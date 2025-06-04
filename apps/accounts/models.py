# apps/accounts/models.py

from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    """
    カスタムユーザーモデル。
    - username, email, password などは AbstractUser が持つ
    - ここでは表示名とプロフィール画像フィールドを追加
    """
    display_name = models.CharField(
        max_length=50,
        blank=True,
        help_text="サイト内で表示したい名前を入力してください。"
    )
    avatar = models.ImageField(
        upload_to='avatars/',
        null=True,
        blank=True,
        help_text="プロフィール画像をアップロード（任意）"
    )

    def __str__(self):
        # display_name が設定されていればそちらを優先して表示
        return self.display_name or self.username
