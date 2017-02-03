/**
 * Parsers input from a URL query string into an Order.
 * @example
 * // where tip is a percentage
 * parseQueryStringInput('tax=0.30&fee=1.50&tip=15&Gus=5.00');
 * @param {string} queryString - The URL query string
 * @returns {Order} An order parsed from the URL query string
 */
function parseQueryStringInput (queryString) {
  var overheads = ['fee', 'tax']; // tip is a special case, maps to tipPercent

  var pairs = queryString.split('&');
  var order = Order();

  for (var i = 0; i < pairs.length; i++) {
    var pairValues = pairs[i].split('=');

    pairValues[1] = Number(pairValues[1]);

    if (pairValues[0] === 'tip') {
      order.tipPercent = pairValues[1] / 100;
    } else if (overheads.indexOf(pairValues[0]) > -1) {
      order[pairValues[0]] = pairValues[1];
    } else {
      order.addItem(pairValues[0], pairValues[1]);
    }
  }

  return order;
}

/**
 * Parses the confirmation summary from an OrderUp.com order
 * @param {string} orderUpText - The confirmation summary from OrderUp.com
 * @return {Order} An order parsed from the OrderUp.com confirmation summary
 */
function parseOrderUpInput (orderUpText) {
  // TODO: check if the number at the beginning of the line affects the item cost
  // example: 2 Chicken $4.00
  //   should the cost for the person be $4 or $8?
  
  var order = Order();
  var label = 'Label for:';
  var itemCost = null;
  var array = orderUpText.split('\n');

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

    var labelIndex = line.indexOf(label);
    if (labelIndex > -1) {
      var name = line.substring(labelIndex + label.length, line.length);
      order.addItem(name, itemCost);
      itemCost = null;
    }
  }

  return order;
}
