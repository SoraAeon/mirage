# apps/dialogues/urls.py
from django.urls import path
from .views import PersonaChatView, GuestPersonaChatView

app_name = "dialogues"

urlpatterns = [
    path("chat/", PersonaChatView.as_view(), name="persona_chat"),
    path("guest/<str:concept_slug>/", GuestPersonaChatView.as_view(), name="guest_persona_chat")
]
