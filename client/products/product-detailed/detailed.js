import { Blaze } from 'meteor/blaze'

Template.detailed.helpers({
  data: function(){
    return Session.get("detailed");
  },
  similars: function(){
    Meteor.subscribe('similar', Session.get('detailed')._id);
    let similar = Similar.findOne({_id: Session.get('detailed')._id});
    let arr = [];
    try{arr = similar.similarity.slice(0, 5); }catch(e){}
    return arr;
  },
  image: function(){
    return Session.get("detailed")._id;
  },
  grade: function(){
    let grade  = Session.get('detailed').nutrition_grade_fr;
    if(grade == "") grade = "nutriscore/x.svg"
    grade = "nutriscore/"+grade+".svg"
    return grade;
  }
});

Template.detailed.events({
  'click .add-product'(event, instance){
    let basket = Session.get("basket");
    //let calories = Session.get("calories");
    if (basket.length <1) {
      Blaze.render(Template.basket, $(".analytics")[0]);
    }
    //calories = calories + parseInt(instance.data.energy);
    basket.push(Session.get("detailed")._id);
    Session.set("basket",_.uniq(basket));
    //Session.set("calories",calories);
  }
});

Template.similarProducts.helpers({
  data: function(){
    let id = this._id.toString();
    Meteor.subscribe('products', id);
    Meteor.subscribe('images', Number(id));
    let name  = "";
    let img   = "";
    try{name  = Products.findOne({_id: id}).product_name; } catch(e){}
    return {name: name, id: id};
  }
});


Template.similarProducts.events({
  'click .similar-product'(event, instance){
    let id = instance.data._id.toString();
    Meteor.subscribe('products', id);
    Meteor.subscribe('images', Number(id));
    Session.set("detailed",Products.findOne({_id : id}));
  }
});


Template.barchart.helpers({
  data: function(){
    let id = Session.get("detailed")._id;
    let product = "";
    Meteor.subscribe('products', id);
    try{product  = Products.findOne({_id: id}); } catch(e){}

    console.log(product.nutrient_levels)

    let facts  = {};
    let show   = false;
    let sodium = 0.0;
    let energy = 0.0;
    let sugars = 0.0;
    let fat    = 0.0;

    if(product.nutriments) facts = product.nutriments
    if(facts.sodium) sodium = Number(facts.sodium).toFixed(2);
    if(facts.energy) energy = Number(facts.energy).toFixed(2);
    if(facts.sugars) sugars = Number(facts.sugars).toFixed(2);
    if(facts["saturatedFat"]) fat = Number(facts["saturatedFat"]).toFixed(2);

    let check = [Number(sodium), Number(energy), Number(sugars), Number(fat)];
    let min = Math.min.apply(Math, check);
    let max = Math.max.apply(Math, check);
    sodium = ((sodium - min) / (max - min));
    energy = ((energy - min) / (max - min));
    sugars = ((sugars - min) / (max - min));
    fat    = ((fat    - min) / (max - min));

    for (var  i=1; i<check.length; i++) {
      if (check[i-1] != check[i]) show = true;
    }

    return {sodium: sodium*100, energy: energy*100, sugars: sugars*100, fat: fat*100, show: show};
  }
});
