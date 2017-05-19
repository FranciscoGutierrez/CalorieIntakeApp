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
      let img   = "";
      try{name  = Products.findOne({_id: id}).product_name; } catch(e){}
      try{img   = Images.findOne({id: Number(id)}).url;     } catch(e){}
      return {name: name, image: img};
    }
  });
