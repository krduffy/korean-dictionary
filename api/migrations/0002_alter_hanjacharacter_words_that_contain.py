# Generated by Django 5.0.1 on 2024-02-01 04:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='hanjacharacter',
            name='words_that_contain',
            field=models.ManyToManyField(related_name='hanja_char', to='api.koreanword'),
        ),
    ]