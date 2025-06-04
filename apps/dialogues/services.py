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
    # 1) System プロンプト：クローンとして振る舞うための指示
    system_prompt = (
        f"あなたは {session.owner.display_name or session.owner.username} さんのデジタルクローンです。"
        "以下に示す“この人らしさ”を反映して回答してください。"
    )

    # 2) Persona サマリーを取得（要約済みのパーソナリティ情報）
    #    generate_persona_summary は、過去のセッション履歴や Concept.summary を元に
    #    「このユーザーらしさ（口調・価値観・口癖など）」を文字列で返す想定
    persona_summary = generate_persona_summary(session.concept)

    # 3) 直近の会話履歴を取得し、role/ content に変換
    #    ただし、session.messages には sender='user' or 'clone' などが入っている
    history_messages = []
    for msg in session.messages.all():
        role = "user" if msg.sender == "user" else "assistant"
        history_messages.append({"role": role, "content": msg.content})

    # 4) 最後にユーザー入力を messages に加える
    user_msg = {"role": "user", "content": user_input}

    # 5) messages を組み立てて返却
    messages = [
        {"role": "system", "content": system_prompt + "\n\n" + persona_summary},
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