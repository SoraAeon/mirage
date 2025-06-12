from rest_framework import viewsets, permissions
from .models import Area, UserLocation
from .serializers import AreaSerializer, UserLocationSerializer

class AreaViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Area.objects.all().order_by('order')
    serializer_class = AreaSerializer
    permission_classes = [permissions.AllowAny]

class UserLocationViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = UserLocationSerializer

    def get_queryset(self):
        return UserLocation.objects.filter(user=self.request.user)
