window.onload = init;

function init () {
  // check for URL query parameters
  if (window.location.search) {
    var queryString = window.location.search.substring(1); // remove prefixing '?'
    handleOrder(function () {
      return parseQueryStringInput(queryString);
    });
  }
}

function onSplitButtonClick () {
  var text = document.getElementById('textarea').value;
  var tax = Number(document.getElementById('taxes').value);
  var fee = Number(document.getElementById('fees').value);
  var tipPercent = Number(document.getElementById('tip').value);

  handleOrder(function () {
    return parseOrderUpInput(text, fee, tax, tipPercent);
  });
}

function handleOrder (parserFunction) {
  var order = parserFunction();
  order.split();
  display(order);
}

function display (order) {

  var calculationsTable = '<table>' +
      '<tr><td>Subtotal:</td><td>$' + prettifyNumber(order.subtotal) + '</td><td>(user input; sum of item costs)</td></tr>' +
      '<tr><td>Tax:</td><td>$' + prettifyNumber(order.tax) + '</td><td>(user input)</td></tr>' +
      '<tr><td>Fees:</td><td>$' + prettifyNumber(order.fee) + '</td><td>(user input)</td></tr>' +
      '<tr><td>Tip:</td><td>$' + prettifyNumber(order.tip) + '</td><td>(tip percent * subtotal)</td></tr>' +
      '<tr><td>Total:</td><td>$' + prettifyNumber(order.total) + '</td><td>(subtotal + tax + fees + tip)</td></tr>' +
      '<tr><td>Fees per Person:</td><td>$' + prettifyNumber(order.feesPerPerson) + '</td><td>(fees / number of people)</td></tr>' +
      '<tr><td>Tax (Percent):</td><td>' + order.taxPercent + '%</td><td>(tax / subtotal)</td></tr>' +
      '<tr><td>Tip (Percent):</td><td>' + order.tipPercent + '%</td><td>(user input)</td></tr>' +
      '</table>';

  var html =
      '<hr>' +
      calculationsTable + '<br>' +
      makeBreakdownDisplay(order) + '<br>' +
      'Publish the following:<br>' +
      '<pre>' + makeTotalsDisplay(order.totals) + '</pre>' +
      makeHyperlink(order.tax, order.fee, order.tipPercent, order.costs);

  document.getElementById('result').innerHTML = html;
}

/**
 * Returns a string of a number in the format "#.##"
 * @example
 * prettifyNumber(12); // returns "12.00"
 * @param {number} n - The number to prettify
 * @returns {string} A string of a number rounded and padded to 2 decimal places
 */
function prettifyNumber (n) {
  n = Math.round(n * 100) / 100; // round to 2 decimal places

  // pad to 2 decimal places if necessary
  var s = n.toString();

  if (s.indexOf('.') === -1) {
    s += '.';
  }

  while (s.length < s.indexOf('.') + 3) {
    s += '0';
  }

  return s;
}

/**
 * Returns a listing of names to split costs
 * @param {object} totals - The totals property from the Order
 * @returns {string} A view mapping names to split costs
 */
function makeTotalsDisplay (totals) {
  // get length of longest name
  var longestName = -1;
  for (var p in totals) {
    longestName = Math.max(p.length, longestName);
  }

  // add 1 to longest name for a space after name
  longestName += 1;

  var output = '';
  var name;
  for (p in totals) {
    name = p;
    for (var i = p.length; i < longestName; i++) {
      name += ' ';
    }
    output += name + '$' + prettifyNumber(totals[p]) + '<br>';
  }

  return output;
}

/**
 * Returns a hyperlink to this split order.
 * @param {number} tax - amount of taxes
 * @param {fee} fee - amount of fees
 * @param {number} tipPercent - tip as a percentage
 * @param {Object} personItemCosts - map of person name to item costs
 * @return {string} The hyperlink to this order
 */
function makeHyperlink (tax, fee, tipPercent, personItemCosts) {
  var link = window.location.origin + window.location.pathname;
  if (link.indexOf('index.html') === -1) {
    link += 'index.html';
  }

  link += '?tax=' + tax + '&fee=' + fee + '&tip=' + tipPercent;

  for (var p in personItemCosts) {
    link += '&' + encodeURIComponent(p) + '=' + prettifyNumber(personItemCosts[p]);
  }

  return '<a href=' + link + '>' + link + '</a>';
}

/**
 * Returns a display breaking down the Order split calculations
 * @param {Order} order - the Order to breakdown
 * @returns {string} A view of the Order breakdown
 */
function makeBreakdownDisplay (order) {
  var breakdown = '<table id="breakdown">';
  breakdown += '<tr><th>Person</th><th>Item Costs</th><th>Tax</th><th>Tip</th><th>Fees Per Person</th><th>Person Total</th></tr>';
  for (var person in order.costs) {
    var personItemCosts = prettifyNumber(order.costs[person]);
    breakdown += '<tr><td>' + person + '</td><td>' +
        personItemCosts + '</td><td> + ' + // item costs
        personItemCosts + ' * ' + order.taxPercent / 100 + '</td><td> + ' + // taxes
        personItemCosts + ' * ' + order.tipPercent / 100 + '</td><td> + ' + // tip
        order.feesPerPerson + '</td><td> = ' +
        prettifyNumber(order.totals[person]) + '</td></tr>';
  }

  breakdown += '</table>';
  return breakdown;
}
