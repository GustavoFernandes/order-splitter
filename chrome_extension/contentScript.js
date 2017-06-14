chrome.storage.onChanged.addListener((changes, namespace) => {
    if(namespace !== "local") {
        return;
    }
    if(changes.parseOrderBitch) {
        sendOrder();
    }
});
sendOrder();

function sendOrder() {
    let order = parseOrderUpDom();
    chrome.storage.local.set({"order": JSON.stringify(order)});
}

function parseOrderUpDom() {
    let table = window.document.querySelector('#order-confirmation-page > tbody');
    let prices = Array.from(table.querySelectorAll('.price-table'))
        .map(el => el.innerText)
        .map(text => Number(text.slice(1)));
    let names = Array.from(table.querySelectorAll('strong')).map(el => el.innerText);
    let order = new Order();
    for(let i=0; i< prices.length; i++) {
        order.withPerson(names[i], prices[i]);
    }
    let orderInfo = Array.from(window.document.querySelectorAll('.general-section.order-information * table * tr'))
        .map(el => el.innerText)
        .filter(t => t.indexOf('$'))
        .map(t => t.split('$').map(t=>t.trim()));
    orderInfo.forEach(([type, p]) => {
        let price = Number(p);
        switch(type) {
            case('Sales Tax'):
                order.withTax(price);
                break;
            case('Processing Fee'):
                order.withNonTaxedFees(order.nonTaxedFees + price);
                break;
            case('Delivery Fee'):
                order.withNonTaxedFees(order.nonTaxedFees + price);
                break;
            case('Tip'):
                order.withTip(price);
                break;
        }
    });
    return order.split();
}
