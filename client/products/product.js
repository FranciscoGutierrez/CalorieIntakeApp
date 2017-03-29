Template.product.events({
  'mouseenter .product'(event, instance) {
    instance.$(".delete").fadeIn(0);
  },
  'mouseleave .product'(event, instance) {
    instance.$(".delete").fadeOut(0);
  },
  'click .product'(event, instance){
    let basket = Session.get("basket");
    basket.push(instance.data);
    Session.set("basket",basket);
    console.log(instance.data._id);
  }
});
