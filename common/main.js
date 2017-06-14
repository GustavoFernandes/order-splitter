function defineCustomElement(tag, elementClass) {
    customElements.define(tag, class extends elementClass {
        static get is() { return tag; }
    });
}

var Utils = {
    _prettifyNumber(n) {
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
};
