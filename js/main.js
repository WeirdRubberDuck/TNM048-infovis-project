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

  pc = new pc(data);

  var key = "Happiness Score"; // OBS! TODO: Rename in file...
  map = new worldMap(data, key);
}