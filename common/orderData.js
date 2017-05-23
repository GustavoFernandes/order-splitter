class OrderData {
    constructor() {
        this.base = window.location.pathname;
    }

    getData() {
        return fetch(this.base+'data/orderUp.json')
            .then(stream => stream.body.getReader().read())
            .then(({value, done}) => this.parse(value));
    }

    parse(value) {
        const string = value.reduce((acc, code) => acc += String.fromCharCode(code), '');
        return JSON.parse(string).map(e => '\n'+e+'\n');
    }

}

window.OrderData = OrderData;
