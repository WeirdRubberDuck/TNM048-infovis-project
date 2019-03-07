/**
 * @Created Feb 28, 2019
 * @LastUpdate ...
 * @author Emma Broman & Ingela Rossing
 */
function starplot(data, selectedData, div){

  var margin = {
    top: 36,
    right: 50,
    bottom: 36,
    left: 60
  };
  var width = 240 - margin.left - margin.right;
  var height = 240 - margin.top - margin.bottom;

  var starplotDivID = "star-plot";
  var starplotDiv = "#" + starplotDivID;

  // Dipsplay that the selected item doesn't have data
  if(isEmpty(selectedData)) {
    d3.select(div).append("text")
      .attr('text-anchor', 'middle')
      .text("No data available");
      return;
  } 
  else {
    // To format happiness score :)
    var format = d3.format(".3n");

    // Create HTML content with info for the first country in the lsit
    d3.select(div).html(
      "<h2 class='text-center'>" + selectedData.Country + "</h2>" //+
      +"<table style='width:80%; margin:auto;'><tr>"
      + "<td><img src=icons/emoji" + emojinr(selectedData[KEY_SCORE]) + ".png height='42'>" + format(selectedData[KEY_SCORE]) +"</td>"
      + "<td> Rank: " + "<span>" + selectedData[KEY_RANK] + "</span></td>"
      + "</tr></table>"
      + "<div id=" + starplotDivID + "></div>" 
      ) 
  }   

  // The dimensions to include in the plot, including labels and an array that will containt the scale for each dimension
  var dimensions = ['Economy (GDP per Capita)','Family','Health (Life Expectancy)','Freedom','Trust (Government Corruption)','Generosity','Dystopia Residual'];
  var labels = ['Economy','Family','Health','Freedom','Trust','Generosity','Dystopia Residual'];
  var scales = [];

  // Create the scale for each dimension depending on the data. The max value for the scale is 
  // the maximum value for each column, respectively. 
  for (i = 0; i < dimensions.length; i++) { 
    scales[i] = d3.scaleLinear()
      .domain([0,d3.max(data, function(d) { return +d[dimensions[i]]; } )])
      .range([0, 100])
  };

  var star = d3.starPlot() 
    .properties([
      dimensions[0],
      dimensions[1],
      dimensions[2],
      dimensions[3],
      dimensions[4],
      dimensions[5],
      dimensions[6],
    ])
    .scales(scales)
    .labels([
      labels[0],
      labels[1],
      labels[2],
      labels[3],
      labels[4],
      labels[5],
      labels[6],
    ])
    .width(width)
    .margin(margin)
  
    star.includeLabels(true);

  d3.select(starplotDiv).append('svg') 
    .attr('class', 'chart')
    .attr('width', width + margin.left + margin.right)
    .attr('height', width + margin.top + margin.bottom)
    .append('g')
      .datum(selectedData)
      .call(star)

  d3.select('#star' + selectedData.id)
    // id is specified in lib/d3-starplot.js
    .style('fill', COLOR_MAP(selectedData[KEY_SCORE])) 

} //end starplot 

function isEmpty(obj) {
  for(var prop in obj) {
      if(obj.hasOwnProperty(prop))
          return false;
  }
  return true;
}  