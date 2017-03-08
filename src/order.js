function Order (fee, tax, tip, isTipPercentage) {
  var subtotal = 0;
  var costs = {};
  var fee, tax, tip, isTipPercentage, feesPerPerson, taxPercent, tipPercent, total, subtotal, totals;

  function setDefaults () {
    if (!fee) {
      console.warn('Fee unset; defaulting to 0');
      fee = 0;
    }

    if (!tax) {
      console.warn('Tax unset; defaulting to 0');
      tax = 0;
    }

    if (!tip) {
      console.warn('Tip unset; defaulting to 0');
      tip = 0;
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

    split: function () {
      setDefaults();

      if (isTipPercentage) {
        tipPercent = tip / 100;
        tip = tipPercent * subtotal;
      } else {
        tipPercent = tip / subtotal;
      }

      taxPercent = tax / subtotal;
      feesPerPerson = fee / Object.keys(costs).length;
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

    set fee (x) {
      fee = x;
    },

    set tax (x) {
      tax = x;
    },

    set tip (x) {
      tip = x;
    },

    set isTipPercentage (x) {
      isTipPercentage = x;
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

    get isTipPercentage () {
      return isTipPercentage;
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
  order.tip = tip;
  order.isTipPercentage = isTipPercentage;

  return order;
}
