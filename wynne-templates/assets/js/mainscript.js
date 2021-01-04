// function to create time series of states gdp
async function buildLinePlot(state) {
    const url = '/states/' + state;
    let data = await d3.json(url);

    // gdp
    let gdp = data.map(d => d.gdp);
    console.log(gdp);
    // years
    let year = data.map(d => d.year);
    console.log(year);
    // rank
    let rank = data.map(d => d.rank);
    console.log(rank);

    // Average National Rank
    let average = (array) => array.reduce((a, b) => a + b) / array.length;
    
    var avgRank = Math.round(average(rank))
    console.log(avgRank);
    var dateParser = d3.timeParse("%Y");
    // Create Line Chart
    let lineTrace = {
        x: dateParser(year),
        y: gdp,
        type: 'scatter'
    };

    var lineData = [lineTrace];
    var config = {responsive: true}
    Plotly.newPlot('line-plot', lineData, config);

    // buildStateRank(avgRank);
    // buildCountiesPlots(state, year);
    // buildCountyRank(kpiRank);
}

function init() {
    let dropdown = d3.select("#selDataset");
    

    d3.json("/state").then((stateNames) => {
        
        // Initialize bar chart, bubble map and top county plots
        stateNames.forEach((value) => {
            dropdown.append("option").text(value).property("value");
        });

                // For Line Chart
        const firstState = stateNames[0];
        buildLinePlot(firstState);
        //buildStateRank(firstState);
        // buildCountiesPlots(firstState);
        // buildCountyRank(firstState);

               
    })
   
    //buildCountyRank(firstState);

}

// Year dropdown
function optionChanged(newState) {
    
    buildLinePlot(newState);
    // buildStateRank(newState);
    // buildCountiesPlots(newState);
    // buildCountyRank(newState);  
}

init();