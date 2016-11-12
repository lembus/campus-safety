/*
 * Root file that handles instances of all the charts and loads the visualization
 */
(function(){
    var instance = null;

    /**
     * Creates instances for every chart (classes created to handle each chart;
     * the classes are defined in the respective javascript files.
     */
    function init() {
        //Creating instances for each visualization

/*
        var lineChart = new LineChart();

        var rectChart = new RectChart();

        var donutChart = new DonutChart(shiftChart);
*/

        var years = [2001];
        for (i=1;i<14;i++) {
            years.push(2001+i);
        }
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

        var year = 2001;
        //Creating the map
        //var mapChart = new MapChart(lineChart, rectChart);
        var mapChart = new MapChart();
        mapChart.update(year);

        d3.select("#yearSlider").on("input", function() {
            mapChart.update(+this.value);
        });


		var typeChart = new TypeChart();
		typeChart.update('CA',2010)
    }

    /**
     *
     * @constructor
     */
    function Main(){
        if(instance  !== null){
            throw new Error("Cannot instantiate more than one Class");
        }
    }

    /**
     *
     * @returns {Main singleton class |*}
     */
    Main.getInstance = function(){
        var self = this
        if(self.instance == null){
            self.instance = new Main();

            //called only once when the class is initialized
            init();
        }
        return instance;
    }

    Main.getInstance();
})();