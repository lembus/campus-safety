import csv
import math
import os

filenames = [
				'Criminal_Offenses_On_campus',
				'Disciplinary_Actions_On_campus',
				'Hate_Crimes_On_campus',
				'VAWA_Offenses_On_campus'
			]

for name in filenames:
	data = []
	filename = name + '.csv'
	print filename
	for row in csv.reader(open(filename, 'rb')):
		data.append(row)
		
	cols = data.pop(0)
	def getKey(item):
		return int(item[1])

	data = sorted(data,key=getKey)
	newData = []

	newCols = cols[0:3]
	newCols.extend(cols[5:])
	newData.append(newCols)

	i = 0
	while (i < len(data)):
		record = data[i]
		year = record[0]
		id = record[1]
		aggVals = ['0' if v is '' else v for v in data[i][6:]]
		aggVals = map(int,aggVals)
		i += 1
		while (i<len(data) and data[i][0] == year and data[i][1] == id):
			temp = ['0' if v is '' else v for v in data[i][6:]]
			temp = map(int,temp)
			aggVals = [sum(tup) for tup in zip(aggVals,temp)]
			i += 1
		newRecord = record[0:3]
		newRecord.append(record[5])
		newRecord.extend(aggVals)
		newData.append(newRecord)

	outputpath = name + '_combined.csv'
	with open(outputpath, "wb") as csv_file:
		writer = csv.writer(csv_file, delimiter=',')
		for line in newData:
			writer.writerow(line)

for name in filenames:			
	os.remove(name + '.csv')

	
	