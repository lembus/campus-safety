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
    self.margin = {top: 0, right: 0, bottom: 0, left: 0};

    var width = 0.50 * window.innerWidth;
    var height = 0.50 * window.innerHeight;

    var divmapChart = d3.select("#map-div")
        .style('width', width + 'px')
        .style('height',height +'px');

    //Gets access to the div element created for this chart from HTML
    self.svgBounds = divmapChart.node().getBoundingClientRect();
    self.svgWidth = self.svgBounds.width - self.margin.left - self.margin.right;
    self.svgHeight = self.svgBounds.height - self.margin.top - self.margin.bottom;

    //creates svg element within the div
    self.svg = divmapChart.select("svg")
        .attr("width",self.svgWidth)
        .attr("height",self.svgHeight)

    self.svg.append('g')
        .attr("id",'map');
    self.drawMap();

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

MapChart.prototype.drawMap = function() {
    var self = this;
    var projection = d3.geoAlbersUsa()
        .translate([self.svgWidth / 2, self.svgHeight / 2])    // translate to center of screen
        .scale([500]);          // scale things down so see entire US

    var path = d3.geoPath()
        .projection(projection);
    d3.json("data/us-states.json", function (error, usMap) {
        if (error) throw error;
        var map = d3.select("#map")
            .selectAll("path")
            .data(usMap.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("id", function (d) {
                return d.id;
            });
    });

};
/**
 * Creates a map with color saturation representing the crime ratio in each state
 */
MapChart.prototype.update = function(year) {
    var self = this;
    
    d3.csv("data/cumulativeData.csv", function (error, cumulativeData) {
        var max = d3.max(cumulativeData, function (d) {
            return d.totalRate
        });

        var colorScale = d3.scaleLinear()
            .domain([0, max])
            .range(["white", "darkred"]);

        //Use this tool tip element to handle any hover over the chart
        var tip = d3.tip().attr('class', 'd3-tip')
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

        function filterByYear(obj) {
            return (obj['year'] == year );
        }

        var thisYearData = cumulativeData.filter(filterByYear);

        var map = d3.select("#map")
            .selectAll("path")
            .attr('fill', function (d) {
                function findState(yearData) {
                    return yearData.state == d.id;
                }
                var state=thisYearData.find(findState);
                return (colorScale(state.totalRate));

            });

        map.call(tip);
        map.on("mouseover", function (d) {
            tip.show(d);
            d3.select(this)
                .classed("highlighted",true);
        })
            .on("mouseout",function(d){
                tip.hide(d);
                d3.select(this)
                    .classed("highlighted",false);
            });


        map.on('click', function (d) {
            if (d3.select(this).classed("selected")) {
                d3.select(this)
                    .classed("selected",false);
                //updateCharts();
                //clearRectChart();
            } else {
                map.classed("selected",false);
                d3.select(this)
                    .classed("selected",true);
                //updateCharts(d.id);
                //rectChart(d.id);
				var typeChart = new TypeChart();
				typeChart.update(d.id)

                var crimeChart = new CrimeChart();
            }
        });


    });


};
