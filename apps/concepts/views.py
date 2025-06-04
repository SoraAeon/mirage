# apps/concepts/views.py
from django.views.generic import ListView, DetailView
from django.views.generic.edit import UpdateView
from django.urls import reverse_lazy
from .models import Concept
from .forms import ConceptForm
from django.contrib.auth.mixins import LoginRequiredMixin

class ConceptListView(ListView):
    """
    他ユーザーの概念一覧（公開設定のものだけ）
    """
    model = Concept
    template_name = "concepts/concept_list.html"
    context_object_name = "concepts"

    def get_queryset(self):
        return Concept.objects.filter(is_public=True).select_related("owner")

class MyConceptView(LoginRequiredMixin, UpdateView):
    """
    自分の概念を閲覧・編集。最初はタイトルと公開設定のみ編集できる想定。
    """
    model = Concept
    form_class = ConceptForm
    template_name = "concepts/my_concept.html"
    success_url = reverse_lazy("concepts:my_concept")

    def get_object(self, queryset=None):
        # ログインユーザーのConcept を取得（存在しなければ作成）
        concept, created = Concept.objects.get_or_create(owner=self.request.user, defaults={"title": f"{self.request.user.username} の概念"})
        return concept

class ConceptDetailView(DetailView):
    """
    他ユーザーの概念プロフィール詳細表示
    """
    model = Concept
    template_name = "concepts/concept_detail.html"
    context_object_name = "concept"
