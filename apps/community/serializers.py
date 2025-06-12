from rest_framework import serializers
from .models import Message

class MessageSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Message
        fields = ['id', 'area', 'user', 'user_name', 'content', 'created_at']
