# Generated by Django 4.2.21 on 2025-06-07 03:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('concepts', '0003_remove_concept_summary'),
    ]

    operations = [
        migrations.AddField(
            model_name='concept',
            name='slug',
            field=models.SlugField(blank=True, null=True, unique=True),
        ),
    ]
