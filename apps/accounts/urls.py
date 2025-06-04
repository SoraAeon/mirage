# apps/accounts/urls.py

from django.urls import path
from .views import SignUpView, CustomLoginView, CustomLogoutView, ProfileView

app_name = 'accounts'

urlpatterns = [
    # サインアップ
    path('signup/', SignUpView.as_view(), name='signup'),
    # ログイン（Django 標準の LoginView を使う）
    path('login/', CustomLoginView.as_view(), name='login'),
    # ログアウト（Django 標準の LogoutView を使う）
    path('logout/', CustomLogoutView.as_view(), name='logout'),
    # プロフィール編集
    path('profile/', ProfileView.as_view(), name='profile'),
]
