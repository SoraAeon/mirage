from rest_framework import viewsets
from .models import Theme, CrossThemeJobMap
from .serializers import ThemeSerializer, CrossThemeJobMapSerializer

class ThemeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Theme.objects.prefetch_related('jobs__branches').all()
    serializer_class = ThemeSerializer


class CrossThemeJobMapViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CrossThemeJobMap.objects.select_related('source_theme', 'source_job', 'target_theme', 'target_job')
    serializer_class = CrossThemeJobMapSerializer
