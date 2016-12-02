window.onload = init;

function init() {
  // get URL query parameters
  var queryParams = {};
  
  var search = window.location.search;
  if (!search) return;
  
  search = search.substring(1); // remove prefixing '?'
  var searchArray = search.split('&');
  for (var i = 0; i < searchArray.length; i++) {
    var pair = searchArray[i].split('=');
    queryParams[pair[0]] = pair[1];
  }
  
  if (!queryParams.hasOwnProperty('tax') ||
      !queryParams.hasOwnProperty('fee') ||
      !queryParams.hasOwnProperty('tip')) {
    console.error('Found URL query string but not all required fields are present (tax, tip, and fee)');
    // example index.html?tax=0.30&fee=1.50&tip=15&gus=5.00
    return;
  }
  
  // TODO
}

function split() {
	var input = document.getElementById('textarea').value;
	var taxes = Number(document.getElementById('taxes').value);
	var fees = Number(document.getElementById('fees').value);
	var tipPercent = Number(document.getElementById('tip').value);

	var map = {};
	var arr = input.split('\n');

	var itemCost = null;
	var itemAmount = null;
	var subtotal = 0;

	for (var i = 0; i < arr.length; i++) {
		var line = arr[i].trim();

		line = line.replace(/\s+/g, " "); 
		var dollarIndex = line.indexOf('$');
		if (itemCost == null && dollarIndex > -1) {
			itemAmount = Number(line.substring(0, line.indexOf(' ')));
			itemCost = Number(line.substring(dollarIndex + 1, line.length));
		} else {
			var labelIndex = line.indexOf('Label for:');
			if (labelIndex > -1) {
				var person = line.substring(labelIndex + 'Label for:'.length, line.length);

				if (map[person] == null) {
					map[person] = 0;
				}

				subtotal += itemAmount * itemCost;
				map[person] += itemAmount * itemCost;
				itemCost = null;
			}
		}
	}

	var taxPercent = taxes / subtotal;
	var feesPerPerson = fees / Object.keys(map).length;
	var tip = tipPercent * subtotal / 100;
	var total = subtotal + taxes + fees + tip;

	var totalMap = {
		'Subtotal:': subtotal,
		'Tax:': taxes,
		'Fees:': fees,
		'Tip:': tip,
		'Total:': total
	};

	for (var x in map) {
		map[x] = map[x] + map[x] * taxPercent + feesPerPerson + map[x] * tipPercent / 100;
	}

	document.getElementById('result').innerHTML = 
		makePrettyTableFromObject(totalMap) +
		'<hr>' +
		'<pre>' + makePrettyTableFromObject(map) + '</pre>';
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
