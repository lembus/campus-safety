/**
 * Constructor for the line charts
 *
 */
//function YearChart(lineChart, rectChart) {
function LineCharts() {
    var self = this;

    self.init();
}

/**
 * Initializes the svg elements required for this chart;
 */
LineCharts.prototype.init = function(){
    var self = this;
    self.divShiftChart = d3.select("#lineCharts").classed("rightChart", true);
};