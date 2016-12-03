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

        var catSunburst = new CatSunburst();

        var typeChart = new TypeChart(catSunburst);

        var crimeChart = new CrimeChart();

        //Creating the map
        //var mapChart = new MapChart(lineChart, rectChart);
        var mapChart = new MapChart(typeChart,catSunburst);


		//typeChart.update('CA',2010)
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