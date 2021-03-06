Template.basket.helpers({
  basket() {
    return Session.get("basket");
  },
  amount() {
    return Session.get("calories");
  },
  size: function(){
    return Session.get("basket").length;
  },
  showSave: function(){
    let size = Session.get("basket").length;
    let show = false;
    if (size > 2) show = true;
    return show;
  },
  dashboard: function() {
    let dashboard = true;
    if(Session.get("user") == "profile") dashboard = false;
    return dashboard;
  },
  avgNutriscore: function(){
    let basket   = Session.get("basket");
    let rate  = "";
    let sum   = 0;
    let grade = "";
    let size = basket.length;
    for (i = 0; i < basket.length; i++) {
      try{rate = Products.findOne({_id: basket[i]}).nutrition_grade_fr}catch(e){};
      if(rate == "a") sum += 1;
      if(rate == "b") sum += 2;
      if(rate == "c") sum += 3;
      if(rate == "d") sum += 4;
      if(rate == "e") sum += 5;
      if(rate == undefined) size -= 1;
    }
    if(sum/size >= 1) grade = "a"
    if(sum/size >= 2) grade = "b"
    if(sum/size >= 3) grade = "c"
    if(sum/size >= 4) grade = "d"
    if(sum/size >= 5) grade = "e"
    return grade;
  }
});

Template.myplate.helpers({
  data() {
    let limits  = {veggies: 10, fruits: 40, proteins: 20, grains: 30, water: 50, isbad: 60 };
    let current = {vfill: 5, ffill: 20, pfill: 15, gfill: 20, wfill: 25, isbadfill: 40 };
    return _.extend(current, limits);
  },
  basket() {
    let basket   = Session.get("basket");
    let veggies  = [];
    let fruits   = [];
    let proteins = [];
    let grains   = [];
    let water    = [];
    let junk     = [];
    let dairy    = [];
    let fruits_tags   = ["en:fruits-in-syrup", "en:canned-fruits", "en:fruits-based-foods","en:fruit-preserves", "en:fruit-based-beverages", "en:fruit-juices", "en:fruit-juices-and-nectars"];
    let veggies_tags  = ["en:plant-based-foods", "en:dehydrated-vegetable-soups", "en:vegetable-soups", "nl:vegetarian-meatballs",  "en:prepared-vegetables", "fr:ratatouilles"];
    let drinks_tags   = ["en:beverages","en:carbonated-drinks","en:sodas","en:sugared-beverages", "en:hot-beverages",  "en:non-sugared-beverages"];
    let proteins_tags = ["fr:escalopes","en:meats","en:seafood", "fr:salade-de-poulet-curry", "en:soupe","en:seafood","en:fishes"];
    let snacks_tags   = ["en:desserts","en:salty-snacks", "en:waffles", "en:sugary-snacks", "en:chocolates", "en:ketchup", "en:jams"];
    let grains_tags   = ["en:sandwiches", "en:cereal-bars",  "en:cereals-and-potatoes", "en:cereals-and-their-products", "en:breakfast-cereals", "en:cereals-and-potatoes", "en:breads", "en:baguettes"];
    let dairy_tags    = ["fr:fromages-blancs", "en:dairies", "en:cheeses", "en:cow-cheeses", "en:uncooked-pressed-cheeses", "fr:fromage-a-pate-dure", "en:yogurts", "en:fruit-yogurts", "fr:yaourts-sur-lit-de-fruits"];
    for (i = 0; i < basket.length; i++) {
      let product = [];
      try{ product = Products.findOne({_id: basket[i]}).categories_tags}catch(e){};
      Meteor.subscribe('products',  basket[i]);
      if(_.intersection(product, fruits_tags).length   > 0) fruits.push(basket[i]);
      if(_.intersection(product, veggies_tags).length  > 0) veggies.push(basket[i]);
      if(_.intersection(product, drinks_tags).length   > 0) water.push(basket[i]);
      if(_.intersection(product, snacks_tags).length   > 0) junk.push(basket[i]);
      if(_.intersection(product, grains_tags).length   > 0) grains.push(basket[i]);
      if(_.intersection(product, proteins_tags).length > 0) proteins.push(basket[i]);
      if(_.intersection(product, dairy_tags).length    > 0) dairy.push(basket[i]);
    }
    let data = {veggies: veggies, fruits: fruits, proteins:proteins, grains:grains, water:water, dairy: dairy, junk:junk};
    return data;
  },
  warn() {
    let basket   = Session.get("basket");
    let veggies  = [];
    let fruits   = [];
    let proteins = [];
    let grains   = [];
    let water    = [];
    let junk     = [];
    let dairy    = [];
    let fruits_tags   = ["en:fruits-in-syrup", "en:canned-fruits", "en:fruits-based-foods","en:fruit-preserves", "en:fruit-based-beverages", "en:fruit-juices", "en:fruit-juices-and-nectars"];
    let veggies_tags  = ["en:plant-based-foods", "en:dehydrated-vegetable-soups", "en:vegetable-soups", "nl:vegetarian-meatballs",  "en:prepared-vegetables", "fr:ratatouilles"];
    let drinks_tags   = ["en:beverages","en:carbonated-drinks","en:sodas","en:sugared-beverages", "en:hot-beverages",  "en:non-sugared-beverages"];
    let proteins_tags = ["en:meats","en:seafood", "fr:salade-de-poulet-curry", "en:soupe","en:seafood","en:fishes"];
    let snacks_tags   = ["en:desserts","en:salty-snacks", "en:waffles", "en:sugary-snacks", "en:chocolates", "en:ketchup", "en:jams"];
    let grains_tags   = ["en:sandwiches", "en:cereal-bars",  "en:cereals-and-potatoes", "en:cereals-and-their-products", "en:breakfast-cereals", "en:cereals-and-potatoes", "en:breads", "en:baguettes"];
    let dairy_tags    = ["fr:fromages-blancs", "en:dairies", "en:cheeses", "en:cow-cheeses", "en:uncooked-pressed-cheeses", "fr:fromage-a-pate-dure", "en:yogurts", "en:fruit-yogurts", "fr:yaourts-sur-lit-de-fruits"];
    for (i = 0; i < basket.length; i++) {
      let product = [];
      try{ product = Products.findOne({_id: basket[i]}).categories_tags}catch(e){};
      if(_.intersection(product, fruits_tags).length   > 0) fruits.push(basket[i]);
      if(_.intersection(product, veggies_tags).length  > 0) veggies.push(basket[i]);
      if(_.intersection(product, drinks_tags).length   > 0) water.push(basket[i]);
      if(_.intersection(product, snacks_tags).length   > 0) junk.push(basket[i]);
      if(_.intersection(product, grains_tags).length   > 0) grains.push(basket[i]);
      if(_.intersection(product, proteins_tags).length > 0) proteins.push(basket[i]);
      if(_.intersection(product, dairy_tags).length    > 0) dairy.push(basket[i]);
    }
    let data = {veggies: false, fruits: fruits.length, proteins:proteins.length, grains:grains.length, water:water.length, dairy: dairy.length, junk:junk.length};
    return data;
  }
});

Template.basket.events({
  'click .save-profile'(event, instance){
    let id        = Session.get("userID");
    let age       = parseInt(Session.get("age"));
    let gender    = Session.get("gender");
    let weight    = parseInt(Session.get("weight"));
    let height    = parseInt(Session.get("height"));
    let activity  = parseInt(Session.get("activity"));
    let allergies = Session.get("allergies");
    let time_start= Session.get("time_start");
    let time_end  = new Date().getTime();
    let favorites = Session.get("basket");
    let bmr = 0;
    if(activity == 0)  bmr = bmr * 1;
    if(activity == 2)  bmr = bmr * 1.2;
    if(activity == 4)  bmr = bmr * 1.375;
    if(activity == 6)  bmr = bmr * 1.55;
    if(activity == 8)  bmr = bmr * 1.725;
    if(activity == 10) bmr = bmr * 1.95;
    $(".save-profile").prop("disabled", true);
    $('.save-profile').css('background', "gray");
    if(gender == "male")
    bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    if(gender == "female")
    bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    let user = {_id:id,
      age:age,
      gender:gender,
      weight:weight,
      height:height,
      activity :activity,
      bmr: bmr,
      //allergies:allergies,
      time_start:time_start,
      time_end:time_end,
      favorites:favorites}
      console.log(user);
      Users.insert(user, function(){
        $('.save-profile').fadeOut(function(){
          //$(".analytics").remove();
          //$(".basket-container").remove();
          //$(".product-container").remove();
          $(".left-container").fadeOut();
          $(".right-container").fadeOut(function(){
            $(".thanks").css("display", "flex");
          });
          //Router.go('/'+String(id));
        });
      });
    },
    'click .fav-product'(event, instance){
      let id = this.toString();
      Meteor.subscribe('products', id);
      Meteor.subscribe('images', Number(id));
      Session.set("detailed",Products.findOne({_id : id}));
    }
  });

  Template.favorite.helpers({
    data: function() {
      let id = this.toString();
      Meteor.subscribe('products', id);
      Meteor.subscribe('images', Number(id));
      let name  = "";
      try{name  = Products.findOne({_id: id}).product_name; } catch(e){}
      let size = "small";
      if(Session.get("user") == "profile") size = "normal";
      return {name: name, image: id, size:size};
    }
  });

  Template.basketItem.helpers({
    data: function() {
      let id = this.toString();
      Meteor.subscribe('products', id);
      Meteor.subscribe('images', Number(id));
      let name  = "";
      let img   = "";
      try{name  = Products.findOne({_id: id}).product_name; } catch(e){}
      try{img   = Images.findOne({id: Number(id)}).url;     } catch(e){}
      let size = "small";
      if(Session.get("user") == "profile") size = "normal";
      return {name: name, image: img, size:size, id:id};
    }
  });

  Template.basketItem.events({
    'click .basket-product'(event, instance){
      let id = this.toString();
      Meteor.subscribe('products', id);
      Meteor.subscribe('images', Number(id));
      Session.set("detailed",Products.findOne({_id : id}));
      Logs.insert({user:Session.get("user")._id, product : Session.get("detailed")._id, plate: Session.get("basket"), time: new Date().getTime(), action:"click-basket-product"});
    },
    'mouseenter .basket-product'(event, instance){
      let id = instance.data;
      $(".product-"+id).css({ "border-color": "#3F51B5"});
      $(".product-"+id).addClass("animated infinite pulse");
    },
    'mouseleave .basket-product'(event, instance){
      let id = instance.data;
      $(".product-"+id).css({ "border-color": "white"})
      $(".product-"+id).removeClass("animated infinite pulse");
    }

  });

  Template.dot.events({
    'mouseenter .dot-product'(event, instance){
      let id = instance.data.id;
      let name = instance.data.name;
      $(".product-"+id).css({ "border-color": "#3F51B5"});
      $(".product-"+id).addClass("animated infinite pulse");
    },
    'mouseleave .dot-product'(event, instance){
      let id = instance.data.id;
      let name = instance.data.name;
      $(".product-"+id).css({ "border-color": "white"})
      $(".product-"+id).removeClass("animated infinite pulse");
    }
  });
