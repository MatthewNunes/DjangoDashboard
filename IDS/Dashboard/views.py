from django.shortcuts import render
from django.http import HttpResponse
import pandas as pd

# Create your views here.
def index(request):
    return render(request, "Dashboard/index.html")
