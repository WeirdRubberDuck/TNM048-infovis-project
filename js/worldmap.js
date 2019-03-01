/**
 * TODO: write description
 * 
 * @Created Mar 1, 2019
 * @LastUpdate ...
 * @author Emma Broman & Ingela Rossing
 */

function worldMap(data, key){

    console.log("Create world map...");

    //Set width and height of the chart
    var div = '#world-map-chart';
    var parentWidth = $(div).parent().width();
    var margin = { top: 40, right: 10, bottom: 10, left: 30 },
        width = parentWidth - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    //Select the div and append our svg tag.
    var svg = d3.select(div).append("svg")
        .attr("width", width)
        .attr("height", height + margin.top + margin.bottom)
        .append('g')
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr('class', 'map');
    
    // Colors to use 
    var color = d3.scaleThreshold()
        .domain([1.0,2.0,3.0,4.0,5.0,6.0,7.0])
        .range(["rgb(247,251,255)", "rgb(222,235,247)", "rgb(198,219,239)", "rgb(158,202,225)", "rgb(107,174,214)", "rgb(66,146,198)","rgb(33,113,181)"]);
    // TODO: Use a better color scale. Preferably using color brewer

    var projection = d3.geoMercator()
                       .scale(130)
                       .translate( [width / 2, height / 1.5]);
    
    var path = d3.geoPath().projection(projection);

    // Load map data and draw the map
    // ------------------------------
    queue()
        .defer(d3.json, "json/world_countries.json")
        .await(drawMap);

    function drawMap(error, mapData){
        var happynessPerCountry = {}; 

        data.forEach(function(d) { happynessPerCountry[d.Country] = +d[key]; });
        mapData.features.forEach(function(d) { d[key] = happynessPerCountry[d.properties.name] });

        svg.append("g")
            .attr("class", "countries")
            .selectAll("path")
            .data(mapData.features)
            .enter().append("path")
            .attr("d", path)
            .style("fill", function(d) { 
                var fillColor = color(happynessPerCountry[d.properties.name]);
                if(!fillColor) fillColor = "rgb(200,200,210)";
                return fillColor;
            })
            .style('stroke', 'white')
            .style('stroke-width', 1.0)
            .style("opacity",0.8)

        svg.append("path")
            .datum(topojson.mesh(mapData.features, function(a, b) { return a.id !== b.id; }))
            .attr("class", "names")
            .attr("d", path);
    }

} // end of worldMap