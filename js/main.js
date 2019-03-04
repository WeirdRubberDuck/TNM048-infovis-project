/**
 * @Created Feb 27, 2019
 * @LastUpdate ...
 * @author Emma Broman & Ingela Rossing
 */

queue()
  .defer(d3.csv,'data/extended2015.csv')
  .defer(d3.csv,'data/extended2016.csv')
  .defer(d3.csv,'data/world-happiness-report/2017.csv')
  .await(draw);

var pc, map;

function draw(error, data1, data2, data3){
  if (error) throw error;

  // Choose data to visualise
  data = data2;

  //Selecting colors for the paths (each line)
  //var colors = colorbrewer.Set2[6]; 

  // Colors to use 
  var color = d3.scaleThreshold()
        .domain([3.0,4.0,5.0,6.0,7.0])
        .range(['rgb(215,48,39)','rgb(252,141,89)','rgb(254,224,139)','rgb(217,239,139)','rgb(145,207,96)','rgb(26,152,80)']); 

  var key = "Happiness Score"; //Used for choosing color

  pc = new pc(data,color, key);

  map = new worldMap(data, color, key);
}