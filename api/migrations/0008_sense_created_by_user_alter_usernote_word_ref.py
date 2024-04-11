# Generated by Django 5.0.1 on 2024-04-11 01:13

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_koreanword_created_by_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='sense',
            name='created_by_user',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='usernote',
            name='word_ref',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user_notes', to='api.koreanword'),
        ),
    ]
