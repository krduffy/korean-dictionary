# Generated by Django 5.0.1 on 2024-05-16 01:25

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='hanjacharacter',
            name='is_known',
        ),
    ]
