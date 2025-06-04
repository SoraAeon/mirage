# apps/dialogues/views.py
from django.shortcuts import redirect, render, get_object_or_404
from django.views import View
from django.contrib.auth.mixins import LoginRequiredMixin
from apps.concepts.models import Concept
from .models import DialogueMessage, DialogueSession
from .services import generate_gpt_response, generate_clone_response
from apps.summaries.services import generate_concept_summary
from django.utils import timezone

class ChatView(LoginRequiredMixin, View):
    """
    ログインユーザーが自分の概念と対話する画面。
    """
    template_name = "dialogues/chat.html"

    def get(self, request):
        # 1) ログインユーザーの概念を取得（存在しなければ作成）
        concept, created = Concept.objects.get_or_create(
            owner=request.user,
            defaults={"title": f"{request.user.username} の概念"}
        )

        # 2) 該当する永続セッションを取得 or 作成
        session, _ = DialogueSession.objects.get_or_create(
            owner=request.user,
            concept=concept,
            is_persistent=True
        )

        # 3) そのセッションに紐づくメッセージ群を取得
        messages = session.messages.all()

        return render(request, self.template_name, {
            "concept": concept,
            "session": session,
            "messages": messages
        })

    def post(self, request):
        # 1) ログインユーザーの概念と永続セッションを get_or_create
        concept = get_object_or_404(Concept, owner=request.user)
        session, _ = DialogueSession.objects.get_or_create(
            owner=request.user,
            concept=concept,
            is_persistent=True
        )

        # 2) フォームからのユーザー発言を取得
        user_input = request.POST.get("message", "").strip()
        if not user_input:
            return redirect("dialogues:chat")

        # 3) ユーザー発言を保存
        DialogueMessage.objects.create(
            session=session,
            sender="user",
            content=user_input
        )

        # 4) GPT によるクローン応答を生成し、保存
        clone_reply = generate_clone_response(session, user_input)
        DialogueMessage.objects.create(
            session=session,
            sender="clone",
            content=clone_reply
        )

        return redirect("dialogues:chat")


class CloneChatView(LoginRequiredMixin, View):
    """
    ログインユーザーが自分のクローン概念と対話する画面。
    他ユーザーがその人のクローンと対話する場合は is_persistent=False で動かす。
    """
    template_name = "dialogues/clone_chat.html"

    def get(self, request, concept_id):
        concept = get_object_or_404(Concept, pk=concept_id, is_public=True)

        # もしこのユーザー（request.user）がオーナーなら、永続セッションを作成 or 取得
        if request.user == concept.owner:
            session, created = DialogueSession.objects.get_or_create(
                owner=request.user, concept=concept, is_persistent=True
            )
        else:
            # 他ユーザー（ゲスト）の場合は毎回セッションを新規作成 or 直近非永続セッションを取得
            session = DialogueSession.objects.create(
                owner=concept.owner, concept=concept, is_persistent=False
            )

        messages = session.messages.all()
        return render(request, self.template_name, {"concept": concept, "session": session, "messages": messages})

    def post(self, request, concept_id):
        concept = get_object_or_404(Concept, pk=concept_id, is_public=True)
        user_input = request.POST.get("message", "").strip()
        if not user_input:
            return redirect("dialogues:clone_chat", concept_id=concept_id)

        # get_or_create セッション（GET と同様に判定）
        if request.user == concept.owner:
            session, _ = DialogueSession.objects.get_or_create(
                owner=request.user, concept=concept, is_persistent=True
            )
        else:
            session = DialogueSession.objects.create(
                owner=concept.owner, concept=concept, is_persistent=False
            )

        # 1) ユーザー発言を保存
        DialogueMessage.objects.create(session=session, sender="user", content=user_input)

        # 2) GPT でクローン応答を生成
        clone_reply = generate_clone_response(session, user_input)

        # 3) クローンの応答を保存
        DialogueMessage.objects.create(session=session, sender="clone", content=clone_reply)

        return redirect("dialogues:clone_chat", concept_id=concept_id)