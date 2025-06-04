# apps/dialogues/urls.py
from django.urls import path
from . import views

app_name = "dialogues"

urlpatterns = [
    path("chat/", views.ChatView.as_view(), name="chat"),
]
