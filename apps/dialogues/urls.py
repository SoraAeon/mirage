# apps/dialogues/urls.py
from django.urls import path
from .views import PersonaChatView, GuestPersonaChatView

app_name = "dialogues"

urlpatterns = [
    path("chat/", PersonaChatView.as_view(), name="persona_chat"),
    path("guest/<int:concept_id>/", GuestPersonaChatView.as_view(), name="guest_persona_chat"),
]
