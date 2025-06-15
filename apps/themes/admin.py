from django.contrib import admin
from .models import Theme, Job, JobBranch, CrossThemeJobMap

@admin.register(Theme)
class ThemeAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'description')

@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ('id', 'theme', 'name', 'description')
    list_filter = ('theme',)

@admin.register(JobBranch)
class JobBranchAdmin(admin.ModelAdmin):
    list_display = ('id', 'job', 'name', 'description')
    list_filter = ('job',)

@admin.register(CrossThemeJobMap)
class CrossThemeJobMapAdmin(admin.ModelAdmin):
    list_display = ('source_theme', 'source_job', 'target_theme', 'target_job')
    list_filter = ('source_theme', 'target_theme')
