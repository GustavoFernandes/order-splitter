window.onload = function() {
  // check for URL query parameters
    if (window.location.search) {
        var queryString = window.location.search.substring(1); // remove prefixing '?'
        var order = new QueryStringParser().parse(queryString).split();
        OrderSplitResults.show(order);
    }
};

function defineCustomElement(tag, elementClass) {
    customElements.define(tag, class extends elementClass {
        static get is() { return tag; }
    });
}
