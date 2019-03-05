/**
 * @Created Feb 28, 2019
 * @LastUpdate ...
 * @author Emma Broman & Ingela Rossing
 */
function starplot(data, dataItem, colorpalette, key, div){

  var margin = {
    top: 36,
    right: 50,
    bottom: 20,
    left: 50
  };
  var width = 240 - margin.left - margin.right;
  var height = 240 - margin.top - margin.bottom;
  var labelMargin = 15;

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
    .title(function(d) { return d.Country; })
    .margin(margin)
    .labelMargin(labelMargin);
  
  // TODO: handle this in a better way
  dataItem.forEach(function(d, i) {
    star.includeLabels(true);

    d3.select(div).append('svg') 
      .attr('class', 'chart')
      .attr('width', width + margin.left + margin.right)
      .attr('height', width + margin.top + margin.bottom)
      .append('g')
        .datum(d)
        .call(star)

    d3.select('#star' + d.id)
      // id is specified in lib/d3-starplot.js
      .style('fill', colorpalette(d[key])) 

    console.log()

  });

} //end starplot 
  