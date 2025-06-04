# apps/dialogues/models.py
from django.db import models
from django.conf import settings
from apps.concepts.models import Concept

class DialogueMessage(models.Model):
    """
    GPT との対話履歴を記録するモデル
    """
    concept = models.ForeignKey(
        Concept,
        on_delete=models.CASCADE,
        related_name="dialogue_messages"
    )
    sender = models.CharField(max_length=10, choices=[("user", "User"), ("gpt", "GPT")])
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.concept.owner.username}: {self.sender} @ {self.created_at}"

    class Meta:
        ordering = ["created_at"]
