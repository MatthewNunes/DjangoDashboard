# Generated by Django 4.0.5 on 2022-07-21 15:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Dashboard', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='device',
            name='type',
            field=models.CharField(choices=[('Machine', 'Machine'), ('VPN', 'VPN'), ('Internet', 'Internet'), ('External', 'External'), ('Historian', 'Historian'), ('EWS', 'EWS'), ('PLC', 'PLC')], default='Machine', max_length=64),
        ),
    ]
