groupPath = function(d) {
    return "M" + 
      d3.geom.hull(d.values.map(function(i) { return [i.x, i.y]; }))
        .join("L")
    + "Z";
};

function addHull() {
	if (hullsActive == false) {
		createHull();
	}
	else {
		networkVis.selectAll("path.hull").remove();
		hullsActive = false;
	}

}
function createHull() {
	hullsActive = true;
	networkVis.selectAll("path.hull").remove();
//	groups_old = d3.nest().key(function(d) { return d.gender; }).entries(nodes);

	occuArray = {"bus-fin-prop": {"name": "bus-fin-prop","color": "green", "x": 0, "y": 0},
			"colonies": {"name": "colonies","color": "khaki", "x": -1, "y": 0},
			"politics": {"name": "politics","color": "blue", "x": -2, "y": 0},
			"dipl-civsvc": {"name": "dipl-civsvc","color": "cyan", "x": -3, "y": 0},
			"law": {"name": "law","color": "floralwhite", "x": -4, "y": 0},
			"medicine": {"name": "medicine","color": "red", "x": -5, "y": 0},
			"royalty-court": {"name": "royalty-court","color": "purple", "x": 0, "y": 1},
			"armed-svcs": {"name": "armed-svcs","color": "gold", "x": -1, "y": 1},
			"religion": {"name": "religion","color": "darkslategrey", "x": -2, "y": 1},
			"arts-hum-schol": {"name": "arts-hum-schol","color": "fuchsia", "x": -3, "y": 1},
			"education": {"name": "education","color": "hotpink", "x": 0, "y": 2},
			"nature": {"name": "nature","color": "darkseagreen", "x": -1, "y": 2},
			"science-eng": {"name": "science-eng","color": "mediumpurple", "x": -2, "y": 2},
			"society": {"name": "society","color": "peachpuff", "x": 0, "y": 3},
			"hoi-polloi": {"name": "hoi-polloi","color": "gray", "x": -1, "y": 3},
			"other": {"name": "other","color": "gray", "x": 0, "y": 4}
			}
	
	groups = [];
	for (occX in occuArray) {
		groups.push({key: occuArray[occX]["name"], values: [], color: occuArray[occX]["color"], id: "O"+occX, size: 1, birthyear: 1})
		for (nodeX in nodes) {
			if (nodes[nodeX].birthyear > 100) {
			if ((nodes[nodeX].occus.indexOf(occuArray[occX]["name"])) > -1) {
				groups[(groups.length - 1)]["values"].push(nodes[nodeX])
			}
			else {
			}
			}
		}
		if (groups[(groups.length - 1)]["values"].length == 0) {
			groups.pop();
		}
	}
	
	networkVis.selectAll("path.hull")
	    .data(groups)
	      .attr("d", groupPath)
	    .enter().append("path")
	      .attr("class","hull")
//	      .style("fill", "none")
	      .style("fill", function(d) {return d.color})
	      .style("stroke", function(d) {return d.color})
	      .style("stroke-width", 20)
	      .style("stroke-linejoin", "round")
	      .style("opacity", .5)
	      .attr("d", groupPath);

	if (occNodes == false) {
		addOccNodes();
	}
}

m0 = null;

d3.select(window)
    .on("mousemove", mousemove)
    .on("mouseup", 	removeNodeMenu);

///////////
function newsClick(individ) {
	pathViz(individ);

}

function newsFeed(t, objectType) {
	var dValue = parseInt([document.getElementById("yearBox").value]);
//	var dValue = 1750;
	
	var executedQuery = newsPersonQuery;
	var runPersonEvents = false;
	if (objectType == 'loc') {
		executedQuery = newsPlaceQuery;
		runSwim(t, dValue,"loc");	
	}
	else if (objectType == 'occ') {
		executedQuery = newsOccupationQuery;
		runSwim(t, dValue,"occ");
		placeOnMap(t, "occ");
		viz01(t,"occ");
	}

	else if (objectType == 'name') {
		executedQuery = newsOccupationQuery;
		runSwim(t, dValue,"name");
		placeOnMap(t, "name");
		viz01(t,"name");
	}
	else {
		runPersonEvents = true;
	}

	d3.selectAll(".plsites").remove();
	d3.selectAll(".plevents").remove();	
	d3.selectAll(".other").remove();
	

	var div = d3.select("#bio").style("padding", "5px").style("opacity", 0);

	  d3.json(executedQuery + t + "&y="+dValue + "&q="+objectType, function(json) {
		  
		  news = json;
		  var prefix = "Not set";
		  if (runPersonEvents == true) {
			  prefix = '' + json.indiv.firstname + ' ';
		  }
		  else if (objectType == "occ") {
			  prefix = "Occupation: ";
		  }
		  else if (objectType == "loc") {
			  prefix = "Location: "
		  }
		  else if (objectType == "name") {
			  prefix = "Surname: "
		  }
		  div
		  .append("img").attr("align","right").attr("class", "plsites").attr("src", "images/sample.png");

		  div
		  .append("p").attr("class", "plsites").html("<h1>"+prefix+'<a href="#" onclick="newsFeed(\''+json.indiv.name+'\',\'name\')" class="focusAction" title: "NameFocus">'+json.indiv.name+"</a></h1>");

		  occuTabs = div.append("ol").attr("class", "other").attr("id", "navlist")
		  
		  occuTabs.selectAll("li")
	      .data(json.indiv.occu)
	      .enter()
	      .append("li")
	      .attr("class", "occus")
	      .html(function(d) {return '<a href="#" onclick="newsFeed(\''+occu_id[d]+'\',\'occ\')" class="focusAction" title: "OccuFocus"><img src="icons/'+d+'.png" title="'+d+'" alt="'+d+'" height="22" width="22"></a>'})
    	  .style("cursor", "pointer")
	      ;
		  
		  if (json.indiv.tragedy > 0) {
			  occuTabs
			  .append("li")
			  .html("TRAGEDY! " + json.indiv.tragedy)
		  }

		  if (json.indiv.inbred > 0) {
			  occuTabs
			  .append("li")
			  .html("INBRED! " + json.indiv.inbred)			  
		  }

		  div
		  .append("p")
	      .attr("class", "other")
		  .html("Here we might put some information about the selected individual, which could be drawn from linked data, or from the entries in the original PHPGedview site, or from the vignette narratives in which this individual is mentioned. Additionally, you can see over to the right that we can embed an image associated with this individual. While this text and that image are static, this can be based dynamically off of the selected individual...");

		  if (runPersonEvents == true) {
		  div
		  .append("p")
	      .attr("class", "other")
		  .html("<h3>Events</h3>");
		  
		  plsites = div.selectAll("p.plevents")
	      .data(json.events)
	      .enter()
	      .append("p")
	      .attr("class", "plevents")
	      .html(function(d) {return '' + d.fullname +''})
	      ;
		  }

		  div
		  .append("p")
	      .attr("class", "plsites")
		  .html("<h3>Events from Similar Individuals</h3>");

		  plsites = div.selectAll("p.plsites")
		      .data(json.nodes)
		      .enter()
		      .append("p")
		      .attr("class", "plsites")
		      .html(function(d) {return '<a href="#" onclick="newsClick(\''+d.indiv_id+'\')" class="pathAction" title: "Path to X.">' + d.fullname +'</a>'})
	    	  .style("cursor", "pointer")
		      ;
	      
		  div.transition().delay(500).duration(1000).style("opacity", 1);

			fixNode(currentFocusID, 250, 100,'kin');

	  })

}

function startDrag() {
	initialY = d3.event.pageY;
	m0 = this.id;
}

function mousemove() {
	
	if(m0) {
	  d3.select(m0)
		  .text(initialY - d3.event.pageY)
		  ;
	}
	
	}

function mouseup() {
//	console.log("up!");
		  m0 = null;
	}

function pathViz(inputID) {

	setWhenRamp();
	if (networkStarted == true) {
		networkVis.remove();
	}
	else {
		networkStarted = true
	}
	if (inputID != 'again') {
		targetID = inputID;
		sourceID = currentFocusID;
		currentFocusID = targetID;
		lastFocusID = sourceID;
		}
	else {
		targetID = currentFocusID;
		sourceID = lastFocusID;
	}
	if (inputID == 'Form') {
		targetID = [document.getElementById("idInputBox").value];
		currentFocusID = targetID;
		}

// ignore if there's already one
	
//w = document.getElementById("netViz1").offsetWidth

		nodeHash = new Array();

		force = d3.layout.force()
		.gravity(.05)
		.distance(graphDistance)
		//.distance(function (d) {return linkramp(d.source.weight + d.target.weight)})
		.charge(-200)
		.size([w, h]);

		nodes = force.nodes(),
		links = force.links();
		
		networkVis = d3.select("#network").append("svg:svg")
		.attr("width", w)
		.attr("height", h)
		.attr("id", "foregroundSVG")
		.on("click",  clearMenuClick);
		
		bgNetworkVis = d3.select("#network").append("g")
		.on("click",  clearMenuClick);
		
		networkVis.append("svg:rect")
		.attr("width", 200)
		.attr("height", 23)
		.attr("x", 125)
		.attr("rx", 5)
		.attr("y", 507)
		.style("fill", "tan")
		.style("stroke", "brown")
		.style("stroke-width", 2)
		.style("cursor", "pointer")
		.on("click",  function() {restartNetwork(targetID)});
		
		networkVis.append("svg:text")
		.attr("x", 130)
		.attr("y", 525)
		.style("cursor", "pointer")
		.text(function () {return "Continue on to " + targetID})
		.on("click",  function() {restartNetwork(targetID)});
		
		var selectiontext = networkVis.selectAll("text.stressLevel")
		.data("Y")
		.enter().append("text")
		.attr("x", 5)
		.attr("y", 5)
		.text(function(d) { return d})
		.attr("id", "descriptionText")
		.style("font-weight", 900)
		;
		
		var selectiontext = networkVis.selectAll("text.stressLevel")
		.data("X")
		.enter().append("text")
		.attr("x", 130)
		.attr("y", 430)
		.text(function(d) { return d})
		.attr("id", "nodetitle")
		;
		
		force.on("tick", tick);
		
		function step1() {
			linkTypeCount = {"green": 0, "purple": 0, "blue": 0};
			activeNodesList = "";
		//	var bValue = [document.getElementById("beforeValue").value];
		//	var aValue = [document.getElementById("afterValue").value];
			var bValue = 0;
			var aValue = 0;
			var cValue = 0;
			switch(document.getElementById("pathselect").value)
			{
			case "any":				
				break;
			case "forward":
				aValue = 1;
				break;
			case "backward":
				bValue = 1;
				break;
			case "between":
				aValue = 1;
				bValue = 1;
				break;
			case "ancestry":
				cValue = 1;
				break;
			}
		//	d3.select(document.getElementById(sourceID)).attr("fill")
			d3.json(pathQuery + sourceID + "&t=" + targetID + "&b="+bValue+"&a="+aValue+"&c="+cValue, function(json) {
				
			    for ( x = 0; x < json.nodes.length; x++ ) {
			    	nodes.push(json.nodes[x]);
			    	nodeHash[String(json.nodes[x].id)] = x;
			    	activeNodesList += "'" + json.nodes[x].id + "'" + ((json.nodes.length - 1) == x ? '' : ',');
			    }
		
			    for ( x = 0; x < json.links.length; x++ ) {
			    	links.push({source: json.nodes[json.links[x].source], target: json.nodes[json.links[x].target], "relation": json.links[x].relation, "id": json.links[x].id });
			    	linkTypeCount[json.links[x].relation] += 1;
		
			    }
			    linkCountViz(linkTypeCount);
				occuViz(json.occu);

			    resizedNodes = false
			    restart();
			    
				fixNode(currentFocusID, 250, 100,'path');
		
			}
			)
		}
		addLegend();
		step1();

		d3.select("#descriptionText")
		.attr("transform", "rotate(90 30 30)")
		.text(function(d) { return "The path from " + sourceID + " to " + targetID });

//////////////////////////


//////////////////////////

//createTimeSlider();

} //end pathViz()

function triangulateViz(inputData) {

	var selectiontext = networkVis.selectAll("text.smallworld")
    .data(inputData)
    .enter()
    .append("text")
    .attr("class", "smallworld")
    .attr("x", 80)
    .attr("y", function(d,i) {return 480 + (i * 15)})
    .text(function(d)  {return "" + d.name + ": " + d.distance})
    .on("click", function(d) {pathViz(d.id)})
    ;

}

function occuViz(inputData) {

	////////////
	
	occuArray = {"bus-fin-prop": {"color": "green", "x": 0, "y": 0},
			"colonies": {"color": "khaki", "x": -1, "y": 0},
			"politics": {"color": "blue", "x": -2, "y": 0},
			"dipl-civsvc": {"color": "cyan", "x": -3, "y": 0},
			"law": {"color": "floralwhite", "x": -4, "y": 0},
			"medicine": {"color": "red", "x": -5, "y": 0},
			"royalty-court": {"color": "purple", "x": 0, "y": 1},
			"armed-svcs": {"color": "gold", "x": -1, "y": 1},
			"religion": {"color": "darkslategrey", "x": -2, "y": 1},
			"arts-hum-schol": {"color": "fuchsia", "x": -3, "y": 1},
			"education": {"color": "hotpink", "x": 0, "y": 2},
			"nature": {"color": "darkseagreen", "x": -1, "y": 2},
			"science-eng": {"color": "mediumpurple", "x": -2, "y": 2},
			"society": {"color": "peachpuff", "x": 0, "y": 3},
			"hoi-polloi": {"color": "gray", "x": -1, "y": 3},
			"other": {"color": "gray", "x": 0, "y": 4}
			}

/*	networkVis
	  .append("rect")
	  .attr("height", 60)
	  .attr("width", 60)
	  .attr("x", 200)
	  .attr("y", 50)
	  .style("fill", "white");
*/

	occnodes = networkVis.selectAll("g.occnode")
  	  .data(inputData)
  	  .enter()
  	  .append("g")
      .attr("transform", function(d, i) { return "translate("+((occuArray[d.activity].x * 20) + 375)+","+((occuArray[d.activity].y * 20) + 5)+")" })
      ;
	
  	occnodes
  	.append("rect")
      .attr("y", 1)
      .attr("x", 1)
      .attr("height", 20)
      .attr("width", 20)
      .style("opacity", function(d, i) { return Math.max((d.total * .1),.25) })
      .style("fill", function(d) { return occuArray[d.activity].color })
      .style("stroke", "white")
      .style("stroke-width", 1)
  	  .attr("class", "occnode")
  	  .on("mouseover", function (d) {highlightOcc(d.activity) })
  	  .on("mouseout", function () { d3.selectAll("g.node").style('opacity', 1); })
  	.transition()
	.delay(function (d,i) {return (i * 100) + 5000})
	.duration(500)
	.style("stroke", "blue")
	.style("stroke-width", 3)
  	.transition()
	.delay(function (d,i) {return (i * 100) + 5500})
	.duration(500)
	.style("stroke", "white")
	.style("stroke-width", 1);
  	  ;
  	  
  	occnodes
    .append("svg:title")
	.text(function(d) {return "" + d.activity + ": " + d.total})
	;
  	
  	/*

	var selectiontext = networkVis
    .append("text")
    .attr("class", "occu")
    .attr("x", 150)
    .attr("y", 150)
    .text(function(d)  {return "" + inputData})
    ;
    */
/*
setInterval(function(){
  occnodes.push({id: ~~(Math.random() * foci.length)});
  force.start();

  networkVis.selectAll("circle.node")
      .data(occnodes)
    .enter().append("svg:circle")
      .attr("class", "node")
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; })
      .attr("r", 8)
      .style("fill", function(d) { return fill(d.id); })
      .style("stroke", function(d) { return d3.rgb(fill(d.id)).darker(2); })
      .style("stroke-width", 1.5)
      .call(force.drag);
}, 1000);
*/

}

function highlightOcc(occInput) {
	d3.selectAll("g.node")
	.style('opacity', function (d,i) { return d.occus.indexOf(occInput) > -1 ? 1 : .2});
}


function linkCountViz(inputObject) {
    networkVis
    .append("svg:text")
    .attr("x", 40)
    .attr("y", 580)
    .text("Edges - Marriage: " + inputObject.green + " Lineage: " + inputObject.blue + " Sibling: " +inputObject.purple)
    ;

}

function viz01(initialIDValue, initialType, initialDepth) {	hullsActive = false;
	occNodes = false;
	if (networkStarted == true) {
		networkVis.remove();
	}
	else {
		networkStarted = true
	}// ignore if there's already one
	//w = document.getElementById("netViz1").offsetWidth		colorramp=d3.scale.linear().domain([0,100,400]).range(["red","yellow","blue"]);		opacityramp=d3.scale.linear().domain([0,75,400]).range([1.0,.5,.1]).clamp(true);		linkramp=d3.scale.linear().domain([2,10,40]).range([50,100,300]).clamp(true);				nodeHash = new Array();				force = d3.layout.force()		.gravity(.10)		.distance(50)		//.distance(function (d) {return linkramp(d.source.weight + d.target.weight)})		.charge(-50)		.size([w, h]);
		
		if (initialType == "gen") {
			force.gravity(.05).distance(graphDistance).charge(-200);
		}				nodes = force.nodes(),		links = force.links();
				networkVis = d3.select("#network").append("svg:svg")		.attr("width", w)		.attr("height", h)		.attr("id", "foregroundSVG")		.attr("viewBox", "0 0 " + w +" " + h)
		.attr("preserveAspectRatio", "xMinYMin meet")
		.on("click",  clearMenuClick)
		;
		
		bgNetworkVis = d3.select("#network").append("g")
		.attr("id", "backgroundSVG")
		;
		
		var selectiontext = networkVis.selectAll("text.stressLevel")
		.data("Y")
		.enter().append("text")
		.attr("x", 5)
		.attr("y", 5)
		.text(function(d) { return d})
		.attr("id", "descriptionText")
		;
						var selectiontext = networkVis.selectAll("text.stressLevel")		.data("X")		.enter().append("text")		.attr("x", 130)		.attr("y", 450)		.text(function(d) { return d})		.attr("id", "nodetitle")		;				force.on("tick", tick);				function step1() {			linkTypeCount = {"green": 0, "purple": 0, "blue": 0};
			activeNodesList = "";
			if (initialType == "ego") {
				var pathClick = egoQuery + initialIDValue + "&q=gen&y="+whenVal;
			}
			else if (initialType == "kin") {
				var pathClick = kinQuery + initialIDValue + "&fb=" + initialDirection + "&d=" + initialDepth;
			}
			else if (initialType == "loc") {
				var pathClick = egoQuery + initialIDValue + "&q=loc&y="+whenVal;				
			}			else if (initialType == "occ") {
				var pathClick = egoQuery + initialIDValue + "&q=occ&y="+whenVal;				
			}
			else if (initialType == "name") {
				var pathClick = egoQuery + initialIDValue + "&q=name&y="+whenVal;				
			}
			else {
				var pathClick = egoQuery + initialIDValue + "&q=gen&y="+whenVal;
			}
			d3.json(pathClick, function(json) {							    for ( x = 0; x < json.nodes.length; x++ ) {			    	nodes.push(json.nodes[x]);			    	nodeHash[json.nodes[x].id] = x;			    	activeNodesList += "'" + json.nodes[x].id + "'" + ((json.nodes.length - 1) == x ? '' : ',');			    }					    for ( x = 0; x < json.links.length; x++ ) {			    	links.push({source: json.nodes[json.links[x].source], target: json.nodes[json.links[x].target], "relation": json.links[x].relation, "id": json.links[x].id });			    	linkTypeCount[json.links[x].relation] += 1;
		
			    }
			    
			    linkCountViz(linkTypeCount);
				occuViz(json.occu);
				
				if (initialType == "ego") {
					nextViz(currentFocusID);			    					resizedNodes = false
					triangulateViz(json.smallworld);
				}
				console.log(initialType);
			    			  restart();
			    
			    
					}			)		}
				addLegend();		restart();		step1();
//createTimeSlider();

} //end viz01()
function addLegend() {
	timeGradient = networkVis.append("svg:defs")
	.append("svg:linearGradient")
	  .attr("id", "gradient")
	  .attr("x1", "50%")
	  .attr("y1", "0%")
	  .attr("x2", "50%")
	  .attr("y2", "100%")
	  .attr("spreadMethod", "pad");

	timeGradient.append("svg:stop")
	  .attr("offset", "0%")
	  .attr("stop-color", "mediumblue")
	  .attr("stop-opacity", 1);

	timeGradient.append("svg:stop")
	  .attr("offset", "50%")
	  .attr("stop-color", "yellow")
	  .attr("stop-opacity", 1);
	
	timeGradient.append("svg:stop")
	  .attr("offset", "100%")
	  .attr("stop-color", "red")
	  .attr("stop-opacity", 1);

	networkVis.append("svg:rect")
	  .attr("width", 30)
	  .attr("height", 200)
	  .attr("x", 320)
	  .attr("y", 200)
	  .style("fill", "url(#gradient)");

	
	legendText = networkVis.selectAll("text.legendText")
	.data([beforeVal,whenVal,afterVal])
	.enter()
	.append("text")
	.attr("id", function(d,i) {return "legendText" + i})
	.attr("class", "legendText")
	.attr("x", 355)
	.attr("y", function(d,i) { return (i * 100) + 205})
	.text(function(d) { return d})
	.on("mousedown",startDrag);
	
}
function tick() {	networkVis.selectAll("g.node")	      .attr("transform", function(d) { return "translate(" + Math.min(Math.max(d.x,0),350) + "," + Math.min(Math.max(d.y,0),600) + ")"; });
	/*	networkVis.selectAll("line.link")      .attr("x1", function(d) { return d.source.x; })      .attr("y1", function(d) { return d.source.y; })      .attr("x2", function(d) { return d.target.x; })      .attr("y2", function(d) { return d.target.y; })      .attr("id", function(d, i) { return "lineid_" + d.id; })      .style("opacity", function(d) { return opacityramp(Math.sqrt(Math.pow(Math.abs((d.target.x) - (d.source.x)),2) + Math.pow(Math.abs((d.target.y) - (d.source.y)),2))) })      ;
	*/
	
	networkVis.selectAll("path.link")
	.attr("d", function(d) {
    var dx = d.target.x - d.source.x,
        dy = d.target.y - d.source.y,
        dr = (d.relation == "purple" ? 0 : Math.sqrt(dx * dx + dy * dy));
    return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
  })
    .attr("id", function(d, i) { return "lineid_" + d.id; })
    .style("opacity", function(d) { return opacityramp(Math.sqrt(Math.pow(Math.abs((d.target.x) - (d.source.x)),2) + Math.pow(Math.abs((d.target.y) - (d.source.y)),2))) })
    .style("stroke-width", function(d) {return d.relation == "green" ? 5 : 2})
    ;
	  	  	networkVis.selectAll("circle.arrowhead")      .attr("cx", function(d) { return ((d.target.x * .9) + (d.source.x * .1)) })      .attr("cy", function(d) { return ((d.target.y * .9) + (d.source.y * .1)) });	if (resizedNodes == false) {
		nodeSizeImportance();		if (degreeSize == true) {	      nodeSizeWeight();		}	}
	
	if (hullsActive == true){
		createHull();
	}
	}
function restartNetwork(sentID) {
	if (sentID == "Form") {
		sentID = [document.getElementById("idInputBox").value];
	}
	var dValue = parseInt([document.getElementById("yearBox").value]);
	viz01(sentID,"ego");
	placeOnMap(sentID,"gen");
	runSwim(sentID,dValue,"gen");
}
function addNodesText(sentID) {

	    for ( sent = 0; sent < sentID.length; sent++ ) {	var pathClick = egoQuery + sentID[sent];    	d3.json(pathClick, function(json) {	    for ( x = 0; x < json.nodes.length; x++ ) {	    	var found = false;		    for ( y = 0; y < nodes.length; y++ ) {		    	if (nodes[y].id == json.nodes[x].id) {		    		found = true;		    		break;		    	}		    }		    if (found == false) {	    	nodes.push(json.nodes[x]);	    	nodeHash[json.nodes[x].id] = nodes.length - 1;		    }	    }	    	    for ( x = 0; x < json.links.length; x++ ) {	    	var found = false;		    for ( y = 0; y < links.length; y++ ) {		    	if (links[y].id == json.links[x].id) {		    		found = true;		    		break;		    	}		    }		    if (found == false) {		    	links.push({source: nodes[nodeHash[json.links[x].sid]], target: nodes[nodeHash[json.links[x].tid]], "relation": json.links[x].relation, "id": json.links[x].id });		    }
	    }  	  restart();	})	}	}
function restart() {	  var link = networkVis.selectAll("path.link")	      .data(links, function(d) { return d.source.id + "-" + d.target.id; });	  	  link.enter().insert("svg:path", "g.node")  .attr("class", "link")    .attr("fill", "none")//  	.attr("stroke", function(d) { return d.relation != 'purple' ? (d.relation) : "none"})
   	.attr("stroke", function(d) { return d.relation })  	.attr("id", function(d, i) { return ("lineid_"+i)})  	.style("stroke-width", 4)	  	;	  	  link.exit().remove();	  	  /*	  var arhead = networkVis.selectAll("circle.arrowhead")  .data(links, function(d) { return d.source.id + "-" + d.target.id; });arhead.enter().insert("svg:circle", "g.node").attr("class", "arrowhead").attr("fill", function(d) { return (d.color)})	.attr("stroke", function(d) { return (d.color)})	.style("stroke-width", function(d) { return (d.relation == "spouseOf") ? 0 : 1})	.attr("r", function(d) { return (d.relation == "spouseOf") ? 0 : 2})	.style("opacity", .4);	;arhead.exit().remove();	  	
	*/
	  
	  
/* HOW TO CHANGE A LINE WIDTH ON-THE-FLY	var testline = networkVis.select("#lineid_3")	.style("stroke-width", 8);
	*/	  var node = networkVis.selectAll("g.node")  .data(nodes, function(d) { return d.id})  ;	  var nodeEnter = node.enter().append("svg:g")  .attr("class", "node")  .call(force.drag)  .attr("id", function(d) { return (d.id)})	  .on("dblclick", addNodes)
	  .on("mouseover", nodeOver)
//	  .on("click", nodeClick)
	  .on("click", function(d) {createSearchTable(d)})
      .style("cursor", "pointer")
		;	  nodeEnter.append("svg:rect")	  .attr("class", "nodeBackground")	  .attr("height", function(d) { return (d.size)})	  .attr("width", function(d) { return (d.size/2)})	  .attr("x", function(d) { return -((d.size)/2)})	  .attr("y", function(d) { return -((d.size)/4)})	  .attr("rx", 100)	  .attr("rx", 100)
//	  .attr("fill", function(d) { return (d.color)})	  .attr("fill", function(d) { return (whenRamp(d.birthyear))})
	  .attr("id", function(d) { return ("nodebc_" + d.id)})	  .attr("stroke", "none")	  .style("opacity", 1)	  ;	  		    nodeEnter.append("svg:image")	        .attr("class", "nodeImage")		    .attr("xlink:href", function(d) { return ("icons/" + d.image + ".svg")})	        .attr("x", function(d) { return -((d.size)/2)})	        .attr("y", function(d) { return -((d.size)/2)})	        .attr("width", function(d) { return (d.size)})	        .attr("height", function(d) { return (d.size)})	        ;	    nodeEnter.append("svg:text")	      .attr("class", "nodetext")	      .attr("dx", function(d) { return -((d.size)/2)})	      .attr("dy", function(d) { return (((d.size)/2) + 10)})		  .attr("id", function(d) { return ("nodelabel_" + d.id)})	      .text("")	      ;	    	    nodeEnter.append("svg:text")	      .attr("class", "nodeValue")	      .attr("dx", -18)	      .attr("dy", ".35em")		  .attr("id", function(d) { return ("nodeValue_" + d.id)})//	      .text(function(d) { return d.parentless })	      .text("")	      .style("opacity", 0)	    ;	    	  node.exit().remove();	  force.start();	    resizedNodes = false;
	}function addNodes(d, i) {	var pathClick = egoQuery + d.id;
	d3.json(pathClick, function(json) {	    for ( x = 0; x < json.nodes.length; x++ ) {	    	var found = false;		    for ( y = 0; y < nodes.length; y++ ) {		    	if (nodes[y].id == json.nodes[x].id) {		    		found = true;		    		break;		    	}		    }		    if (found == false) {			activeNodesList += ",'" + json.nodes[x].id + "'";	    	nodes.push(json.nodes[x]);	    	nodeHash[json.nodes[x].id] = nodes.length - 1;		    }	    }	    	    for ( x = 0; x < json.links.length; x++ ) {	    	var found = false;		    for ( y = 0; y < links.length; y++ ) {		    	if (links[y].id == json.links[x].id) {		    		found = true;		    		break;		    	}		    }		    if (found == false) {		    	links.push({source: nodes[nodeHash[json.links[x].sid]], target: nodes[nodeHash[json.links[x].tid]], "relation": json.links[x].relation, "id": json.links[x].id });		    }	    }	  restart();	})		}
function addOccNodes() {
	for (groupX in groups) {
		nodes.push(groups[groupX])
    	nodeHash[groups[groupX].id] = nodes.length - 1;
		for (valX in groups[groupX]["values"]) {
			links.push({source: nodes[nodes.length-1], target: nodes[nodeHash[groups[groupX]["values"][valX].id]], "relation": "none", "id": 9999})
		}
	    }
	  occNodes=true;
	  restart();	
	}

//EMPHASISfunction emphasizeNode(idArray, color, isTemporary, emphDuration) {    for ( x = 0; x < idArray.length; x++ ) {    	//append background color tag    	var bcolorID = "nodebc_" + idArray[x];    	var oldColor = d3.select(document.getElementById(bcolorID)).attr("fill")    	var oldSize = d3.select(document.getElementById(bcolorID)).attr("height")    	d3.select(document.getElementById(bcolorID))    		.transition()		    .duration(emphDuration)  		  .attr("fill", color)		  .style("opacity", .9)		  .attr("height", function () {return oldSize * 2})		  .attr("width", function () {return oldSize * 2})		  .attr("x", -(oldSize))		  .attr("y", -(oldSize))		  ;    	if (isTemporary == true){    	d3.select(document.getElementById(bcolorID))    	.transition()        .delay(emphDuration)	    .duration(emphDuration)		  .attr("height", oldSize)		  .attr("width", oldSize)		  .attr("x", -(oldSize / 2))		  .attr("y", -(oldSize / 2))    	.attr("fill", oldColor)	    .style("opacity", .3)	  ;}    	    }}function emphasizeNodeRing(idArray, color, isTemporary, emphDuration) {    for ( x = 0; x < idArray.length; x++ ) {    	//append background color tag    	var bcolorID = "nodebc_" + idArray[x];    	var oldColor = d3.select(document.getElementById(bcolorID)).style("stroke")    	var oldSize = d3.select(document.getElementById(bcolorID)).style("stroke-width")    	d3.select(document.getElementById(bcolorID))  		  .style("stroke", color)		  .style("opacity", .9)		  .style("stroke-width", 2);    	if (isTemporary == true){    	d3.select(document.getElementById(bcolorID))    	.transition()        .delay(emphDuration)	    .duration(emphDuration)        .style("stroke-width", 1)    	.style("stroke", "black")	    .style("opacity", .3)	  ;}    	    }}function emphasizeLink(idArray, color, isTemporary, emphDuration) {    for ( x = 0; x < idArray.length; x++ ) {    	//append background color tag        for ( y = 0; y < links.length; y++ ) {    	if (idArray[x].sourceid == links[y].source.id && idArray[x].targetid == links[y].target.id) {    		var tarLink = "lineid_" + links[y].id;        	var oldColor = d3.select(document.getElementById(tarLink)).attr("stroke")    		d3.select(document.getElementById(tarLink))    		.transition()    		.duration(emphDuration)    	  	.style("stroke-width", 8)	  		.attr("stroke", color)    	  	;    	  	    	  	if (isTemporary == true){    	    	d3.select(document.getElementById(tarLink))    	    	.transition()    	        .delay(emphDuration)    		    .duration(emphDuration)    		    .style("stroke-width", 4)    		    .attr("stroke", oldColor)    		  ;    	}    	  	break;    	}        }    	    	    }}//LABELINGfunction onoffLabel(idArray, flip) {	    for ( x = 0; x < idArray.length; x++ ) {    	//append background color tag    	var bcolorID = "nodelabel_" + idArray[x];//    	if (d3.select(document.getElementById(bcolorID)).text() == "" && flip == true) {    		d3.select(document.getElementById(bcolorID))    		.transition()		    .duration(2000)	      .text(function(d) { return d.name })//	      .attr("x", function(d) { return -(d.name.length) })	      ;//    	}/*    	else {    		d3.select(document.getElementById(bcolorID))    		.transition()		    .duration(2000)		      .text("")    		}    		*/    	    }}//OTHERfunction nodeSizeWeight() {
	
	if (dynamicSizing == true) {	sizeRamp=d3.scale.linear().domain([2,10,40]).range([16,32,64]).clamp(true);    for ( x = 0; x < nodes.length; x++ ) {    	var bcolorID = "nodebc_" + nodes[x].id;    	d3.select(document.getElementById(bcolorID))    	.attr("height", sizeRamp(nodes[x].weight))    	.attr("width", sizeRamp(nodes[x].weight))    	.attr("x", -(sizeRamp(nodes[x].weight)/2))    	.attr("y", -(sizeRamp(nodes[x].weight)/2))    	;    }
	}    resizedNodes = true;}

function nodeSizeImportance() {
	
	sizeRamp=d3.scale.linear().domain([0,100,1000]).range([16,24,32]).clamp(true);
	opacityRamp=d3.scale.linear().domain([0,100,1000]).range([0,.25,1]).clamp(true);

    for ( x = 0; x < nodes.length; x++ ) {
    	var bcolorID = "nodebc_" + nodes[x].id;
    	d3.select(document.getElementById(bcolorID))
//    	.style("opacity", sizeRamp(nodes[x].charsize))
    	.attr("height", sizeRamp(nodes[x].charsize))
    	.attr("width", sizeRamp(nodes[x].charsize)/2)
    	.attr("x", -(sizeRamp(nodes[x].charsize)/4))
    	.attr("y", -(sizeRamp(nodes[x].charsize)/2))
    	;
    }
    resizedNodes = true;
}function colorByAttribute(attrName,numericalRange,colorRange) {	var attrRamp=d3.scale.linear().domain(numericalRange).range(colorRange).clamp(true);    for ( x = 0; x < nodes.length; x++ ) {    	var bcolorID = "nodebc_" + nodes[x].id;    	d3.select(document.getElementById(bcolorID))    		.transition()		    .duration(2000)		    .attr("fill", attrRamp(nodes[x][attrName]));    }}function colorPartitionByAttribute(attrName,attrValue,colorName) {    for ( x = 0; x < nodes.length; x++ ) {    	var bcolorID = "nodebc_" + nodes[x].id;    	if (nodes[x][attrName] == attrValue) {    	d3.select(document.getElementById(bcolorID))    		.transition()		    .duration(2000)		    .attr("fill", colorName);    	}    }}function removeOnes() {		for ( y = links.length - 1; y >= 0; y-- ) {			if (links[y].source.weight == 1 || links[y].target.weight == 1) {				links.splice(y, 1);			}		}	var tempArray = new Array();	for ( x = nodes.length - 1; x >= 0; x-- ) {		if( nodes[x].weight == 1) {			tempArray.push(nodes[x].id);			nodes.splice(x, 1); // remove b		}		}	  restart();	}//NOT WORKINGfunction changeForce() {	force	.gravity(.025)	.distance(100)	.charge(-100);}//NOT WORKINGfunction fixSingleNode(idArray, locationX, locationY) {    for ( x = 0; x < idArray.length; x++ ) {    	for ( y = 0; y < nodes.length; y++ ) {    	if (nodes[y].id == idArray[x]) {    		nodes[y].fixed = true;    		nodes[y].x = 50;    		nodes[y].y = 50;    		nodes[y].px = 50;    		nodes[y].py = 50;    		break;    	}    }    }    tick();}function fixNode(centerID, locationX, locationY, pathKin) {
	for ( y = 0; y < nodes.length; y++ ) {
		nodes[y].fixed = false;
}
	
tick();

var stepSize = 10;
var genSize = 60;
if (pathKin == 'path') {
	stepSize = 25;
	genSize = 50;
}
gensHeight = [stepSize];

for (g = 0; g < 40; g++)
{
	gensHeight.push(genSize);
}
//	var centerID = idArray[0];
		var centerBirthYear = nodes[nodeHash[centerID]].birthyear;	nodes[nodeHash[centerID]].fixed = true;	nodes[nodeHash[centerID]].y = locationX;	nodes[nodeHash[centerID]].py = locationX;	nodes[nodeHash[centerID]].x = genSize;
	nodes[nodeHash[centerID]].px = genSize;
	gensHeight[locationX/stepSize] += stepSize;
	//	var birthRamp=d3.scale.linear().domain([1700,1900]).range([50,950]).clamp(true);			for ( y = 0; y < nodes.length; y++ ) {		var displacedNodes = 0;		var nodePlaced = false;		for ( z = 0; z < links.length; z++) {			if (links[z].target.fixed == true || links[z].source.fixed == true) {				if (links[z].target.fixed == true && links[z].source.fixed == false) 				{					if (links[z].relation == "green" || links[z].relation == "purple"){						var shiftx = links[z].target.y;
						var shifty = gensHeight[shiftx/stepSize];
					}					else {
						var shiftx = links[z].target.y - (genSize);
						var shifty = gensHeight[shiftx/stepSize]
					}
					links[z].source.y = shiftx;
					links[z].source.py = shiftx;
					links[z].source.x = gensHeight[shiftx/stepSize];
					links[z].source.px = gensHeight[shiftx/stepSize];
					gensHeight[shiftx/stepSize] += stepSize;					links[z].source.fixed = true;				}				else if (links[z].source.fixed == true && links[z].target.fixed == false) 				{
					var shifty = gensHeight[shiftx/stepSize];					if (links[z].relation == "green" || links[z].relation == "purple"){						var shiftx = links[z].source.y;
					}					else {						var shiftx = links[z].source.y + (genSize);
						var shifty = gensHeight[shiftx/stepSize]
						}
					links[z].target.y = shiftx;
					links[z].target.py = shiftx;
					links[z].target.x = gensHeight[shiftx/stepSize];
					links[z].target.px = gensHeight[shiftx/stepSize];
					gensHeight[shiftx/stepSize] += stepSize;					links[z].target.fixed = true;				}
				
								if(displacedNodes%2 == 0) {//					currentGenHeight = -1 * currentGenHeight				}				else{//					currentGenHeight = -2 * currentGenHeight				}				displacedNodes++;			}											}    }    tick();
    
	d3.select("#descriptionText")
	.attr("transform", "rotate(90 10 10)")
	.text(function(d) { return "The family of " + nodes[nodeHash[centerID]].name });
}function fixbyBirthDate(idArray, locationX, locationY) {		var birthRamp=d3.scale.linear().domain([1700,1900]).range([50,950]).clamp(true);	    	for ( y = 0; y < nodes.length; y++ ) {    		nodes[y].fixed = true;    		nodes[y].x = birthRamp(nodes[y].birthyear);    		nodes[y].px = birthRamp(nodes[y].birthyear);    }    tick();}function freeNodes() {
	nodes[0].px += 5;
    	for ( y = 0; y < nodes.length; y++ ) {    		nodes[y].fixed = false;    }    tick();}//NODE MENUfunction removeNodeMenu(){	d3.selectAll(".nodeMenu")	.remove()	;}function nodeMenu(id){	removeNodeMenu();    for ( i = 0; i < nodeOptions.length; i++ ) {  	d3.select(document.getElementById(id))	  .append("svg:rect")	  .attr("class", "nodeMenu")	  .attr("height", 20)	  .attr("width", 20)	  .attr("x", 5)	  .attr("y", (i * 25) - (nodeOptions.length * 12.5))	  .attr("rx", 2)	  .attr("fill", "orange")	  .attr("stroke", "black")	  .style("opacity", 1)      .attr("id", nodeOptions[i])      .on("click", nodeMenuClick);		d3.select(document.getElementById(id))	.append("svg:image")    .attr("class", "nodeMenu")    .attr("xlink:href", function(d) { return ("icons/" + nodeOptions[i] + ".svg")})    .attr("x", 5)    .attr("y", (i * 25) - (nodeOptions.length * 12.5))    .attr("width", 20)    .attr("height", 20)    .attr("id", nodeOptions[i])    .on("click",  nodeMenuClick);    }    	d3.select(document.getElementById(id))	  .append("svg:rect")	  .attr("class", "nodeMenu")	  .attr("height", 10)	  .attr("width", 10)	  .attr("x", 5)	  .attr("y", (i * 25) - (nodeOptions.length * 12.5))	  .attr("rx", 5)	  .attr("ry", 5)	  .attr("fill", "orange")	  .attr("stroke", "black")	  .style("opacity", .2)    .attr("id", "closeMenu")
    .on("click", function() { d3.event.stopPropagation(); })
    .on("mousedown", function() { d3.event.stopPropagation(); })
    .on("mouseup", function() { d3.event.stopPropagation(); })
    .on("click", removeNodeMenu);		d3.select(document.getElementById(id))	.append("svg:image")	.attr("class", "nodeMenu")  	.attr("xlink:href", function(d) { return ("icons/x.svg")})  	.attr("x", 5)  	.attr("y", (i * 25) - (nodeOptions.length * 12.5))  	.attr("width", 10)  	.attr("height", 10)  	.attr("id", "closeMenu")    .on("click", function() { d3.event.stopPropagation(); })
    .on("mousedown", function() { d3.event.stopPropagation(); })
    .on("mouseup", function() { d3.event.stopPropagation(); })
  	.on("click",  removeNodeMenu); }//CLICKINGgetSim = function(inum,year){    ds.removeAll();    var req = Ext.Ajax.request( {        url: 'php/q_ptest.php',        params: {            i: inum,            y: year        },        method: 'GET',        success: function(req) {            response = req.responseText;            if ((/^ERROR|INFO/).test(response) || response === '') {              alert("ERROR/INFO" + response);            } else {            // alert (response);                jsonObject = eval('(' + response + ')');                ds.loadData(jsonObject);            }        }    })};function nodeMenuClick(d, i) {	if (this.id == "chart") {
		fixNode(d.id, 250, 100,'kin');			}	if (this.id == "fix") {		var ob = d3.select(document.getElementById(d.id));    	for ( y = 0; y < nodes.length; y++ ) {    		if (nodes[y].id == d.id){    			if (nodes[y].fixed == true) {    				nodes[y].fixed = false;    				break;    			}    			else {    				nodes[y].fixed = true;    				break;    			}    		}	}	}	if (this.id == "ego") {//		addNodes(d,i);
		console.log(d.id);
		newsClick(d.id)	}	d3.select(document.getElementById(this.id))	.transition()    .duration(100)	  .style("fill", "gray");		d3.select(document.getElementById(this.id))	.transition()	.delay(200)    .duration(100)	  .style("fill", "orange");}

function nodeOver(noded, nodei) {
	d3.select("#nodetitle")
	.text(function(d) { return noded.name });
}function nodeClick(noded, nodei) {    nodeMenu(noded.id);}function clearMenuClick(d, i){	/*	d3.selectAll("rect.nodeMenu")	.remove()	;d3.selectAll("image.nodeMenu").remove();*/	}function hideNodeText(){d3.selectAll("text.nodeValue")	.transition()	.duration(1000)	.style("opacity", 0)}function changeLook(){
	
	/*	d3.selectAll("circle.nodeBackground")		.transition()		.duration(1000)		  .attr("r", function(d) return {(d.gender == "n") ? 2 : 8})		  .attr("r", 1)		  .attr("fill", "aliceblue")		  .attr("stroke-weight", 1)		  .attr("stroke", "darkblue")		  .style("opacity", 1)		;	d3.selectAll("path.link")	.transition()	.duration(1000)  	.style("stroke-width", 1)	.attr("stroke", "black")	  .style("opacity", 1)		  	;	  	networkVis.selectAll("circle.arrowhead")	.transition()	.duration(1000)  	.attr("r", 2)	.attr("fill", "black")	.attr("stroke", "black")	  .style("opacity", 1)	  ;	*/	}