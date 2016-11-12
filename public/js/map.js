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
}

/**
 * Initializes the svg elements required for this chart
 */
MapChart.prototype.init = function(){

    var self = this;
    self.margin = {top: 10, right: 20, bottom: 30, left: 50};

    var width = 0.50 * window.innerWidth;
    var height = 0.80 * window.innerHeight;

    var divmapChart = d3.select("#map-div")
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

    self.svg.append('g')
        .attr("id",'map');

};


/**
 * Renders the HTML content for tool tip
 *
 * @param state State abreviation to be populated in the tool tip
 * @param totalSize Number of student in each state to be populated in the tool tip
 * @param totalCrime Number of total crimes in each state to be populated in the tool tip
 * @return text HTML content for toop tip
 */
MapChart.prototype.tooltip_render = function (state,totalSize,totalCrime) {
    var self = this;
    return "<h4>"+state+"</h4><table>"+
        "<tr><td># of Students</td><td>"+totalSize+"</td></tr>"+
        "<tr><td># of crimes</td><td>"+totalCrime+"</td></tr>"+
        "</table>";
};

/**
 * Creates a map with color saturation representing the crime ratio in each state
 */
MapChart.prototype.update = function(year) {
    var self = this;

    var stateAbrev = 	["HI", "AK", "FL", "SC", "GA", "AL", "NC", "TN", "RI", "CT", "MA",
     "ME", "NH", "VT", "NY", "NJ", "PA", "DE", "MD", "WV", "KY", "OH",
     "MI", "WY", "MT", "ID", "WA", "DC", "TX", "CA", "AZ", "NV", "UT",
     "CO", "NM", "OR", "ND", "SD", "NE", "IA", "MS", "IN", "IL", "MN",
     "WI", "MO", "AR", "OK", "KS", "LS", "VA"];


    d3.csv("data/cumulativeData.csv", function (error, cumulativeData) {
        var max = d3.max(cumulativeData, function (d) {
            return d.totalRate
        });

        var colorScale = d3.scaleLinear()
            .domain([0, max])
            .range(["white", "darkred"]);

        var projection = d3.geoAlbersUsa()
            .translate([self.svgWidth / 2, self.svgHeight / 2])    // translate to center of screen
            .scale([500]);          // scale things down so see entire US

        //Use this tool tip element to handle any hover over the chart
        tip = d3.tip().attr('class', 'd3-tip')
            .direction('se')
            .offset(function() {
                return [0,0];
            })
            .html(function(d) {
                function findState(yearData) {
                    return yearData.state == d.id;
                }
                var state=thisYearData.find(findState);
                var htmlContent = self.tooltip_render(d.id,state.size,state.total);
                return htmlContent;
            });

        var path = d3.geoPath()
            .projection(projection);

        function filterByYear(obj) {
            return (obj['year'] == year );
        }

        var thisYearData = cumulativeData.filter(filterByYear);

        d3.json("data/us-states.json", function (error, usMap) {
            if (error) throw error;
            var map = d3.select("#map")
                .selectAll("path")
                .data(usMap.features)
                .enter()
                .append("path")
                .attr("d", path)
                .attr('fill', function (d) {
                    function findState(yearData) {
                        return yearData.state == d.id;
                    }
                    var state=thisYearData.find(findState);
                    return (colorScale(state.totalRate));

                })
                .attr("id", function (d) {
                    return d.id;
                });

            map.call(tip);
            map.on("mouseover", tip.show)
                .on("mouseout",tip.hide);

        });

    });
    

};
