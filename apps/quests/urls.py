from rest_framework.routers import DefaultRouter
from .views import QuestViewSet, AchievementViewSet

router = DefaultRouter()
router.register(r'quests', QuestViewSet)
router.register(r'achievements', AchievementViewSet)
urlpatterns = router.urls
