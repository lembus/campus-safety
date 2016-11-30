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

    var height = 0.4 * window.outerHeight;

    var divmapChart = d3.select("#mapArea").classed("leftChart",true)
        .style('height',height +'px');

    //Gets access to the div element created for this chart from HTML
    self.svgBounds = divmapChart.node().getBoundingClientRect();
    self.svgWidth = self.svgBounds.width - self.margin.left - self.margin.right;
    self.svgHeight = self.svgBounds.height - self.margin.top - self.margin.bottom;

    //creates svg element within the div
    self.svg = divmapChart.select("svg")
        .attr("width",self.svgWidth*0.79)
        .attr("height",self.svgHeight);

    self.svg.append('g')
        .attr("id",'map');

    divmapChart.append('svg')
        .attr('id','colormap')
        .attr("width",self.svgWidth*0.19)
        .attr("height",self.svgHeight);

    var defs = divmapChart.select('#colormap').append("defs");

    var gradient = defs.append("linearGradient")
        .attr("id", "gradient")
        .attr("x1", "50%")
        .attr("x2", "50%")
        .attr("y1", "100%")
        .attr("y2", "0%");

    gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "white");

    gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "darkred");

    divmapChart.select("#colormap").append('rect')
        .attr("x", '30%')
        .attr("y", '10%')
        .attr("width", '20%')
        .attr("height", '80%')
        .attr('stroke','black')
        .attr('stroke-width',1)
        .attr("fill", "url(#gradient)");

    self.drawMap();

    var years = [2001];
    for (i=1;i<14;i++) {
        years.push(2001+i);
    }
    var sliderDivt = d3.select("#slider").classed("leftChart",true);
    var sliderAxis = d3.select('#slider').select('svg');
    var maxTick = 98.2;
    var sliderTicks = sliderAxis.selectAll('rect')
        .data(years)
        .enter().append('rect')
        .attr('x',function(d,i) {
            return maxTick*i/(years.length-1)+"%";
        })
        .attr('y',0)
        .attr('width',1)
        .attr('height',7);
    var maxTick = 98.2;
    var sliderTicks = sliderAxis.selectAll('text')
        .data(years)
        .enter().append('text')
        .text(function (d) {
            return d;
        })
        .attr('x',function(d,i) {
            return maxTick*i/(years.length-1)+"%";
        })
        .attr('y',20)
        .attr('text-anchor','middle');

    //Creating the map
    //var mapChart = new MapChart(lineChart, rectChart);
    self.update(2001);
    d3.select("#yearSlider").on("input", function() {
        self.update(+this.value);
    });
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

        var colormapSvg = d3.select('#colormap');

        var colormapScale = d3.scaleLinear()
            .domain([0, max])
            .range([colormapSvg.attr('height') * 0.8, 0])
            .nice();

        var colormapAxis = d3.axisRight().scale(colormapScale);
        colormapSvg.append('g')
            .attr("transform", "translate(" + colormapSvg.attr('width')*0.5 + "," + colormapSvg.attr('height')*0.099 + ")")
            .call(colormapAxis);

        colormapSvg.append("g").append('text')
            .attr("text-anchor", "middle")
            .attr('transform','rotate(-90,' + colormapSvg.attr('width')*0.9 + ',' + colormapSvg.attr('height')*0.5 + ')')
            .attr("y", colormapSvg.attr('height')*0.5)
            .attr("x", colormapSvg.attr('width')*0.9)
            .attr('stroke','black')
            .style('font-size','12')
            .style('stroke-width', '0.1px')
            .text("#Crimes/#Students");

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
                crimeChart.update(d.id);
            }
        });


    });


};
