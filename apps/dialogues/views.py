# apps/dialogues/views.py
from django.shortcuts import redirect, render, get_object_or_404
from django.views import View
from django.contrib.auth.mixins import LoginRequiredMixin
from apps.concepts.models import Concept
from .models import PersonaMessage, PersonaSession  # ←ここもリネーム
from .services import generate_gpt_response, generate_persona_response  # ここも関数名に合わせて
from apps.summaries.services import generate_persona_summary

class PersonaChatView(LoginRequiredMixin, View):
    """
    ログインユーザーが自分のペルソナと対話する画面。
    """
    template_name = "dialogues/persona_chat.html"  # テンプレート名も揃えよう

    def get(self, request):
        concept, created = Concept.objects.get_or_create(
            owner=request.user,
            defaults={"title": f"{request.user.username} のペルソナ"}
        )
        session, _ = PersonaSession.objects.get_or_create(
            owner=request.user,
            concept=concept,
            is_persistent=True
        )
        chat_messages = session.messages.all()
        return render(request, self.template_name, {
            "concept": concept,
            "session": session,
            "chat_messages": chat_messages
        })

    def post(self, request):
        concept = get_object_or_404(Concept, owner=request.user)
        session, _ = PersonaSession.objects.get_or_create(
            owner=request.user,
            concept=concept,
            is_persistent=True
        )
        user_input = request.POST.get("message", "").strip()
        if not user_input:
            return redirect("dialogues:persona_chat")

        PersonaMessage.objects.create(
            session=session,
            sender="user",
            content=user_input
        )

        # GPTでペルソナ応答
        persona_reply = generate_persona_response(session, user_input, is_self=True)
        PersonaMessage.objects.create(
            session=session,
            sender="persona",
            content=persona_reply
        )

        # 発言数が一定以上ならペルソナ要約更新
        if session.messages.count() >= 5:
            generate_persona_summary(concept)

        return redirect("dialogues:persona_chat")


class GuestPersonaChatView(View):
    template_name = "dialogues/guest_persona_chat.html"

    def get(self, request, concept_slug):
        concept = get_object_or_404(Concept, slug=concept_slug, is_public=True)

        # 1. セッションIDを取得
        guest_session_key = f"guest_session_{concept.pk}"
        persona_session_id = request.session.get(guest_session_key)

        # 2. sessionが残っていればそれを使う、なければ新規作成
        session = None
        if persona_session_id:
            try:
                session = PersonaSession.objects.get(pk=persona_session_id, is_persistent=False)
            except PersonaSession.DoesNotExist:
                pass
        if session is None:
            session = PersonaSession.objects.create(
                owner=concept.owner,
                concept=concept,
                is_persistent=False
            )
            request.session[guest_session_key] = session.pk

        chat_messages = session.messages.all()
        return render(request, self.template_name, {
            "concept": concept,
            "session": session,
            "chat_messages": chat_messages
        })

    def post(self, request, concept_slug):
        concept = get_object_or_404(Concept, slug=concept_slug, is_public=True)
        guest_session_key = f"guest_session_{concept.pk}"
        persona_session_id = request.session.get(guest_session_key)

        session = None
        if persona_session_id:
            try:
                session = PersonaSession.objects.get(pk=persona_session_id, is_persistent=False)
            except PersonaSession.DoesNotExist:
                pass
        if session is None:
            session = PersonaSession.objects.create(
                owner=concept.owner,
                concept=concept,
                is_persistent=False
            )
            request.session[guest_session_key] = session.pk

        user_input = request.POST.get("message", "").strip()
        if not user_input:
            return redirect("dialogues:guest_persona_chat", concept_slug=concept_slug)

        PersonaMessage.objects.create(session=session, sender="user", content=user_input)
        persona_reply = generate_persona_response(session, user_input)
        PersonaMessage.objects.create(session=session, sender="persona", content=persona_reply)
        return redirect("dialogues:guest_persona_chat", concept_slug=concept_slug)


