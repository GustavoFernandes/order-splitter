var OVERHEADS = ['tip', 'tax', 'fee'];

window.onload = init;

let web_socket = new WebSocket("wss://morning-spire-54006.herokuapp.com/");

web_socket.onmessage = function(e) {
   split(JSON.parse(e.data));
}


function init() {
  // check for URL query parameters
  if (window.location.search) {
    try {
      var input = this.parseQueryStringInput(window.location.search);
      this.split(input);
    } catch (err) {
      console.error(err);
    }
  }
}

/**
 * Parses a URL query string.
 *
 * Below is an example of input:
 * ?tax=0.30&fee=1.50&tip=15&Gus=5.00
 */
function parseQueryStringInput(input) {
  var map = {
    persons: {}
  };

  input = input.substring(1); // remove prefixing '?'
  var searchArray = input.split('&');
  for (var i = 0; i < searchArray.length; i++) {
    var pair = searchArray[i].split('=');
    if (OVERHEADS.indexOf(pair[0]) > -1) {
      map[pair[0]] = Number(pair[1]);
    } else {
      map.persons[pair[0]] = Number(pair[1]);
    }
  }
  
  if (!map.hasOwnProperty('tax') ||
      !map.hasOwnProperty('fee') ||
      !map.hasOwnProperty('tip')) {
    throw 'Found URL query string but not all required fields are present (tax, tip, and fee)';
  }

  map.tipPercent = map.tip / 100;
  delete map.tip;

  return map;
}

/**
 * Parses the confirmation summary from an OrderUp.com order
 */
function parseOrderUpInput(text) {
  // TODO: check if the number at the beginning of the line affects the item cost
  // example: 2 Chicken $4.00
  //   should the cost for the person be $4 or $8?

  var LABEL = 'Label for:';

  var map = {
    persons: {}
  };
  var itemCost = null;
  var array = text.split('\n');
  
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
      
      if (map.persons[person] == null) {
        map.persons[person] = 0;
      }
      
      map.persons[person] += itemCost;
      itemCost = null;
    }
  }
  
  return map;
}

function onSplitButtonClick() {
  var text = document.getElementById('textarea').value;

  var input = this.parseOrderUpInput(text);
  input.tax = Number(document.getElementById('taxes').value);
  input.fee = Number(document.getElementById('fees').value);
  input.tipPercent = Number(document.getElementById('tip').value) / 100;

  this.split(input);
  web_socket.send(JSON.stringify(input));
}

function split(input) {
  var subtotal = 0;
  for (var person in input.persons) {
    subtotal += input.persons[person];
  }

  var taxPercent = input.tax / subtotal;
  var feesPerPerson = input.fee / Object.keys(input.persons).length;
  var tip = input.tipPercent * subtotal;
  var total = subtotal + input.tax + input.fee + tip;

  var costs = {};
  for (person in input.persons) {
    costs[person] = input.persons[person] /* item cost */ +
        input.persons[person] * taxPercent + /* tax on items */ +
        input.persons[person] * input.tipPercent /* tip on items */ +
        feesPerPerson;
  }

  input.subtotal = subtotal;
  input.taxPercent = taxPercent;
  input.feesPerPerson = feesPerPerson;
  input.tip = tip;
  input.total = total;
  input.costs = costs;

  this.display(input);
}

function display(input) {

  var calculationsTable = '<table>' +
      '<tr><td>Subtotal:</td><td>$' + this.prettifyNumber(input.subtotal) + '</td><td>(user input; sum of item costs)</td></tr>' +
      '<tr><td>Tax:</td><td>$' + this.prettifyNumber(input.tax) + '</td><td>(user input)</td></tr>' +
      '<tr><td>Fees:</td><td>$' + this.prettifyNumber(input.fee) + '</td><td>(user input)</td></tr>' +
      '<tr><td>Tip:</td><td>$' + this.prettifyNumber(input.tip) + '</td><td>(tip percent * subtotal)</td></tr>' +
      '<tr><td>Total:</td><td>$' + this.prettifyNumber(input.total) + '</td><td>(subtotal + tax + fees + tip)</td></tr>' +
      '<tr><td>Fees per Person:</td><td>$' + this.prettifyNumber(input.feesPerPerson) + '</td><td>(fees / number of people)</td></tr>' +
      '<tr><td>Tax (Percent):</td><td>' + input.taxPercent * 100 + '%</td><td>(tax / subtotal)</td></tr>' +
      '<tr><td>Tip (Percent):</td><td>' + input.tipPercent * 100 + '%</td><td>(user input)</td></tr>' +
      '</table>';

  var html =
      '<hr>' +
      calculationsTable + '<br>' +
      this.makeBreakdown(input) + '<br>' +
      'Publish the following:<br>' +
      '<pre>' + this.makeTable(input.costs) + '</pre>' +
      this.makeHyperlink(input.tax, input.fee, input.tipPercent, input.persons);

  document.getElementById('result').innerHTML = html;
}

/**
 * Returns a string of a number in the format "#.##"
 */
function prettifyNumber(n) {
  return pad(round(n));
}

/**
 * Returns a number rounded to 2 decimals.
 */
function round(n) {
  return Math.round(n * 100) / 100;
}

/**
 * Returns a string of a number padded to 2 decimal places
 */
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

function makeTable(object) {
  var table = '<table>';
  for (var x in object) {
    table += '<tr><td>' + x + '</td><td>$' + this.prettifyNumber(object[x]) + '</td></tr>';
  }
  table += '</table>';
  return table;
}

/**
 * Returns a hyperlink to this split order.
 * @param {number} tax - amount of taxes
 * @param {fee} fee - amount of fees
 * @param {number} tipPercent - tip as a percentage
 * @param {Object} personItemCosts - map of person name to item costs
 * @return {string} the hyperlink to this order
 */
function makeHyperlink(tax, fee, tipPercent, personItemCosts) {
  var link = window.location.origin + window.location.pathname;
  if (link.indexOf('index.html') == -1) {
    link += 'index.html';
  }

  link += '?tax=' + tax + '&fee=' + fee + '&tip=' + tipPercent * 100;

  for (var p in personItemCosts) {
    link += '&' + p + '=' + personItemCosts[p];
  }

  return '<a href=' + link + '>' + link + '</a>';
}

function makeBreakdown(input) {
  var breakdown = '<table id="breakdown">';
  breakdown += '<tr><th>Person</th><th>Item Costs</th><th>Tax</th><th>Tip</th><th>Fees Per Person</th><th>Person Total</th></tr>';
  for (var person in input.persons) {
    breakdown += '<tr><td>' + person + '</td><td>' +
        input.persons[person] + '</td><td> + ' + // item costs
        input.persons[person] + ' * ' + input.taxPercent + '</td><td> + ' + // taxes
        input.persons[person] + ' * ' + input.tipPercent + '</td><td> + ' + // tip
        input.feesPerPerson + '</td><td> = ' +
        input.costs[person] + '</td></tr>';
  }

  breakdown += '</table>';
  return breakdown;
}
