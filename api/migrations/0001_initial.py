# Generated by Django 5.0.1 on 2024-05-01 00:11

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='HanjaCharacter',
            fields=[
                ('character', models.CharField(max_length=1, primary_key=True, serialize=False)),
                ('meaning_reading', models.CharField(max_length=30)),
                ('is_known', models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name='KoreanWord',
            fields=[
                ('target_code', models.IntegerField(primary_key=True, serialize=False)),
                ('word', models.CharField(max_length=100)),
                ('origin', models.CharField(default='', max_length=100)),
                ('word_type', models.CharField(default='', max_length=3)),
                ('is_known', models.BooleanField(default=False)),
                ('created_by_user', models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name='Sense',
            fields=[
                ('target_code', models.IntegerField(primary_key=True, serialize=False)),
                ('definition', models.CharField(max_length=1500)),
                ('type', models.CharField(default='', max_length=3)),
                ('order', models.SmallIntegerField()),
                ('category', models.CharField(default='', max_length=6)),
                ('pos', models.CharField(default='', max_length=6)),
                ('additional_info', models.JSONField(default=None, null=True)),
                ('created_by_user', models.BooleanField(default=False)),
                ('referent', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='senses', to='api.koreanword')),
            ],
        ),
    ]
