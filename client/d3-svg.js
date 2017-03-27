import * as d3 from "d3";

Template.output.rendered = function () {

  let data = [110,109,108,107,106,105,104,103,102,101,100,99,98,97,96,95,94,93,92,91,90,89,88,87,86];
  //let data = [50,109,108,107,106,105,104,103,102,101,100,99,98,97,96,95,94,93,92,91,90,89,88,87,86];

  let width  = 400;
  let height = 300;
  let svg    = d3.select(".d3-svg ").attr("width", width).attr("height", height);
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
  .attr("fill", "none")
  .attr("stroke", "#3F51B5")
  .attr("stroke-linejoin", "round")
  .attr("stroke-linecap", "round")
  .attr("stroke-width", 3)
  .attr("d", line(data));


};
