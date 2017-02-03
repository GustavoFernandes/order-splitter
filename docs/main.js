window.onload = init;

function init() {
  // check for URL query parameters
  if (window.location.search) {
    var queryString = window.location.search.substring(1); // remove prefixing '?'
    var order = parseQueryStringInput(queryString);
    split(order);
  }
}

function onSplitButtonClick() {
  var text = document.getElementById('textarea').value;
  var order = parseOrderUpInput(text);
  order.tax = Number(document.getElementById('taxes').value);
  order.fee = Number(document.getElementById('fees').value);
  order.tipPercent = Number(document.getElementById('tip').value) / 100;

  this.split(input);
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

/**
 * Returns a listing of names to split costs
 */
function makeTable(object) {
  // get length of longest name
  var longestName = -1;
  for (var p in object) {
    longestName = Math.max(p.length, longestName);
  }

  // add 1 to longest name for a space after name
  longestName += 1;

  var output = '';
  var name;
  for (p in object) {
    name = p;
    for (var i = p.length; i < longestName; i++) {
      name += ' ';
    }
    output += name + '$' + this.prettifyNumber(object[p]) + '<br>';
  }

  return output;
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
