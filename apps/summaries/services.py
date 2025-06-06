# apps/summaries/services.py
from openai import OpenAI
from django.conf import settings
from django.utils import timezone
from apps.concepts.models import Concept
from apps.dialogues.models import PersonaSession, PersonaMessage 
from apps.summaries.models import ConceptSummary

client = OpenAI(api_key=settings.OPENAI_API_KEY)

def generate_concept_summary(conversation_texts: list[str]) -> str:
    """
    conversation_texts: 会話メッセージ（ユーザーとペルソナ双方）のテキストを
        ある程度まとめて渡す（例：過去50メッセージを文字列に連結）
    """
    # プロンプト例：要約フェーズ向けに調整
    system_prompt = (
        "これから示す対話履歴から、ユーザーの「内的ペルソナ（価値観・信念・思考様式など）」を"
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
    指定の Concept に紐づく「永続セッション」から、
    直近の PersonaMessage ログを抜き出し、
    GPT に「この人らしさを要約してください」と投げて返却する。

    返ってきた要約は concept.persona_summary に保存＋ConceptSummaryにも保存。
    """

    # 1) 永続セッション（ユーザー本人用）だけを対象にする
    sessions = PersonaSession.objects.filter(
        concept=concept,
        owner=concept.owner,
        is_persistent=True
    )

    # 2) 直近 50 件のメッセージを取得
    messages_qs = PersonaMessage.objects.filter(
        session__in=sessions
    ).order_by('-timestamp')[:50]
    # タイムスタンプ降順→昇順に戻す
    messages = list(messages_qs)[::-1]

    # 3) メッセージをテキスト化
    transcript_lines = []
    for msg in messages:
        speaker = "User" if msg.sender == "user" else "Persona"
        transcript_lines.append(f"{speaker}: {msg.content}")
    transcript_text = "\n".join(transcript_lines)

    if not transcript_text:
        return ""

    # 4) GPTに要約を依頼
    system_prompt = (
        f"以下は {concept.owner.username} さんの直近の会話ログです。"
        "このログから、この人物の性格、口癖、価値観、好みなどを簡潔に 100 文字以内で要約してください。\n\n"
        f"```\n{transcript_text}\n```"
    )

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
            ],
            temperature=0.5,
            max_tokens=150,
        )
        summary = response.choices[0].message.content.strip()
    except Exception as e:
        print(f"[Error] generate_persona_summary: {e}")
        summary = concept.persona_summary or ""

    # 5) Conceptに保存
    concept.persona_summary = summary
    concept.save(update_fields=["persona_summary"])

    # 6) ConceptSummary履歴も記録（重複回避ロジック込み）
    latest_summary = ConceptSummary.objects.filter(concept=concept).order_by('-snapshot_at').first()
    if not latest_summary or latest_summary.text != summary:
        ConceptSummary.objects.create(
            concept=concept,
            text=summary,
            snapshot_at=timezone.now()
        )

    return summary
