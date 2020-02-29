var svgWidth = 1000;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 20,
  bottom: 50,
  left: 50
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

  var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

  d3.csv("./assets/data/data.csv").then(function(stateData) {
    console.log(stateData);
    stateData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
    });

    var  xPovertyScale = d3.scaleLinear()
        .domain(d3.extent(stateData, d => d.poverty))
        .range([0, width])
    
    var yHCScale = d3.scaleLinear()
        .domain(d3.extent(stateData, d => d.healthcare))
        .range([height, 0])

    var bottomAxis = d3.axisBottom(xPovertyScale)
    var leftAxis = d3.axisLeft(yHCScale)

    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g").call(leftAxis);

    var line1 = d3.line()
        .x(d => xPovertyScale(d.poverty))
        .y(d => yHCScale(d.healthcare))

    var circlesGroup = chartGroup.selectAll(".stateCircle")
        .data(stateData)
        .enter()
        .append("circle")
        .attr("class", ".stateCircle")
        .attr("cx", d => xPovertyScale(d.poverty))
        .attr("cy", d => yHCScale(d.healthcare))
        .attr("r", "8")
        .attr("fill", "blue")
        .attr("opacity", "0.75")

    var textGroup = chartGroup.selectAll(".stateText")
        .data(stateData)
        .enter()
        .append("text")
        .attr("class", ".stateText")
        .attr("x", d => xPovertyScale(d.poverty) -4)
        .attr("y", d => yHCScale(d.healthcare) +2)
        .text(d => d.abbr)
        .attr("fill", "white")
        .attr("font-size", "7")
        .attr("text-anchor", "start")

        chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height - 100))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Lacks Health Insurance(%)");

        chartGroup.append("text")
        .attr("transform", `translate(${width - 310}, ${height + margin.top + 20})`)
        .attr("class", "axisText")
        .text("In Poverty(%)");

  });



