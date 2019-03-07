/**
 * @Created Feb 27, 2019
 * @LastUpdate ...
 * @author Emma Broman & Ingela Rossing
 */

queue()
  .defer(d3.csv,'data/extended2015_nice_headers.csv')
  .defer(d3.csv,'data/extended2016_nice_headers.csv')
  .defer(d3.csv,'data/world-happiness-report/2017.csv')
  .await(draw);

var pc, map, stars;

const KEY_SCORE = "Happiness Score";
const KEY_RANK = "Happiness Rank";

function draw(error, data1, data2, data3){
  if (error) throw error;

  // Choose data to visualise
  data = data1;

  // Colors to use 
  var color = d3.scaleThreshold()
        .domain([3.0,4.0,5.0,6.0,7.0])
        .range(['rgb(215,48,39)','rgb(252,141,89)','rgb(254,224,139)','rgb(217,239,139)','rgb(145,207,96)','rgb(26,152,80)']); 

  pc = new pc(data, color);

  map = new worldMap(data, color);
}

// To choose emoji using rank
function emojinr(d){
  var nr = d3.scaleThreshold()
    .domain([3.0,4.0,5.0,6.0,7.0]) //TODO: get domain from color variable insted!
    .range(['1','2','3','4','5','6']); 

  if(nr(d))
      return nr(d);
  else
      return "X"
}
  