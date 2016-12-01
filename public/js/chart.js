var crime_type;
var crime_cat;


function CrimeChart() {
    var self = this;
    self.init();
};

CrimeChart.prototype.init = function(){
    var self = this;
    var height = 0.4 * window.outerHeight;
    self.divCrimeChart = d3.select("#lineCharts").classed("rightChart", true)
        .style('height',height +'px');
}

CrimeChart.prototype.update = function(state){

    //console.log(state);

    d3.csv("data/"+state+"/crime_types.csv", function (error, csv) {

        crime_type = csv;

        createLineChart(state);

    });


}


function createLineChart(state) {



    var total = new Array(14);
    var co = new Array(14);
    var da = new Array(14);
    var hc = new Array(14);
    var vw = new Array(14);
    for (var i = 0; i < 14; i++) {
        total[i] = 0;
        co[i] = 0;
        da[i] = 0;
        hc[i] = 0;
        vw[i] = 0;
    }
    for (var i = 0; i < crime_type.length; i++) {
        total[parseInt(crime_type[i]["Survey year"])-2001] += parseInt(crime_type[i].total);
        co[parseInt(crime_type[i]["Survey year"])-2001] += parseInt(crime_type[i].CO);
        da[parseInt(crime_type[i]["Survey year"])-2001] += parseInt(crime_type[i].DA);
        hc[parseInt(crime_type[i]["Survey year"])-2001] += parseInt(crime_type[i].HC);
        vw[parseInt(crime_type[i]["Survey year"])-2001] += parseInt(crime_type[i].VW);
    }


    var max = 0;
    for (var i = 0; i < 14; i++) {
        if (max < total[i]) max = total[i];
    }


    var xScale = d3.scaleLinear()
        .domain([2001, 2014])
        .range([0,500]);
    var xAxis = d3.axisBottom().scale(xScale);
    var yScale = d3.scaleLinear()
        .domain([max, 0])
        .range([0,500]);
    var yAxis = d3.axisLeft().scale(yScale);


    d3.selectAll("#yAxis").call(yAxis)
        .attr("transform", "translate(60,50)");

    d3.selectAll("#xAxis").call(xAxis)
        .attr("transform", "translate(60,550)");




    var svg = d3.select("#line")
        .append("svg")
        .attr("x", 60)
        .attr("y", 0)
        .attr("width", 900)
        .attr("height", 900);

    svg.append("path")
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 3)
        .attr("d", function() {
            var str = "M ";
            for (var i = 0; i < 14; i++) {
                str += 500*i/13;
                str += " ";
                str += (550-total[i]*500/max);
                str += " ";
                if (i != 13) str += "L ";
            }
            return str;
        });
    svg.append("path")
        .attr("fill", "none")
        .attr("stroke", "orange")
        .attr("stroke-width", 3)
        .attr("d", function() {
            var str = "M ";
            for (var i = 0; i < 14; i++) {
                str += 500*i/13;
                str += " ";
                str += (550-co[i]*500/max);
                str += " ";
                if (i != 13) str += "L ";
            }
            return str;
        })
        .on("click", function() {
            d3.csv("data/"+state+"/Criminal_Offenses_On_campus_combined.csv", function(error, csv) {
                crime_cat = csv;
                createBarChart();
            })
        });
    svg.append("path")
        .attr("fill", "none")
        .attr("stroke", "green")
        .attr("stroke-width", 3)
        .attr("d", function() {
            var str = "M ";
            for (var i = 0; i < 14; i++) {
                str += 500*i/13;
                str += " ";
                str += (550-da[i]*500/max);
                str += " ";
                if (i != 13) str += "L ";
            }
            return str;
        })
        .on("click", function() {
            d3.csv("data/"+state+"/Disciplinary_Actions_On_campus_combined.csv", function(error, csv) {
                crime_cat = csv;
                createBarChart();
            })
        });
    svg.append("path")
        .attr("fill", "none")
        .attr("stroke", "blue")
        .attr("stroke-width", 3)
        .attr("d", function() {
            var str = "M ";
            for (var i = 0; i < 14; i++) {
                str += 500*i/13;
                str += " ";
                str += (550-hc[i]*500/max);
                str += " ";
                if (i != 13) str += "L ";
            }
            return str;
        })
        .on("click", function() {
            d3.csv("data/"+state+"/Hate_Crimes_On_campus_combined.csv", function(error, csv) {
                crime_cat = csv;
                createBarChart();
            })
        });
    svg.append("path")
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 3)
        .attr("d", function() {
            var str = "M ";
            for (var i = 0; i < 14; i++) {
                str += 500*i/13;
                str += " ";
                str += (550-vw[i]*500/max);
                str += " ";
                if (i != 13) str += "L ";
            }
            return str;
        })
        .on("click", function() {
            d3.csv("data/"+state+"/VAWA_Offenses_On_campus_combined.csv", function(error, csv) {
                crime_cat = csv;
                createBarChart();
            })
        });



}


function createBarChart() {

    //console.log(crime_cat[0]);

    var catName = [];
    for (var key in crime_cat[0]) {
        if (crime_cat[0].hasOwnProperty(key) && key != "Survey year" && key != "Unitid" && key != "Institution name" && key != "Institution Size") {
            catName.push(key);
        }
    }
    //console.log(catName);

    var nCat = new Array(catName.length);

    for (var i = 0; i < catName.length; i++) {
        nCat[i] = 0;
    }

    for (var i = 0; i < crime_cat.length; i++) {
        for (var j = 0; j < catName.length; j++) {
            nCat[j] += parseInt(crime_cat[i][catName[j]]);
        }
    }

    //console.log(nCat);

    var max = 0;
    for (var i = 0; i < nCat.length; i++) {
        if (max < nCat[i]) max = nCat[i];
    }


    d3.select("#barChart").select("#bar").selectAll("*").remove();
    var xScale = d3.scaleLinear()
        .domain([0, catName.length])
        .range([0,500]);
    var xAxis = d3.axisBottom().scale(xScale);
    var yScale = d3.scaleLinear()
        .domain([max, 0])
        .range([0,500]);
    var yAxis = d3.axisLeft().scale(yScale);


    d3.selectAll("#yAxis1").call(yAxis)
        .attr("transform", "translate(60,50)");

    d3.selectAll("#xAxis1").call(xAxis)
        .attr("transform", "translate(60,550)");

    var svg = d3.select("#bar")
        .append("svg")
        .attr("x", 60)
        .attr("y", 0)
        .attr("width", 900)
        .attr("height", 900);

    for (var i = 0; i < nCat.length; i++) {
        svg.append("rect")
            .attr("fill", "blue")
            .attr("x", 500*i/nCat.length)
            .attr("y", 550-500*nCat[i]/max)
            .attr("width", 500/nCat.length)
            .attr("height", 500*nCat[i]/max);
    }



}



/*var crime_type;
var crime_cat;

function createBarChart() {

    console.log(crime_cat[0]);

    var catName = [];
    for (var key in crime_cat[0]) {
        if (crime_cat[0].hasOwnProperty(key) && key != "Survey year" && key != "Unitid" && key != "Institution name" && key != "Institution Size") {
            catName.push(key);
        }
    }
    console.log(catName);

    var nCat = new Array(catName.length);

    for (var i = 0; i < catName.length; i++) {
        nCat[i] = 0;
    }

    for (var i = 0; i < crime_cat.length; i++) {
        for (var j = 0; j < catName.length; j++) {
            nCat[j] += parseInt(crime_cat[i][catName[j]]);
        }
    }

    console.log(nCat);

    var max = 0;
    for (var i = 0; i < nCat.length; i++) {
        if (max < nCat[i]) max = nCat[i];
    }


    d3.select("#barChart").select("#bar").selectAll("*").remove();
    var xScale = d3.scaleLinear()
        .domain([0, catName.length])
        .range([0,500]);
    var xAxis = d3.axisBottom().scale(xScale);
    var yScale = d3.scaleLinear()
        .domain([max, 0])
        .range([0,500]);
    var yAxis = d3.axisLeft().scale(yScale);


    d3.selectAll("#yAxis1").call(yAxis)
        .attr("transform", "translate(60,50)");

    d3.selectAll("#xAxis1").call(xAxis)
        .attr("transform", "translate(60,550)");

    var svg = d3.select("#bar")
        .append("svg")
        .attr("x", 60)
        .attr("y", 0)
        .attr("width", 900)
        .attr("height", 900);

    for (var i = 0; i < nCat.length; i++) {
        svg.append("rect")
            .attr("fill", "blue")
            .attr("x", 500*i/nCat.length)
            .attr("y", 550-500*nCat[i]/max)
            .attr("width", 500/nCat.length)
            .attr("height", 500*nCat[i]/max);
    }



}



function createLineChart() {



    var total = new Array(14);
    var co = new Array(14);
    var da = new Array(14);
    var hc = new Array(14);
    var vw = new Array(14);
    for (var i = 0; i < 14; i++) {
        total[i] = 0;
        co[i] = 0;
        da[i] = 0;
        hc[i] = 0;
        vw[i] = 0;
    }
    for (var i = 0; i < crime_type.length; i++) {
        total[parseInt(crime_type[i]["Survey year"])-2001] += parseInt(crime_type[i].total);
        co[parseInt(crime_type[i]["Survey year"])-2001] += parseInt(crime_type[i].CO);
        da[parseInt(crime_type[i]["Survey year"])-2001] += parseInt(crime_type[i].DA);
        hc[parseInt(crime_type[i]["Survey year"])-2001] += parseInt(crime_type[i].HC);
        vw[parseInt(crime_type[i]["Survey year"])-2001] += parseInt(crime_type[i].VW);
    }


    var max = 0;
    for (var i = 0; i < 14; i++) {
        if (max < total[i]) max = total[i];
    }


    var xScale = d3.scaleLinear()
        .domain([2001, 2014])
        .range([0,500]);
    var xAxis = d3.axisBottom().scale(xScale);
    var yScale = d3.scaleLinear()
        .domain([max, 0])
        .range([0,500]);
    var yAxis = d3.axisLeft().scale(yScale);


    d3.selectAll("#yAxis").call(yAxis)
        .attr("transform", "translate(60,50)");

    d3.selectAll("#xAxis").call(xAxis)
        .attr("transform", "translate(60,550)");




    var svg = d3.select("#line")
        .append("svg")
        .attr("x", 60)
        .attr("y", 0)
        .attr("width", 900)
        .attr("height", 900);

    svg.append("path")
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 3)
        .attr("d", function() {
            var str = "M ";
            for (var i = 0; i < 14; i++) {
                str += 500*i/13;
                str += " ";
                str += (550-total[i]*500/max);
                str += " ";
                if (i != 13) str += "L ";
            }
            return str;
        });
    svg.append("path")
        .attr("fill", "none")
        .attr("stroke", "orange")
        .attr("stroke-width", 3)
        .attr("d", function() {
            var str = "M ";
            for (var i = 0; i < 14; i++) {
                str += 500*i/13;
                str += " ";
                str += (550-co[i]*500/max);
                str += " ";
                if (i != 13) str += "L ";
            }
            return str;
        })
        .on("click", function() {
            d3.csv("data/CA/Criminal_Offenses_On_campus_combined.csv", function(error, csv) {
                crime_cat = csv;
                createBarChart();
            })
        });
    svg.append("path")
        .attr("fill", "none")
        .attr("stroke", "green")
        .attr("stroke-width", 3)
        .attr("d", function() {
            var str = "M ";
            for (var i = 0; i < 14; i++) {
                str += 500*i/13;
                str += " ";
                str += (550-da[i]*500/max);
                str += " ";
                if (i != 13) str += "L ";
            }
            return str;
        })
        .on("click", function() {
            d3.csv("data/CA/Disciplinary_Actions_On_campus_combined.csv", function(error, csv) {
                crime_cat = csv;
                createBarChart();
            })
        });
    svg.append("path")
        .attr("fill", "none")
        .attr("stroke", "blue")
        .attr("stroke-width", 3)
        .attr("d", function() {
            var str = "M ";
            for (var i = 0; i < 14; i++) {
                str += 500*i/13;
                str += " ";
                str += (550-hc[i]*500/max);
                str += " ";
                if (i != 13) str += "L ";
            }
            return str;
        })
        .on("click", function() {
            d3.csv("data/CA/Hate_Crimes_On_campus_combined.csv", function(error, csv) {
                crime_cat = csv;
                createBarChart();
            })
        });
    svg.append("path")
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 3)
        .attr("d", function() {
            var str = "M ";
            for (var i = 0; i < 14; i++) {
                str += 500*i/13;
                str += " ";
                str += (550-vw[i]*500/max);
                str += " ";
                if (i != 13) str += "L ";
            }
            return str;
        })
        .on("click", function() {
            d3.csv("data/CA/VAWA_Offenses_On_campus_combined.csv", function(error, csv) {
                crime_cat = csv;
                createBarChart();
            })
        });



}


d3.csv("data/CA/crime_types.csv", function (error, csv) {

    crime_type = csv;

    createLineChart();

});
*/