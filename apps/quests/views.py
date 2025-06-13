from rest_framework import viewsets, permissions
from .models import Quest, Achievement
from .serializers import QuestSerializer, AchievementSerializer

class QuestViewSet(viewsets.ModelViewSet):
    queryset = Quest.objects.all().order_by('-created_at')
    serializer_class = QuestSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class AchievementViewSet(viewsets.ModelViewSet):
    queryset = Achievement.objects.all().order_by('-achieved_at')
    serializer_class = AchievementSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        # 自分の達成記録だけを表示したい場合
        return Achievement.objects.filter(user=self.request.user).order_by('-achieved_at')