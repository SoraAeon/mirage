from django.db import models
from django.conf import settings

class Quest(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    tags = models.CharField(max_length=200, blank=True, help_text="カンマ区切り")
    category = models.CharField(max_length=100, blank=True)
    difficulty = models.IntegerField(default=1, help_text="1〜5で推奨難易度")
    creator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class QuestAchievement(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    quest = models.ForeignKey('Quest', on_delete=models.CASCADE)
    comment = models.TextField(blank=True)
    proof_image = models.ImageField(upload_to='quest_proofs/', blank=True, null=True)  # 画像証拠オプション
    achieved_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.quest.title} ({self.achieved_at})"