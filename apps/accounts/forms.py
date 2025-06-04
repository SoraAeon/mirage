# apps/accounts/forms.py

from django import forms
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from .models import User

class SignUpForm(UserCreationForm):
    """
    ユーザー登録フォーム（パスワード確認付き）
    """
    email = forms.EmailField(
        required=True,
        widget=forms.EmailInput(attrs={'class': 'form-control'}),
        label='メールアドレス'
    )
    display_name = forms.CharField(
        required=False,
        widget=forms.TextInput(attrs={'class': 'form-control'}),
        label='表示名（任意）'
    )
    avatar = forms.ImageField(
        required=False,
        widget=forms.ClearableFileInput(attrs={'class': 'form-control'}),
        label='アバター画像（任意）'
    )

    class Meta:
        model = User
        fields = [
            'username',
            'email',
            'display_name',
            'avatar',
            'password1',
            'password2',
        ]
        widgets = {
            'username': forms.TextInput(attrs={'class': 'form-control'}),
            'password1': forms.PasswordInput(attrs={'class': 'form-control'}),
            'password2': forms.PasswordInput(attrs={'class': 'form-control'}),
        }
        labels = {
            'username': 'ユーザー名',
            'password1': 'パスワード',
            'password2': 'パスワード（確認）',
        }

class UserProfileForm(UserChangeForm):
    """
    ユーザーのプロフィール編集フォーム
    ※ カスタムユーザーなので、パスワード変更の項目は除外する
    """
    password = None  # パスワード欄を非表示にする

    class Meta:
        model = User
        fields = [
            'email',
            'display_name',
            'avatar',
        ]
        widgets = {
            'email': forms.EmailInput(attrs={'class': 'form-control'}),
            'display_name': forms.TextInput(attrs={'class': 'form-control'}),
            'avatar': forms.ClearableFileInput(attrs={'class': 'form-control'}),
        }
        labels = {
            'email': 'メールアドレス',
            'display_name': '表示名',
            'avatar': 'アバター画像',
        }
