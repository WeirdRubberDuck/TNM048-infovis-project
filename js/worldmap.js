/**
 * Function to create an interactive world map to visualise a value (given by "key")
 * 
 * Based on an example by Micah Stubbs: http://bl.ocks.org/micahstubbs/8e15870eb432a21f0bc4d3d527b2d14f  
 * 
 * @Created Mar 1, 2019
 * @LastUpdate ...
 * @author Emma Broman & Ingela Rossing
 */

function worldMap(data){

    console.log("Create world map...");

    var key_score = "Happiness Score"; // OBS! TODO: Rename in file...
    var key_rank = "Happiness Rank"; // OBS! TODO: Rename in file...

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
            happynessPerCountry[d.Country] = +d[key_score]; 
            rankPerCountry[d.Country] = +d[key_rank]; 
        });
        mapData.features.forEach(function(d) { 
            d[key_score] = happynessPerCountry[d.properties.name] 
            d[key_rank] = rankPerCountry[d.properties.name] 
        });

        svg.append("g")
            .attr("class", "countries")
            .selectAll("path")
            .data(mapData.features)
            .enter().append("path")
            .attr("d", path)
            .style("fill", function(d) { 
                var fillColor = color(happynessPerCountry[d.properties.name]);
                if(!fillColor) fillColor = colorUndefined;
                return fillColor;
            })
            .style('stroke', 'white')
            .style('stroke-width', 1.0)
            .style("opacity",0.8)
            // tooltips
            .style("stroke","white")
            .style('stroke-width', 0.3)
            .on('mouseover',function(d){
                tip.show(d);

                d3.select(this)
                    .style("opacity", 1)
                    .style("stroke","white")
                    .style("stroke-width",3);
            })
            .on('mouseout', function(d){
                tip.hide(d);

                d3.select(this)
                    .style("opacity", 0.8)
                    .style("stroke","white")
                    .style("stroke-width",0.3);
            });

        svg.append("path")
            .datum(topojson.mesh(mapData.features, function(a, b) { return a.id !== b.id; }))
            .attr("class", "names")
            .attr("d", path);
    }

} // end of worldMap