# apps/accounts/views.py

from django.shortcuts import render, redirect
from django.urls import reverse_lazy
from django.views import View
from django.views.generic import FormView, UpdateView
from django.contrib.auth.views import LoginView, LogoutView
from django.contrib.auth.mixins import LoginRequiredMixin
from .forms import SignUpForm, UserProfileForm
from .models import User

class SignUpView(FormView):
    """
    サインアップ（ユーザー登録）画面
    """
    template_name = 'accounts/signup.html'
    form_class = SignUpForm
    success_url = reverse_lazy('accounts:login')

    def form_valid(self, form):
        # フォームを保存してユーザーを作成
        form.save()
        return super().form_valid(form)

class CustomLoginView(LoginView):
    """
    ログイン画面。Django 標準の LoginView を拡張したもの
    """
    template_name = 'registration/login.html'  # デフォルトは 'registration/login.html'
    redirect_authenticated_user = True  # すでにログインしている場合はリダイレクト

class CustomLogoutView(LogoutView):
    """
    ログアウトビュー。ログアウト後にリダイレクト先を指定可
    """
    next_page = reverse_lazy('accounts:login')

class ProfileView(LoginRequiredMixin, UpdateView):
    """
    ログイン済ユーザーのプロフィール編集画面
    """
    model = User
    form_class = UserProfileForm
    template_name = 'accounts/profile.html'
    success_url = reverse_lazy('accounts:profile')

    def get_object(self, queryset=None):
        # フォームの対象は必ずログイン中のユーザー自身
        return self.request.user
