import csv
import math
	
CO = []
DA = []
HC = []
VW = []

filenames = [
				'Criminal_Offenses_On_campus',
				'Disciplinary_Actions_On_campus',
				'Hate_Crimes_On_campus',
				'VAWA_Offenses_On_campus'
			]
			
fileCO = "Criminal_Offenses_On_campus_combined.csv"
fileDA = "Disciplinary_Actions_On_campus_combined.csv"
fileHC = "Hate_Crimes_On_campus_combined.csv"
fileVW = "VAWA_Offenses_On_campus_combined.csv"

for row in csv.reader(open(fileCO, 'rb')):
	CO.append(row)
for row in csv.reader(open(fileDA, 'rb')):
	DA.append(row)
for row in csv.reader(open(fileHC, 'rb')):
	HC.append(row)
for row in csv.reader(open(fileVW, 'rb')):
	VW.append(row)

cols = CO.pop(0)

newData = []

newCols = cols[0:4]
newCols.extend(['CO','DA','HC','VW','total'])
newData.append(newCols)


first = 0
second = 0
for i in CO:
	coTotal = sum(map(int,['0' if v is '' else v for v in i[4:]]))
	
	daTemp = [item for item in DA if (item[0] == i[0] and item[1] == i[1])][0][4:]
	daTotal = sum(map(int,['0' if v is '' else v for v in daTemp]))
	
	hcTemp = [item for item in HC if (item[0] == i[0] and item[1] == i[1])][0][4:]
	hcTotal = sum(map(int,['0' if v is '' else v for v in hcTemp]))
	
	vwList = [item for item in VW if (item[1] == i[1])]
	if len(vwList) > 0:
		vwTemp = map(int,vwList[0][4:])
		first += 1
	else:
		vwTemp = [0]
		second += 1
	vwTotal = sum(map(int,['0' if v is '' else v for v in vwTemp]))
	newRecord = i[0:4]
	newRecord.extend([coTotal, daTotal, hcTotal, vwTotal,coTotal+daTotal+hcTotal+vwTotal])
	newData.append(newRecord)
print first
print second
	
outputpath = 'crime_types.csv'
with open(outputpath, "wb") as csv_file:
	writer = csv.writer(csv_file, delimiter=',')
	for line in newData:
		writer.writerow(line)
	
	