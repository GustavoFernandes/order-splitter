self.addEventListener('message', function(e) {
	let order = e.data;
	let arr = split(order);

	let map = arr[0];
	let totalMap = arr[1];

	self.postMessage({map, totalMap});
});

function split({input, taxes, fees, tipPercent}) {
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
	return [map, totalMap];
}
