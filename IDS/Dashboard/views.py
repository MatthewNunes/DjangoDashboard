from django.shortcuts import render
from django.http import HttpResponse
from django.templatetags.static import static
import pandas as pd
import os

# Create your views here.
def index(request):
    network_df = pd.read_csv(static("Dashboard/resources/SWaT/data2017_time_SWaT.csv").replace("/", "./Dashboard/", 1))
    return render(request, "Dashboard/index.html", {'dataset': network_df.to_json()})
