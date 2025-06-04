# apps/questions/services.py
import openai
from django.conf import settings

openai.api_key = settings.OPENAI_API_KEY

def generate_question_answer(question_text: str, concept_summary: str) -> str:
    """
    質問文と概念の要約を使って回答を生成
    """
    system_prompt = "以下はユーザーが構築した「概念」の概要です。この概念の内容を踏まえて質問に答えてください。"
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "assistant", "content": concept_summary or "要約情報なし"},
        {"role": "user", "content": question_text},
    ]
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",  # または "gpt-4"
        messages=messages,
        temperature=0.6,
        max_tokens=300
    )
    return response.choices[0].message.content.strip()
