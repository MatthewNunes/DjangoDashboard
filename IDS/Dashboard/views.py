from django.shortcuts import render
from django.http import HttpResponse
from django.templatetags.static import static
import pandas as pd
import os
import json
from .models import Device


network_df = pd.read_csv(static("Dashboard/resources/SWaT/data2017_time_SWaT.csv").replace("/", "./Dashboard/", 1))
time_list = network_df["StartTime"].unique()
current_time = time_list[0]


#current_slice = network_df[network_df["StartTime"] == current_time].groupby(["SrcAddr"]).sum()
#print(current_slice)

def handleGet(request):
    global current_time
    if request.method == 'GET':
        if (request.GET.get('time') != None):
            current_time = request.GET.get('time')
            print(current_time)
# Create your views here.
def index(request):
    global current_time
    global time_list
    global network_df
    handleGet(request)


    network_slice_df = network_df[network_df["StartTime"] == current_time]
    print(network_slice_df.shape)

    dst_file = open(static("Dashboard/resources/SWaT/2017_SWAT_dst_ips.json").replace("/", "./Dashboard/", 1))
    dst_obj = json.load(dst_file)

    src_file = open(static("Dashboard/resources/SWaT/2017_SWAT_src_ips.json").replace("/", "./Dashboard/", 1))
    src_obj = json.load(src_file)

    unique_ips_file = open(static("Dashboard/resources/SWaT/unique_vals_ips_reversed_SWAT.json").replace("/", "./Dashboard/", 1))
    unique_ips_obj = json.load(unique_ips_file)

    return render(request, "Dashboard/index.html", {
        'src_list': src_obj,
        'dataset': network_slice_df.to_json(orient="records"),
        'destination_ips': json.dumps(dst_obj),
        'source_ips': json.dumps(src_obj),
        'unique_ips': json.dumps(unique_ips_obj),
        'source_model': Device.objects.all(),
        'time_list': json.dumps(list(time_list)),
        'current_time': current_time,
        })

def table(request):
    global current_time
    global time_list
    global network_df
    handleGet(request)
    #network_df = pd.read_csv(static("Dashboard/resources/SWaT/data2017_time_SWaT.csv").replace("/", "./Dashboard/", 1))
    network_slice_df = network_df[network_df["StartTime"] == current_time]

    src_file = open(static("Dashboard/resources/SWaT/2017_SWAT_src_ips.json").replace("/", "./Dashboard/", 1))
    src_obj = json.load(src_file)

    unique_ips_file = open(static("Dashboard/resources/SWaT/unique_vals_ips_reversed_SWAT.json").replace("/", "./Dashboard/", 1))
    unique_ips_obj = json.load(unique_ips_file)

    return render(request, "Dashboard/table.html", {
        'src_list': src_obj,
        'dataset': network_slice_df.to_json(orient="records"),
        'unique_ips': json.dumps(unique_ips_obj),
        'source_model': Device.objects.all(),
        'time_list': json.dumps(list(time_list)),
        'current_time': current_time,
    })

def device(request, id):
    global current_time
    global time_list
    global network_df
    handleGet(request)
    field_stats = ["SrcBytes", "SrcPkts", "DstBytes", "DstPkts"]
    field_names = {"SrcBytes": "Source Bytes", "SrcPkts": "Source Packets", "DstBytes": "Destination Bytes", "DstPkts": "Destination Packets"}
    selected_device = Device.objects.get(pk=id)

    time_aslist = list(time_list)
    current_index = time_aslist.index(current_time)
    current_slice = network_df[network_df["StartTime"].isin(time_aslist[0:current_index+1])]
    current_group = current_slice.groupby(["SrcAddr"]).sum()

    percent_vals_dict = {}
    viz_dict = {}
    for field in field_stats:
        total = current_group[field].sum()
        percentage_val = current_group.loc[[selected_device.log_id]][field].to_numpy()[0] / total
        percentage_val = percentage_val * 100
        percent_vals_dict[field_names[field]] = round(percentage_val, 2)
        viz_dict[field_names[field]] = json.dumps(current_group[field].to_json())

    return render(request, "Dashboard/device.html", {
     'time_list': json.dumps(list(time_list)),
     'current_time': current_time,
     'source_model': Device.objects.all(),
     'selected_device': selected_device,
     'percent_vals_dict': percent_vals_dict,
     'viz_dict': viz_dict,
    })


def addDevicesToDatabase(request):
    src_file = open(static("Dashboard/resources/SWaT/2017_SWAT_src_ips.json").replace("/", "./Dashboard/", 1))
    src_obj = json.load(src_file)
    src_file.close()

    unique_ips_file = open(static("Dashboard/resources/SWaT/unique_vals_ips_reversed_SWAT.json").replace("/", "./Dashboard/", 1))
    unique_ips_obj = json.load(unique_ips_file)
    unique_ips_file.close()

    for num_id in src_obj:
        address = unique_ips_obj[str(num_id)]
        d = Device(ip_address=address, log_id=num_id)
        d.save()

    return HttpResponse("Called")
