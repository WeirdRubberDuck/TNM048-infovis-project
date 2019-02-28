/**
 * @Created Feb 27, 2019
 * @LastUpdate ...
 * @author Emma Broman & Ingela Rossing
 */

queue()
  .defer(d3.csv,'data/world-happiness-report/2015.csv')
  .defer(d3.csv,'data/world-happiness-report/2016.csv')
  .defer(d3.csv,'data/world-happiness-report/2017.csv')
  .await(draw);

var pc;

function draw(error, data1, data2, data3){
  if (error) throw error;

  pc = new pc(data3);

}