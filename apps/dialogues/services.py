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
    is_first_turn = not session.messages.exists()
    owner_name = session.owner.display_name or session.owner.username
    persona_summary = generate_persona_summary(session.concept)

    if is_self:
        # 本人チャット
        base_system = (
            f"あなたは{owner_name}さんの『ペルソナ』です。\n"
            "今は“共感と聞き役、引き出し役”として振る舞ってください。"
            "ユーザー（＝本人）が話しかけてきたら、まず共感してから、優しく話を深める質問をしてください。"
            "絶対に提案や助言はせず、相手の内面を引き出すことに集中してください。"
        )
        if persona_summary:
            base_system += f"\n\nなお、以下は現在あなた（ペルソナ）が学習している本人の特徴です：\n{persona_summary}"
        system_prompt = base_system
    else:
        # ★ゲストチャット用プロンプト
        base_system = (
            f"あなたは{owner_name}さんの『ペルソナ』です。\n"
            "ゲストからの質問や相談に対し、{owner_name}さんらしく丁寧に、"
            "自分自身の経験や価値観、信念、個性を伝える役割で振る舞ってください。"
            "ゲストの発言には誠実に答え、なるべく質問返しや逆質問はせず、"
            "自分のこと・自分の考えや気持ちを“説明”するように答えてください。"
        )
        if persona_summary:
            base_system += f"\n\nペルソナの参考情報：\n{persona_summary}"
        system_prompt = base_system

        if is_first_turn:
            system_prompt += "\n\nはじめまして。気になることがあれば何でも質問してください。"
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
