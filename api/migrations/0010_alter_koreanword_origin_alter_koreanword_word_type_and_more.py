# Generated by Django 5.0.1 on 2024-04-11 04:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0009_alter_koreanword_origin_alter_koreanword_word_type_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='koreanword',
            name='origin',
            field=models.CharField(default='', max_length=100),
        ),
        migrations.AlterField(
            model_name='koreanword',
            name='word_type',
            field=models.CharField(default='', max_length=3),
        ),
        migrations.AlterField(
            model_name='sense',
            name='category',
            field=models.CharField(default='', max_length=6),
        ),
        migrations.AlterField(
            model_name='sense',
            name='pos',
            field=models.CharField(default='', max_length=6),
        ),
        migrations.AlterField(
            model_name='sense',
            name='type',
            field=models.CharField(default='', max_length=3),
        ),
    ]
