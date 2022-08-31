from django.contrib import admin
from .models import Device, Microcontroller




class DeviceAdmin(admin.ModelAdmin):
    list_display = ("ip_address", "type", "process")

class MicrocontrollerAdmin(admin.ModelAdmin):
    list_display = ("device_id", "type", "description")

# Register your models here.
admin.site.register(Device, DeviceAdmin)
admin.site.register(Microcontroller, MicrocontrollerAdmin)
