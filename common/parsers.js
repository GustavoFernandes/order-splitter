class QueryStringParser {
    /**
     * Parses input from a URL query string into an Order.
     * @example
     * parse('tax=0.30&fee=1.50&tip=1.25&Gus=5.00');
     * @param {string} queryString - The URL query string
     * @returns {Order} An order parsed from the URL query string
     */
    parse(queryString) {
        var pairs = queryString.split('&');
        let order = new Order();

        for (var i = 0; i < pairs.length; i++) {
            var pairValues = pairs[i].split('=');

            pairValues[1] = Number(pairValues[1]);

            if(pairValues[0] === 'fee') {
                order.withNonTaxedFees(pairValues[1]);
            }
            else if(pairValues[0] === 'tax') {
                order.withTax(pairValues[1]);
            } 
            else if(pairValues[0] === 'tip') {
                order.withTip(pairValues[1]);
            } 
            else {
                order.withPerson(decodeURIComponent(pairValues[0]), pairValues[1]);
            }
        }

        return order;
    }
}

class OrderUpParser {

    /**
     * Parses the confirmation summary from an OrderUp.com order
     * @param {string} orderUpText - The confirmation summary from OrderUp.com
     * @param {number} fee
     * @param {number} tax
     * @param {number} tip - The tip (either a fixed value or percentage)
     * @param {boolean} isTipPercentage - True if the tip is a percentage as opposed to a fixed value
     * @return {Order} An order parsed from the OrderUp.com confirmation summary
     */
    parse(orderUpText, fee, tax, tip, isTipPercentage) {
        // TODO: check if the number at the beginning of the line affects the item cost
        // example: 2 Chicken $4.00
        //   should the cost for the person be $4 or $8?

        let order = new Order()
            .withNonTaxedFees(fee)
            .withTax(tax)
            .withTip(tip, isTipPercentage);
        var label = 'Label for:';
        var itemCost = null;
        var array = orderUpText.split('\n');

        for (var i = 0; i < array.length; i++) {
            var line = array[i].trim();
            line = line.replace(/\s+/g, ' '); // replace all whitespace with single space

            if (!itemCost) {
                var dollarIndex = line.lastIndexOf('$');
                if (dollarIndex > -1) {
                    itemCost = Number(line.substring(dollarIndex + 1, line.length));
                }
                continue;
            }

            var labelIndex = line.indexOf(label);
            if (labelIndex > -1) {
                var name = line.substring(labelIndex + label.length, line.length);
                order.withPerson(name, itemCost);
                itemCost = null;
            }
        }

        return order;
    }
}

class CsvParser {
    parse(csv) {
        const order = new Order();

        const lines = csv.split('\n');
        for(const line of lines) {
            if(line.trim() !== "") {
                const [name, priceString] = line.split(',');
                const price = Number(priceString.trim().replace('$',''));
                if(name === 'fee') {
                    order.withNonTaxedFees(price);
                }
                else if(name === 'tax') {
                    order.withTax(price);
                } 
                else if(name === 'tip') {
                    order.withTip(price);
                } 
                else {
                    order.withPerson(name, price);
                }
            }
        }

        return order;
    }
}
