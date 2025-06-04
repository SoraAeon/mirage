# apps/questions/urls.py
from django.urls import path
from . import views

app_name = "questions"

urlpatterns = [
    path("ask/<int:concept_id>/", views.AskQuestionView.as_view(), name="ask_question"),
]
