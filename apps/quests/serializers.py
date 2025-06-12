from rest_framework import serializers
from .models import ChoiceNode, UserProgress

class ChoiceNodeSerializer(serializers.ModelSerializer):
    next_choices = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = ChoiceNode
        fields = ['id', 'name', 'description', 'next_choices']

class UserProgressSerializer(serializers.ModelSerializer):
    node = ChoiceNodeSerializer()

    class Meta:
        model = UserProgress
        fields = ['id', 'user', 'node', 'reached_at']
