from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path('table/', views.table, name="table"),
#    path('device/', views.device, name="device"),
    path('device/<int:id>/', views.device, name="device"),
    path('autoAdd/', views.addDevicesToDatabase, name="AutoAdd"),
]
