from rest_framework import serializers
from .models import UserProfile

class UserProfileSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    achievement_count = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = UserProfile
        fields = [
            'id', 'user', 'user_name', 'display_name', 'achievement_count', 'bio', 'avatar',
            'points', 'exp', 'level', 'skills'
        ]
        read_only_fields = ['user', 'user_name', 'points', 'exp', 'level']
