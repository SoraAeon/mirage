from rest_framework.routers import DefaultRouter
from .views import ChoiceNodeViewSet, UserProgressViewSet

router = DefaultRouter()
router.register(r'choice-nodes', ChoiceNodeViewSet)
router.register(r'user-progress', UserProgressViewSet)

urlpatterns = router.urls
