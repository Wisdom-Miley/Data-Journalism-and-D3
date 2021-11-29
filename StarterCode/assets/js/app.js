var svgWidth = 700;
var svgHeight = 500;

// Create the chart's margins as an object
var chartMargin = {
  top: 50,
  right: 50,
  bottom: 50,
  left: 50
};

// create dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

// Append a group to the SVG area 
var chartGroup = svg.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

// Load data from data.csv
d3.csv("assets/data/data.csv").then(function(data) {

    
    console.log(data);

    //  Parse Data/Cast as numbers
    data.forEach(function(data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
    });

    // Create scale 
    var xLinearScale = d3.scaleLinear()
      .domain([8, d3.max(data, d => d.poverty + 2)])
      .range([0, chartWidth]);

    var yLinearScale = d3.scaleLinear()
      .domain([2, d3.max(data, d => d.healthcare + 2)])
      .range([chartHeight, 0]);

    // Create axis
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append Axes to the chart
    chartGroup.append("g")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Create Circles
    
    var circlesGroup = chartGroup.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d.poverty))
      .attr("cy", d => yLinearScale(d.healthcare))
      .attr("r", "10")
      .attr("fill", "#3240bd")
      .attr("opacity", ".5");

    // Add abbreviation labels to circles
    var circleLabels = chartGroup.selectAll(null).data(data).enter().append("text");
      
    circleLabels
        .attr("x", function(d) {
            return xLinearScale(d.poverty);
        })
        .attr("y", function(d) {
            return yLinearScale(d.healthcare);
        })
        .text(function(d) {
            return d.abbr;
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", "10px")
        .attr("text-anchor", "middle")
        .attr("fill", "white");

    // Create axis labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - chartMargin.left)
        .attr("x", 0 - (chartHeight - 130))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .attr("font-family", "sans-serif")
        .style('stroke', '#000')
        .text("Lacks Healthcare (%)");

  chartGroup.append("text")
        .attr("transform", `translate(${chartWidth - 325}, ${chartHeight + chartMargin.top - 10})`)
        .attr("class", "axisText")
        .attr("font-family", "sans-serif")
        .style('stroke', '#000')
        .text("In Poverty (%)");

    });