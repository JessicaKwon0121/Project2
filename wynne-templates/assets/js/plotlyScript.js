
var updateState;
var updateYear;


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

    // Create Line Chart
    let lineTrace = {
        x: year,
        y: gdp,
        type: 'scatter'
    };

    var lineData = [lineTrace];
    var config = {responsive: true}
    Plotly.newPlot('time-series-chart', lineData, config);

    // buildStateRank(avgRank);
    // buildCountiesPlots(state, year);
    // buildCountyRank(kpiRank);
}



// counties plot
async function buildCountiesPlots(state, year) {

    const url = '/counties/' + state + '/' + year;
    console.log(url);
    let data = await d3.json(url);
    console.log(data)

    // dataLatest = data.filter(d => d.year === 2019);

    // Get bar chart plot parameters.

    // var gdp = dataLatest.map(d => d.gdp).slice(0, 20);
    var gdp = data.map(d => d.gdp);
    // var counties = dataLatest.map(d => d.counties).slice(0, 20);
    var counties = data.map(d => d.counties);

    var barTrace = {
    x: counties,
    y: gdp,
    type: 'bar',
    // text: ['4.17 below the mean', '4.17 below the mean', '0.17 below the mean', '0.17 below the mean', '0.83 above the mean', '7.83 above the mean'],
    marker: {
        color: 'rgb(142,124,195)'
    }
    };

    var barData = [barTrace];

    var layout = {
    title: 'Counties GDP',
    font:{
        family: 'Raleway, sans-serif'
    },
    showlegend: false,
    xaxis: {
        tickangle: -90
    },
    yaxis: {
        zeroline: false,
        gridwidth: 2
    },
    bargap :0.05
    };

    var config = {responsive: true};

    Plotly.newPlot('bar-chart', barData, layout, config);


}


function init() {
    let dropdown = d3.select("#selDataset"); // states
    let yearDropdown = d3.select("#selYear"); // year

    d3.json("/state").then((stateNames) => {
        d3.json("/year").then((gdpYears) => {

            stateNames.forEach((value) => {
                dropdown.append("option").text(value).property("value");
            });

            // Initialize bar chart, bubble map and top county plots
            gdpYears.forEach((value) => {
                yearDropdown.append("option").text(value).property("value");
            });

                     // For Line Chart
            const firstState = stateNames[0];
            buildLinePlot(firstState);
            updateState = firstState;
            // buildStateRank(firstState);
            


            const firstYear = gdpYears[0];
            buildCountiesPlots(firstState, firstYear);
            updateYear = firstYear;
            // buildCountyRank(firstState); 

            




        })



    })
    

   
}






function optionChangedState(newState) {

    updateState = newState;
    buildLinePlot(newState);
            // buildStateRank(firstState);
            


            
    // const firstYear = gdpYears[0];
    buildCountiesPlots(updateState, updateYear);
            // buildCountyRank(firstState); 
    
   
}

function optionChangedYear(newYear) {
    updateYear = newYear;

    // const firstYear = gdpYears[0];
    buildCountiesPlots(updateState, updateYear);
            // buildCountyRank(firstState); 

}

init();



   