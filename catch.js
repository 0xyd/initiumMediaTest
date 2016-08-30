/* 
	Operate web elements on 財政部 web page. 
	http://web02.mof.gov.tw/njswww/WebProxy.aspx?sys=100&funid=defjsptgl 
*/


// Choose monthly data
document
	.querySelector(
		'table[summary=國別、貨品細分類交叉表－出口查詢條件設定表格資料]:nth-child(2) select[name=cycle] option:first-child'
		).selected = true;

// Switch the data range from 民國90 to 民國105.
// Choose 90.
document
	.querySelector(
		'table[summary=國別、貨品細分類交叉表－出口查詢條件設定表格資料]:nth-child(2) select[name=yyf] > option:last-child')
	.selected = true;

document
	.querySelector(
		'table[summary=國別、貨品細分類交叉表－出口查詢條件設定表格資料]:nth-child(2) select[name=yyt] > option:first-child'
	).selected = true;

// Choose output mode to csv
document
	.querySelector(
		'table[summary=國別、貨品細分類交叉表－出口查詢條件設定表格資料]:nth-child(2) select[name=outmode] > option:last-child'
	).selected = true;

// Select all table about goods export
var tableIds = [];

for ( var i = 44; i <= 107; i++ )
	tableIds.push('#item'+i);

for ( var j = 0; j < tableIds.length; j++)
	document.querySelector(tableIds[j]+' input[name=codchk0]').checked = true;


