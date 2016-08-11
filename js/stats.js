function statsStartup() {
	statsViz = d3.select("#stats")
	.append("svg")
	.attr("height", 300)
	.attr("width", 600)
	.attr("id", "statsViz")
        occNameArray = [];
        for (x in occupationHash) {
            occNameArray.push(x);
        }
        actNameArray = [];
        for (x in occuArray) {
            actNameArray.push(x);
        }
        selectList = occNameArray.filter(function(element,index,array) {return actNameArray.indexOf(element) == -1} ).sort()
        d3.select("#scrollSelect").select("select").selectAll("option").data(selectList).enter()
        .append("option")
        .attr("value", function(d) {return d})
        .html(function(d) {return d})
        
        statsViz.append("g").attr("id", "parentChart").attr("transform", "translate(-25,-25)")
        statsViz.append("g").attr("id", "spouseChart").attr("transform", "translate(125,-25)")
        statsViz.append("g").attr("id", "siblingChart").attr("transform", "translate(275,-25)")
        statsViz.append("g").attr("id", "childChart").attr("transform", "translate(425,-25)")
        statsViz.append("text").attr("id", "parentTotal").attr("transform", "translate(75,80)").attr("text-anchor","middle").text("")
        statsViz.append("text").attr("id", "spouseTotal").attr("transform", "translate(225,80)").attr("text-anchor","middle").text("")
        statsViz.append("text").attr("id", "siblingTotal").attr("transform", "translate(375,80)").attr("text-anchor","middle").text("")
        statsViz.append("text").attr("id", "childTotal").attr("transform", "translate(525,80)").attr("text-anchor","middle").text("")

	var loadScreen = statsViz.append("text")
	.text("Loading")
	.attr("y", 50)
	.attr("x", 20)
	.attr("id", "loadingScreen")
	
        d3.json("occ_stats.json", function(statsData) {
            exposedStatsData = statsData;
            d3.select("#loadingScreen").remove();
            
            visualizeOcc("abolitionist")
        })
}

function arraySum(inArray) {
    var aSum = 0
    for (x in inArray) {
        if (inArray[x]) {
            aSum += inArray[x].a
        }
    }
    return aSum;
}

function createPieChart(divID, dataArray) {

            d3.select("#" + divID).selectAll("g").remove();

            var childPie = d3.select("#" + divID).append("g");

            childPie
            .data([dataArray])
            .attr("transform", "translate(100,100)")
            
            arc = d3.svg.arc()
            .outerRadius(60)
            .innerRadius(20);
            
            var pie = d3.layout.pie()
                .value(function(d) {return d.a})
            
            var arcs = childPie.selectAll("g.slice")
            .data(pie);
            
            arcs.enter()
            .append("g")
            .attr("class", "slice")
            .on("mouseover", highlightOcc)
            .on("mouseout", endHighlight)
            .on("click", function(d) {visualizeOcc(d.data.t)})
            
            arcs.exit().remove();
            
            arcs.append("path")
                .attr("fill", function(d,i) {return occuArray[occupationHash[d.data.t].category].color})
                .attr("class", "occs")
                .attr("d", arc)
                .style("stroke", "none")
                .style("stroke-width", 5)
                .style("stroke-opacity", .75);


}

function changeOcc(d,i) {
    visualizeOcc(d.t);
}

function highlightOcc(d,i) {
    d3.select("#arcTitle").html('');
    d3.selectAll("path.occs")
    .style("opacity", function(p,q) {return p.data.t == (d.data ? d.data.t : d.t) ? 1 : .5})
    .style("stroke",  function(p,q) {return p.data.t == (d.data ? d.data.t : d.t) ? "red" : "none"});
    d3.selectAll("li.occs").style("opacity", function(p,q) {return p.t == (d.data ? d.data.t : d.t) ? 1 : .5})
    .style("font-weight", function(p,q) {return p.t == (d.data ? d.data.t : d.t) ? "900" : "300"});

    if (d.data) {
        d3.select("#arcTitle").html(d.data.t);
    }
}

function endHighlight(d,i) {
    d3.select("#arcTitle").html('');
    d3.selectAll("path.occs").style("opacity", 1).style("stroke", "none");
    d3.selectAll("li.occs").style("opacity", 1).style("font-weight", "300");
}

function visualizeOcc(occName) {
    d3.select("#tbDiv").selectAll("input").attr("value", "A↓")
    d3.selectAll("li.occs").remove();
    mTotal = exposedStatsData[occName].total;
            d3.select("#occTitle").html(occName +"s (" + mTotal + " tagged in Kindred Britain)")

            childArray = exposedStatsData[occName].stats.filter(function(element, index, array) {return element["r"] == "C"}).sort(function(a,b) {return parseInt(b["a"]) - parseInt(a["a"])})
            parentArray = exposedStatsData[occName].stats.filter(function(element, index, array) {return element["r"] == "P"}).sort(function(a,b) {return parseInt(b["a"]) - parseInt(a["a"])})
            spouseArray = exposedStatsData[occName].stats.filter(function(element, index, array) {return element["r"] == "Sp"}).sort(function(a,b) {return parseInt(b["a"]) - parseInt(a["a"])})
            siblingArray = exposedStatsData[occName].stats.filter(function(element, index, array) {return element["r"] == "Sb"}).sort(function(a,b) {return parseInt(b["a"]) - parseInt(a["a"])})

            d3.select("#parentTotal").text(arraySum(parentArray))
            d3.select("#spouseTotal").text(arraySum(spouseArray))
            d3.select("#siblingTotal").text(arraySum(siblingArray))
            d3.select("#childTotal").text(arraySum(childArray))
            
            parentOccs = d3.select("#parentDiv ol").selectAll("li").data(parentArray)
            parentOccs.enter().append("li").style("cursor", "pointer").attr("class","occs")
            .on("click", changeOcc).html(function(d,i) {return d.t + ": " + d.a})
            .on("mouseover", highlightOcc)
            .on("mouseout", endHighlight);
            
            spouseOccs = d3.select("#spouseDiv ol").selectAll("li").data(spouseArray)
            spouseOccs.enter().append("li").style("cursor", "pointer").attr("class","occs").on("click", changeOcc).html(function(d,i) {return d.t + ": " + d.a})
            .on("mouseover", highlightOcc)
            .on("mouseout", endHighlight);
                        
            siblingOccs = d3.select("#siblingDiv ol").selectAll("li").data(siblingArray)
            siblingOccs.enter().append("li").style("cursor", "pointer").attr("class","occs").on("click", changeOcc).html(function(d,i) {return d.t + ": " + d.a})
            .on("mouseover", highlightOcc)
            .on("mouseout", endHighlight);

            childOccs = d3.select("#childDiv ol").selectAll("li").data(childArray)
            childOccs.enter().append("li").style("cursor", "pointer").attr("class","occs").on("click", changeOcc).html(function(d,i) {return d.t + ": " + d.a})
            .on("mouseover", highlightOcc)
            .on("mouseout", endHighlight);

            if (parentArray.length > 0) {
                createPieChart("parentChart", parentArray);
            }
            if (spouseArray.length > 0) {
            createPieChart("spouseChart", spouseArray);
            }
            if (siblingArray.length > 0) {
            createPieChart("siblingChart", siblingArray);
            }
            if (childArray.length > 0) {
            createPieChart("childChart", childArray);
            }
            
            createPieChart("parentChart", parentArray);
            createPieChart("spouseChart", spouseArray);
            createPieChart("siblingChart", siblingArray);
            createPieChart("childChart", childArray);

}

function selectChange(sel) {
    visualizeOcc(sel.options[sel.selectedIndex].value);
}

function sortLi(targetDiv, currentSort,bID) {

    if (currentSort.value == 'A↓') {
        d3.select("#" + targetDiv).selectAll("li").sort(function(a,b) {
        if(a.t<b.t) return -1;
        if(a.t>b.t) return 1;
        return 0;})
        d3.select("#"+bID).attr("value", "A↑")
    }
    else if (currentSort.value == 'A↑') {
    d3.select("#" + targetDiv).selectAll("li").sort(function(a,b) {
    if(a.t>b.t) return -1;
    if(a.t<b.t) return 1;
    return 0;})
        d3.select("#"+bID).attr("value", "#↑")
    }
    else if (currentSort.value == '#↓') {
    d3.select("#" + targetDiv).selectAll("li").sort(function(a,b) {
    if(a.a>b.a) return -1;
    if(a.a<b.a) return 1;
    return 0;})
        d3.select("#"+bID).attr("value", "A↓")
    }
    else {
    d3.select("#" + targetDiv).selectAll("li").sort(function(a,b) {
    if(a.a<b.a) return -1;
    if(a.a>b.a) return 1;
    return 0;})
        d3.select("#"+bID).attr("value", "#↓")
    }
}