from django.db import models
from django.conf import settings

class Quest(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=100, blank=True)  # 例：健康・趣味・仕事
    is_sponsored = models.BooleanField(default=False)        # Sponsored枠
    sponsor_name = models.CharField(max_length=100, blank=True)  # 企業名やPR欄（任意）
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({'SPONSORED' if self.is_sponsored else 'Normal'})"

    
class Achievement(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    quest = models.ForeignKey('Quest', on_delete=models.CASCADE)
    comment = models.TextField(blank=True)
    proof_image = models.ImageField(upload_to='achievements/', blank=True, null=True)  # 証拠画像（任意）
    achieved_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.quest.title} ({self.achieved_at.date()})"