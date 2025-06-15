from rest_framework.routers import DefaultRouter
from .views import ThemeViewSet, CrossThemeJobMapViewSet

router = DefaultRouter()
router.register(r'themes', ThemeViewSet)
router.register(r'job-maps', CrossThemeJobMapViewSet)
urlpatterns = router.urls
