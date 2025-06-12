from rest_framework import viewsets, permissions
from .models import Quest, QuestAchievement
from .serializers import QuestSerializer, QuestAchievementSerializer

class QuestViewSet(viewsets.ModelViewSet):
    queryset = Quest.objects.all().order_by('-created_at')
    serializer_class = QuestSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)


class QuestAchievementViewSet(viewsets.ModelViewSet):
    queryset = QuestAchievement.objects.all().order_by('-achieved_at')
    serializer_class = QuestAchievementSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    def get_queryset(self):
        # 自分の達成記録だけ取得（MVPとしてはシンプルに）
        return QuestAchievement.objects.filter(user=self.request.user).order_by('-achieved_at')