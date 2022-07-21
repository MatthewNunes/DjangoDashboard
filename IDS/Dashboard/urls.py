from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path('table/', views.table, name="table"),
    path('autoAdd/', views.addDevicesToDatabase, name="AutoAdd"),
]
