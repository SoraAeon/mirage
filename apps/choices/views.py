from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import ChoiceCard, QuestParticipation
from .serializers import ChoiceCardSerializer, QuestParticipationSerializer
from apps.quests.models import Quest

class UserChoicesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # 進行中クエスト（ロックカードとして必ず返す）
        locked = QuestParticipation.objects.filter(user=user, completed=False)
        locked_cards = [
            {
                "card_type": "quest",
                "locked": True,
                "quest": QuestParticipationSerializer(part).data,
            }
            for part in locked
        ]

        # 新規カードの候補
        unlocked_count = 4 - len(locked_cards)
        # シンプル例：適当なChoiceCardをunlockedとして返す（本来はおすすめロジックへ）
        unlocked_cards = ChoiceCard.objects.filter(
            active=True,
            card_type='quest'
        ).exclude(quest__in=[p.quest for p in locked])[:unlocked_count]
        unlocked_serialized = ChoiceCardSerializer(unlocked_cards, many=True).data

        # 4つ合計に
        cards = locked_cards + unlocked_serialized
        # 足りなければ空カードで補充（profile, goal, etc.でもOK）

        return Response(cards)
