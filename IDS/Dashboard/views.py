from django.shortcuts import render
from django.http import HttpResponse
from django.templatetags.static import static
import pandas as pd
import os
import json

# Create your views here.
def index(request):
    network_df = pd.read_csv(static("Dashboard/resources/SWaT/data2017_time_SWaT.csv").replace("/", "./Dashboard/", 1))

    dst_file = open(static("Dashboard/resources/SWaT/2017_SWAT_dst_ips.json").replace("/", "./Dashboard/", 1))
    dst_obj = json.load(dst_file)

    src_file = open(static("Dashboard/resources/SWaT/2017_SWAT_src_ips.json").replace("/", "./Dashboard/", 1))
    src_obj = json.load(src_file)

    unique_ips_file = open(static("Dashboard/resources/SWaT/unique_vals_ips_reversed_SWAT.json").replace("/", "./Dashboard/", 1))
    unique_ips_obj = json.load(unique_ips_file)

    return render(request, "Dashboard/index.html", {
        'dataset': network_df[0:2].to_json(orient="records"),
        'destination_ips': json.dumps(dst_obj),
        'source_ips': json.dumps(src_obj),
        'unique_ips': json.dumps(unique_ips_obj)
        })
