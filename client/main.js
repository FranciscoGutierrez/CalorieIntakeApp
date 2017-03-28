import * as d3 from "d3";
import noUiSlider from 'noUiSlider';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import './main.html';

Products = new Meteor.Collection('products');

Template.controls.onCreated(function helloOnCreated() {
  Session.setDefault("activity",2.00);
  Session.setDefault("basket",1500);
  Session.setDefault("prediction",100);
});

Template.output.helpers({
  bmr() {
    let gender   = Session.get("gender");
    let age      = parseInt(Session.get("age"));
    let weight   = parseInt(Session.get("weight"));
    let height   = parseInt(Session.get("height"));
    let activity = parseInt(Session.get("activity"));
    let basket   = parseInt(Session.get("basket"));
    let bmr      = 0.0;
    if(gender == "male") {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else if(gender == "female"){
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }
    if(activity == 0)  bmr = bmr * 1;
    if(activity == 2)  bmr = bmr * 1.2;
    if(activity == 4)  bmr = bmr * 1.375;
    if(activity == 6)  bmr = bmr * 1.55;
    if(activity == 8)  bmr = bmr * 1.725;
    if(activity == 10) bmr = bmr * 1.95;

    // Generate and update prediction array.
    let diff = (basket-bmr)/1000;
    let pred = [weight,
      weight+diff,
      weight+(diff*2),
      weight+(diff*3),
      weight+(diff*4),
      weight+(diff*5),
      weight+(diff*6),
      weight+(diff*7),
      weight+(diff*8),
      weight+(diff*9),
      weight+(diff*10),
      weight+(diff*11),
      weight+(diff*12),
      weight+(diff*13),
      weight+(diff*14),
      weight+(diff*15),
      weight+(diff*16),
      weight+(diff*17),
      weight+(diff*18),
      weight+(diff*19),
      weight+(diff*20),
      weight+(diff*21),
      weight+(diff*22),
      weight+(diff*23),
      weight+(diff*24),
    ];
    console.log(pred);
    console.log(bmr);

    let w    = 400;
    let h    = 300;
    let svg  = d3.select(".d3-svg").transition();
    let x    = d3.scaleLinear().domain([0, pred.length]).range([0, w]);
    let y    = d3.scaleLinear().domain([0, d3.max(pred)+50]).range([h, 0]);
    let line = d3.line().x(function(d,i) {return x(i);}).y(function(d) {return y(d);})
    svg.select(".line").duration(750).attr("d", line(pred));
    svg.select(".y-axis").duration(750).call(d3.axisLeft(y));


    return bmr.toFixed(2);
  }
});

Template.products.helpers({
  basket() {
    return Session.get("basket");
  }
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
  let slider = document.getElementById('slider');
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
