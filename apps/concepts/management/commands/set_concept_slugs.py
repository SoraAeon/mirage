# apps/concepts/management/commands/set_concept_slugs.py
from django.core.management.base import BaseCommand
from apps.concepts.models import Concept
from django.utils.text import slugify

class Command(BaseCommand):
    help = 'すべてのConceptにslug（ownerのusername）を自動付与します'

    def handle(self, *args, **kwargs):
        updated = 0
        for concept in Concept.objects.all():
            if not concept.slug:
                concept.slug = slugify(concept.owner.username)
                concept.save()
                updated += 1
        self.stdout.write(self.style.SUCCESS(f"{updated} 件のConceptにslugを付与しました"))
