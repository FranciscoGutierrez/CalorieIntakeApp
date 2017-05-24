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
    let proteins_tags = ["en:meats","en:seafood", "fr:salade-de-poulet-curry", "en:soupe","en:seafood","en:fishes"];
    let snacks_tags   = ["en:desserts","en:salty-snacks", "en:waffles", "en:sugary-snacks", "en:chocolates", "en:ketchup", "en:jams"];
    let grains_tags   = ["en:sandwiches", "en:cereal-bars",  "en:cereals-and-potatoes", "en:cereals-and-their-products", "en:breakfast-cereals", "en:cereals-and-potatoes", "en:breads", "en:baguettes"];
    let dairy_tags    = ["fr:fromages-blancs", "en:dairies", "en:cheeses", "en:cow-cheeses", "en:uncooked-pressed-cheeses", "fr:fromage-a-pate-dure", "en:yogurts", "en:fruit-yogurts", "fr:yaourts-sur-lit-de-fruits"];


    for (i = 0; i < basket.length; i++) {
      let product = [];
      try{ product = Products.findOne({_id: basket[i]}).categories_tags}catch(e){};
      Meteor.subscribe('products',  basket[i]);

      if(_.intersection(product, fruits_tags).length  > 0){
        fruits.push(basket[i]);
      }
      if(_.intersection(product, veggies_tags).length  > 0){
        veggies.push(basket[i]);
      }
      if(_.intersection(product, drinks_tags).length   > 0){
        water.push(basket[i]);
      }
      if(_.intersection(product, snacks_tags).length   > 0){
        junk.push(basket[i]);
      }
      if(_.intersection(product, grains_tags).length  > 0){
        grains.push(basket[i]);
      }
      if(_.intersection(product, proteins_tags).length > 0){
        proteins.push(basket[i]);
      }
      if(_.intersection(product, dairy_tags).length > 0){
        dairy.push(basket[i]);
      }
    }

    let data = {veggies: veggies, fruits: fruits, proteins:proteins, grains:grains, water:water, dairy: dairy, junk:junk};
    return data;
  }
});

Template.basket.events({
  'click .save-profile'(event, instance){
    let id        = Session.get("userID");
    let age       = Session.get("age");
    let gender    = Session.get("gender");
    let weight    = Session.get("weight");
    let height    = Session.get("height");
    let activity  = Session.get("activity");
    let allergies = Session.get("allergies");
    let time_start= Session.get("time_start");
    let time_end  = new Date().getTime();
    let favorites = Session.get("basket");
    $(".save-profile").prop("disabled", true);
    $('.save-profile').css('background', "gray");
    let user = {_id:id,
      age:age,
      gender:gender,
      weight:weight,
      height:height,
      activity :activity,
      allergies:allergies,
      time_start:time_start,
      time_end:time_end,
      favorites:favorites}
      Users.insert(user, function(){
        $('.save-profile').fadeOut(function(){
          $(".analytics").remove();
          $(".basket-container").remove();
          $(".product-container").remove();
          Router.go('/'+String(id));
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
      // if(name == "veggies")  $(".product-"+id).css({ "border-color": "#2E7D32"});
      // if(name == "fruits")   $(".product-"+id).css({ "border-color": "#c62828"});
      // if(name == "proteins") $(".product-"+id).css({ "border-color": "#F9A825"});
      // if(name == "grains")   $(".product-"+id).css({ "border-color": "#4E342E"});
      // if(name == "water")    $(".product-"+id).css({ "border-color": "#1976D2"});
      // if(name == "junk")     $(".product-"+id).css({ "border-color": "#455A64"});
      // if(name == "dairy")    $(".product-"+id).css({ "border-color": "#512DA8"});
    },
    'mouseleave .dot-product'(event, instance){
      let id = instance.data.id;
      let name = instance.data.name;
      $(".product-"+id).css({ "border-color": "white"})
      $(".product-"+id).removeClass("animated infinite pulse");
      // if(name == "veggies")  $(".product-"+id).css({ "border-color": "#81C784"});
      // if(name == "fruits")   $(".product-"+id).css({ "border-color": "#e57373"});
      // if(name == "proteins") $(".product-"+id).css({ "border-color": "#FFCC80"});
      // if(name == "grains")   $(".product-"+id).css({ "border-color": "#A1887F"});
      // if(name == "water")    $(".product-"+id).css({ "border-color": "#90CAF9"});
      // if(name == "junk")     $(".product-"+id).css({ "border-color": "#B0BEC5"});
      // if(name == "dairy")    $(".product-"+id).css({ "border-color": "#9575CD"});
    }
  });
