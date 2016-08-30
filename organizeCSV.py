import os
import re
import csv
import json

path = './data/HS'
re_file_name = re.compile('HS-(?P<country>[\u4e00-\u9fa5]+)[\u4e00-\u9fa5]{2}[\u4e00-\u9fa5a-zA-Z0-9_()-~]+.csv$')

re_monthly_data = re.compile('^["](?P<year>\d{2,3})[\u4e00-\u9fa5]\s(?P<month>\d{1,2})')
re_monthly_data_total_trade = re.compile('^(?P<year>\d{2,3})[\u4e00-\u9fa5]\s(?P<month>\d{1,2})')

re_value = re.compile('^(\s+)(?P<value>\d*,{0,1}\d+,{0,1}\d*)"{0,1}\r{0,1}\n{0,1}$')	
re_value_total_trade = re.compile('^(?P<value>\d+)\s*$')

re_zero_value = re.compile('^\s+－"*\s{0,1}$')

re_col_escapes = re.compile('\s*"*\r{0,1}\n{0,1}$')

def csv_to_json_output(csv, output, delimeter='","'):

	col_headers = None
					
	for index, row in enumerate(csv):
		
		# Dump the first row.
		if index == 0:
			continue

		# The headers are in the row 1.
		if index == 1:
			col_headers = row.split(delimeter)
			
			# Delete all escapes in column headers
			for i, hd in enumerate(col_headers):

				hd = re_col_escapes.sub('', hd)
				print('hd: ', hd.__repr__())
				col_headers[i] = hd
			# print('col_headers: ', col_headers)
		else:
			
			for i, r in enumerate(row.split(delimeter)):
				
				# Latest nation data
				latest_output_idx = len(output)-1
				
				# Latest time data
				latest_data_idx = len(output[latest_output_idx]['data']) - 1

				# First col is time data
				if i == 0:
					time_m = re_monthly_data.match(r)
				
					if time_m:
						output[latest_output_idx]['data'].append( \
							{'yr': time_m.group('year'), 'mon': time_m.group('month')})
					else:
						time_m2 = re_monthly_data_total_trade.match(r)

						if time_m2:
							output[latest_output_idx]['data'].append( \
								{'yr': time_m2.group('year'), 'mon': time_m2.group('month')})

				else:

					print('header: ', col_headers[i].__repr__())
					print(r.__repr__())
					value_m = re_value.match(r)
					
					if value_m:	
						print('i in value_m: ', i)
						output[latest_output_idx]['data'] \
							[latest_data_idx][col_headers[i]] = \
								value_m.group('value').replace(',', '')

					else:
						
						value_m2 = re_value_total_trade.match(r)
						zero = re_zero_value.match(r)
						
						if value_m2:
							print('i in value_m2: ', i)
							output[latest_output_idx]['data'] \
								[latest_data_idx][col_headers[i]] = \
									value_m2.group('value').replace(',', '')

						elif zero:
							print('i in zero: ', i)
							output[latest_output_idx]['data'] \
								[latest_data_idx][col_headers[i]] = 0
					print(col_headers[i] + ':')
					print(output[latest_output_idx]['data'][latest_data_idx][col_headers[i]])						
					print('============================================')

	return output

if __name__ == '__main__':

	# It is used for calculationg the proportional trade value
	total_trade_output = None

	# Handle the total.
	# with open(path + '/HS-總數出口(民國90~105)按月.csv', newline='') as csv_data:

	# 	# The final output result
	# 	output = [{ 'data': [] }]

	# 	# Start to parse the file
	# 	total_trade_output = csv_to_json_output(csv_data, output, ',')

	# 	json.dump(total_trade_output, open('總數.json', 'w+'), ensure_ascii=False)

	# Parse each country
	for root, dirs, files in os.walk('./data/HS'):

		for f in files:
			print(f)
	# 		# Parse the csv files only
	# 		file_name_m = re_file_name.match(f)

	# 		# The final output result
	# 		output = []

	# 		# Start to parse the file
	# 		if file_name_m and file_name_m.group('country') != '總數':
				
	# 			output.append({ 'nation': file_name_m.group('country'), 'data': [] })

	# 			with open(path + '/' + f, newline='') as csv_data:
	# 				print('Nation:', file_name_m.group('country'))
	# 				country_trade = csv_to_json_output(csv_data, output)

	# 			# Calculate the proprotion of each goods
	# 			for i, d in enumerate(country_trade[0]['data']):
	# 				print(i)
	# 				print(file_name_m.group('country'))
	# 				print(total_trade_output[0]['data'][i])
	# 				print(total_trade_output[0]['data'][i].get('體操競技比賽其他運動或戶外遊戲用物品及設備'))
	# 				for key in iter(d):
						
	# 					if key != 'yr' and key != 'mon':

	# 						proportion = None
							
	# 						# division 0 handler
	# 						if int(total_trade_output[0]['data'][i][key]) == 0:
	# 							proportion = 0

	# 						else:
	# 							proportion = \
	# 								int(country_trade[0]['data'][i][key]) / int(total_trade_output[0]['data'][i][key])

	# 						# New data format with trade proportion.
	# 						_new_ = { 
	# 							'value': country_trade[0]['data'][i][key],
	# 							'proportion': proportion
	# 						}
						
	# 						# Replace the trade data with new format
	# 						country_trade[0]['data'][i][key] = _new_

	# 			json.dump(country_trade, \
	# 				open('./data/HS/json/' + file_name_m.group('country') + '.json', 'w+'), ensure_ascii=False)


						

				


