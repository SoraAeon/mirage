# apps/dialogues/models.py
from django.db import models
from django.conf import settings
from apps.concepts.models import Concept

class DialogueSession(models.Model):
    """
    1つのクローンとの“会話セッション”を表す。
    - owner: このデジタルクローンを育てているユーザー
    - created_at: セッション開始日時
    - is_persistent: True ならログをDB に残す（＝本人ログ用）。False ならゲスト用（当日のみ / 一時保存）。
    """
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="dialogue_sessions"
    )
    concept = models.ForeignKey(
        Concept,
        on_delete=models.CASCADE,
        related_name="dialogue_sessions"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    is_persistent = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.owner.username} セッション @{self.created_at}"


class DialogueMessage(models.Model):
    """
    セッション内の1メッセージを表す。
    - session: どのセッションに属するか
    - sender: user / clone (GPT) / system など
    - content: メッセージ本文
    - timestamp: 時刻
    """
    session = models.ForeignKey(
        DialogueSession,
        on_delete=models.CASCADE,
        related_name="messages"
    )
    sender = models.CharField(
        max_length=10,
        choices=[("user", "User"), ("clone", "Clone"), ("system", "System")]
    )
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["timestamp"]

    def __str__(self):
        return f"{self.session.owner.username} [{self.sender}] {self.timestamp}"