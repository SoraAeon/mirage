from rest_framework.routers import DefaultRouter
from .views import QuestViewSet, QuestAchievementViewSet

router = DefaultRouter()
router.register(r'quests', QuestViewSet)
router.register(r'achievements', QuestAchievementViewSet)

urlpatterns = router.urls
