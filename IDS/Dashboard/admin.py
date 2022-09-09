from django.contrib import admin
from .models import Device, Microcontroller, Alert




class DeviceAdmin(admin.ModelAdmin):
    list_display = ("ip_address", "type", "process")

class MicrocontrollerAdmin(admin.ModelAdmin):
    list_display = ("device_id", "type", "description")

class AlertAdmin(admin.ModelAdmin):
    list_display = ("start_time", "severity", "physical_file")

# Register your models here.
admin.site.register(Device, DeviceAdmin)
admin.site.register(Microcontroller, MicrocontrollerAdmin)
admin.site.register(Alert, AlertAdmin)
