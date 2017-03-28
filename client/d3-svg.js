import * as d3 from "d3";

Template.output.rendered = function () {
  let data = [110, 108.986, 107.972, 106.958, 105.944, 104.93, 103.916, 102.902, 101.888, 100.874, 99.86, 98.846, 97.832, 96.818, 95.804, 94.78, 93.776, 92.762, 91.748, 90.734, 89.72, 88.706, 87.692, 86.678, 85.664]; //Session.get("prediction");

  let width  = 400;
  let height = 300;
  let svg    = d3.select(".d3-svg").attr("width", width).attr("height", height);
  let x      = d3.scaleLinear().domain([0, data.length]).range([0, width]);
  let y      = d3.scaleLinear().domain([0, d3.max(data)+50]).range([height, 0]);

  d3.timeParse("%b");

  svg.append("g").attr("transform", "translate(0,"+height+")").call(d3.axisBottom(x))
  .append("text")
  .attr("fill", "#7f8c8d")
  .attr("x", width)
  .attr("dy", "-0.71em")
  .attr("text-anchor", "end")
  .text("Weeks");

  svg.append("g").call(d3.axisLeft(y))
  .append("text")
  .attr("fill", "#7f8c8d")
  .attr("transform", "rotate(-90)")
  .attr("y", 6)
  .attr("dy", "0.71em")
  .attr("text-anchor", "end")
  .text("Weight (kg.)");

  let line = d3.line()
  .x(function(d,i) {
    return x(i);
  })
  .y(function(d) {
    return y(d);
  })

  svg.append("path")
  .attr("class", "line")
  .attr("fill", "none")
  .attr("stroke", "#3F51B5")
  .attr("stroke-linejoin", "round")
  .attr("stroke-linecap",  "round")
  .attr("stroke-width", 3)
  .attr("d", line(data));

};
