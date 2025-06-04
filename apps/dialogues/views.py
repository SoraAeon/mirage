# apps/dialogues/views.py
from django.shortcuts import redirect, render
from django.views import View
from django.contrib.auth.mixins import LoginRequiredMixin
from apps.concepts.models import Concept
from .models import DialogueMessage
from .services import generate_gpt_response
from apps.summaries.services import generate_concept_summary
from django.utils import timezone

class ChatView(LoginRequiredMixin, View):
    """
    GPT と会話して概念を育成する画面
    """
    template_name = "dialogues/chat.html"

    def get(self, request):
        # 自分の Concept を取得
        concept = Concept.objects.get(owner=request.user)
        messages = concept.dialogue_messages.all()
        return render(request, self.template_name, {"concept": concept, "messages": messages})

    def post(self, request):
        user_message = request.POST.get("message", "").strip()
        if not user_message:
            return redirect("dialogues:chat")

        concept = Concept.objects.get(owner=request.user)

        # 1) まず、ユーザーの発言を保存
        DialogueMessage.objects.create(
            concept=concept,
            sender="user",
            message=user_message
        )

        # 2) 対話履歴を GPT 形式に変換
        history_messages = []
        for msg in concept.dialogue_messages.all():
            role = "assistant" if msg.sender == "gpt" else "user"
            history_messages.append({"role": role, "content": msg.message})

        # 3) GPT に投げて返答を取得
        gpt_reply = generate_gpt_response(user_message, history_messages)

        # 4) GPT の返答を保存
        DialogueMessage.objects.create(
            concept=concept,
            sender="gpt",
            message=gpt_reply
        )

        # 5) 必要に応じて要約を更新（例：一定数メッセージたまったら要約生成）
        #    ここでは単純に「最新の5往復」をまとめて要約を作成するとします
        messages_for_summary = concept.dialogue_messages.order_by("-created_at")[:10]
        # 時系列順に並べ替え
        msgs_texts = [msg.message for msg in reversed(messages_for_summary)]
        summary_text = generate_concept_summary(msgs_texts)
        # ConceptSummary として保存
        from apps.summaries.models import ConceptSummary
        ConceptSummary.objects.create(
            concept=concept,
            text=summary_text,
            snapshot_at=timezone.now()
        )
        # 6) Concept モデルの summary フィールドも更新しておく（最新要約のみ保持したい場合）
        concept.summary = summary_text
        concept.save()

        return redirect("dialogues:chat")
