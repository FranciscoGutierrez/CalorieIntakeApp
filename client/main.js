import noUiSlider from 'noUiSlider';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Template.controls.onCreated(function helloOnCreated() {
  // counter starts at 0
  Session.setDefault("bmr",0)
});

Template.controls.helpers({
  counter() {
    return Template.instance().counter.get();
  },
});

Template.output.helpers({
  bmr() {
    return Session.get("bmr");
  },
});

Template.controls.events({
  'click .update'(event, instance) {
    var age    = $(".ageVal").val();
    var weight = $(".weightVal").val();
    var height = $(".heightVal").val();
    var gender = $(".genderVal").val();
    var activity = $(".activityVal").val();
    var bmr = 0;
    if(gender == "male") {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else if(gender == "female"){
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }
    if(activity == "a0") bmr = bmr * 1;
    if(activity == "a1") bmr = bmr * 1.2;
    if(activity == "a2") bmr = bmr * 1.375;
    if(activity == "a3") bmr = bmr * 1.55;
    if(activity == "a4") bmr = bmr * 1.725;
    if(activity == "a5") bmr = bmr * 1.95;
    console.log(bmr);
    Session.set("bmr", bmr.toFixed(2));

  },
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
};
