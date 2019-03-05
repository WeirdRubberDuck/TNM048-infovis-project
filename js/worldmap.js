/**
 * Function to create an interactive world map to visualise a value (given by "key")
 * 
 * Based on an example by Micah Stubbs: http://bl.ocks.org/micahstubbs/8e15870eb432a21f0bc4d3d527b2d14f  
 * 
 * @Created Mar 1, 2019
 * @LastUpdate ...
 * @author Emma Broman & Ingela Rossing
 */

function worldMap(data, color, key_score, key_rank){

    var selectedPath = null; // Variable for the currently selected country

    // Set width and height of the chart
    var div = '#map-chart';
    var parentWidth = $(div).parent().width();
    var margin = { top: 40, right: 10, bottom: 10, left: 30 },
        width = parentWidth - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // Select the div and append our svg tag.
    var svg = d3.select(div).append("svg")
        .attr("width", width)
        .attr("height", height + margin.top + margin.bottom)
        .append('g')
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr('class', 'map');

    // Add legend describing the color coding
    var legend = d3.legendColor()
        .shapeWidth(30)
        .orient('vertical')
        .labels(d3.legendHelpers.thresholdLabels)
        .title(key_score)
        .labelFormat(d3.format(".0f"))
        .scale(color);

    svg.append("g")
       .attr("class", "colorLegend")
       .attr("transform", "translate(-20," + (height - 120) + ")")
       .call(legend);
    
    // Color to use where there is no data
    var colorUndefined ="rgb(200,200,210)";

    var projection = d3.geoMercator()
                       .scale(130)
                       .translate( [width / 2, height / 1.5]);
    
    var path = d3.geoPath().projection(projection);

    // To format happiness score :)
    var format = d3.format(".3n");

    // Function for setting tooltips
    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
            return "<strong><span class='details'>" + d.properties.name + "</span></strong>" 
                + "<br>"
                + "Happiness Score: <span class='details'>"  + format(d[key_score]) +"</span>"
                + "<br>"
                + "Rank: " + "<span class='details'>" + d[key_rank] + "</span>" ;
        })

    svg.call(tip);

    // Load map data and draw the map
    // ------------------------------
    queue()
        .defer(d3.json, "json/world_countries.json")
        .await(drawMap);

    function drawMap(error, mapData){
        var happynessPerCountry = {}; 
        var rankPerCountry = {}; 

        // Set values for each country
        data.forEach(function(d) { 
            happynessPerCountry[d.id] = +d[key_score]; 
            rankPerCountry[d.id] = +d[key_rank]; 
        });
        mapData.features.forEach(function(d) { 
            d[key_score] = happynessPerCountry[d.id] 
            d[key_rank] = rankPerCountry[d.id] 
        });

        svg.append("g")
            .attr("class", "countries")
            .selectAll("path")
            .data(mapData.features)
            .enter().append("path")
            .attr("d", path)
            .style("fill", function(d) { 
                var fillColor = color(happynessPerCountry[d.id]);
                if(!fillColor) fillColor = colorUndefined;
                return fillColor;
            })
            .style("stroke", "white")
            .style("stroke-width", 0.3)
            .style("opacity",0.8)
            // tooltips
            .on("mouseover",function(d){
                tip.show(d);

                if(this !== selectedPath) {
                    onHoverStyle(this);
                }
            })
            .on("mouseout", function(d){
                tip.hide(d);

                if(this !== selectedPath) {
                    resetStyle(this);
                }
            })
            // Handle selection
            .on('click', function(d, i) {
                if(this === selectedPath) {
                    // Clear selection
                    selectedPath = null;
                    resetStyle(this);
                    clearStarPlot() 
                } else {
                    // Reset old selected
                    resetStyle(selectedPath);
                    // Set new selected
                    selectedPath = this;
                    selectedStyle(selectedPath);
                    createStarPlot(selectedPath.__data__.id);
                }   
            });
    }
    
    function onHoverStyle(p){
        d3.select(p)
        .style("opacity", 1)
        .style("stroke","white")
        .style("stroke-width",2);
    }

    function selectedStyle(p){
        d3.select(p)
          .style("opacity", 1)
          .style("stroke","cyan") // TODO: create variable for selected color
          .style("stroke-width",3);
    }

    function resetStyle(p){
        d3.select(p)
          .style("opacity", 0.8)
          .style("stroke","white")
          .style("stroke-width",0.5);
    }

    var starDiv = '#star-plot';

    function createStarPlot(id) {
        clearStarPlot();
        var item = data.filter(function(d){return d.id == selectedPath.__data__.id;});
        starplot(data, item, color, key_score, starDiv);
    }

    function clearStarPlot() {
        d3.select(starDiv).selectAll("*").remove();
    }


} // end of worldMap