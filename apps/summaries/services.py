# apps/summaries/services.py
from openai import OpenAI
from django.conf import settings
from apps.concepts.models import Concept
from django.utils import timezone
from datetime import timedelta

client = OpenAI(api_key=settings.OPENAI_API_KEY)

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
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",  # または "gpt-4"
        messages=messages,
        temperature=0.5,
        max_tokens=500
        )
    return response.choices[0].message.content.strip()

def generate_persona_summary(concept: Concept) -> str:
    """
    このユーザー（concept.owner）のパーソナリティ要約を生成して返す関数です。
    まずは簡易版として、concept.summary があればそれを返し、なければ空文字を返します。

    将来的には「過去の対話ログ」を解析して
    「口癖」「トーン」「価値観キーワード」などを抽出した文字列を返すように拡張します。
    """

    # 1) まずは Concept に保存されている summary を返す
    if concept.summary:
        return concept.summary

    # 2) もし summary がまだなければ、空の要約を返す
    return ""