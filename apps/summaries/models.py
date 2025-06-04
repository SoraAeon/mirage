# apps/summaries/models.py
from django.db import models
from apps.concepts.models import Concept

class ConceptSummary(models.Model):
    """
    GPT によって生成された概念の要約や成長ログを保存
    """
    concept = models.ForeignKey(
        Concept,
        on_delete=models.CASCADE,
        related_name="summaries"
    )
    # 要約テキスト
    text = models.TextField()
    # どの時点までの対話を要約したかのタイムスタンプ
    snapshot_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.concept.owner.username} の要約 ({self.snapshot_at.date()})"

    class Meta:
        ordering = ["-snapshot_at"]
