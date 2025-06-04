# apps/summaries/services.py
import openai
from django.conf import settings

openai.api_key = settings.OPENAI_API_KEY

def generate_concept_summary(conversation_texts: list[str]) -> str:
    """
    conversation_texts: 対話メッセージ（ユーザーとGPT双方）のテキストを
        ある程度まとめて渡す（例：過去50メッセージを文字列に連結）
    """
    # プロンプト例：要約フェーズ向けに調整
    system_prompt = (
        "これから示す対話履歴から、ユーザーの「内的概念（価値観・信念・思考様式など）」を"
        "分かりやすく要約・整理してください。"
    )
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": "\n".join(conversation_texts)},
    ]
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",  # または "gpt-4"
        messages=messages,
        temperature=0.5,
        max_tokens=500
    )
    return response.choices[0].message.content.strip()
