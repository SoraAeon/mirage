# apps/dialogues/services.py
from openai import OpenAI
from django.conf import settings
from apps.dialogues.models import PersonaMessage, PersonaSession
from apps.summaries.services import generate_persona_summary

client = OpenAI(api_key=settings.OPENAI_API_KEY)

def generate_gpt_response(prompt: str, conversation_history: list[dict]) -> str:
    """
    prompt: 最新のユーザー入力文
    conversation_history: これまでの対話履歴を
        [{"role": "system/user/assistant", "content": "..."},...] という形で渡す
    """
    messages = [
        {"role": "system", "content": "あなたはユーザーの『内的ペルソナ』を引き出すアシスタントです。"},
    ] + conversation_history + [
        {"role": "user", "content": prompt}
    ]
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=messages,
        temperature=0.7
    )
    return response.choices[0].message.content.strip()

def build_persona_prompt(session: PersonaSession, user_input: str, is_self: bool = False):
    """
    ペルソナとのチャット用プロンプトを生成。
    - is_self=True: 本人によるペルソナ会話
    - is_self=False: ゲストによる会話
    """
    is_first_turn = not session.messages.exists()
    owner_name = session.owner.display_name or session.owner.username
    persona_summary = generate_persona_summary(session.concept)

    if is_self:
        base_system = (
            f"あなたは{owner_name}さんの『ペルソナ』です。\n"
            "今は“共感と聞き役、引き出し役”として振る舞ってください。"
            "ユーザー（＝本人）が話しかけてきたら、"
            "まず共感の言葉をかけてから、優しく話を深めるための質問をしてください。"
            "絶対に教えたり提案したりせず、まずはユーザーの内面を引き出すことに集中してください。"
        )
        if persona_summary:
            base_system += f"\n\nなお、以下は現在あなた（ペルソナ）が学習している本人の特徴です：\n{persona_summary}"
        system_prompt = base_system
    else:
        base_system = (
            f"あなたは{owner_name}さんの『ペルソナ』です。\n"
            "以下に示す“この人らしさ”を反映して回答してください。"
        )
        if is_first_turn:
            first_turn_msg = (
                "はじめまして。私はあなたのペルソナです。"
                "これからあなたの価値観や口癖、好み、信念などを学び、一緒に成長していきたいと思っています。"
                "まずはご自身のこと（自己紹介、趣味、価値観など）を教えていただけますか？"
            )
            system_prompt = base_system + "\n\n" + persona_summary + "\n\n" + first_turn_msg
        else:
            system_prompt = base_system + "\n\n" + persona_summary

    # 履歴構築
    history_messages = []
    for msg in session.messages.all():
        role = "user" if msg.sender == "user" else "assistant"
        history_messages.append({"role": role, "content": msg.content})

    user_msg = {"role": "user", "content": user_input}

    messages = [
        {"role": "system", "content": system_prompt},
    ] + history_messages + [user_msg]
    return messages

def generate_persona_response(session: PersonaSession, user_input: str, is_self: bool = False) -> str:
    """
    ペルソナとのチャット応答を生成。
    is_self=True: 本人（自分）が自分のペルソナと話す
    is_self=False: ゲスト（他人）がペルソナと話す
    """
    messages = build_persona_prompt(session, user_input, is_self=is_self)
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=messages,
        temperature=0.7
    )
    return response.choices[0].message.content.strip()
