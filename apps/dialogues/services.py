# apps/dialogues/services.py
import os
from openai import OpenAI
from django.conf import settings

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
    response = client.chat.completions.create(model="gpt-3.5-turbo",  # または "gpt-4"
    messages=messages,
    temperature=0.7)
    # 一番最後のアシスタントメッセージを返す
    return response.choices[0].message.content.strip()
