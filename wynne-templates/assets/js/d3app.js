/// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 100},
width = 600 - margin.left - margin.right,
height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#time-series-chart")
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

// Configure a parseTime function which will return a new Date object from a string
var parseTime = d3.timeParse("%Y");

// create function to scale gdp
function scaleGDP(x) {
return x/1000000000;
}
console.log(scaleGDP(1800000000));
//Read the data
// Load data from Flask App
d3.json("/states").then(function(stateGDPdata) {

var statesData = stateGDPdata.result;

// Format the date and cast the gdp value to a number
Object.values(statesData).forEach(function(data) {

// data.year = parseTime(data.year);
data.gdp = scaleGDP(+data.gdp);
data.rank = +data.rank;
});

// Print the statesData
console.log(statesData);

// Capture states and append to dropdowm
var fullStatesGroup = [];

Object.values(statesData).forEach((value) => {


fullStatesGroup.push(value.state);
});


console.log(fullStatesGroup);

// Get unique values
var statesGroup = fullStatesGroup.filter((x, i, a) => a.indexOf(x) == i);
console.log(statesGroup);

// List of groups (here I have one group per column)
// var allGroup = d3.map(data, function(d){return(d.name)}).keys()

// add the options to the button
d3.select("#selDataset")
  .selectAll('myOptions')
   .data(statesGroup)
  .enter()
  .append('option')
  .text(function (d) { return d; }) // text showed in the menu
  .attr("value", function (d) { return d; }) // corresponding value returned by the button

// A color scale: one color for each group
var myColor = d3.scaleOrdinal()
  .domain(statesGroup)
  .range(d3.schemeSet2);

// Add X axis --> it is a date format
var x = d3.scaleLinear()
  .domain(d3.extent(statesData, function(d) { return d.year; }))
  .range([ 0, width ]);
svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x).ticks(5));

// Add Y axis
var y = d3.scaleLinear()
  .domain(d3.extent(statesData, function(d) { return +d.gdp; }))
  .range([ height, 0 ]);
svg.append("g")
  .call(d3.axisLeft(y));

// Initialize line with first group of the list
var line = svg
  .append('g')
  .append("path")
    .datum(statesData.filter(function(d){return d.name==statesGroup[0]}))
    .attr("d", d3.line()
      .x(function(d) { return x(d.year) })
      .y(function(d) { return y(+d.gdp) })
    )
    .attr("stroke", function(d){ return myColor("AK") })
    .style("stroke-width", 4)
    .style("fill", "none")

// A function that update the chart
function update(selectedGroup) {

  // Create new data with the selection?
  var dataFilter = statesData.filter(function(d){return d.state==selectedGroup})

  // Give these new data to update line
  line
      .datum(dataFilter)
      .transition()
      .duration(1000)
      .attr("d", d3.line()
        .x(function(d) { return x(d.year) })
        .y(function(d) { return y(+d.gdp) })
      )
      .attr("stroke", function(d){ return myColor(selectedGroup) })
}

// When the button is changed, run the updateChart function
d3.select("#selDataset").on("change", function(d) {
    // recover the option that has been chosen
    var selectedOption = d3.select(this).property("value")
    // run the updateChart function with this selected option
    update(selectedOption)
})

})




    



















// var caliData = getStateData(CA);
function init() {
let dropdown = d3.select("#selDataset");
//let yearDropdown = d3.select("#selYear");

d3.json("/state").then((stateNames) => {
    
    // Initialize bar chart, bubble map and top county plots
    stateNames.forEach((value) => {
        dropdown.append("option").text(value).property("value");
    });

            // For Line Chart
    const firstState = stateNames[0];
    getStateData(firstState)
    

    
})
}


function chartInit() {
let dropdown = d3.select("#selYear");

d3.json("/year").then((gdpYears) => {
    
    // Initialize bar chart, bubble map and top county plots
    gdpYears.forEach((value) => {
        dropdown.append("option").text(value).property("value");
    });

    updateData(data)

            // For Line Chart
    // const firstState = stateNames[0];
    // getStateData(firstState)
    

    
})

}



function optionChanged(data) {
updateData(data);


//buildCountyRank(newState, newYear);  
}
init();
chartInit();