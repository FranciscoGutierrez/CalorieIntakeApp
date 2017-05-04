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
    let img = Images.findOne({id: Number(Session.get("detailed")._id)})
    let url = "";
    try{
      url = img.url
    }catch(e){}
    return url;
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
    try{img   = Images.findOne({id: Number(id)}).url;     } catch(e){}
    return {name: name, image: img};
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
