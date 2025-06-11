from django.db import models
from django.conf import settings

class Area(models.Model):
    """
    村などのエリア定義
    """
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)  # 表示順
    next_areas = models.ManyToManyField('self', blank=True, symmetrical=False, related_name='previous_areas')
    icon = models.ImageField(upload_to='area_icons/', blank=True, null=True)

    def __str__(self):
        return self.name

class UserLocation(models.Model):
    """
    ユーザーの現在地
    """
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    area = models.ForeignKey(Area, on_delete=models.CASCADE)
    entered_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} is in {self.area.name}"
