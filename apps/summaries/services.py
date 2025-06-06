# apps/summaries/services.py
from openai import OpenAI
from django.conf import settings
from django.utils import timezone
from datetime import timedelta
from apps.concepts.models import Concept
from apps.dialogues.models import DialogueSession, DialogueMessage

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
    指定の Concept に紐づく「永続セッション」から、
    直近の DialogueMessage ログを抜き出し、
    GPT に「この人らしさを要約してください」と投げて返却する。

    返ってきた要約は concept.persona_summary に保存してください。
    """

    # 1) 永続セッション（ユーザー本人用）だけを対象にする
    sessions = DialogueSession.objects.filter(
        concept=concept,
        owner=concept.owner,
        is_persistent=True
    )

    # 2) 直近 50 件のメッセージを取得（発言が膨大なら適宜件数を減らす）
    messages_qs = DialogueMessage.objects.filter(
        session__in=sessions
    ).order_by('-timestamp')[:50]
    # タイムスタンプの降順で取っているので、そのまま使うと時系列逆転する -> 昇順に戻す
    messages = list(messages_qs)[::-1]

    # 3) メッセージを一本のテキストに連結
    #    「User: ～」「Clone: ～」というプレフィックスを加えるとモデルがわかりやすい
    transcript_lines = []
    for msg in messages:
        speaker = "User" if msg.sender == "user" else "Clone"
        # content が長いとプロンプトが膨らむので、必要に応じて要約するか件数をさらに減らす
        transcript_lines.append(f"{speaker}: {msg.content}")
    transcript_text = "\n".join(transcript_lines)

    if not transcript_text:
        # 対話ログがない場合は空文字を返す
        return ""

    # 4) GPT に要約を依頼するプロンプトを構築
    system_prompt = (
        f"以下は {concept.owner.username} さんの直近の会話ログです。"
        "このログから、この人物の性格、口癖、価値観、好みなどを簡潔に 100 文字以内で要約してください。\n\n"
        f"```\n{transcript_text}\n```"
    )

    # 5) ChatCompletion を呼び出し
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",  # または "gpt-4"
            messages=[
                {"role": "system", "content": system_prompt},
            ],
            temperature=0.5,
            max_tokens=150,
        )
        summary = response.choices[0].message.content.strip()
    except Exception as e:
        # APIエラー時は、既存の要約を維持または空文字を返す
        print(f"[Error] generate_persona_summary: {e}")
        summary = concept.persona_summary or ""

    # 6) Concept に保存して返却
    concept.persona_summary = summary
    concept.save(update_fields=["persona_summary"])
    return summary