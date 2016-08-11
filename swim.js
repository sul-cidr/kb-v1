function runSwim(qType) {
	d3.select("#timelineViz").remove();

//	d3.json("../php/timeline_events_d3.php?i="+queryValue+"&y="+dVal+"&g="+qType, function(json) {
//		d3.json("../php/timeline_events_d3.php?i=I5906&y=1800&g=gen", function(json) {
//		items = json;
		
		items = nodes;
		var	timeBegin = d3.min(items, function(p) {return p["birthyear"]}) - 10;
		var	timeEnd = d3.max(items, function(p) {return p["end"]}) + 10;

		var newLaneDates = [0];
		var newLanes = [""];
		var currentZoom = 1;

		lanes = [];
		for (x in items) {
			lanes.push("Lane"+x);
			items[x]["lane"] = parseInt(x);
			items[x]["relation"] = "gray";
		}
		laneLength = Math.max(10,lanes.length);
		
		priestlyPacked = true;
		
		if ( qType != "ego" && qType != "path") {
		for (x in items) {
			var laned = false;
			var xx = 0;
					while (laned == false) {
						if (items[x]["birthyear"] > newLaneDates[xx]) {
							newLaneDates[xx] = items[x]["end"] + 5
							items[x]["lane"] = xx;
							laned = true;
							break;
						}
						xx++;
						if (xx > newLaneDates.length) {
							newLaneDates.push(items[x]["end"] + 5);
							items[x]["lane"] = newLanes.length;
//							newLanes.push("");
							newLanes.push("Lane"+newLanes.length);
							laned = true;
							break;
						}
			}
		}

			lanes = newLanes;
			laneLength = Math.max(10,newLanes.length);
		}
		
		var bDiv = document.getElementById("timeline");
		

		var timW = parseInt(bDiv.clientWidth),
		timH = parseInt(bDiv.clientHeight);
		
		gw = Math.max(1200,(timeEnd - timeBegin) * 15);
		gh = laneLength * 30;

		//scales
		
	timelineZoom = d3.behavior.zoom()
	    .on("zoom", redraw)
	    ;
		
		var x = d3.scale.linear()
				.domain([timeBegin, timeEnd])
				.range([0, gw]);
		var x1 = d3.scale.linear()
				.range([0, gw]);
				
				visibleX1 = x1;
		var y1 = d3.scale.linear()
				.domain([0, laneLength])
				.range([0, gh - 10]);

		var chart = d3.select("#timeline")
					.append("svg")
					.attr("id", "timelineViz")
					.attr("width", timW)
					.attr("height", timH)
					.attr("class", "chart")
					.call(timelineZoom)
					.on("mousemove", adjustTimeslice)
					.on("click", hideGuide);
				
		var main = chart.append("g")
					.attr("transform", "translate(0,0)")
					.attr("width", gw)
					.attr("height", gh)
					.attr("class", "main");
		

//	    main.append("rect").style("opacity",.01).attr("width",9999).attr("height",9999).attr("x",-5000).attr("y",-5000).style("fill","white")
		
		//main lanes and texts

	tvXAxis = d3.svg.axis()
	    .scale(x)
	    .orient("top")
	    .tickFormat(d3.format("d"))
	    .tickSubdivide(9);

    	    sliceG = chart.append("g")
	    .attr("transform", "translate(0,0)")
	    .style("pointer-events","none")
	    .attr("id","sliceLine");

	    timelineAxis = chart.append("g")
	    .attr("class", "axis")
	    .attr("id", "tlaxis")
	    .attr("transform", "translate(0,"+timH+")");
	    
	    xAxisG = timelineAxis.append("g").style("pointer-events","none").call(tvXAxis);	    
	    
	    
	    var sliceBar = sliceG.append("g").attr("id","sbarG")
	    .attr("transform","translate(100,-50)");
	    
	    sliceBar.append("line")
	    .style("fill", "none")
	    .style("stroke", "#B1AA99")
	    .style("stroke-width", "1px")
	    .style("stroke-dasharray", "1,1")
	    .attr("x1", 0)
	    .attr("y1", 0)
	    .attr("x2", 0)
	    .attr("y1", 1000)
	    .style("pointer-events","none");	    

	    function adjustTimeslice()
	    {
		
		var divHeight = parseFloat(document.getElementById("timeline").clientHeight);
		var curMouse = d3.mouse(this);
		var curYX = xyFromTranslate(sliceBar);
		var curMain = xyFromTranslate(main);

		sliceBar.attr("transform", "translate("+(curMouse[0] - curMain[0])+","+curYX[1]+")")		
		var yearOnly = Math.floor(x1.invert((curMouse[0] - curMain[0]) - (Math.floor(5 * timelineZoom.scale())))) + 1;
		var timesliceText = '';
		var yearScale = Math.max(Math.floor(1 / timelineZoom.scale()),1) * 3;
		var earlyYear = yearOnly - 2 * yearScale;
		var laterYear = yearOnly + 2 * yearScale;
		var opaRamp=d3.scale.linear().domain([-110,-5, 5,110]).range([0,1,1,0]).clamp(true);

		if (sliceBar.attr("display") != "none") {
		d3.selectAll("g.datelineText").remove();
		var realYear = -2;
		for (earlyYear;earlyYear<=laterYear;earlyYear+=yearScale) {
		var displayYear = earlyYear.toString();
			var timeSegment = sliceBar
			.insert("g","line")
			.attr("class","datelineText")
			.attr("transform","translate("+((realYear * 35) - 14)+","+(divHeight - 15)+")")
			.style("opacity", opaRamp((realYear * 35)));

			timeSegment.append("rect")
			.attr("width", 32)
			.attr("height", (6 * (dateline[(realYear + yearOnly).toString()] ? (realYear + yearOnly).toString() + " - " + dateline[(realYear + yearOnly).toString()] : (realYear + yearOnly).toString()).length) + 70)
			.attr("y", -((6 * (dateline[(realYear + yearOnly).toString()] ? (realYear + yearOnly).toString() + " - " + dateline[(realYear + yearOnly).toString()] : (realYear + yearOnly).toString()).length) + 10))
			.attr("x", -18)
			.attr("rx", 4)
			.attr("ry", 4)
			.style("fill", "white")
			
			timeSegment.append("text").text(dateline[(realYear + yearOnly).toString()] ? (realYear + yearOnly).toString() + " - " + dateline[(realYear + yearOnly).toString()] : (realYear + yearOnly).toString())
			.attr("transform","rotate(-90)")
			.style("pointer-events","none")
			.style("font-size","12px")
			.style("color", "#808080");
			realYear++;
			
		}
		}
		
		
	    }
	    
		timelineZoom.translate([0,22]);
		
		itemRects = main.append("g");
	
		display();

		function redraw() {
			
		timW = document.getElementById("timeline").clientWidth,
		timH = document.getElementById("timeline").clientHeight;
		
		var zoomedQ = false;

			if (currentZoom != timelineZoom.scale()) {
			zoomedQ = true;
			var newH = (laneLength * (30 * timelineZoom.scale()));
			var newW = Math.max(1200,(timeEnd - timeBegin) * 15) * timelineZoom.scale();
			if ((((newH + 200) > (timH)) || ((newW + 200) > (timW))) && (!(newH > 1000))) {
					currentZoom = timelineZoom.scale();
					redisplayTimeline(newH,newW);
				}
				else {
					timelineZoom.scale(currentZoom);
				}
			}


		    var tx = Math.max(Math.min(d3.event.translate[0],100),(-1 * ((x1(timeEnd) - timW) + 100)));
		    var ty = Math.max(Math.min(d3.event.translate[1],100),(-1 * ((y1(laneLength) - timH) + 100)));


		timelineZoom.translate([tx,ty]);
		    
		    	var curTAYX = xyFromTranslate(timelineAxis);
		    	var curMaYX = xyFromTranslate(main);
			
				main.attr("transform", "translate("+tx+","+ty+")");
				timelineAxis.attr("transform", "translate("+tx+","+curTAYX[1]+")");
//				if (zoomedQ == false) {
				sliceG.attr("transform", "translate("+tx+",40)");
//				}
				updateTimelineAxis();

		}
		

		function redisplayTimeline(newH, newW) {
			
			eventViewOff();
			
			x1.range([0,Math.max(timW - 200,newW - 200)]);
			tvAxisScale = x1;

			var newBegin = tvAxisScale.invert(0)
			var newEnd = tvAxisScale.invert(0)

			var x1StepSize = x1(timeBegin + 1);
			
			y1.range([0, Math.max((timH - 50),(newH - 50))]);
			var barHeight = (Math.max((timH - 50),(newH - 50)) / laneLength) / 2			
//.ticks(parseInt(x1StepSize * 5))

			itemRects.selectAll("g.timelines")
			.attr("transform",function(d) {return "translate("+x1(d.birthyear)+","+y1(d.lane)+")"})

			itemRects.selectAll("rect.timelineBar")
			.attr("width", function(d) {return x1(d.end) - x1(d.birthyear);})
			.attr("height", barHeight)

			itemRects.selectAll("rect.timelineopacfilter")
			.attr("width", function(d) {return x1(d.end) - x1(d.birthyear);})
			.attr("height", barHeight)

			adjustEvents(barHeight);

			itemRects.selectAll("rect.aevents")
			.attr("x", function (b, j) { return (b.year * x1StepSize) - (barHeight / 2) });

			itemRects.selectAll("rect.uaevents")
			.attr("x", function (b, j) { return (b.year * x1StepSize) - (barHeight / 2) });

		}
		
		function display() {

			x1.domain([timeBegin, timeEnd]).range([0,gw * timelineZoom.scale()]);
			
			var x1StepSize = x1(timeBegin + 1);

			//update main item rects
			rects = itemRects.selectAll("g")
			        .data(items, function(d) { return d.id; })
			        .enter().append("g")
			        .attr("transform",function(d) {return "translate("+x1(d.birthyear)+","+y1(d.lane)+")"})
			        .attr("class", "timelines")
			        .attr("id", function(d) {return "timelineG" + d.id})
      				.on("click", function(d) { d3.event.stopPropagation(); highlightNode(d.id);})
      				.on("mouseout", anyOut)
        			.each(function(d) {
        				var g = d3.select(this);
        				g.append("rect")
				.attr("class", function(d) {return "miniItem" + d.lane;})
				.attr("class", "timelineBar")
				.attr("id", function(d) {return "timelineBar" + d.id})
				.attr("width", function(d) {return x1(d.end) - x1(d.birthyear);})
				.attr("height", 15)
   				.on("mouseover", timelineBarOver)
   				.attr("rx", 4)
   				.attr("ry", 4)
				.style("fill", function(d) {
	return d.image == 'male' ? slightlyRandomColor('#67ccff',colorVariance) : slightlyRandomColor('#caa6ff',colorVariance)
				})
				.style("opacity", 1)
	    	    ;
				g.append("rect")
				.attr("class", function(d) {return "miniItem" + d.lane;})
				.attr("class", "timelineopacfilter")
				.attr("width", function(d) {return x1(d.end) - x1(d.birthyear);})
				.attr("height", 15)
   				.style("pointer-events","none")
   				.attr("rx", 4)
   				.attr("ry", 4)
				.style("fill", "black")
				.style("opacity", .25)
	    	    ;
        				var aeventsG = g.selectAll("g.aevents")
        					.data(d.aevents)
        						.enter().append("g")
        						.attr("class","aevents")
							.attr("transform", "translate(" + function (b, j) { return (b.year * x1StepSize) - 7.5 } +",0)")
							// kg: the following line renders timeline improperly
							// .attr("transform", function(b, j) { return "translate(" + (b.year * x1StepSize - 7.5) + ",0)" })        					
							.on("mouseover", timelineBarOver);

        						aeventsG.append("rect")
							.attr("class","aevents")
							.attr("rx", 20)
        						.attr("ry", 20)
        						.attr("width", 15)
        						.attr("height", 15)
							.each(function(b) {b["actyear"] = d.birthyear + b.year})
							.style("fill", function (b) {return b.eventtype == "BIRT" ? "#005826" : "#7A0026"})
							.style("stroke-width", 0)
        						.style("opacity", .5)
							
        						aeventsG.append("rect")
							.attr("class","uaevents")
							.attr("rx", 20)
        						.attr("ry", 20)
        						.attr("width", 15)
        						.attr("height", 15)
							.each(function(b) {b["actyear"] = d.birthyear + b.year})
        						.style("fill", function(b) { return slightlyRandomColor(eventColor[b.eventtype],colorVariance)})
        						.style("stroke", function(b) {return b.accuracy == 'known' ? 'none' : 'black'})
							.style("stroke-width", "1px")
        						.style("stroke-linecap", "round")
        						.style("stroke-dasharray", function(b) {return (b.accuracy == 'known' ? "0" : (b.accuracy == 'estimated' ? "5,5" : "2,5")) })
        						.style("opacity", 1)
        						.style("stroke-width", 0);
							        						aeventsG.append("rect")

			    });

			//update the item labels
			timelineLabels = itemRects.selectAll("text")
				.data(items, function (d) { return d.id; })
				.attr("x", function(d) {return x1(Math.max(d.birthyear, timeBegin) + 2);});

			timelineLabels.enter().append("text")
				.text('')
				.attr("x", function(d) {return x1(Math.max(d.birthyear, timeBegin));})
				.attr("y", function(d) {return y1(d.lane + 12);})
				.attr("text-anchor", "start")
				.style("opacity",0);

			timelineLabels.exit().remove();
			aevents = d3.selectAll("rect.aevents");
			
			adjustEvents(15);
			
			redisplayTimeline((laneLength * (30 * timelineZoom.scale())), Math.max(1200,(timeEnd - timeBegin) * 15) * timelineZoom.scale())
		    initialTimelinePosition();

		}
	resetButtons();
	hideGuide();
	resizePanes();

}

		function updateTimelineAxis() {
			timW = document.getElementById("timeline").clientWidth;
			var tz = timelineZoom.translate();
			var timelineScale = d3.scale.linear().domain([visibleX1.invert(-tz[0]),visibleX1.invert(-tz[0] + timW)]).range([-tz[0],-tz[0]+timW])
			tvXAxis.scale(timelineScale)
			xAxisG.call(tvXAxis);
		}

function initialTimelinePosition() {
    	var meanBirth = d3.mean(nodes, function(p) {return p["birthyear"]});
	moveTimeline(1000,(meanBirth),20);
	
}

function fromHex(hexInput) {
	r = hexToR(hexInput);
	g = hexToG(hexInput);
	b = hexToB(hexInput);
	 
	function hexToR(h) {return parseInt((cutHex(h)).substring(0,2),16)}
	function hexToG(h) {return parseInt((cutHex(h)).substring(2,4),16)}
	function hexToB(h) {return parseInt((cutHex(h)).substring(4,6),16)}
	function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h}
	return [r,g,b];
	}


function slightlyRandomColor(hexColor, range) {
	var rgbColor = fromHex(hexColor);
	var r = rgbColor[0];
	var g = rgbColor[1];
	var b = rgbColor[2]
    r = r + (Math.floor(Math.random() * range) - Math.floor(range / 2));
    g = g + (Math.floor(Math.random() * range) - Math.floor(range / 2));
    b = b + (Math.floor(Math.random() * range) - Math.floor(range / 2));
    return "rgb("+r+","+g+","+b+")"
  }
  
  	    function hideGuide() {
		d3.selectAll(".timelineGuideButton").classed("active", false);
		if (d3.select("#sbarG").attr("display") == "none") {
			d3.select("#sbarG").attr("display", "block")
			d3.select("#tBVs").classed("active", true);
			_gaq.push(['_trackEvent', 'layoutEvent', "hide_guide"]);
		}
		else {
			d3.select("#sbarG").attr("display", "none");
			d3.select("#tBVh").classed("active", true);	
		}
	    }


