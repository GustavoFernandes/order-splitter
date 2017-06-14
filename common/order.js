class Order {
    constructor() {
        this.people = new Map();
        this.tip = 0;
        this.tax = 0;
        this.nonTaxedFees = 0;
        this.taxedFees = 0;
        this.isTipPercentage = false;
        this._tipDollars = 0;
        this._tipPercentage = 0;
    }

    withTip(tip, asPercentage=false) {
        this.isTipPercentage = asPercentage;
        if(this.isTipPercentage) {
            this._tipPercentage = tip/100;
        }
        else {
            this._tipDollars = tip;
        }
        return this;
    }

    withNonTaxedFees(...fees) {
        this.nonTaxedFees = fees.reduce((acc, val) => acc+val);
        return this;
    }

    withTaxedFees(...fees) {
        this.taxedFees = fees.reduce((acc, val) => acc+val);
        return this;
    }

    withTax(tax) {
        this.tax = tax;
        return this;
    }

    withPerson(name, price) {
        let newPrice = price;
        if(this.people.has(name)) {
            newPrice += this.people.get(name);
        }
        this.people.set(name, newPrice);
        return this;
    }

    get taxPercent() {
        if(this.subTotal === 0) {
            return 0;
        }
        return this.tax/this.subTotal;
    }

    get taxPercentDisplay() {
        return this.taxPercent*100;
    }

    get fee() {
        return this.nonTaxedFees;
    }

    get tipPercent() {
        if(this.isTipPercentage) {
            return this._tipPercentage;
        }
        if(this.subTotal === 0) {
            return 0;
        }
        return this._tipDollars / this.subTotal;
    }

    get tipDollars() {
        return this.tipPercent * this.subTotal;
    }

    get feesPerPerson() {
        return this.fee/this.people.size;
    }

    get total() {
        return this.subTotal + this.fee + this.tipDollars + this.tax;
    }

    split() {

        this.subTotal = Array.from(this.people.values()).reduce((sum, value) => sum+value);
        this.subTotal += this.taxedFees;

        this.totals = new Map();
        for (let [name, price] of this.people.entries()) {
            let totalForPerson = price;
            totalForPerson += price * this.taxPercent;
            totalForPerson += price * this.tipPercent;
            totalForPerson += this.feesPerPerson;
            this.totals.set(name, totalForPerson);
        }
        let totalPrice = Array.from(this.totals.values()).reduce((acc, val) => acc+val);
        if(Math.round(totalPrice*100) != Math.round(this.total*100)) {
            throw new Error('Everyone\'s share does not add up to total');
        }
        return this;
    }

    // not used. we should delete this
    toJSON() {
        let ret = {};
        ret.people = Array.from(this.people);
        ret.tipDollars = this.tipDollars;
        ret.tax = this.tax;
        ret.nonTaxedFees = this.nonTaxedFees;
        ret.taxedFees = this.taxedFees;
        ret.isTipPercentage = this.isTipPercentage;
        return ret;
    }
    
    // not used. we should delete this
    static fromJSON(json) {
        let order = new Order();
        order.people = new Map(json.people);
        order.withTip(json.tipDollars, false)
            .withTax(json.tax)
            .withNonTaxedFees(json.nonTaxedFees)
            .withTaxedFees(json.taxedFees);
        return order.split();
    }
}
