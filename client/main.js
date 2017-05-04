import * as d3 from "d3";
import noUiSlider from 'noUiSlider';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import './main.html';

Products = new Meteor.Collection('products');
Images   = new Meteor.Collection('images');
Similar  = new Meteor.Collection('similar');

Template.profile.onCreated(function() {
  Session.set("activity",2.00);
  Session.set("prediction",100);
  Session.set("detailed", "");
  Session.set("basket", []);
  Session.set("calories", 0);
});

Template.output.helpers({
  bmr() {
    let gender   = Session.get("gender");
    let age      = parseInt(Session.get("age"));
    let weight   = parseInt(Session.get("weight"));
    let height   = parseInt(Session.get("height"));
    let activity = parseInt(Session.get("activity"));
    let basket   = parseInt(Session.get("calories"));
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
      weight+(diff*24)
    ];

    let lower = [(weight*0.95),
      (weight*0.94)+diff,
      (weight*0.93)+(diff*2),
      (weight*0.92)+(diff*3),
      (weight*0.91)+(diff*4),
      (weight*0.90)+(diff*5),
      (weight*0.89)+(diff*6),
      (weight*0.88)+(diff*7),
      (weight*0.87)+(diff*8),
      (weight*0.86)+(diff*9),
      (weight*0.85)+(diff*10),
      (weight*0.84)+(diff*11),
      (weight*0.83)+(diff*12),
      (weight*0.82)+(diff*13),
      (weight*0.81)+(diff*14),
      (weight*0.80)+(diff*15),
      (weight*0.79)+(diff*16),
      (weight*0.78)+(diff*17),
      (weight*0.77)+(diff*18),
      (weight*0.76)+(diff*19),
      (weight*0.75)+(diff*20),
      (weight*0.74)+(diff*21),
      (weight*0.73)+(diff*22),
      (weight*0.72)+(diff*23),
      (weight*0.71)+(diff*24)
    ];

    let upper = [(weight*1.05),
      (weight*1.06)+diff,
      (weight*1.07)+(diff*2),
      (weight*1.08)+(diff*3),
      (weight*1.09)+(diff*4),
      (weight*1.10)+(diff*5),
      (weight*1.11)+(diff*6),
      (weight*1.12)+(diff*7),
      (weight*1.13)+(diff*8),
      (weight*1.14)+(diff*9),
      (weight*1.15)+(diff*10),
      (weight*1.16)+(diff*11),
      (weight*1.17)+(diff*12),
      (weight*1.18)+(diff*13),
      (weight*1.19)+(diff*14),
      (weight*1.20)+(diff*15),
      (weight*1.21)+(diff*16),
      (weight*1.22)+(diff*17),
      (weight*1.23)+(diff*18),
      (weight*1.24)+(diff*19),
      (weight*1.25)+(diff*20),
      (weight*1.26)+(diff*21),
      (weight*1.27)+(diff*22),
      (weight*1.28)+(diff*23),
      (weight*1.29)+(diff*24)
    ];

    let w    = 300;
    let h    = 200;
    let svg  = d3.select(".d3-svg").transition();
    let x    = d3.scaleLinear().domain([0, pred.length]).range([0, w]);
    let y    = d3.scaleLinear().domain([0, d3.max(pred)+50]).range([h, 0]);
    let line = d3.line()
    .x(function(d,i) {return x(i);})
    .y(function(d)   {return y(d);});

    let areaL = d3.area()
    .x(function(d,i)  { return x(i);})
    .y0(function(d,i) { return y(pred[i]) })
    .y1(function(d)   { return y(d);});

    let areaU = d3.area()
    .x(function(d,i)  { return x(i);})
    .y0(function(d,i) { return y(pred[i]) })
    .y1(function(d)   { return y(d);});

    svg.select(".areaU").duration(400).attr("d", areaL(upper));
    svg.select(".areaL").duration(400).attr("d", areaL(lower));
    svg.select(".line").duration(400).attr("d", line(pred));
    svg.select(".y-axis").duration(200).call(d3.axisLeft(y));
    svg.select(".x-axis").duration(200).call(d3.axisBottom(x));


    return bmr.toFixed(2);
  }
});

Template.profile.events({
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
  },
  'click .next-profile'(event, instace) {
    var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
    $(".user-profile").removeClass('animated fadeInLeft');
    $(".user-profile").addClass('animated fadeOutRight').one(animationEnd, function() {
      $(this).remove();
      Blaze.render(Template.products, $("body")[0]);
    });
  }
});

Template.profile.rendered = function () {
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
