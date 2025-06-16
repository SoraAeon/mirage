from rest_framework import serializers
from .models import ChoiceCard, QuestParticipation
from apps.quests.models import Quest
from apps.quests.serializers import QuestSerializer  # すでにあるなら

class ChoiceCardSerializer(serializers.ModelSerializer):
    quest = QuestSerializer(read_only=True)

    class Meta:
        model = ChoiceCard
        fields = [
            'id', 'card_type', 'title', 'description', 'quest',
            'payload', 'priority', 'active'
        ]

# 進行中クエスト用
class QuestParticipationSerializer(serializers.ModelSerializer):
    quest = QuestSerializer(read_only=True)
    class Meta:
        model = QuestParticipation
        fields = ['id', 'quest', 'started_at', 'completed']
