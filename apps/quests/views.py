from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import viewsets, permissions
from rest_framework.permissions import IsAuthenticated
from .models import Quest, Achievement
from .serializers import QuestSerializer, AchievementSerializer

import random

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
    

class RecommendedQuestView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        # ユーザーがまだ達成してないクエスト
        achieved_quest_ids = Achievement.objects.filter(user=user).values_list('quest_id', flat=True)
        available_quests = Quest.objects.exclude(id__in=achieved_quest_ids).filter(is_sponsored=False)
        recommended = list(available_quests)
        random.shuffle(recommended)
        recommended = recommended[:3]

        # Sponsored枠も最大2件（ここは好きに調整してOK）
        sponsored_quests = Quest.objects.exclude(id__in=achieved_quest_ids).filter(is_sponsored=True)[:2]

        return Response({
            "recommended": QuestSerializer(recommended, many=True).data,
            "sponsored": QuestSerializer(sponsored_quests, many=True).data
        })