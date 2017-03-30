Template.basket.helpers({
  basket() {
    return Session.get("basket");
  },
  amount() {
    return Session.get("calories");
  }
});
