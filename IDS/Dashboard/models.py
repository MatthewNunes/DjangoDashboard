from django.db import models

#To update database about new models:
## python manage.py makemigrations
## python manage.py migrate

#To add to the admin page
##First create admin account - python manage.py createsuperuser
##Then go to admin.py inside app
##from .models import Device
##admin.site.register(Device)

device_types = [
    ("Machine", "Machine"),
    ("VPN", "VPN"),
    ("Internet", "Internet"),
    ("External", "External"),
    ("Historian", "Historian"),
    ("EWS", "EWS"),
    ("PLC", "PLC"),
]

# Create your models here.
class Device(models.Model):
    ip_address = models.CharField(max_length=15)
    log_id = models.IntegerField()
    type = models.CharField(max_length=64, choices=device_types, default='Machine')
    description = models.CharField(max_length=150, blank=True)
    def __str__(self):
        return f"{self.ip_address}"
