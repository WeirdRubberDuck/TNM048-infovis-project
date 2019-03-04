/**
 * Parallell coordinates d3 (v4) implementation
 * 
 * @Created Feb 27, 2019
 * @LastUpdate ...
 * @author Emma Broman & Ingela Rossing
 */

function pc(data, colorpalette, key){

    //Set width and height of the chart
    var div = '#pc-chart';
    var parentWidth = $(div).parent().width();
    var margin = { top: 60, right: 60, bottom: 20, left: 60 },
        width = parentWidth - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    //Set the axes scales, we pre-define the xScale but not yScale 
    //because we will fill it with each dimension(column) 
    var xScale = d3.scaleBand().range([0, width]);
    var yScale = {};
    var dragging = {};

    //For each line, foreground is the colored lines we see
    //background are the gray lines we see when we filter.
    //dimension are the y-axes (columns) 
    var line = d3.line(),
        foreground,
        background,
        dimensions;

    //Select the div and append our svg tag.
    var svg = d3.select(div).append("svg")
        .attr("width", width)
        .attr("height", height + margin.top + margin.bottom)
        .append("svg:g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //List of dimensions we want to exclude from the pc plot
    var excludedDims = ['Country', 'Region', 'Lower Confidence Interval','Upper Confidence Interval', 'Happiness.Rank', 'Happiness Rank','Standard Error','Whisker.high','Whisker.low'];
    //List of dimensions that should be possible to hide/expand, part of happiness report
    var happyDims = ['Economy (GDP per Capita)','Family','Health (Life Expectancy)','Freedom','Trust (Government Corruption)','Generosity','Dystopia Residual'];

    //Extract the list of dimensions and create a scale for each.
    //keys are the the axes names gathered from the dataset, we want to 
    //create as many axes as there are keys in the dataset 
    //Scale,domain and range for each axes. 
    xScale.domain(dimensions = d3.keys(data[0]).filter(function (d) {
        return !excludedDims.includes(d) && (yScale[d] = d3.scaleLinear()
            .domain(d3.extent(data, function (p) { return +p[d]; }))
            .range([height, 0])
        );
    }));

    //------------------------------------------------------------------------------------->

    // Add grey background lines for context.
    background = svg.append("g")
        .attr("class", "background")
        .selectAll("path")
        .data(data)
        .enter().append("path")
        .attr("d", path);

    // Add blue foreground lines for focus.
    foreground = svg.append("g")
        .attr("class", "foreground")
        .selectAll("path")
        .data(data)
        .enter().append("path")
        .attr("d", path)
        .style("stroke", function (d, i) { return colorpalette(d[key]); }); 

    // Define drag beavior
    var dragBehaviour = d3.drag();      

    // Add a group element for each dimension.
    var g = svg.selectAll(".dimension")
        .data(dimensions)
        .enter().append("g")
        .attr("class", "dimension")
        .attr("transform", function (d) { return "translate(" + xScale(d) + ")"; })
        .call(dragBehaviour
            .on("start", function(d) {
                d3.event.sourceEvent.stopPropagation();
                dragging[d] = xScale(d);
                background.attr("visibility", "hidden");
            })
            .on("drag", function(d) {
                dragging[d] = Math.min(width, Math.max(0, d3.event.x));
                foreground.attr("d", path);
                dimensions.sort(function(a, b) { return position(a) - position(b); });
                xScale.domain(dimensions);
                g.attr("transform", function(d) { return "translate(" + position(d) + ")"; })
            })
            .on("end", function(d) {
                delete dragging[d];
                transition(d3.select(this)).attr("transform", "translate(" + xScale(d) + ")");
                transition(foreground).attr("d", path);
                background
                    .attr("d", path)
                    .transition()
                    .delay(500)
                    .duration(0)
                    .attr("visibility", null);
            }));

    function position(d) {
        var v = dragging[d];
        return v == null ? xScale(d) : v;
    }
    
    function transition(g) {
        return g.transition().duration(500);
    }

    // Add an axis and title.
    g.append("g")
        .attr("class", "axis")
        .each(function (d) { d3.select(this).call(d3.axisLeft(yScale[d])); })
        .append("text")
        .attr("text-anchor", "middle")  
        .attr("y", -15)
        .attr("transform", "rotate(-15)")
        .style('fill', 'black')
        .text(String);

    // Add and store a brush for each axis.
    g.append("g")
        .attr("class", "brush")
        .each(function (d) {
            d3.select(this).call(d.brush = d3.brushY()
                .extent([[-10, 0], [10, height]])
                .on("start", brushstart)
                .on("brush", brush)
                .on("end", brush)
            );
        })
        .selectAll("rect")
        .attr("x", -8)
        .attr("width", 10);

    //------------------------------------------------------------------------------------->

    // Returns the path for a given data point.
    function path(d) {
        return line(dimensions.map(function (p) { return [xScale(p), yScale[p](d[p])]; }));
    }//end of path

    //------------------------------------------------------------------------------------->
    function brushstart() {
        d3.event.sourceEvent.stopPropagation();
    }

    // Handles a brush event, toggling the display of foreground lines.
    function brush() {
        var actives = [];
        svg.selectAll(".dimension .brush")
            .filter(function (d) {
                yScale[d].brushSelectionValue = d3.brushSelection(this);
                return  d3.brushSelection(this)
            })
            .each(function (d) {
                actives.push({
                    dim: d,
                    extent: d3.brushSelection(this).map(yScale[d].invert)
                });
            });
        foreground.style("display", function (d) {
            return actives.every(function (active) {
                var dim = active.dim;
                var ext = active.extent;
                return ext[1] <= d[dim] && d[dim] <= ext[0];
            }) ? null : "none";
        });
    }//end of brush
    //------------------------------------------------------------------------------------->

} // end of pc