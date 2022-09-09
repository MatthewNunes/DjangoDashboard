from django.shortcuts import render
from django.http import HttpResponse
from django.templatetags.static import static
from django.core import serializers
import pandas as pd
import os
import json
from .models import Device, Microcontroller, Alert
from sklearn.ensemble import IsolationForest



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

def getAlerts():
    critical_alerts = Alert.objects.filter(severity="Critical")
    high_alerts = Alert.objects.filter(severity="High")
    medium_alerts = Alert.objects.filter(severity="Medium")
    low_alerts = Alert.objects.filter(severity="Low")
    return critical_alerts, high_alerts, medium_alerts, low_alerts
# Create your views here.
def index(request):
    global current_time
    global time_list
    global network_df
    handleGet(request)
    critical_alerts, high_alerts, medium_alerts, low_alerts = getAlerts()

    network_slice_df = network_df[network_df["StartTime"] == current_time]

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
        'critical_alerts': critical_alerts,
        'high_alerts': high_alerts,
        'medium_alerts': medium_alerts,
        'low_alerts': low_alerts,
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
    all_devices_json = serializers.serialize("json", Device.objects.all())
    all_devices = Device.objects.all()
    critical_alerts, high_alerts, medium_alerts, low_alerts = getAlerts()

    time_aslist = list(time_list)
    current_index = time_aslist.index(current_time)
    current_slice = network_df[network_df["StartTime"].isin(time_aslist[0:current_index+1])]
    current_group = current_slice.groupby(["SrcAddr"]).sum()

    percent_vals_dict = {}
    viz_dict = {}
    for field in field_stats:
        total = current_group[field].sum()
        if selected_device.log_id in current_group.index:
            percentage_val = current_group.loc[[selected_device.log_id]][field].to_numpy()[0] / total
            percentage_val = percentage_val * 100
            percent_vals_dict[field_names[field]] = round(percentage_val, 2)

            current_group_percents = current_group[field] / total
            current_group_percents = current_group_percents * 100
            for device in all_devices:
                if device.log_id not in current_group_percents:
                    current_group_percents = pd.concat([current_group_percents, pd.Series([0],index=[device.log_id])])
            viz_dict[field_names[field]] = current_group_percents.to_json()

    return render(request, "Dashboard/device.html", {
     'time_list': json.dumps(list(time_list)),
     'current_time': current_time,
     'source_model': Device.objects.all(),
     'selected_device': selected_device,
     'percent_vals_dict': percent_vals_dict,
     'viz_dict': viz_dict,
     'all_devices': all_devices_json,
     'critical_alerts': critical_alerts,
     'high_alerts': high_alerts,
     'medium_alerts': medium_alerts,
     'low_alerts': low_alerts,
    })

def alert(request, id):
    global current_time
    global time_list
    global network_df
    handleGet(request)
    critical_alerts, high_alerts, medium_alerts, low_alerts = getAlerts()
    alert_obj = Alert.objects.get(pk=id)
    microcontrollers = alert_obj.microcontroller.all()
    names = []
    full_names = []
    for controller in microcontrollers:
        names.append(controller.device_id.split("-")[1][0])
        full_names.append(controller.device_id)
    #There are six stages
    cost = len(list(set(names))) / 6
    #6 gallons produced per minute normally
    #7200 per hour
    output_loss = cost * 7200
    alert_df = pd.read_csv(static("Dashboard/resources/" + alert_obj.physical_file).replace("/", "./Dashboard/", 1))



    return render(request, "Dashboard/alert.html", {
     'time_list': json.dumps(list(time_list)),
     'current_time': current_time,
     'output_loss': output_loss,
     'source_model': Device.objects.all(),
     'alert_obj': alert_obj,
     'alert_df': alert_df.to_json(orient="records"),
     'full_microcontroller_names': json.dumps(full_names),
     'critical_alerts': critical_alerts,
     'high_alerts': high_alerts,
     'medium_alerts': medium_alerts,
     'low_alerts': low_alerts,
    })

def addPhysicalToDatabase(request):
    src_file = open(static("Dashboard/resources/SWaT/physical_devices.csv").replace("/", "./Dashboard/", 1))
    for line in src_file:
        id = line.split(",")[0].strip()
        type = line.split(",")[1].strip()
        desc = line.split(",")[2].strip()
        c = Microcontroller(device_id=id, type=type, description=desc)
        c.save()
    src_file.close()
    return HttpResponse("Called")

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

def addAlertToDatabase(request):
    alert_df = pd.read_csv(static("Dashboard/resources/SWaT/attack_one.csv").replace("/", "./Dashboard/", 1))
    start_time = alert_df["Timestamp"][0]
    severity = "Medium"
    physical_file = "SWaT/attack_one.csv"
    devices = list(Microcontroller.objects.filter(device_id="FIT-502"))
    devices.extend(list(Microcontroller.objects.filter(device_id="AIT-203")))
    devices.extend(list(Microcontroller.objects.filter(device_id="P-206")))
    devices.extend(list(Microcontroller.objects.filter(device_id="FIT-401")))
    devices.extend(list(Microcontroller.objects.filter(device_id="FIT-301")))
    a = Alert(start_time=start_time, severity=severity, physical_file=physical_file)
    a.save()
    for d in devices:
        a.microcontroller.add(d)
    a.save()
    print(devices)
    return HttpResponse("Called")
