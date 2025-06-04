# apps/dialogues/urls.py
from django.urls import path
from . import views

app_name = "dialogues"

urlpatterns = [
    path("chat/", views.ChatView.as_view(), name="chat"),
    path("clone/<int:concept_id>/", views.CloneChatView.as_view(), name="clone_chat"),
]
