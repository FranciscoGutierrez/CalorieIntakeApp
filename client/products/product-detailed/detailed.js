import { Blaze } from 'meteor/blaze'

Template.detailed.helpers({
  data: function(){
    return Session.get("detailed");
  },
  ingredients_tags: function(){
    let tags = [];
    let allergens = [];
    try{tags = Session.get("detailed").ingredients_tags;} catch(e){}
    try{allergens = Session.get("detailed").allergens_tags;} catch(e){}
    let show = true;
    if (tags == undefined) tags = [];
    if (allergens == undefined) allergens = [];
    if (tags.length < 1 )  show = false;
    if (allergens.length < 1 )  show = false;
    allergens = _.uniq(allergens, false).slice(1,6);
    tags = _.uniq(tags, false).slice(1,6);
    return {allergens: allergens, tags: tags, show: show};
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
    let action = "add";
    if(Session.get("user") != "profile") {
      text = "Add to My Plate";
      if(_.include(Session.get("basket"), Session.get("detailed")._id)) {
        text = "Remove from My Plate";
        action = "delete";
      }
    } else {
      if(_.include(Session.get("basket"), Session.get("detailed")._id)) {
        text = "Remove from My Favorites";
        action = "delete";
      }
    }
    return {text:text, action:action};
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
    let veggies  = ["en:vegetables-based-foods", "en:canned-vegetables"];
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
  dataQuality: function(){
    let product  = Session.get('detailed');
    let category = undefined;
    try {category= product.categories_tags.length;} catch(e){};
    let grade    = undefined;
    try {grade   = product.nutrition_grade_fr;} catch(e){};
    let levels   = undefined;
    try {levels  = product.nutrient_levels;} catch(e){};
    let quality  = 3;
    if(category < 5) quality -=1;
    if(category == undefined)  quality -=1;
    if(grade == undefined)  quality -=1;
    if(levels == undefined) quality -=1;
    if(quality == 3) quality ="good";
    if(quality == 2) quality ="poor";
    if(quality == 1) quality ="bad";
    return quality;
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

Template.profileProducts.helpers({
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

Template.healthyProducts.helpers({
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
  allergy: function() {
    let allergens = this.valueOf().substring(3);
    //["milk", "eggs", "wheat", "soybeans", "peanuts", "treenuts", "fish", "shellfish"]
    let user = Session.get("user").allergies;
    return _.contains(user, allergens);
  }
});

Template.allergentag.helpers({
  ingredients: function(){
    let text = this.valueOf().replace(/-/g, "");
    let show = true;
    if(text == "") show = false;
    return {text:text.substring(3), show:show};
  }
});


Template.similarProducts.events({
  'click .similar-product'(event, instance){
    let id = instance.data.pid.toString();
    Meteor.subscribe('products', id);
    Meteor.subscribe('images', Number(id));
    Session.set("detailed",Products.findOne({_id : id}));
    Logs.insert({user:Session.get("user")._id, product : Session.get("detailed")._id, plate: Session.get("basket"), time: new Date().getTime(), action:"click-similar-product"});
  }
});

Template.healthyProducts.events({
  'click .similar-product'(event, instance){
    let id = instance.data.pid.toString();
    Meteor.subscribe('products', id);
    Meteor.subscribe('images', Number(id));
    Session.set("detailed",Products.findOne({_id : id}));
    Logs.insert({user:Session.get("user")._id, product : Session.get("detailed")._id, plate: Session.get("basket"), time: new Date().getTime(), action:"click-healthy-product"});
  }
});

Template.profileProducts.events({
  'click .similar-product'(event, instance){
    let id = instance.data.pid.toString();
    Meteor.subscribe('products', id);
    Meteor.subscribe('images', Number(id));
    Session.set("detailed",Products.findOne({_id : id}));
    Logs.insert({user:Session.get("user")._id, product : Session.get("detailed")._id, plate: Session.get("basket"), time: new Date().getTime(), action:"click-profile-product"});
  }
});

Template.detailed.events({
  'click .add-product'(event, instance){
    let basket = Session.get("basket");
    let id   = Session.get("detailed")._id;
    let user = Session.get("user")._id;
    let time = new Date().getTime();
    basket.push(id);
    Session.set("basket",_.uniq(basket));
    Logs.insert({ user:Session.get("user")._id, product : Session.get("detailed")._id, plate: Session.get("basket"), time: new Date().getTime(), action:"click-add-product"});
  },
  'click .delete-product'(event, instance){
    let basket = Session.get("basket");
    let detail = Session.get("detailed")._id;
    if(_.include(basket, detail)) {
      basket = _.without(basket, _.findWhere(basket, detail));
    }
    Session.set("basket",_.uniq(basket));
    Logs.insert({user:Session.get("user")._id, product : Session.get("detailed")._id, plate: Session.get("basket"), time: new Date().getTime(), action:"click-delete-product"});
  }
});
