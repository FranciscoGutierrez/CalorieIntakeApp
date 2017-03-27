import noUiSlider from 'noUiSlider';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import './main.html';

Template.controls.onCreated(function helloOnCreated() {
  Session.setDefault("activity",0);
});

Template.controls.helpers({
  counter() {
    return Template.instance().counter.get();
  },
});

Template.output.helpers({
  bmr() {
    var age      = Session.get("age");
    var weight   = Session.get("weight");
    var height   = Session.get("height");
    var gender   = Session.get("gender");
    var activity = Session.get("activity");
    var bmr      = 0;
    if(gender == "male") {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else if(gender == "female"){
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }
    if(activity == 0.00)  bmr = bmr * 1;
    if(activity == 2.00)  bmr = bmr * 1.2;
    if(activity == 4.00)  bmr = bmr * 1.375;
    if(activity == 6.00)  bmr = bmr * 1.55;
    if(activity == 8.00)  bmr = bmr * 1.725;
    if(activity == 10.00) bmr = bmr * 1.95;
    return bmr.toFixed(2);
  },
});

Template.controls.events({
  'keyup .ageVal'(event, instance) {
    Session.set("age",instance.$(".ageVal").val());
  },
  'keyup .weightVal'(event, instance) {
    Session.set("weight",instance.$(".weightVal").val());
  },
  'keyup .heightVal'(event, instance) {
    Session.set("height",instance.$(".heightVal").val());
  },
  'change .genderVal'(event, instance) {
    Session.set("gender",instance.$(".genderVal").val());
  }
});

Template.product.events({
  'mouseenter .product'(event, instance) {
    instance.$(".delete").fadeIn(0);
  },
  'mouseleave .product'(event, instance) {
    instance.$(".delete").fadeOut(0);
  },
});

Template.controls.rendered = function () {
  var slider = document.getElementById('slider');
  noUiSlider.create(slider, {
    start: 2,
    connect: "lower",
    tooltips: {to: function (v) {
      var text = "";
      if(v==0)  text = "No Activity";
      if(v==2)  text = "Little or no exercise"; //"Sedentary - Little or no exercise";
      if(v==4)  text = "Lightly Active - Exercise/sports 1-3 times/week";
      if(v==6)  text = "Moderately Active - Exercise/sports 3-5 times/week";
      if(v==8)  text = "Very Active - Hard Exercise/sports 6-7 times/week ";
      if(v==10) text = "Extra Active - Very hard exercise/sports or physical job";
      return text;
      }
    },
    range: {
      'min': 0,
      '20%': 2,
      '40%': 4,
      '60%': 6,
      '80%': 8,
      'max': 10
    },
    snap: true,
    pips: {
      mode: 'steps',
      density: 2
    }
  });

  slider.noUiSlider.on('slide', function(value){
    Session.set("activity",value[0]);
  });
};
