# apps/dialogues/services.py
import os
from openai import OpenAI
from django.conf import settings
from apps.dialogues.models import DialogueMessage, DialogueSession
from apps.summaries.services import generate_persona_summary

client = OpenAI(api_key=settings.OPENAI_API_KEY)

def generate_gpt_response(prompt: str, conversation_history: list[dict]) -> str:
    """
    prompt: 最新のユーザー入力文
    conversation_history: これまでの対話履歴を
        [{"role": "system/user/assistant", "content": "..."},...] という形で渡す
    """
    # 例）ChatCompletion を使う場合
    messages = [
        {"role": "system", "content": "あなたはユーザーの「内的概念」を引き出すアシスタントです。"},
    ] + conversation_history + [
        {"role": "user", "content": prompt}
    ]
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",  # または "gpt-4"
        messages=messages,
        temperature=0.7
    )
    # 一番最後のアシスタントメッセージを返す
    return response.choices[0].message.content.strip()

def build_clone_prompt(session: DialogueSession, user_input: str):
    """
    session: DialogueSession インスタンス
    user_input: 今回ユーザーが入力したメッセージ
    戻り値: GPT に渡す messages のリスト [{'role':'system/user/assistant', 'content':...}, ...]
    """

    # 1) 初回セッションかどうかを判定
    is_first_turn = not session.messages.exists()

    # 2) System プロンプト共通部分：クローンとして振る舞う指示
    base_system = (
        f"あなたは {session.owner.display_name or session.owner.username} さんのデジタルクローンです。"
        "以下に示す“この人らしさ”を反映して回答してください。"
    )

    # 3) Persona サマリーを取得（要約済みのパーソナリティ情報）
    persona_summary = generate_persona_summary(session.concept)

    # 4) 初回誘導メッセージを作成
    if is_first_turn:
        first_turn_msg = (
            "はじめまして。私はあなたのデジタルクローンです。"
            "これからあなたの価値観や口癖、好み、信念などを学び、一緒に成長していきたいと思っています。"
            "まずはご自身のこと（自己紹介、趣味、価値観など）を教えていただけますか？"
        )
        system_prompt = base_system + "\n\n" + persona_summary + "\n\n" + first_turn_msg
    else:
        system_prompt = base_system + "\n\n" + persona_summary

    # 5) 直近の会話履歴を取得
    history_messages = []
    for msg in session.messages.all():
        role = "user" if msg.sender == "user" else "assistant"
        history_messages.append({"role": role, "content": msg.content})

    # 6) 最後にユーザー入力を messages に加える
    user_msg = {"role": "user", "content": user_input}

    # 7) messages を組み立てて return
    messages = [
        {"role": "system", "content": system_prompt},
    ] + history_messages + [user_msg]

    return messages

def generate_clone_response(session: DialogueSession, user_input: str) -> str:
    messages = build_clone_prompt(session, user_input)
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",  # または "gpt-4"
        messages=messages,
        temperature=0.7
    )
    return response.choices[0].message.content.strip()


def build_self_chat_prompt(session: DialogueSession, user_input: str):
    """
    ChatView（本人ユーザー用）向けに共感＆引き出し役のプロンプトを生成する。
    """
    # 1) ペルソナ要約を取得（存在すれば使う）
    persona_summary = generate_persona_summary(session.concept)

    # 2) システムプロンプト：共感的に聞き役に徹するよう指示
    #    - user_input は「ユーザーが何か発言した」ことを反映する
    #    - persona_summary があれば、「あなたは◯◯さんのクローンで…」も付加
    system_prompt = (
        "あなたは {name} さんのデジタルクローンです。"
        "今は“共感と聞き役、引き出し役”として振る舞ってください。"
        "ユーザー（＝本人）が話しかけてきたら、"
        "まず共感の言葉をかけてから、優しく話を深めるための質問をしてください。"
        "絶対に教えたり提案したりせず、まずはユーザーの内面を引き出すことに集中してください。"
    ).format(name=session.owner.display_name or session.owner.username)

    # persona_summary がある場合は、さらに付加情報としてシステムプロンプトに足す
    if persona_summary:
        system_prompt += "\n\nなお、以下は現在のあなた（クローン）が学習している本人の特徴（ペルソナ要約）です。これを踏まえて対応してください：\n" + persona_summary

    # 3) 直近の会話履歴を取得（role:user／assistant 形式）
    history_messages = []
    for msg in session.messages.all():
        role = "user" if msg.sender == "user" else "assistant"
        history_messages.append({"role": role, "content": msg.content})

    # 4) ユーザー発言を入れる
    user_msg = {"role": "user", "content": user_input}

    # 5) messages リストを組み立て
    messages = [
        {"role": "system", "content": system_prompt},
    ] + history_messages + [user_msg]

    return messages


def build_clone_prompt(session: DialogueSession, user_input: str):
    """
    CloneChatView（他人/ゲスト用）向けに「本人クローンらしさ」を活かすプロンプトを生成する、
    これまでの build_clone_prompt の実装です。
    """
    is_first_turn = not session.messages.exists()

    base_system = (
        f"あなたは {session.owner.display_name or session.owner.username} さんのデジタルクローンです。"
        "以下に示す“この人らしさ”を反映して回答してください。"
    )

    persona_summary = generate_persona_summary(session.concept)

    if is_first_turn:
        first_turn_msg = (
            "はじめまして。私はあなたのデジタルクローンです。"
            "これからあなたの価値観や口癖、好み、信念などを学び、一緒に成長していきたいと思っています。"
            "まずはご自身のこと（自己紹介、趣味、価値観など）を教えていただけますか？"
        )
        system_prompt = base_system + "\n\n" + persona_summary + "\n\n" + first_turn_msg
    else:
        system_prompt = base_system + "\n\n" + persona_summary

    history_messages = []
    for msg in session.messages.all():
        role = "user" if msg.sender == "user" else "assistant"
        history_messages.append({"role": role, "content": msg.content})

    user_msg = {"role": "user", "content": user_input}
    messages = [
        {"role": "system", "content": system_prompt},
    ] + history_messages + [user_msg]
    return messages


def generate_clone_response(session: DialogueSession, user_input: str, is_self: bool = False) -> str:
    """
    is_self=True のときは build_self_chat_prompt を使い、False のときは build_clone_prompt を使う。
    """
    if is_self:
        messages = build_self_chat_prompt(session, user_input)
    else:
        messages = build_clone_prompt(session, user_input)

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",  # または "gpt-4"
        messages=messages,
        temperature=0.7
    )
    return response.choices[0].message.content.strip()