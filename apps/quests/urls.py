from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import QuestViewSet, AchievementViewSet
from .views import RecommendedQuestView

router = DefaultRouter()
router.register(r'quests', QuestViewSet)
router.register(r'achievements', AchievementViewSet)
urlpatterns = router.urls

urlpatterns = [
    path('recommended/', RecommendedQuestView.as_view(), name='recommended-quests'),
]