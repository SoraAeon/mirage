
from rest_framework.routers import DefaultRouter
from .views import AreaViewSet, UserLocationViewSet

router = DefaultRouter()
router.register(r'areas', AreaViewSet)
router.register(r'user-locations', UserLocationViewSet, basename='userlocation')

urlpatterns = router.urls