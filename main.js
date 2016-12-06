var worker = new Worker('parser.js');

worker.addEventListener('message', function(e) {
	let map = e.data.map;
	let totalMap = e.data.totalMap;

	document.getElementById('result').innerHTML = 
		makePrettyTableFromObject(totalMap) +
		'<hr>' +
		'<pre>' + makePrettyTableFromObject(map) + '</pre>';
});

function split() {
	var input = document.getElementById('textarea').value;
	var taxes = Number(document.getElementById('taxes').value);
	var fees = Number(document.getElementById('fees').value);
	var tipPercent = Number(document.getElementById('tip').value);

	worker.postMessage({input, taxes, fees, tipPercent});
}


function prettifyNumber(n) {
	return pad(Math.round(n * 100) / 100);
}

function pad(n) {
	var s = n.toString();

	if (s.indexOf('.') == -1) {
		s += '.';
	}

	while (s.length < s.indexOf('.') + 3) {
		s += '0';
	}

	return s;
}

function makePrettyTableFromObject(obj) {
	var table = '<table>';
	for (var x in obj) {
		table += '<tr><td>' + x + '</td><td>$' + prettifyNumber(obj[x]) + '</td></tr>';
	}
	table += '</table>';
	return table;
}
