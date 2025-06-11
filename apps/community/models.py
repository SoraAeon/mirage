from django.db import models
from django.conf import settings
from apps.worldmap.models import Area

class Message(models.Model):
    """
    エリアごとの掲示板投稿
    """
    area = models.ForeignKey(Area, on_delete=models.CASCADE, related_name='messages')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} ({self.area.name}): {self.content[:20]}"
