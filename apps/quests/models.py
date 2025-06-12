from django.db import models
from django.conf import settings

class ChoiceNode(models.Model):
    """
    ツリーのノード（人生の選択肢）
    """
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    # “次の分岐”は多対多（子ノードが複数ある）
    next_choices = models.ManyToManyField('self', blank=True, symmetrical=False, related_name='previous_choices')

    def __str__(self):
        return self.name

class UserProgress(models.Model):
    """
    各ユーザーの人生進行履歴
    """
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    node = models.ForeignKey(ChoiceNode, on_delete=models.CASCADE)
    reached_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}: {self.node.name} ({self.reached_at})"
