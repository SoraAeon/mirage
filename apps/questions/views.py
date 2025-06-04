# apps/questions/views.py
from django.shortcuts import render, redirect, get_object_or_404
from django.views import View
from django.utils import timezone
from apps.concepts.models import Concept
from .models import Question, QuestionAnswer
from .services import generate_question_answer  # GPT 呼び出しロジックを別ファイルに用意

class AskQuestionView(View):
    template_name = "questions/ask_question.html"

    def get(self, request, concept_id):
        concept = get_object_or_404(Concept, pk=concept_id, is_public=True)
        return render(request, self.template_name, {"concept": concept})

    def post(self, request, concept_id):
        concept = get_object_or_404(Concept, pk=concept_id, is_public=True)
        text = request.POST.get("question", "").strip()
        if not text:
            return redirect("questions:ask_question", concept_id=concept_id)

        # 質問を登録
        question = Question.objects.create(
            concept=concept,
            asker=request.user if request.user.is_authenticated else None,
            is_anonymous=not request.user.is_authenticated,
            question_text=text,
            asked_at=timezone.now()
        )

        # GPT で回答を生成
        # プロンプト例：ユーザーの概念（summary）を渡す
        summary = concept.summary or ""
        answer_text = generate_question_answer(question.question_text, summary)

        # 回答を保存
        QuestionAnswer.objects.create(
            question=question,
            answer_text=answer_text,
            answered_at=timezone.now()
        )

        return redirect("concepts:concept_detail", pk=concept_id)
