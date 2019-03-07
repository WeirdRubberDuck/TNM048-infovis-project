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

var pc, map, stars, year;

function draw(error, data1, data2){

  var year1 = document.getElementById("Year");
  var year = year1.options[year1.selectedIndex].value;

  if(year === "2015")
    var data = data1;
  else// if (year === "2015")
    var data = data2;

  // Colors to use 
  var color = d3.scaleThreshold()
        .domain([3.0,4.0,5.0,6.0,7.0])
        .range(['rgb(215,48,39)','rgb(252,141,89)','rgb(254,224,139)','rgb(217,239,139)','rgb(145,207,96)','rgb(26,152,80)']); 

  // Keys for some columns in the data
  var key_score = "Happiness Score";    //Used for choosing color
  var key_rank = "Happiness Rank"; 

  pc = new pc(data, color, key_score);

  map = new worldMap(data, color, key_score, key_rank);
}

