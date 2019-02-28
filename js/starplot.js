/**
 * @Created Feb 28, 2019
 * @LastUpdate ...
 * @author Emma Broman & Ingela Rossing
 */

  var margin = {
    top: 36,
    right: 50,
    bottom: 20,
    left: 50
  };
  var width = 240 - margin.left - margin.right;
  var height = 240 - margin.top - margin.bottom;
  var labelMargin = 15;

  var dim2017 = ['Economy..GDP.per.Capita.','Family','Health..Life.Expectancy.','Freedom','Generosity','Trust..Government.Corruption.','Dystopia.Residual'];
  var dim2015 = ['Economy (GDP per Capita)','Family','Health (Life Expectancy)','Freedom','Trust (Government Corruption)','Generosity','Dystopia Residual'];

  // The dimensions to include in the plot, including labels and an array that will containt the scale for each dimension
  var dimensions = dim2017;
  var labels = ['Economy','Family','Health','Freedom','Trust','Generosity','Dystopia Residual'];
  var scales = [];

  d3.csv('data/world-happiness-report/2017.csv')
    .row(function(d) {
        for (i = 0; i < dimensions.length; i++) { 
            d[dimensions[i]] = +d[dimensions[i]];
        }
        return d;
    })
    .get(function(error, rows) {
      
      // Create the scale for each dimension depending on the data. The max value for the scale is 
      // the maximum value for each column, respectively. 
      for (i = 0; i < dimensions.length; i++) { 
        scales[i] = d3.scaleLinear()
            .domain([0,d3.max(rows, function(d) { return +d[dimensions[i]]; } )])
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
        .labelMargin(labelMargin)
  
      rows.forEach(function(d, i) {
        star.includeLabels(true);
  
        d3.select('#star-plot').append('svg')
          .attr('class', 'chart')
          .attr('width', width + margin.left + margin.right)
          .attr('height', width + margin.top + margin.bottom)
          .append('g')
            .datum(d)
            .call(star)
      });
    });
  