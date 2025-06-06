# apps/dialogues/models.py
from django.db import models
from django.conf import settings
from apps.concepts.models import Concept

class PersonaSession(models.Model):
    """
    ユーザーのペルソナとの会話セッション。
    """
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="persona_sessions"
    )
    concept = models.ForeignKey(
        Concept,
        on_delete=models.CASCADE,
        related_name="persona_sessions"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    is_persistent = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.owner.username} セッション @{self.created_at}"

class PersonaMessage(models.Model):
    """
    セッション内の1メッセージ
    """
    session = models.ForeignKey(
        PersonaSession,
        on_delete=models.CASCADE,
        related_name="messages"
    )
    sender = models.CharField(
        max_length=10,
        choices=[("user", "User"), ("persona", "Persona"), ("system", "System")]
    )
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["timestamp"]

    def __str__(self):
        return f"{self.session.owner.username} [{self.sender}] {self.timestamp}"
