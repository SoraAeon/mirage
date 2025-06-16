from django.db import models
from django.contrib.auth import get_user_model
from apps.quests.models import Quest  # すでにあるQuestモデル

User = get_user_model()

class ChoiceCard(models.Model):
    # カード種別
    CARD_TYPES = [
        ('quest', 'Quest'),
        ('auth', 'Login/Signup'),
        ('profile', 'ProfileInput'),
        ('goal', 'GoalSet'),
        ('custom', 'Custom'),  # 今後イベントやお知らせ用にも
    ]
    card_type = models.CharField(max_length=16, choices=CARD_TYPES)
    
    # Questなら紐付け
    quest = models.ForeignKey(Quest, null=True, blank=True, on_delete=models.SET_NULL)

    # 表示用タイトル・説明
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)

    # カスタム用データ（後で柔軟な表示やアクション用）
    payload = models.JSONField(blank=True, null=True)

    # 表示優先度や条件
    priority = models.IntegerField(default=100)
    show_to_unauthenticated = models.BooleanField(default=False)  # 未ログインでも出すか？
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.get_card_type_display()}: {self.title}"
    
# 「ユーザーの進行中クエスト（ロック）」を表現する例
class QuestParticipation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    quest = models.ForeignKey(Quest, on_delete=models.CASCADE)
    started_at = models.DateTimeField(auto_now_add=True)
    completed = models.BooleanField(default=False)
    # 必要ならstatusなど

    class Meta:
        unique_together = ('user', 'quest')
