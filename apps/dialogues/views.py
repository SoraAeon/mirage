# apps/dialogues/views.py
from django.shortcuts import redirect, render, get_object_or_404
from django.views import View
from django.contrib.auth.mixins import LoginRequiredMixin
from apps.concepts.models import Concept
from .models import PersonaMessage, PersonaSession  # ←ここもリネーム
from .services import generate_gpt_response, generate_persona_response  # ここも関数名に合わせて
from apps.summaries.services import generate_persona_summary
from django.utils import timezone

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


class GuestPersonaChatView(LoginRequiredMixin, View):
    """
    他ユーザーがゲストとして他人のペルソナと対話する画面。
    """
    template_name = "dialogues/guest_persona_chat.html"

    def get(self, request, concept_id):
        concept = get_object_or_404(Concept, pk=concept_id, is_public=True)
        if request.user == concept.owner:
            session, _ = PersonaSession.objects.get_or_create(
                owner=request.user, concept=concept, is_persistent=True
            )
        else:
            # ゲストは毎回新規一時セッション
            session = PersonaSession.objects.create(
                owner=concept.owner, concept=concept, is_persistent=False
            )
        chat_messages = session.messages.all()
        return render(request, self.template_name, {
            "concept": concept,
            "session": session,
            "chat_messages": chat_messages
        })

    def post(self, request, concept_id):
        concept = get_object_or_404(Concept, pk=concept_id, is_public=True)
        user_input = request.POST.get("message", "").strip()
        if not user_input:
            return redirect("dialogues:guest_persona_chat", concept_id=concept_id)

        if request.user == concept.owner:
            session, _ = PersonaSession.objects.get_or_create(
                owner=request.user, concept=concept, is_persistent=True
            )
        else:
            session = PersonaSession.objects.create(
                owner=concept.owner, concept=concept, is_persistent=False
            )

        PersonaMessage.objects.create(session=session, sender="user", content=user_input)
        persona_reply = generate_persona_response(session, user_input)
        PersonaMessage.objects.create(session=session, sender="persona", content=persona_reply)
        return redirect("dialogues:guest_persona_chat", concept_id=concept_id)
