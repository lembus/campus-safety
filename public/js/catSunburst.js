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
    self.margin = {top: 150, right: 10, bottom: 20, left: 10};

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
 * Creates a the Sunburst chart for crime records of a university
 */
CatSunburst.prototype.update = function(state,year,university) {
    var self = this;

    if (state=='' || university=='') {
        self.svg.select("g").remove();
        self.svg.select('text').remove();
        return;
    }
    if (self.svg.select('text').empty()) {
        self.svg.append('text')
    }
    self.svg.select("text")
        .attr("x", (self.svgWidth / 2))
        .attr("y", self.margin.bottom)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .attr("font-weight",'bold')
        .text(university+" Crime Records");

    d3.csv("data/" + state + "/Criminal_Offenses_On_campus_combined.csv", function (error, CO) {
        d3.csv("data/" + state + "/Disciplinary_Actions_On_campus_combined.csv", function (error, DA) {
            d3.csv("data/" + state + "/Hate_Crimes_On_campus_combined.csv", function (error, HC) {
                d3.csv("data/" + state + "/VAWA_Offenses_On_campus_combined.csv", function (error, VW) {
                    d3.csv("data/" + state + "/crime_types.csv", function (error, crimes) {
                        //Extracting the accumulated crimes data
                        var accumData = crimes.filter(function (d) {
                            return d['Survey year'] == year;
                        });
                        accumData = accumData.filter(function (d) {
                            return d['Institution name'] == university;
                        });

                        //Extracting the CO crimes data
                        var coData = CO.filter(function (d) {
                            return d['Survey year'] == year;
                        });
                        coData = coData.filter(function (d) {
                            return d['Institution name'] == university;
                        });
                        var typeNames = ['Criminal offenses', 'Disciplinary actions', 'Hate crimes', 'VAWA Offenses'];
                        var typesData = [];
                        typesData.push(coData);

                        //Extracting the DA crimes data
                        var daData = DA.filter(function (d) {
                            return d['Survey year'] == year;
                        });
                        daData = daData.filter(function (d) {
                            return d['Institution name'] == university;
                        });
                        typesData.push(daData);

                        //Extracting the HC crimes data
                        var hcData = HC.filter(function (d) {
                            return d['Survey year'] == year;
                        });
                        hcData = hcData.filter(function (d) {
                            return d['Institution name'] == university;
                        });
                        typesData.push(hcData);

                        //Extracting the VW crimes data
                        var vwData = VW.filter(function (d) {
                            return d['Survey year'] == year;
                        });
                        vwData = vwData.filter(function (d) {
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

                        var typeAbbrs = ['CO', 'DA', 'HC', 'VW'];
                        var typeInitX = 0;
                        var catInitX = 0;
                        var uniChildren = [];
                        var colNames = [CO.columns, DA.columns, HC.columns, VW.columns]
                        for (i = 0; i < 4; i++) {
                            var tempType = {
                                name: typeNames[i],
                                depth: 1,
                                dx: accumData[0][typeAbbrs[i]] / accumData[0].total,
                                dy: 0.35,
                                value: accumData[0][typeAbbrs[i]],
                                x: typeInitX,
                                y: 0.3,
                                parent: uniCrimeData
                            };
                            typeInitX += tempType.dx;
                            var typeChildren = [];
                            for (j = 4; j < colNames[i].length; j++) {
                                var tempCat = {
                                    name: colNames[i][j],
                                    depth: 2,
                                    dx: typesData[i][0][colNames[i][j]] / accumData[0].total,
                                    dy: 0.35,
                                    value: typesData[i][0][colNames[i][j]],
                                    size: typesData[i][0][colNames[i][j]],
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

                        var radius = (Math.min(self.svgWidth, self.svgHeight) / 2) - self.margin.bottom;
                        var formatNumber = d3.format(",d");

                        var x = d3.scaleLinear()
                            .range([0, 2 * Math.PI]);

                        var y = d3.scaleSqrt()
                            .range([0, radius]);

                        var color = d3.scaleOrdinal(d3.schemeCategory10);

                        var root = d3.hierarchy(uniCrimeData)
                            .sum(function (d) {
                                return d.size;
                            })
                            .sort(null);

                        var partition = d3.partition();

                        var arc = d3.arc()
                            .startAngle(function (d) {
                                return Math.max(0, Math.min(2 * Math.PI, x(d.x0)));
                            })
                            .endAngle(function (d) {
                                return Math.max(0, Math.min(2 * Math.PI, x(d.x1)));
                            })
                            .innerRadius(function (d) {
                                return Math.max(0, y(d.y0));
                            })
                            .outerRadius(function (d) {
                                return Math.max(0, y(d.y1));
                            });

                        var chartGroup = self.svg.select("g").remove();
                            chartGroup = self.svg.append("g")
                                .attr("transform", "translate(" + self.svgWidth / 2 + "," + ((self.svgHeight / 2)+self.margin.bottom) + ")");

                        var node = root;
                        chartGroup.selectAll("path")
                            .data(partition(root).descendants())
                            .enter().append("path")
                            .style('stroke', 'white')
                            .style("fill", function (d) {
                                return color((d.data.children ? d.data.name : d.data.parent.name + d.data.parent.parent.name));
                            })
                            .on("click", click);

                        var test = chartGroup.selectAll("path").append("title")
                            .text(function (d) {
                                return d.data.name + "\n" + formatNumber(d.value);
                            });

                        chartGroup.selectAll("path")
                            .transition().duration(1000)
                            .attrTween("d", arcTweenData);

                        function click(d) {
                            node = d;
                            chartGroup.selectAll("path").transition().duration(1000).attrTween("d", arcTweenZoom(d));
                        }

                        // When switching data: interpolate the arcs in data space.
                        function arcTweenData(a, i) {
                            var oi = d3.interpolate({x0: (a.x0s ? a.x0s : 0), x1: (a.x1s ? a.x1s : 0)}, a);

                            function tween(t) {
                                var b = oi(t);
                                a.x0s = b.x0;
                                a.x1s = b.x1;
                                return arc(b);
                            }

                            if (i == 0) {
                                // If we are on the first arc, adjust the x domain to match the root node
                                // at the current zoom level. (We only need to do this once.)
                                var xd = d3.interpolate(x.domain(), [node.x0, node.x1]);
                                return function (t) {
                                    x.domain(xd(t));
                                    return tween(t);
                                };
                            } else {
                                return tween;
                            }
                        }

                        // When zooming: interpolate the scales.
                        function arcTweenZoom(d) {
                            var xd = d3.interpolate(x.domain(), [d.x0, d.x1]),
                                yd = d3.interpolate(y.domain(), [d.y0, 1]),
                                yr = d3.interpolate(y.range(), [d.y0 ? 20 : 0, radius]);
                            return function (d, i) {
                                return i
                                    ? function (t) {
                                    return arc(d);
                                }
                                    : function (t) {
                                    x.domain(xd(t));
                                    y.domain(yd(t)).range(yr(t));
                                    return arc(d);
                                };
                            };
                        }

                    });
                });
            });
        });
    });

};
