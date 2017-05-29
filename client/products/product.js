import { Blaze } from 'meteor/blaze'

Template.product.helpers({
  ffacts: function(){
    let facts  = {};
    let show   = false;
    let sodium = 0.0;
    let energy = 0.0;
    let sugars = 0.0;
    let fat    = 0.0;
    let grade  = this.nutrition_grade_fr;
    if(this.nutriments) facts = this.nutriments
    if(facts.sodium) sodium = Number(facts.sodium).toFixed(2);
    if(facts.energy) energy = Number(facts.energy).toFixed(2);
    if(facts.sugars) sugars = Number(facts.sugars).toFixed(2);
    if(facts["saturatedFat"]) fat = Number(facts["saturatedFat"]).toFixed(2);

    if(grade == "") grade = "nutriscore/x.svg"
    //grade = "nutriscore/"+grade+".svg"
    let check = [sodium, energy, sugars, fat];
    for (var  i=1; i<check.length; i++) {
      if (check[i-1] != check[i]) show = true;
    }
    return {sodium: sodium, energy: energy, sugars: sugars, fat: fat, show: show, grade:grade};
  },
  image: function(){
    let img = "products/"+Number(this._id)+".jpg";
    $.get(img)
    .done().fail(function() {
      img = "demo/d1.png";
    })
    return img;
  }
});

Template.product.events({
  'mouseenter .product'(event, instance) {
    instance.$(".delete").fadeIn(0);
  },
  'mouseleave .product'(event, instance) {
    instance.$(".delete").fadeOut(0);
  },
  'click .product'(event, instance){
    if(Session.get("detailed") == "") {
      Blaze.renderWithData(Template.detailed, instance.data, $(".bottom-container")[0]);
      Session.set("detailed",instance.data);
    } else {
      Session.set("detailed",instance.data);
    }
    Logs.insert({user:Session.get("user")._id, product : Session.get("detailed")._id, plate: Session.get("basket"), time: new Date().getTime(), action:"click-search-product"});
  }
});

Template.products.events({
  'click .results'(event, instance) {
    $(".results").fadeOut();
  },
  'click paper-input'(event, instance) {
    $(".results").fadeIn(500);
  }
});

Template.littleProduct.events({
  'click .little-product'(event, instance){
    let basket = Session.get("basket");
    let calories = Session.get("calories");
    calories = calories - parseInt(instance.data.energy);
    basket.splice(_.indexOf(basket, _.findWhere(basket, { _id : instance.data._id})), 1);
    instance.$('.little-product').addClass('animated bounceInDown').addClass("animated bounceOutUp");
    instance.$('.little-product').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
      Session.set("basket", basket);
      Session.set("calories",calories);
      if (basket.length <1) {
        $(".basket-container").css("width",0);
        $(".basket-container").css("background","none");
        $(".basket-container .amount").fadeOut();
        let view = Blaze.getView($('.output').get(0));
        Blaze.remove(view);
      }
    });
  }
});
