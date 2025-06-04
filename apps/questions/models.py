# apps/questions/models.py
from django.db import models
from django.conf import settings
from apps.concepts.models import Concept

class Question(models.Model):
    """
    他のユーザーが概念者に投げる質問
    """
    concept = models.ForeignKey(
        Concept,
        on_delete=models.CASCADE,
        related_name="questions"
    )
    # 質問者がログインしていない場合は null 可
    asker = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="asked_questions"
    )
    is_anonymous = models.BooleanField(default=True)
    question_text = models.TextField()
    asked_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Q: {self.question_text[:20]}... by {'匿名' if self.is_anonymous else self.asker.username}"

class QuestionAnswer(models.Model):
    """
    GPT を使って生成された質問への回答を保存
    """
    question = models.OneToOneField(
        Question,
        on_delete=models.CASCADE,
        related_name="answer"
    )
    answer_text = models.TextField()
    answered_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"A to {self.question.id} @ {self.answered_at}"
