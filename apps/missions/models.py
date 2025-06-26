from django.db import models
from django.conf import settings

# 選択肢リスト（参考）
JOB_CHOICES = [
    ('tank', 'Tank（分析）'),
    ('healer', 'Healer（外交）'),
    ('mage', 'Mage（番人）'),
    ('assassin', 'Assassin（探検）'),
]

MBTI_CHOICES = [
    # Tank
    ('INTJ', 'Architect（建築家）'),
    ('INTP', 'Logician（論理学者）'),
    ('ENTJ', 'Commander（指揮者）'),
    ('ENTP', 'Debater（討論者）'),
    # Healer
    ('INFJ', 'Advocate（提唱者）'),
    ('INFP', 'Mediator（仲介者）'),
    ('ENFJ', 'Protagonist（主人公）'),
    ('ENFP', 'Campaigner（運動家）'),
    # Mage
    ('ISTJ', 'Logistician（管理者）'),
    ('ISFJ', 'Defender（擁護者）'),
    ('ESTJ', 'Executive（領事）'),
    ('ESFJ', 'Consul（領事）'),
    # Assassin
    ('ISTP', 'Virtuoso（巨匠）'),
    ('ISFP', 'Adventurer（冒険家）'),
    ('ESTP', 'Entrepreneur（起業家）'),
    ('ESFP', 'Entertainer（ESFP）'),
]

# Skillリスト
SKILL_CHOICES = [
    # Tank
    ('visionary', 'Visionary'),
    ('strategist', 'Strategist'),
    ('director', 'Director'),
    ('organizer', 'Organizer'),
    # Healer
    ('planner', 'Planner'),
    ('treasurer', 'Treasurer'),
    ('mediator', 'Mediator'),
    ('supporter', 'Supporter'),
    # Mage
    ('architect', 'Architect'),
    ('engineer', 'Engineer'),
    ('innovator', 'Innovator'),
    ('analyst', 'Analyst'),
    # Assassin
    ('marketer', 'Marketer'),
    ('evangelist', 'Evangelist'),
    ('negotiator', 'Negotiator'),
    ('influencer', 'Influencer'),
]

class Mission(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='missions')
    title = models.CharField(max_length=128, help_text="Missionタイトル（自由記述 or 選択）")
    description = models.TextField(blank=True, help_text="Missionの詳細説明（任意）")
    job = models.CharField(max_length=16, choices=JOB_CHOICES)
    mbti = models.CharField(max_length=8, choices=MBTI_CHOICES)
    skill = models.CharField(max_length=16, choices=SKILL_CHOICES)
    exp = models.PositiveIntegerField(default=0)
    level = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # 表示用
    def __str__(self):
        return f"{self.user.username} - {self.title} (Lv.{self.level})"

    class Meta:
        verbose_name = 'Mission'
        verbose_name_plural = 'Missions'
        ordering = ['-created_at']
