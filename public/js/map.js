/**
 * Constructor for the Year Chart
 *
 * @param lineChart instance of LineChart
 * @param rectChart instance of RectChart
 */
//function YearChart(lineChart, rectChart) {
function MapChart() {
    var self = this;

//    self.lineChart = lineChart;
//    self.rectChart = rectChart;
    self.init();
};

/**
 * Initializes the svg elements required for this chart
 */
MapChart.prototype.init = function(){

    var self = this;
    self.margin = {top: 10, right: 20, bottom: 30, left: 50};

    var width = 0.50 * window.innerWidth;
    var height = 0.80 * window.innerHeight;

    var divmapChart = d3.select("#map")
        .style('width', width + 'px')
        .style('height',height +'px');

    //Gets access to the div element created for this chart from HTML
    self.svgBounds = divmapChart.node().getBoundingClientRect();
    self.svgWidth = self.svgBounds.width - self.margin.left - self.margin.right;
    self.svgHeight = self.svgBounds.height - self.margin.top - self.margin.bottom;

    //creates svg element within the div
    self.svg = divmapChart.append("svg")
        .attr("width",self.svgWidth)
        .attr("height",self.svgHeight)

};


/**
 * Creates a map with color saturation representing the crime ratio in each state
 */
var stateAbrev = 	["UT","CA"];
var thisYearData = [];

MapChart.prototype.update = function(year){
    var self = this;

/*    var stateAbrev = 	["HI", "AK", "FL", "SC", "GA", "AL", "NC", "TN", "RI", "CT", "MA",
        "ME", "NH", "VT", "NY", "NJ", "PA", "DE", "MD", "WV", "KY", "OH",
        "MI", "WY", "MT", "ID", "WA", "DC", "TX", "CA", "AZ", "NV", "UT",
        "CO", "NM", "OR", "ND", "SD", "NE", "IA", "MS", "IN", "IL", "MN",
        "WI", "MO", "AR", "OK", "KS", "LS", "VA"];
*/

    for (a=0; a<stateAbrev.length ;a++) {
        console.log('in for')
        console.log(stateAbrev[a])
        d3.csv("data/"+stateAbrev[a]+"/crime_types.csv", function (error, stateData) {
            function filterByYear(obj) {
                console.log('in csv function')
                console.log(stateAbrev[a])
                return (obj['Survey year'] == year );
            }
            var thisYearStateData=stateData.filter(filterByYear);

            var totalCO = 0;
            var totalDA = 0;
            var totalHC = 0;
            var totalVW = 0;
            var totalSize = 0;
            var totalAll = 0;
            for ( var j = 0; j < thisYearStateData.length; j++ ) {
                totalCO += +thisYearStateData[j].CO;
                totalDA += +thisYearStateData[j].DA;
                totalHC += +thisYearStateData[j].HC;
                totalVW += +thisYearStateData[j].VW;
                totalAll += +thisYearStateData[j].total;
                totalSize += +thisYearStateData[j]['Institution Size'];
            }
            console.log('last')
            console.log(stateAbrev[a])
            thisYearData.push({'state': stateAbrev[a], 'size':totalSize, 'CO':totalCO, 'DA':totalDA, 'HC':totalHC, 'VW':totalVW, 'total':totalAll});
        });
    }
    console.log(thisYearData);
    //Domain definition for global color scale
    var domain = [-60,-50,-40,-30,-20,-10,0,10,20,30,40,50,60 ];

    //Color range for global color scale
    var range = ["#0066CC", "#0080FF", "#3399FF", "#66B2FF", "#99ccff", "#CCE5FF", "#ffcccc", "#ff9999", "#ff6666", "#ff3333", "#FF0000", "#CC0000"];

    //Global colorScale to be used consistently by all the charts
    self.colorScale = d3.scaleQuantile()
        .domain(domain).range(range);

};
