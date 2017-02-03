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

    set tipPercent (x) {
      tipPercent = x;
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
    }
  }
}
