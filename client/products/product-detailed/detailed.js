import { Blaze } from 'meteor/blaze'

Template.detailed.helpers({
  data: function(){
    return Session.get("detailed");
  },
  ingredients_tags: function(){
    let tags = Session.get("detailed").ingredients_tags;
    let show = true;
    if (tags.length < 1 ) show = false;
    return {data: _.uniq(tags, false).slice(1,8), show: show};
  },
  similars: function(){
    let product  = Session.get('detailed');
    let category = product.categories_tags;

    let drinks   = ["en:beverages","en:carbonated-drinks","en:sodas","en:sugared-beverages"]
    let veggies  = ["en:plant-based-foods"];
    let proteins = ["en:meals", "en:meats","en:seafood","en:dairies","en:cheeses", "fr:salade-de-poulet-curry", "en:soupe","en:seafood","en:fishes"]
    let snacks   = ["en:desserts","en:salty-snacks", "en:waffles", "en:sugary-snacks", "en:chocolates"]
    let id = "";
    let show = false;
    try { id = product._id.toString(); } catch(e){}

    Meteor.subscribe('similar', id);
    let similar = Similar.findOne({pid: product._id});
    let arr = [];
    try{arr = similar.similarity; }catch(e){}
    let sliced = _.sortBy(arr, 'score').slice(0, 6);
    if(sliced.length > 0) show = true;
    return {array: sliced, show: show};
  },
  image: function(){
    return Session.get("detailed")._id;
  },
  grade: function(){
    let grade  = Session.get('detailed').nutrition_grade_fr;
    let show   = true;
    if((grade == "") || (grade == undefined)){
       grade = ""
       show  = false;
     }
    grade = "nutriscore/"+grade+".svg"
    return {grade: grade, show: show};
  },
  show: function() {
    let levels  = Session.get('detailed').nutrient_levels;
    let show = true;
    if(_.isEmpty(levels)) show = false;
    return show;
  },
  buttonText: function(){
    let text = "Add to Favorites";
    if(Session.get("user") != "profile") {
      text = "Add to My Plate";
    }
    return text;
  },
  userDashboard: function(){
    let dashboard = true;
    if(Session.get("user") == "profile") dashboard = false;
    return dashboard;
  },
  healthysimilars: function(){
    let product  = Session.get('detailed');
    let category = product.categories_tags;
    let drinks   = ["en:beverages","en:carbonated-drinks","en:sodas","en:sugared-beverages"]
    let veggies  = ["en:plant-based-foods"];
    let proteins = ["en:meals", "en:meats","en:seafood","en:dairies","en:cheeses", "fr:salade-de-poulet-curry", "en:soupe","en:seafood","en:fishes"]
    let snacks   = ["en:desserts","en:salty-snacks", "en:waffles", "en:sugary-snacks", "en:chocolates"]
    let id = "";
    let show = false;
    try { id = product._id.toString(); } catch(e){}
    Meteor.subscribe('similar', id);
    let similar = Similar.findOne({pid: product._id});
    let arr = [];
    try{arr = similar.similarity; }catch(e){}
    const toDelete = new Set(["","c","d","e"]);
    const newArray = arr.filter(obj => !toDelete.has(obj.healthy));
    let sliced = _.sortBy(newArray, 'healthy').slice(0, 6);
    if(sliced.length > 0) show = true;
    return {array: sliced, show: show};
  },
  usersimilars: function(){
    let product  = Session.get('detailed');
    let category = product.categories_tags;
    let drinks   = ["en:beverages","en:carbonated-drinks","en:sodas","en:sugared-beverages"]
    let veggies  = ["en:plant-based-foods"];
    let proteins = ["en:meals", "en:meats","en:seafood","en:dairies","en:cheeses", "fr:salade-de-poulet-curry", "en:soupe","en:seafood","en:fishes"]
    let snacks   = ["en:desserts","en:salty-snacks", "en:waffles", "en:sugary-snacks", "en:chocolates"]
    let id = "";
    let show = false;
    try { id = product._id.toString(); } catch(e){}
    Meteor.subscribe('similar', id);
    let similar = Similar.findOne({pid: product._id});
    let arr = [];
    try{arr = similar.similarity; }catch(e){}
    let sliced = _.sortBy(arr, 'score').reverse().slice(0, 6);
    if(sliced.length > 0) show = true;
    return {array: sliced, show: show};
  },
});

Template.detailed.events({
  'click .add-product'(event, instance){
    let basket = Session.get("basket");
    //let calories = Session.get("calories");
    if (basket.length <1) {
      Blaze.render(Template.basket, $(".top-container")[0]);
    }
    //calories = calories + parseInt(instance.data.energy);
    basket.push(Session.get("detailed")._id);
    Session.set("basket",_.uniq(basket));
    //Session.set("calories",calories);
  }
});

Template.similarProducts.helpers({
  data: function(){
    let id = this.pid;
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
    let id = instance.data.pid.toString();
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
  },
  isDrink: function(){
    let id = Session.get("detailed")._id;
    let product       = [];
    let drinks_tags   = ["en:beverages","en:carbonated-drinks","en:sodas","en:sugared-beverages", "en:hot-beverages",  "en:non-sugared-beverages"];
    try{ product = Products.findOne({_id: id}).categories_tags}catch(e){};
    return (_.intersection(product, drinks_tags).length   > 0)
  }
});

Template.ingredienttag.helpers({
  ingredients: function(){
    let text = this.valueOf().replace(/-/g, "");
    let show = true;
    if(text == "") show = false;
    return {text:text, show:show};
  },
});
