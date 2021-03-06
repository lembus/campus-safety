var crime_type;
var crime_cat;

var height;
var width;
var svgh;
var svgw;
var margint = 100, marginb = 50, marginl = 60, marginr = 20;
var datah;
var dataw;

var curstate = "none";


function CrimeChart() {
    var self = this;
    self.init();
};

CrimeChart.prototype.init = function(){

    var h = 0.5 * window.outerHeight;
    var self = this;
    self.divCrimeChart = d3.select("#lineCharts").classed("rightChart", true)
        .style('height',h +'px');
    var dimension = d3.select("#lineCharts").node().getBoundingClientRect();
    //console.log(dimension);


    svgh = dimension.height;
    svgw = dimension.width*0.45;
    d3.select("#lineChart")
        .attr("width", svgw)
        .attr("height", svgh);
    d3.select("#barChart")
        .attr("width", svgw)
        .attr("height", svgh);

    datah = svgh-margint-marginb;
    dataw = svgw-marginl-marginr;

}

CrimeChart.prototype.update = function(state){

    //console.log(state);

    d3.csv("data/"+state+"/crime_types.csv", function (error, csv) {

        crime_type = csv;

        d3.select("#barChart").select("#xAxis1").selectAll("*").remove();
        d3.select("#barChart").select("#yAxis1").selectAll("*").remove();
        d3.select("#barChart").select("#bar").selectAll("*").remove();
        d3.select("#barChart").select("#barcharttitle").remove();

        if (curstate == state) {
            curstate = "none";
            d3.select("#lineChart").select("#xAxis").selectAll("*").remove();
            d3.select("#lineChart").select("#yAxis").selectAll("*").remove();
            d3.select("#lineChart").select("#line").selectAll("*").remove();
            d3.select("#lineChart").select("#linecharttitle").remove();

        } else {
            curstate = state;
            createLineChart(state);
        }


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


    d3.select("#lineChart").select("#line").selectAll("*").remove();


    d3.select("#lineChart").select("#linecharttitle").remove();

    d3.select("#lineChart").append("svg")
        .attr('width', svgw)
        .attr('height', margint)
        .attr('id', 'linecharttitle')
        .append('text')
        .attr("x", (svgw / 2))
        .attr("y", margint/2)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .attr("font-weight",'bold')
        .text(state + " Universities Number of Crime over 2001-2014");


    var xScale = d3.scaleLinear()
        .domain([2001, 2014])
        .range([0,dataw]);
    var xAxis = d3.axisBottom().scale(xScale);
    var yScale = d3.scaleLinear()
        .domain([max, 0])
        .range([0,datah]);
    var yAxis = d3.axisLeft().scale(yScale);


    d3.selectAll("#yAxis").call(yAxis)
        .attr("transform", "translate("+marginl+","+margint+")");

    d3.selectAll("#xAxis").call(xAxis)
        .attr("transform", "translate("+marginl+","+(svgh-marginb)+")")
        .selectAll("text")
        .attr("dx", "1.6em")
        .attr("dy", ".3em")
        .attr("transform", "rotate(45)");




    var svg = d3.select("#line")
        .append("svg")
        .attr("x", marginl)
        .attr("y", margint)
        .attr("width", dataw)
        .attr("height", datah);

    for (var j = 0; j < 5; j++) {

        svg.append("path")
            .attr("fill", "none")
            .attr("stroke", function () {
                if (j == 0) return "black";
                else if (j == 1) return "orange";
                else if (j == 2) return "green";
                else if (j == 3) return "blue";
                else if (j == 4) return "red";
            })
            .attr("stroke-width", 5)
            .attr("d", function () {
                var str = "M ";
                for (var i = 0; i < 14; i++) {
                    str += dataw * i / 13;
                    str += " ";
                    if (j == 0) str += (datah - total[i] * datah / max);
                    else if (j == 1) str += (datah - co[i] * datah / max);
                    else if (j == 2) str += (datah - da[i] * datah / max);
                    else if (j == 3) str += (datah - hc[i] * datah / max);
                    else if (j == 4) str += (datah - vw[i] * datah / max);
                    str += " ";
                    if (i != 13) str += "L ";
                }
                return str;
            })
            .attr("id", "line" + j);
    }

    var tip0 = d3.tip().attr('class', 'd3-tip')
        .direction('s')
        .offset(function() {
            return [0,0];
        })
        .html("Total");
    var line0 = d3.select("#line0");
    line0.call(tip0);
    line0.on("mouseover", function () {
        tip0.show();
    })
        .on("mouseout",function(){
            tip0.hide();
        });

    var tip1 = d3.tip().attr('class', 'd3-tip')
        .direction('s')
        .offset(function() {
            return [0,0];
        })
        .html("Criminal Offenses");
    var line1 = d3.select("#line1");
    line1.call(tip1);
    line1.on("mouseover", function () {
        tip1.show();
    })
        .on("mouseout",function(){
            tip1.hide();
        })
        .on("click", function () {
            d3.csv("data/" + state + "/Criminal_Offenses_On_campus_combined.csv", function (error, csv) {
                crime_cat = csv;
                createBarChart();
            })
        });

    var tip2 = d3.tip().attr('class', 'd3-tip')
        .direction('s')
        .offset(function() {
            return [0,0];
        })
        .html("Disciplinary Actions");
    var line2 = d3.select("#line2");
    line2.call(tip2);
    line2.on("mouseover", function () {
        tip2.show();
    })
        .on("mouseout",function(){
            tip2.hide();
        })
        .on("click", function () {
            d3.csv("data/" + state + "/Disciplinary_Actions_On_campus_combined.csv", function (error, csv) {
                crime_cat = csv;
                createBarChart();
            })
        });

    var tip3 = d3.tip().attr('class', 'd3-tip')
        .direction('s')
        .offset(function() {
            return [0,0];
        })
        .html("Hate Crimes");
    var line3 = d3.select("#line3");
    line3.call(tip3);
    line3.on("mouseover", function () {
        tip3.show();
    })
        .on("mouseout",function(){
            tip3.hide();
        })
        .on("click", function () {
            d3.csv("data/" + state + "/Hate_Crimes_On_campus_combined.csv", function (error, csv) {
                crime_cat = csv;
                createBarChart();
            })
        });

    var tip4 = d3.tip().attr('class', 'd3-tip')
        .direction('s')
        .offset(function() {
            return [0,0];
        })
        .html("VAWA Offenses");
    var line4 = d3.select("#line4");
    line4.call(tip4);
    line4.on("mouseover", function () {
        tip4.show();
    })
        .on("mouseout",function(){
            tip4.hide();
        })
        .on("click", function () {
            d3.csv("data/" + state + "/VAWA_Offenses_On_campus_combined.csv", function (error, csv) {
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

    if (catName.length == 0) return;

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

    var nonzero = 0;
    for (var i = 0; i < nCat.length; i++) {
        if (nCat[i] > 0.1*max) nonzero++;
    }


    var spacing = [0];

    for (var i = 0; i < nonzero; i++) {
        spacing.push(dataw*(i+1)/nonzero);
    }
    /*
    for (var i = 0; i < catName.length; i++) {
        spacing.push(dataw*(i+1)/catName.length);
    }*/


    d3.select("#barChart").select("#bar").selectAll("*").remove();


    d3.select("#barChart").select("#barcharttitle").remove();

    d3.select("#barChart").append("svg")
        .attr('width', svgw)
        .attr('height', margint)
        .attr('id', 'barcharttitle')
        .append('text')
        .attr("x", (svgw / 2))
        .attr("y", margint/2)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .attr("font-weight",'bold')
        .text("Type of Crime in Total");


    var xScale = d3.scaleOrdinal();
    /*
    if (catName.length < 50) {
        xScale.domain(catName)
            .range(spacing);
    } else {
        xScale.domain([])
            .range(spacing);
    }
     */
    xScale.domain([])
        .range(spacing);


    var xAxis = d3.axisBottom().scale(xScale);
    var yScale = d3.scaleLinear()
        .domain([max, 0])
        .range([0,datah]);
    var yAxis = d3.axisLeft().scale(yScale);


    d3.selectAll("#yAxis1").call(yAxis)
        .attr("transform", "translate("+marginl+","+margint+")");

    d3.selectAll("#xAxis1").call(xAxis)
        .attr("transform", "translate("+marginl+","+(svgh-marginb)+")");

    var text = d3.selectAll("#text")
        .attr("transform", "translate("+marginl+","+(svgh-marginb)+")");


    var svg = d3.select("#bar")
        .append("svg")
        .attr("x", marginl)
        .attr("y", margint)
        .attr("width", dataw)
        .attr("height", datah);


    var tiparray = [];
    for (var i = 0; i < nCat.length; i++) {
        var tipt = d3.tip().attr('class', 'd3-tip')
            .direction('s')
            .offset(function() {
                return [0,0];
            })
            .html("Type of crime: "+catName[i]+"<br>"+"Number: "+nCat[i]);
        tiparray.push(tipt);
    }



    var j = 0;

    for (var i = 0; i < nCat.length; i++) {
        /*
        svg.append("rect")
            .attr("fill", "blue")
            .attr("x", dataw*(i+0.3)/nCat.length)
            .attr("y", datah-datah*nCat[i]/max)
            .attr("width", 0.4*dataw/nCat.length)
            .attr("height", datah*nCat[i]/max);
            */
        if (nCat[i] > 0.1*max) {
            svg.append("rect")
                .attr("fill", "blue")
                .attr("x", dataw*(j+0.3)/nonzero)
                .attr("y", datah-datah*nCat[i]/max)
                .attr("width", 0.4*dataw/nonzero)
                .attr("height", datah*nCat[i]/max)
                .call(tiparray[i])
                .on('mouseover', tiparray[i].show)
                .on('mouseout', tiparray[i].hide);
            j++;
        }
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