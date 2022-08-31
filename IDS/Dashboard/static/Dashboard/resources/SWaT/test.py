f = open("physical_devices.csv")

for line in f:
	print(line.split(",")[0].strip(), line.split(",")[1].strip())