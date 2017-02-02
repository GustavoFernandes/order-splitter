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

function parseOrderUpInput (orderUpText) {
  // TODO
}
