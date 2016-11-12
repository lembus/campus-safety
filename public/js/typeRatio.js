
function TypeChart() {
    var self = this;
    self.init();
};

/**
 * Initializes the svg elements required for this chart
 */
TypeChart.prototype.init = function(){
    var self = this;
    self.margin = {top: 100, right: 20, bottom: 20, left: 100};
    var ratioChart = d3.select("#rect-chart");

	var width = 0.80 * window.innerWidth;
    var height = 0.80 * window.innerWidth;

    var ratioChart = d3.select("#rect-chart")
        .style('width', width + 'px')
        .style('height',height +'px');
		
    //Gets access to the div element created for this chart from HTML
    self.svgBounds = ratioChart.node().getBoundingClientRect();
    self.svgWidth = self.svgBounds.width - self.margin.left - self.margin.right;
    self.svgHeight = self.svgBounds.height - self.margin.top - self.margin.bottom;

    //creates svg element within the div
    self.svg = ratioChart.append("svg")
        .attr("width",self.svgWidth)
        .attr("height",self.svgHeight)
		.attr('style',"border: 3px solid black; display: block; margin: auto;")
};

TypeChart.prototype.update = function(state,year){
    var self = this;
	  
	var svg = d3.select("#rect-chart").select('svg');
	
	d3.csv("data/" + state + "/crime_types.csv", function (error, crimes) {
		
		var ratioChartScale = d3.scaleLinear()
			.domain([0, 1])
			.range([100,  self.svgWidth - 50]);
		/*
		crimes = crimes.filter(function(d) { 
			return parseInt(d['Survey year']) == year
		});
		*/
		crimes = crimes.sort(function (a,b) {return d3.ascending(a['Unitid'], b['Unitid'])})
		
		//total number of crimes
		combinedYears = []
		aggVals = ['CO','DA','VW','HC','total']
		var i = 0;
		while(i<crimes.length){
			record = crimes[i];
			aggVals.forEach(function(e){
				record[e] = parseInt(record[e]);
			});
			id = record['Unitid']
			i += 1
			while (i<crimes.length && crimes[i]['Unitid'] == id){
				newRecord = crimes[i];
				aggVals.forEach(function(e){
					record[e] += parseInt(newRecord[e]);
				});
				i += 1;
			}
			combinedYears.push(record);
		}
		combinedYears = combinedYears.filter(function(d){
			return d['total'] > 0;
		});
		
		var maxUniSize = d3.max(combinedYears,function(e){
			return parseFloat(e['Institution Size']);
		});
		
		//total crimes by year
		/*
		crimes = crimes.filter(function(d) { 
			return parseInt(d['Survey year']) == year
		});
		
		var maxUniSize = d3.max(crimes,function(e){
			return parseFloat(e['Institution Size']);
		});
		*/
		
		var ratioChart = svg.selectAll('circle')
			.data(combinedYears)
			
		ratioChart.exit().remove();
		
		console.log(combinedYears)
		
		ratioChart.enter()
			.append('circle')
			.attr('r', function(d){
				return (parseFloat(d['Institution Size'])/maxUniSize)*10
			})
			.attr('cx', function (d) {
				return ratioChartScale((parseFloat(d['DA']) + parseFloat(d['HC']))/(parseFloat(d['CO'])+parseFloat(d['VW'])+parseFloat(d['HC'])+parseFloat(d['DA'])))
			})
			.attr('cy', function(d){
				return ratioChartScale((parseFloat(d['DA']) + parseFloat(d['VW']))/(parseFloat(d['CO'])+parseFloat(d['VW'])+parseFloat(d['HC'])+parseFloat(d['DA'])))
			});
	});

};
