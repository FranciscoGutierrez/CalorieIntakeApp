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

Template.littleProduct.events({
  'click .little-product'(event, instance){
    let basket = Session.get("basket");
    basket.splice(_.indexOf(basket, _.findWhere(basket, { _id : instance.data._id})), 1);
    Session.set("basket", basket);
  }
});
