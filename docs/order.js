function Order (fee, tax, tipPercent) {
  var subtotal = 0;
  var costs = {};

  function setDefaults () {
    if (!fee) {
      console.warn('Fee unset; defaulting to 0');
      fee = 0;
    }

    if (!tax) {
      console.warn('Tax unset; defaulting to 0');
      tax = 0;
    }

    if (!tipPercent) {
      console.warn('Tip unset; defaulting to 0');
      tipPercent = 0;
    }
  }

  var order = {
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

    set tipPercent (x) {
      tipPercent = x / 100;
    },

    split: function () {
      setDefaults();

      taxPercent = tax / subtotal;
      feesPerPerson = fee / Object.keys(costs).length;
      tip = tipPercent * subtotal;
      total = subtotal + tax + fee + tip;

      totals = {};
      for (var person in costs) {
        totals[person] =
            costs[person] + // cost of items
            costs[person] * taxPercent + // tax on items
            costs[person] * tipPercent + // tip on items
            feesPerPerson;
      }
    },

    get costs () {
      return costs;
    },

    get fee () {
      return fee;
    },

    get feesPerPerson () {
      return feesPerPerson;
    },

    get tax () {
      return tax;
    },

    get taxPercent () {
      return taxPercent * 100;
    },

    get tip () {
      return tip;
    },

    get tipPercent () {
      return tipPercent * 100;
    },

    get total () {
      return total;
    },

    get subtotal () {
      return subtotal;
    },

    get totals () {
      return totals;
    }
  };

  order.fee = fee;
  order.tax = tax;
  order.tipPercent = tipPercent;

  return order;
}
