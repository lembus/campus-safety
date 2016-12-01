/**
 * Created by amir_ on 12/1/2016.
 */

/**
 * Constructor for the ategorical sunburst chart
 *
 */
function CatSunburst() {
    var self = this;

    self.init();
}

/**
 * Initializes the svg elements required for this chart;
 */
CatSunburst.prototype.init = function(){
    var self = this;
    self.margin = {top: 10, right: 10, bottom: 10, left: 10};

    var height = 0.5 * window.outerWidth;

    var divSBChart = d3.select("#catSunburst").classed("rightChart",true)
        .style('height',height +'px');

    //Gets access to the div element created for this chart from HTML
    self.svgBounds = divSBChart.node().getBoundingClientRect();
    self.svgWidth = self.svgBounds.width - self.margin.left - self.margin.right;
    self.svgHeight = self.svgBounds.height - self.margin.top - self.margin.bottom;

    //creates svg element within the div
    self.svg = divSBChart.select("svg")
        .attr("width",self.svgWidth)
        .attr("height",self.svgHeight);

};


/**
 * Creates a map with color saturation representing the crime ratio in each state
 */
CatSunburst.prototype.update = function(state,year,university) {
    var self = this;


    d3.csv("data/" + state + "/Criminal_Offenses_On_campus_combined.csv", function (error, CO) {
        d3.csv("data/" + state + "/Disciplinary_Actions_On_campus_combined.csv", function (error, DA) {
            d3.csv("data/" + state + "/Hate_Crimes_On_campus_combined.csv", function (error, HC) {
                d3.csv("data/" + state + "/VAWA_Offenses_On_campus_combined.csv", function (error, VW) {
                    d3.csv("data/" + state + "/crime_types.csv", function (error, crimes) {
                        //Extracting the accumulated crimes data
                        var accumData = crimes.filter(function(d){
                            return d['Survey year'] == year;
                        });
                        accumData = accumData.filter(function(d){
                            return d['Institution name'] == university;
                        });

                        //Extracting the CO crimes data
                        var coData = CO.filter(function(d){
                            return d['Survey year'] == year;
                        });
                        coData = coData.filter(function(d){
                            return d['Institution name'] == university;
                        });
                        var typeNames = ['Criminal offenses','Disciplinary actions','Hate crimes','VAWA Offenses'];
                        var typesData=[];
                        typesData.push(coData);

                        //Extracting the DA crimes data
                        var daData = DA.filter(function(d){
                            return d['Survey year'] == year;
                        });
                        daData = daData.filter(function(d){
                            return d['Institution name'] == university;
                        });
                        typesData.push(daData);

                        //Extracting the HC crimes data
                        var hcData = HC.filter(function(d){
                            return d['Survey year'] == year;
                        });
                        hcData = hcData.filter(function(d){
                            return d['Institution name'] == university;
                        });
                        typesData.push(hcData);

                        //Extracting the VW crimes data
                        var vwData = VW.filter(function(d){
                            return d['Survey year'] == year;
                        });
                        vwData = vwData.filter(function(d){
                            return d['Institution name'] == university;
                        });
                        typesData.push(vwData);

                        var uniCrimeData = {
                            name: university,
                            depth: 0,
                            dx: 1,
                            dy: 0.3,
                            value: accumData[0].total,
                            x: 0,
                            y: 0
                        };

                        var typeAbbrs = ['CO','DA','HC','VW'];
                        var typeInitX = 0;
                        var catInitX = 0;
                        var uniChildren = [];
                        var colNames = [CO.columns,DA.columns,HC.columns,VW.columns]
                        for (i=0;i<4;i++) {
                            var tempType = {
                                name: typeNames[i],
                                depth: 1,
                                dx: accumData[0][typeAbbrs[i]] /accumData[0].total,
                                dy: 0.35,
                                value: accumData[0][typeAbbrs[i]],
                                x: typeInitX,
                                y: 0.3,
                                parent: uniCrimeData
                            };
                            typeInitX += tempType.dx;
                            var typeChildren=[];
                            for (j = 4; j < colNames[i].length; j++) {
                                 var tempCat = {
                                     name: colNames[i][j],
                                     depth: 2,
                                     dx: typesData[i][0][colNames[i][j]] /accumData[0].total,
                                     dy: 0.35,
                                     value: typesData[i][0][colNames[i][j]],
                                     x: catInitX,
                                     y: 0.65,
                                     parent: tempType
                                 };
                                catInitX += tempCat.dx;
                                typeChildren.push(tempCat);
                            }
                            tempType.children = typeChildren;
                            uniChildren.push(tempType);
                        }
                        uniCrimeData.children = uniChildren;
                        console.log(uniCrimeData);
                    });
                });
            });
        });
    });



};