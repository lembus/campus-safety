
function TypeChart(catSunburst) {
    var self = this;
	self.catSunburst = catSunburst;
    self.init();
};

/**
 * Initializes the svg elements required for this chart
 */
TypeChart.prototype.init = function(){
    var self = this;
    self.margin = {top: 20, right: 20, bottom: 20, left: 20};
    var ratioChart = d3.select("#rect-chart");
	$("#uni-svg").remove();

    var height = 0.55 * window.outerWidth;

    var ratioChart = d3.select("#rect-chart")
        .classed("leftChart",true)
        .style('height',height +'px');
		
    //Gets access to the div element created for this chart from HTML
    self.svgBounds = ratioChart.node().getBoundingClientRect();
    self.svgWidth = self.svgBounds.width - self.margin.left - self.margin.right;
    self.svgHeight = self.svgBounds.height - self.margin.top - self.margin.bottom;


	if (ratioChart.select('#title').empty()) {
		ratioChart.append('svg')
			.attr('width', self.svgBounds.width)
			.attr('height', 30)
			.attr('id', 'title');
	}
    //creates svg element within the div
    self.svg = ratioChart.append("svg")
        .attr("width",self.svgWidth)
        .attr("height",self.svgHeight)
		.attr('style',"border: 3px solid black; display: block; margin: auto;")
		.attr('id','uni-svg');
	self.selectedUni = '';
};

TypeChart.prototype.update = function(state,year,colorScale){
	$("#uni-table").remove();
    var self = this;
	self.catSunburst.update(state,year,self.selectedUni)

	if(state=='') {
		d3.select("#title").select('text').remove();
		return;
	}
	if (d3.select('#title').select('text').empty()) {
		d3.select('#title').append('text')
	}
	d3.select("#title").select('text')
		.attr("x", (self.svgBounds.width / 2))
		.attr("y", self.margin.bottom)
		.attr("text-anchor", "middle")
		.style("font-size", "16px")
		.attr("font-weight",'bold')
		.text(state + " Universities Crime Records");

	var svg = d3.select("#rect-chart").select('#uni-svg');
	
	var ratioChartScale = d3.scaleLinear()
		.domain([0, 1])
		.range([100,  self.svgWidth - 50]);
		
	typeNames = [
		{'name': 'Disciplinary Actions', 'x': 0.93, 'y': 1.05},
		{'name': 'Hate Crimes', 'x': 0.93, 'y': -0.07},
		{'name': 'VAWA Offenses', 'x':-0.07, 'y': 1.05},
		{'name': 'Criminal offenses', 'x':-0.07, 'y':-0.07}
	]
	texts = svg.selectAll('text')
		.data(typeNames)
		.enter()
		.append('text')
        .text(function (d) {return d.name})
        .attr('x', function (d) {return ratioChartScale(d.x)})
        .attr('y', function (d) {return ratioChartScale(d.y)})
        .attr('class', 'typetext');
	
	
	d3.csv("data/" + state + "/crime_types.csv", function (error, crimes) {
		
		var ratioChartScale = d3.scaleLinear()
			.domain([0, 1])
			.range([100,  self.svgWidth - 50]);

		crimes = crimes.sort(function (a,b) {return d3.ascending(a['Unitid'], b['Unitid'])})
		
		///////////////////////////////////combine years
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
		
		/////////////////////////////////selected by year
		combinedYears = crimes.filter(function(d) { 
			return parseInt(d['Survey year']) == year
		});

		
		var maxUniSize = d3.max(combinedYears,function(e){
			return parseFloat(e['Institution Size']);
		});
		
		var maxCrime = d3.max(combinedYears,function(e){
			return parseFloat(e['total']);
		});
		
		
		maxRatio = d3.max(combinedYears,function(d){
			return d.total/d['Institution Size'];
		})
		
		var colorScale = d3.scaleLinear()
			.domain([0,maxCrime])
			.range(["white", "darkred"]);
		
		//total crimes by year
		/*
		crimes = crimes.filter(function(d) { 
			return parseInt(d['Survey year']) == year
		});
		
		var maxUniSize = d3.max(crimes,function(e){
			return parseFloat(e['Institution Size']);
		});
		*/
		var brush = d3.brush()
			.extent([[self.margin.left,self.margin.top],[self.svgWidth, self.svgHeight]])
			.on("end", brushed);

		svg.append("g")
			.attr("class", "brush")
			.call(brush);
		
		var ratioChart = svg.selectAll('circle')
			.data(combinedYears)
			
		ratioChart.exit().remove();
		
		
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
			})
			.attr('id',function(d){
				return d['Institution name'];
			})
			.attr('fill',function(d){
				console.log(colorScale(d.total))
				colorScale(d.total)
			})
			.attr('class','uniCircle')
			.style('opacity',0.8)
			.attr('onmouseover',function(d){
				return 'unitip(event,"' + d['Institution name'] + '")';
			})
			.attr('onmouseout','nunitip()')
			.on('click', function(d) {
				self.selectedUni = d['Institution name'];
				self.catSunburst.update(state,year,d['Institution name'])
			});

		

		
		function brushed(){
			var interval = d3.event.selection;
			var x1 = interval[0]
			var x2 = interval[1]
			
			selected = combinedYears.filter(function(d){
				dx = ratioChartScale((parseFloat(d['DA']) + parseFloat(d['HC']))/(parseFloat(d['CO'])+parseFloat(d['VW'])+parseFloat(d['HC'])+parseFloat(d['DA'])))
				dy = ratioChartScale((parseFloat(d['DA']) + parseFloat(d['VW']))/(parseFloat(d['CO'])+parseFloat(d['VW'])+parseFloat(d['HC'])+parseFloat(d['DA'])))
				return ((x1[0] <= dx && dx <= x2[0])&&(x1[1] <= dy && dy <= x2[1]))
			});
			var compareChart = new CompareChart();
            compareChart.update(selected);
		}
		
	});
	

};

function unitip(e,name){
	var childcircle = document.getElementById("uni-svg").children;
	var left  = (parseInt(e.clientX) + 10).toString()  + "px";
    var top  = (parseInt(e.clientY) - 20).toString()  + "px";
    var div = document.getElementById("tooltipdiv");
	div.innerHTML = name;
    div.style.left = left;
    div.style.top = top;
	div.style.color = "Green";
	$("#tooltipdiv").toggle();
}
function nunitip(){
	$("#tooltipdiv").toggle();
}
