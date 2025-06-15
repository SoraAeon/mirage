from rest_framework import serializers
from .models import Theme, Job, JobBranch, CrossThemeJobMap

class JobBranchSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobBranch
        fields = ['id', 'name', 'description']

class JobSerializer(serializers.ModelSerializer):
    branches = JobBranchSerializer(many=True, read_only=True)
    class Meta:
        model = Job
        fields = ['id', 'name', 'description', 'branches']

class ThemeSerializer(serializers.ModelSerializer):
    jobs = JobSerializer(many=True, read_only=True)
    class Meta:
        model = Theme
        fields = ['id', 'name', 'description', 'jobs']


class CrossThemeJobMapSerializer(serializers.ModelSerializer):
    source_theme = serializers.CharField(source='source_theme.name')
    source_job = serializers.CharField(source='source_job.name')
    target_theme = serializers.CharField(source='target_theme.name')
    target_job = serializers.CharField(source='target_job.name')
    class Meta:
        model = CrossThemeJobMap
        fields = ['id', 'source_theme', 'source_job', 'target_theme', 'target_job']
