from rest_framework import serializers
from .models import Quest, QuestAchievement

class QuestSerializer(serializers.ModelSerializer):
    creator_name = serializers.CharField(source='creator.username', read_only=True)
    class Meta:
        model = Quest
        fields = ['id', 'title', 'description', 'tags', 'category', 'difficulty', 'creator', 'creator_name', 'created_at']

class QuestAchievementSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    quest_title = serializers.CharField(source='quest.title', read_only=True)
    class Meta:
        model = QuestAchievement
        fields = ['id', 'user', 'user_name', 'quest', 'quest_title', 'comment', 'proof_image', 'achieved_at']
        read_only_fields = ['user', 'user_name', 'quest_title', 'achieved_at']