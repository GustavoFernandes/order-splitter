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
    parse(orderUpText, fee=0, tax=0, tip=0, isTipPercentage=false) {
        let order = new Order()
            .withNonTaxedFees(fee)
            .withTax(tax)
            .withTip(tip, isTipPercentage);

        var lines = orderUpText.split('\n');

        lines.reduce((lastItemCost, line) => {
            let itemCostMatch, nameMatch;

            if(!lastItemCost) {
                if (itemCostMatch = line.match('.*\\$([0-9.]+)')) {
                    let itemCost = Number(itemCostMatch[1]);
                    return itemCost;
                }
            }

            if (nameMatch = line.match('.*Label for:(.*)')) {
                let name = nameMatch[1];
                order.withPerson(name, lastItemCost);
                return;
            }

            return lastItemCost;
        }, null);

        return order;
    }
}

class CsvParser {
    parse(csv) {
        const order = new Order();

        const lines = csv.split('\n');
        for(const line of lines) {
            if(line.trim() !== '') {
                const [name, ...priceStrings] = line.split(',');
                const price = priceStrings.map(ps => Number(ps.trim().replace('$',''))).reduce((p,acc) => p+acc, 0);
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
