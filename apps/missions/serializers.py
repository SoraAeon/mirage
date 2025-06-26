from rest_framework import serializers
from .models import Mission

class MissionSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')  # 読み取り専用

    class Meta:
        model = Mission
        fields = [
            'id', 'user', 'title', 'description', 'job', 'mbti', 'skill',
            'exp', 'level', 'created_at', 'updated_at'
        ]
        read_only_fields = ('exp', 'level', 'created_at', 'updated_at')
