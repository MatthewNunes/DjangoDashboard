from django.contrib import admin
from .models import Device




class DeviceAdmin(admin.ModelAdmin):
    list_display = ("ip_address", "type", "description")

# Register your models here.
admin.site.register(Device, DeviceAdmin)
