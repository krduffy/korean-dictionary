# Generated by Django 5.0.1 on 2024-05-22 22:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_hanjacharacter_decomposition_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='hanjacharacter',
            name='meaning_reading',
            field=models.CharField(),
        ),
    ]
