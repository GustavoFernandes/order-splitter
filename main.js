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

// TODO: check if the number at the beginning of the line affects the item cost
// example: 2 Chicken $4.00
//   should the cost for the person be $4 or $8?
function parseOrderUpInput(text) {
  var LABEL = 'Label for:';

  var map = {};
  var itemCost = null;
  var array = input.split('\n');
  
  for (var i = 0; i < array.length; i++) {
    var line = array[i].trim();
    line = line.replace(/\s+/g, ' '); // replace all whitespace with single space
    
    if (!itemCost) {
      var dollarIndex = line.indexOf('$');
      if (dollarIndex > -1) {
        itemCost = Number(line.substring(dollarIndex + 1, line.length));
      }
      continue;
    }
    
    var labelIndex = line.indexOf(LABEL);
    if (labelIndex > -1) {
      var person = line.substring(labelIndex + LABEL.length, line.length);
      
      if (map[person] == null) {
        map[person] = 0;
      }
      
      map[person] += itemCost;
      itemCost = null;
    }
  }
  
  return map;
}

function split() {
	var input = document.getElementById('textarea').value;
	var taxes = Number(document.getElementById('taxes').value);
	var fees = Number(document.getElementById('fees').value);
	var tipPercent = Number(document.getElementById('tip').value);
	
	// TODO this.parseOrderUpInput(input);

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
