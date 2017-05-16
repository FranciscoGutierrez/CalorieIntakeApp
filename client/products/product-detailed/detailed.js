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
  },
  show: function() {
    let levels  = Session.get('detailed').nutrient_levels;
    let show = true;
    if(_.isEmpty(levels)) show = false;
    return show;
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

    let nutri  = "";
    let fat    = "";
    let salt   = "";
    let satfat = "";
    let sugars = "";

    let show   = true;
    try {
      nutri  = product.nutrient_levels;
      fat    = nutri.fat;
      if(fat == "high")     fat =  80;
      if(fat == "moderate") fat =  40;
      if(fat == "low")      fat =   8;
      salt   = nutri.salt;
      if(salt == "high")     salt =  80;
      if(salt == "moderate") salt =  40;
      if(salt == "low")      salt =   8;
      satfat = nutri["saturated-fat"];
      if(satfat == "high")     satfat =  80;
      if(satfat == "moderate") satfat =  40;
      if(satfat == "low")      satfat =   8;
      sugars = nutri.sugars;
      if(sugars == "high")     sugars =  80;
      if(sugars == "moderate") sugars =  40;
      if(sugars == "low")      sugars =   8;
    } catch(e){
      show   = false;
    }

    if(_.isEmpty(nutri)) show = false;

    return {
      sodium: salt,
      sugars: sugars,
      fat: fat,
      satfat: satfat,
      show: show
    };

  }
});
