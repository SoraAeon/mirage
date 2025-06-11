from rest_framework import serializers
from .models import Area, UserLocation

class AreaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Area
        fields = ['id', 'name', 'description', 'order', 'icon']

class UserLocationSerializer(serializers.ModelSerializer):
    area = AreaSerializer()

    class Meta:
        model = UserLocation
        fields = ['user', 'area', 'entered_at']
