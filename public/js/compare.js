var cellWidth = 80,
    cellHeight = 20,
    cellBuffer = 15,
    barHeight = 18;

var aggregateColorScale = d3.scaleLinear()
    .range(['#ece2f0', '#016450']);

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

	var width = 0.70 * window.innerWidth;
    var height = 0.70 * window.innerWidth;

    var compareChart = d3.select("#compare-chart")
        .style('width', width + 'px')
        .style('height',height +'px');

	
	var table = document.createElement('table');
	var header = table.createTHead();
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
	var sizeScale = d3.scaleLinear()
		.domain([0, d3.max(tableElements, function(d){return d["Institution Size"];})])
		.range([cellBuffer, 2 * cellWidth - cellBuffer]);
	var coScale = d3.scaleLinear()
		.domain([0, d3.max(tableElements, function(d){return d.CO;})])
		.range([cellBuffer, 2 * cellWidth - cellBuffer]);
	var daScale = d3.scaleLinear()
		.domain([0, d3.max(tableElements, function(d){return d.DA;})])
		.range([cellBuffer, 2 * cellWidth - cellBuffer]);
	var hcScale = d3.scaleLinear()
		.domain([0, d3.max(tableElements, function(d){return d.HC;})])
		.range([cellBuffer, 2 * cellWidth - cellBuffer]);
	var vwScale = d3.scaleLinear()
		.domain([0, d3.max(tableElements, function(d){return d.VW;})])
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
	.attr("width", 4 * cellWidth)
	.attr("class", function (d) {"UniName"})
	.text(function (d) {
		return d.value;
	});
		
	
	
	bars = d3.select("#uni-table").select("tbody").selectAll("td").filter(function (d) {
            return d.vis == 'barsIS'
        })
        .append("svg")
            .attr("width", 2 * cellWidth)
            .attr("height", cellHeight)
            .append("g")
			
    bars.append("rect")
        .attr("width", function (d) {
            return sizeScale(d.value)
        })
        .attr("height", barHeight)
		
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
		case 'Institution Size':
			if (ascInd == true){
				tableElements = tableElements.sort(function (a,b) {return d3.descending(a['Institution Size'], b['Institution Size'])})
				}
			else{
				tableElements = tableElements.sort(function (a,b) {return d3.ascending(a['Institution Size'], b['Institution Size'])})
				}
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
