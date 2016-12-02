var cellWidth = 80,
    cellHeight = 20,
    cellBuffer = 15,
    barHeight = 20;

var sizeColorScale = d3.scaleLinear()
    .range(['#ece2f0', '#016450']);
var crimeColorScale = d3.scaleLinear()
    .range(['#ece2f0', '#8B0000']);

var gTableElements;
function CompareChart() {
    var self = this;
    self.init();
};

var doSort = false;

/**
 * Initializes the svg elements required for this chart
 */
CompareChart.prototype.init = function(){
    var self = this;
    self.margin = {top: 20, right: 20, bottom: 20, left: 20};
	$("#uni-table").remove();

	var width = 0.80 * window.innerWidth;
    var height = 0.80 * window.innerWidth;

    var compareChart = d3.select("#compare-chart")
        .classed("wholeChart",true);

	
	var table = document.createElement('table');
	var header = table.createTHead();
	
	header.setAttribute("class", "tableHeader");
	
    var row1 = header.insertRow(0);
    var row1col0 = row1.insertCell(0);
    row1col0.innerHTML = 'Institution Name';
	var row1col1 = row1.insertCell(1);
    row1col1.innerHTML = 'Institution Size';
    var row1col2 = row1.insertCell(2);
    row1col2.innerHTML = 'Criminal Offenses';
    var row1col3 = row1.insertCell(3);
    row1col3.innerHTML = 'Disciplinary Actions';
	var row1col1 = row1.insertCell(4);
    row1col1.innerHTML = 'Hate Crimes';
	var row1col1 = row1.insertCell(5);
    row1col1.innerHTML = 'VAWA Offenses';
	
	table.appendChild(document.createElement('tbody'))
	
	table.id = "uni-table";

    var compareDiv = document.getElementById('compare-chart');
    compareDiv.appendChild(table);
	
	d3.select("#uni-table").select("thead").selectAll("tr").selectAll("td").on("click", sort)
    d3.select("#uni-table").select("thead").selectAll("tr").selectAll("th").on("click", sort)
};


CompareChart.prototype.update = function(tableElements){
	var maxSize = d3.max(tableElements, function(d){return d["Institution Size"];})
	var sizeScale = d3.scaleLinear()
		.domain([0, maxSize])
		.range([cellBuffer, 2 * cellWidth - cellBuffer]);
	var maxCO = d3.max(tableElements, function(d){return d.CO;});
	var coScale = d3.scaleLinear()
		.domain([0, maxCO])
		.range([cellBuffer, 2 * cellWidth - cellBuffer]);
	var maxDA = d3.max(tableElements, function(d){return d.DA;});
	var daScale = d3.scaleLinear()
		.domain([0, maxDA])
		.range([cellBuffer, 2 * cellWidth - cellBuffer]);
	var maxHC = d3.max(tableElements, function(d){return d.HC;});
	var hcScale = d3.scaleLinear()
		.domain([0, maxHC])
		.range([cellBuffer, 2 * cellWidth - cellBuffer]);
	var maxVW = d3.max(tableElements, function(d){return d.VW;});
	var vwScale = d3.scaleLinear()
		.domain([0, maxVW])
		.range([cellBuffer, 2 * cellWidth - cellBuffer]);

    tr = d3.select("#uni-table").select("tbody").selectAll("tr")
		.data(tableElements)  
        .enter()
        .append('tr')

    var td = tr.selectAll("td")
        .data( function (d) {
        return [{"vis": "names", "value": d["Institution name"]},
                {"vis": "barsIS", "value": d["Institution Size"]},
				{"vis": "barsCO", "value": d.CO},
                {"vis": "barsDA", "value": d.DA},
                {"vis": "barsHC", "value": d.HC},
                {"vis": "barsVW", "value": d.VW}]
        })
        .enter()
        .append("td")
	
		
	td.filter(function (d) {
		return d.vis == 'names'
	})
	.attr("width", 5 * cellWidth)
	.attr("class", function (d) {"UniName"})
	.text(function (d) {
		return d.value;
	})
	.classed('uniName', true)
		
	
	
	bars = d3.select("#uni-table").select("tbody").selectAll("td").filter(function (d) {
            return d.vis == 'barsIS'
        })
        .append("svg")
            .attr("width", 3 * cellWidth)
            .attr("height", cellHeight)
            .append("g")
			
    bars.append("rect")
        .attr("width", function (d) {
            return sizeScale(d.value)
        })
        .attr("height", barHeight)
		.attr('fill', function (d) {
            return 'green';
        })
		.style('opacity',function(d){
			return d.value/maxSize;
		})
		
	bars.append("text")
        .attr("width", function (d) {
            return sizeScale(d.value)/2
        })
        .attr("x", function (d) {
            return 2
        })
        .attr("y", cellHeight/2 + 5)
		.attr("fill", "white")
        .text(function (d) {
            return d.value
        })
	//////////////////////////////////////////////	
		
	bars = d3.select("#uni-table").select("tbody").selectAll("td").filter(function (d) {
            return d.vis == 'barsCO'
        })
        .append("svg")
            .attr("width", 2 * cellWidth)
            .attr("height", cellHeight)
            .append("g")
			
    bars.append("rect")
        .attr("width", function (d) {
            return coScale(d.value)
        })
        .attr("height", barHeight)
		.attr('fill', function (d) {
            return 'darkred';
        })
		.style('opacity',function(d){
			return 2 * d.value/maxCO;
		})
		
	bars.append("text")
        .attr("width", function (d) {
            return coScale(d.value)/2
        })
        .attr("x", function (d) {
            return 2
        })
        .attr("y", cellHeight/2 + 5)
		.attr("fill", "white")
        .text(function (d) {
            return d.value
        })
	///////////////////////////////////////////////////////////////
	bars = d3.select("#uni-table").select("tbody").selectAll("td").filter(function (d) {
            return d.vis == 'barsDA'
        })
        .append("svg")
            .attr("width", 2 * cellWidth)
            .attr("height", cellHeight)
            .append("g")
			
    bars.append("rect")
        .attr("width", function (d) {
            return daScale(d.value)
        })
        .attr("height", barHeight)
		.attr('fill', function (d) {
            return 'darkred';
        })
		.style('opacity',function(d){
			return 2 * d.value/maxDA;
		})
		
	bars.append("text")
        .attr("width", function (d) {
            return daScale(d.value)/2
        })
        .attr("x", function (d) {
            return 2
        })
        .attr("y", cellHeight/2 + 5)
		.attr("fill", "white")
        .text(function (d) {
            return d.value
        })
	///////////////////////////////////////////////////////////
		
		bars = d3.select("#uni-table").select("tbody").selectAll("td").filter(function (d) {
            return d.vis == 'barsHC'
        })
        .append("svg")
            .attr("width", 2 * cellWidth)
            .attr("height", cellHeight)
            .append("g")
			
    bars.append("rect")
        .attr("width", function (d) {
            return hcScale(d.value)
        })
		.attr('fill', function (d) {
            return 'darkred';
        })
		.style('opacity',function(d){
			return 2 * d.value/maxHC;
		})
		
        .attr("height", barHeight)
	bars.append("text")
        .attr("width", function (d) {
            return hcScale(d.value)/2
        })
        .attr("x", function (d) {
            return 2
        })
        .attr("y", cellHeight/2 + 5)
		.attr("fill", "white")
        .text(function (d) {
            return d.value
        })
	/////////////////////////////////////////////////////////////
		bars = d3.select("#uni-table").select("tbody").selectAll("td").filter(function (d) {
            return d.vis == 'barsVW'
        })
        .append("svg")
            .attr("width", 2 * cellWidth)
            .attr("height", cellHeight)
            .append("g")
			
    bars.append("rect")
        .attr("width", function (d) {
            return vwScale(d.value)
        })
        .attr("height", barHeight)
		.attr('fill', function (d) {
            return 'darkred';
        })
		.style('opacity',function(d){
			return 2 * d.value/maxVW;
		})
		
	bars.append("text")
        .attr("width", function (d) {
            return vwScale(d.value)/2
        })
        .attr("x", function (d) {
            return 2
        })
        .attr("y", cellHeight/2 + 5)
		.attr("fill", "white")
        .text(function (d) {
            return d.value
        })
		gTableElements = tableElements;
}


var sortTabel = {'Institution Name': false, 'Institution Size': false, 'Criminal Offenses': false, 'Disciplinary Actions': false, 
	'Hate Crimes': false, 'VAWA Offenses': false}

function sort() {
	tableElements = gTableElements;
    header = d3.select(this).text()
	ascInd = sortTabel[header];
	switch(header){
		case 'Institution Name':
			if (ascInd == true)
				tableElements = tableElements.sort(function (a,b) {return d3.descending(a['Institution name'], b['Institution name'])})
			else 
				tableElements = tableElements.sort(function (a,b) {return d3.ascending(a['Institution name'], b['Institution name'])})
			break;

		case 'Criminal Offenses':
			if (ascInd == true)   
				gTableElements = gTableElements.sort(function (a,b) {return d3.descending(a['CO'], b['CO'])})
			else 
				gTableElements = gTableElements.sort(function (a,b) {return d3.ascending(a['CO'], b['CO'])})
			break;
		case 'Disciplinary Actions':
			if (ascInd == true)
				tableElements = tableElements.sort(function (a,b) {return d3.descending(a['DA'], b['DA'])})
			else 
				tableElements = tableElements.sort(function (a,b) {return d3.ascending(a['DA'], b['DA'])})
			break;
		case 'Hate Crimes':
			if (ascInd == true)
				tableElements = tableElements.sort(function (a,b) {return d3.descending(a['HC'], b['HC'])})
			else
				tableElements = tableElements.sort(function (a,b) {return d3.ascending(a['HC'], b['HC'])})
			break;
		case 'VAWA Offenses':
			if (ascInd == true)
				tableElements = tableElements.sort(function (a,b) {return d3.descending(a['VW'], b['VW'])})
			else
				tableElements = tableElements.sort(function (a,b) {return d3.ascending(a['VW'], b['VW'])}) 
			break;
	}
    if(ascInd == true)
		sortTabel[header] = false;
	else
		sortTabel[header] = true;
		
    var compareChart = new CompareChart();
    compareChart.update(tableElements);
}
