# apps/dialogues/management/commands/cleanup_sessions.py

from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from apps.dialogues.models import DialogueSession

class Command(BaseCommand):
    help = "1時間以上古い非永続セッション（is_persistent=False）を削除します"

    def handle(self, *args, **options):
        threshold = timezone.now() - timedelta(hours=1)
        deleted_count, _ = DialogueSession.objects.filter(
            is_persistent=False,
            created_at__lt=threshold
        ).delete()
        self.stdout.write(self.style.SUCCESS(
            f"Deleted {deleted_count} non-persistent sessions older than 1 hour."
        ))
