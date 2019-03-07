/**
 * @Created Feb 27, 2019
 * @LastUpdate ...
 * @author Emma Broman & Ingela Rossing
 */

// Read all available in the beginning
queue()
  .defer(d3.csv,'data/extended2015_nice_headers.csv')
  .defer(d3.csv,'data/extended2016_nice_headers.csv')
  .await(draw);

var pc, map, year;

// Colors to use 
var COLOR_MAP = d3.scaleThreshold()
  .domain([3.0,4.0,5.0,6.0,7.0])
  .range(['rgb(215,48,39)','rgb(252,141,89)','rgb(254,224,139)','rgb(217,239,139)','rgb(145,207,96)','rgb(26,152,80)']); 

// Keys to columns in the data
const KEY_SCORE = "Happiness Score";
const KEY_RANK = "Happiness Rank";

function draw(error, data1, data2){

  var year1 = document.getElementById("Year");
  var year = year1.options[year1.selectedIndex].value;

  if(year === "2015")
    var data = data1;
  else// if (year === "2015")
    var data = data2;

  pc = new pc(data);

  map = new worldMap(data);
}

// To choose emoji using rank
function emojinr(d){
  var nr = d3.scaleThreshold()
    .domain(COLOR_MAP.domain())
    .range(['1','2','3','4','5','6']); 

  if(nr(d))
      return nr(d);
  else
      return "X"
}
