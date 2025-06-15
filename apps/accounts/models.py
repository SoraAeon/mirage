from django.db import models
from django.conf import settings

class UserProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile')
    display_name = models.CharField(max_length=100, blank=True)
    bio = models.TextField(blank=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    points = models.IntegerField(default=0)
    exp = models.IntegerField(default=0)
    level = models.IntegerField(default=1)
    theme = models.ForeignKey('themes.Theme', null=True, blank=True, on_delete=models.SET_NULL)

    # スキルはタグ型 or 別モデルで紐付けてもOK！
    skills = models.CharField(max_length=255, blank=True, help_text="カンマ区切り")

    def __str__(self):
        return self.display_name or self.user.username

    @property
    def achievement_count(self):
        from apps.quests.models import Achievement
        return Achievement.objects.filter(user=self.user).count()