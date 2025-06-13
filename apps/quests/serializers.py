from rest_framework import serializers
from .models import Quest, Achievement

class QuestSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source='created_by.username', read_only=True)

    class Meta:
        model = Quest
        fields = [
            'id', 'title', 'description', 'category', 'is_sponsored', 'sponsor_name',
            'created_by', 'created_by_name', 'created_at'
        ]
        read_only_fields = ['created_by', 'created_by_name', 'created_at']


class AchievementSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    quest_title = serializers.CharField(source='quest.title', read_only=True)
    class Meta:
        model = Achievement
        fields = [
            'id', 'user', 'user_name', 'quest', 'quest_title',
            'comment', 'proof_image', 'achieved_at'
        ]
        read_only_fields = ['user', 'user_name', 'quest_title', 'achieved_at']