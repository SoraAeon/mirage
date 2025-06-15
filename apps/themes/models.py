from django.db import models

class Theme(models.Model):
    name = models.CharField(max_length=64, unique=True)
    description = models.TextField(blank=True)
    def __str__(self):
        return self.name

class Job(models.Model):
    theme = models.ForeignKey(Theme, on_delete=models.CASCADE, related_name='jobs')
    name = models.CharField(max_length=64)
    description = models.TextField(blank=True)
    def __str__(self):
        return f"{self.theme.name}-{self.name}"

class JobBranch(models.Model):
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='branches')
    name = models.CharField(max_length=64)
    description = models.TextField(blank=True)
    def __str__(self):
        return f"{self.job.theme.name}-{self.job.name}-{self.name}"

# ★ジョブ横断マッピングモデル
class CrossThemeJobMap(models.Model):
    source_theme = models.ForeignKey(Theme, related_name='source_maps', on_delete=models.CASCADE)
    source_job = models.ForeignKey(Job, related_name='source_job_maps', on_delete=models.CASCADE)
    target_theme = models.ForeignKey(Theme, related_name='target_maps', on_delete=models.CASCADE)
    target_job = models.ForeignKey(Job, related_name='target_job_maps', on_delete=models.CASCADE)
    def __str__(self):
        return f"{self.source_theme.name}/{self.source_job.name} → {self.target_theme.name}/{self.target_job.name}"
