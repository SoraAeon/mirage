# apps/concepts/models.py
from django.db import models
from django.conf import settings
from django.utils.text import slugify

class Concept(models.Model):
    # ユーザーが作成・育成する「概念」を表現するモデル
    owner = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="concept"
    )
    title = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    # “概念” の概要。GPT要約結果を随時更新していく想定
    persona_summary = models.TextField(blank=True)
    # プライバシー設定など
    is_public = models.BooleanField(default=True)

    slug = models.SlugField(max_length=50, unique=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            # 必ず username から slug 生成
            self.slug = slugify(self.owner.username)
        super().save(*args, **kwargs)
    def __str__(self):
        return f"{self.owner.username} の概念"

    class Meta:
        verbose_name = "Concept"
        verbose_name_plural = "Concepts"
