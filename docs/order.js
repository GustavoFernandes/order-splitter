function Order () {
  var fee = 0;
  var tax = 0;
  var tip = 0;
  var tipPercent = 0;
  var subtotal = 0;
  var costs = {};

  return {
    addItem: function (name, cost) {
      if (costs[name] == null) {
        costs[name] = 0;
      }

      costs[name] += cost;
      subtotal += cost;
    },

    set fee (x) {
      fee = x;
    },

    set tax (x) {
      tax = x;
    },

    set tip (x) {
      tip = x;
    },

    set tipPercent (x) {
      tipPercent = x;
    }
  }
}
