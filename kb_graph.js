// 20140717
groupPath = function(d) {
    return "M" + d3.geom.hull(d.values.map(function(i) {
	return [i.x, i.y];
    })).join("L") + "Z";
};

function addHull() {
    hideThirdBio();

    if (hullsActive == false) {
   	_gaq.push(['_trackEvent', 'layoutEvent', 'professions']);

	d3.select("#nBP").classed("disabled", true);
	d3.select("#nBT").classed("disabled", true);
	createHull();
    } else {
	d3.select("#nBPr").classed("active", false);
	d3.select("#nBP").classed("disabled", false);
	d3.select("#nBT").classed("disabled", false);
	removeHull();
    }
}

function removeHull() {
	removeOccNodes();
	hullsActive = false;
	occNodes = false;
}

function createHull() {
    hullsActive = true;
    gNetworkVis.selectAll("g.hull").remove();

    var	timeBegin = d3.min(nodes, function(p) {return p["birthyear"]}) - 10;
    var	timeEnd = d3.max(nodes, function(p) {return p["end"]}) + 10;

    groups = [];
    for (occX in occuArray) {
	groups.push({
	    key: occuArray[occX]["name"],
	    name: occuArray[occX]["display-name"],
	    values: [],
	    color: occuArray[occX]["color"],
	    id: "O" + occX,
	    size: 1,
	    birthyear: timeBegin,
	    end: timeEnd,
	    isMetaNode: true
	})
	for (nodeX in nodes) {
		if ((nodes[nodeX].occus)){
		    if ((nodes[nodeX].occus.indexOf(occuArray[occX]["name"])) > -1) {
		    groups[(groups.length - 1)]["values"].push(nodes[nodeX])
		} else {}
	    }
	}
	if ((groups[(groups.length - 1)]["values"].length < 3) || (groups[(groups.length - 1)]["values"].length >= nodes.length)) {
	    groups.pop();
	}
    }

    var hullG = gNetworkVis.selectAll("g.hull").data(groups).enter().append("g").attr("class","hull");
    
    hullG.append("path").attr("id",function(d) {return "hull" + d.key}).attr("class", "hull")
    .style("fill", function(d) {
	return d.color
    }).style("stroke", function(d) {
	return d.color
    })
    .style("stroke-width", 20)
    .style("stroke-linejoin", "round")
    .style("opacity", .3)
    .style("pointer-events", "none")
    .attr("d", groupPath);
    
    hullG.append("text").attr("class","hullTitles").text(function(d) {return d.name}).style("text-anchor", "middle").style("fill", "white").style("stroke", "white").style("stroke-width",2)
    .style("opacity", .5)
            .on("mouseover", function(d) {
	highlightOcc(d.key)
    }).on("mouseout", function() {
	deHighlightOcc()
    })
    .style("cursor","default")
    .attr("x", 150)
    .attr("y", function(d,i) {return (i * 25) + 50});
    
    hullG.append("text").attr("class","hullTitles").text(function(d) {return d.name}).style("text-anchor", "middle")
    .style("pointer-events","none")
    .attr("x", 150)
    .attr("y", function(d,i) {return (i * 25) + 50});

    if (occNodes == false) {
	addOccNodes();
    }
    
}

m0 = null;

///////////

function newsClick(individ) {
    currentHighlightedNode = "";
    pathViz(individ);

}

function changeTitle(newTitle) {
    
    if (vA.length > 1) {
	newTitle = vA.charAt(0).toUpperCase() + vA.slice(1);
    }
    d3.select("#titletext").html("<a onclick='toggleDisplay(\"searchShare\")'>" + newTitle + "</a>");
    currentTitle = newTitle;
    if (newTitle == "Some Luminaries in Kindred Britain") {
	d3.select("#twsh_button > .twitter-share-button").remove()
	d3.select("#twsh_button")
	.append("a")
	.attr("href", "https://twitter/share")
	.attr("class", "twitter-share-button")
	.attr("data-text", "Kindred Britain")
	.attr("data-url", "http://kindred.stanford.edu/")
	.attr("data-hashtags", "KindredBritain")
	if (typeof(twttr) != "undefined") {
	    twttr.widgets.load();
	}
    }
    else {
	d3.select("#twsh_button > .twitter-share-button").remove()
	d3.select("#twsh_button")
	.append("a")
	.attr("href", "https://twitter/share")
	.attr("class", "twitter-share-button")
	.attr("data-text", "Kindred Britain - " + newTitle.substr(0,50)+(newTitle.length>50?'...':''))
	.attr("data-url", "http://kindred.stanford.edu/" + window.location.hash)
	.attr("data-hashtags", "KindredBritain")
	if (twttr) {
	    twttr.widgets.load();
	}	

    }
}

function newsFeed(t, objectType, divName, floatDirection) {
    d3.select("#" + divName).style("display", "block").style("pointer-events", "auto");

    if (divName != 'bioFloatContents3') {
	    d3.select("#"+divName).classed("shadowBio", false)
	    bioLoading = false;
    }
    
    var executedQuery = newsPersonQuery;
    var runPersonEvents = false;
    d3.selectAll("." + divName + "plsites").remove();
    d3.selectAll("." + divName + "plevents").remove();
    d3.selectAll("." + divName + "other").remove();
    
    if (objectType == 'loc') {
	currentSituatedPerspective = 'location';
	executedQuery = newsPlaceQuery;
    } else if (objectType == 'occ') {
	currentSituatedPerspective = 'occupation';
	executedQuery = newsOccupationQuery;
	viz01(t, "occ");
    } else if (objectType == 'name') {
	currentSituatedPerspective = 'surname';
	executedQuery = newsOccupationQuery;
	viz01(t, "name");
    } else if (objectType == 'path') {
	executedQuery = newsOccupationQuery;
	placeOnMap(t, "path");
    }
     else if (objectType == 'story') {
	executedQuery = newsOccupationQuery;
	placeOnMap(t, "path");
    } else {
	runPersonEvents = true;

	if (bioLoading == false) {
	    bioLoading = true;
	
	var div = d3.select("#" + divName).style("opacity", 0);
console.log(executedQuery + t + "&q=" + objectType);
	d3.json(executedQuery + t + "&y=1776&q=" + objectType, function(json) {
	    news = json;
	    var linkFunction = json.indiv.name;
	    var prefix = "Not set";
	    if (currentSituatedPerspective != "path") {
		currentSituatedPerspective = 'person';
	    }
	    if (runPersonEvents == true) {
		prefix = '' + json.indiv.firstname + ' ';
	    } else {
		if (objectType == "occ") {
		    prefix = "Occupation: ";
		    isLoaded = false;
		} else if (objectType == "loc") {
		    prefix = "Location: "
		    linkFunction = json.indiv.id;
		    isLoaded = false;
		} else if (objectType == "name") {
		    prefix = "Surname: "
		    isLoaded = false;
		} else if (objectType == "path") {
		    isLoaded = false;
		    prefix = "Events from individuals along this";
		}
	    }
	    var topDiv = div.append("div").style("margin",0).style("height","50px").attr("class", divName + "plsites " + (divName != "bioFloatContents3" ? "biotop" : "")).attr("id", "topDiv").attr("onclick", divName == "bioFloatContents3" ? "d3.select(\"#"+divName + "LargeImage\").style(\"display\",\"none\");" : "d3.select(\"#"+divName + "ThumbImage\").style(\"display\",\"block\");d3.select(\"#"+divName + "LargeImage\").style(\"display\",\"none\");showHide(\"" + divName + "\")");

	    if (json.imagepath) {
		topDiv.append("div").attr("id", divName+"ThumbImage").style("height", "50px").attr("class", divName + "plsites").style("float", divName == "bioFloatContents1" || floatDirection == "right" ? "right" : "left")
		.on("click", function() {
		    var makeSmaller = d3.select("#"+divName+"ThumbImage").style("display") == "none";
		    console.log(makeSmaller);
		    d3.event.stopPropagation();
		    d3.select(this).style("display","none");
		    showHide(divName, true);
		    d3.select("#"+divName + "LargeImage").style("display","block");
		    d3.select("#" + divName + "profilename").style("padding", makeSmaller ? "0" : "11px 42px 0 40px");
		})
		.append("img").attr("height", "40px").attr("max-width", "30px").style("padding","5px").attr("id",divName +"image").attr("class", divName + "plsites bwimage").attr("src", json.imagepath).style("float", divName == "bioFloatContents1" || floatDirection == "right" ? "right" : "left")
	    }
    	var nameRamp=d3.scale.linear().domain([29,54]).range([18,10]);

	    if (runPersonEvents == true) {
		if(json.indiv.prefix) {
		    var px = json.indiv.prefix + ' ';
		}
		else {
		    var px = '';
		}
		topDiv.append("p")
		.style("margin",0)
//		.style("margin", divName == "bioFloatContents1" || floatDirection == "right" ? "0 -35px 0 0" : "0")
		.attr("id", divName + "profilename").attr("class", divName + "plsites profilename")
		.style("float", divName == "bioFloatContents1" || floatDirection == "right" ? "right" : "left")
		.style("position", divName == "bioFloatContents1" || floatDirection == "right" ? "relative" : "relative")
		.style("text-overflow","ellipsis")
		.style("max-width", "80%")
		.style("max-height", "30px")
		.style("white-space", "nowrap")
		.style("overflow", "hidden")
		.style("font-size", "18px")
		.html('<a style="padding: 0 '+((json.imagepath) ? '10px' : '20px')+';" onclick="restartNetwork(\'' + json.indiv.id + '\');var event = arguments[0];event.stopPropagation();" title: "See the family of ' + json.indiv.firstname + ' ' + json.indiv.name + '">' + px + json.indiv.fullname + "</a>");

	    } else {
		topDiv.append("p").attr("class", divName + "plsites profilename").html("" +px+json.indiv.fullname + "");
	    }
	    var infoText = "";

	    if (json.indiv.birthyear) {
		    datePadding = "10px";
		if (json.imagepath) {
		    datePadding = "42px";
		}
		topDiv.append("span")
		.attr("id", divName + "bioDate")
		.attr("class", "profiledate")
		.style(divName == "bioFloatContents1" || floatDirection == "right" ? "right" : "left", datePadding)
    // .html(json.indiv.birthyear + " - " + ((json.indiv.deathyear && json.indiv.deathyear < 2013) ? (json.indiv.deathyear) : ""))
		.html(json.indiv.birthyear + " - " + ((json.indiv.deathyear && json.indiv.deathyear < 2017) ? (json.indiv.deathyear) : ""))
	    }
	    if (divName != 'bioFloatContents3') {
	    infoText += ('<input type="button" class="topButton" style="width:20px; height:20px; position:absolute; padding: 0;' + (divName == 'bioFloatContents1' ? 'position:absolute;top:-10px;left:10px;' : 'top:-10px;right:5px;') + '" value="&darr;" id="darr' + divName + '" />');
	    }
	    else {
	    infoText += "<span>&nbsp;</span>";
	    }
	    topDiv.append("p").attr("class", "profiledate")
	    .style(divName == "bioFloatContents1" || floatDirection == "right" ? "left" : "right", "5px")
	    .html(infoText)

	    hideDiv = div.append("div").attr("class", divName + "plsites biocontent initial").attr("id", "collapsible").style("display", divName == "bioFloatContents3" ? "block" : "none");

	    if (json.imagepath) {
		var largeImageDiv = div.append("div")
		.style("padding","0")
		.attr("class", divName + "plsites")
		.attr("id", divName + "LargeImage")
		.style("display", "none")
		.style("border-style", "solid none none none")
		.style("border-width", "thin")
		.style("border-color", "#C0C0C0")
		.html('<img onclick="d3.select(\'#' + divName + 'profilename\').style(\'padding\', \'11px 0 0 2px\');' + ((divName == "bioFloatContents3") ? 'd3.select(\'#bioFloatContents3\').select(\'.initial\').style(\'display\',\'block\');' : '') + 'd3.select(\'#'+divName + 'LargeImage\').style(\'display\',\'none\');d3.select(\'#'+divName + 'ThumbImage\').style(\'display\',\'block\');" style="max-height:300px;max-width: 90%;margin-left: auto;margin-right: auto;padding: 20px;display: block;" src="'+json.imagepath+'" />');
		if (divName != "bioFloatContents3") {largeImageDiv.append("div").attr("class", divName + "plsites insertDiv").style("height", "30px").style("border-style", "solid none none none").style("border-width", "thin").style("border-color", "#C0C0C0").style("text-align", "center").html('<input type="button" class="topButton" onclick="d3.select(\'#'+divName + 'LargeImage\').style(\'display\',\'none\');d3.select(\'#'+divName + 'ThumbImage\').style(\'display\',\'block\');" value="&uarr;" style="width:100%;margin-top:0px;" />')};

	    }
	    var indivSearchDiv = div.append("div").style("padding","5px 20px 0").attr("class", divName + "plsites initial").attr("id", "collapsible").style("display", divName == "bioFloatContents3" ? "block" : "none").style("height", "30px").style("border-style", "solid none none none").style("border-width", "1px").style("border-color", "#C0C0C0").style("overflow", "hidden").html('<form id="' + divName + 'SearchForm"><span style="color: #0D00BE;">Connect to </a> <input style="width:220px; -webkit-appearance: none;" TYPE="text" id="idInputBoxD" placeholder="name to search" onkeydown="return press( event,document.forms.' + divName + 'SearchForm' + '.idInputBoxD.value,\'search\',\'' + json.indiv.id + '\',\'indivSearchResults.' + divName + 'plsites\');"/><input TYPE="button" NAME="button" Value="&rarr;" style="margin-top:-5px;color: #0D00BE;" class="topButton" <input TYPE="button" NAME="button" Value="Search" onClick="createSearchTable(document.forms.' + divName + 'SearchForm' + '.idInputBoxD.value,\'search\',\'' + json.indiv.id + '\',\'indivSearchResults.' + divName + 'plsites\')"></form>');
	    var indivSearchResultsDiv = div.append("div").attr("id", "indivSearchResults").style("margin","0 0 -1px -1px").attr("class", divName + "plsites results").style("border-style", "solid none none none").style("border-width", "1px").style("border-color", "#C0C0C0").style("overflow", "auto").style("display", divName == "bioFloatContents3" ? "block" : "none").html('');
	    if (divName != "bioFloatContents3") {
		    var lessDiv = div.append("div").attr("class", divName + "plsites insertDiv").attr("id", "collapsible").style("display", "none").style("height", "30px").style("border-style", "solid none none none").style("border-width", "thin").style("border-color", "#C0C0C0").style("text-align", "center").html('<input type="button" class="topButton" onclick="showHide(\'' + divName + '\')" value="&uarr;" style="width:100%;margin-top:0px;" />');
	    }
	    else {
		div.append("div").attr("class", divName + "plsites insertDiv").style("height", "30px").style("border-style", "solid none none none").style("border-width", "thin").style("border-color", "#C0C0C0").style("text-align", "center").html('<input type="button" class="topButton" onclick="hideThirdBio()" value="&uarr;" style="width:100%;margin-top:0px;" />');
	    }

	    if (json.indiv.suffix) {
		hideDiv.append("p").attr("class", divName + "plsites").html("" + json.indiv.suffix + "");
	    }

	    occuTabs = hideDiv.append("ol").attr("class", divName + "other").attr("id", "navlist")

    
	    
	    occuTabs.selectAll("li").data(json.indiv.occu).enter().append("li").attr("class", "occus").html(function(d) {
		return (occupationHash[d] ? '<span id="tButton"><a><input type="button" class="tragedyButton" style="background-color: '+ occuArray[occupationHash[d]["category"]]["color"] +';" /> </a><span id="trarray">'+d+'</span></span>' : '')
	    }).style("cursor", "pointer");

	    if (json.indiv.tragedy > 0) {
		var tratext = '<ul style="list-style-type:none; padding: 5px 0px 20px;text-transform: none;">';
		tratext += "<li style='list-style-type:none;float: none;'>Tragedy index: " + json.indiv.tragedy + "</li>";
		json.indiv.trarray[0] > 0 ? tratext += "<li style='list-style-type:none;float: none;'>Died young or to violence: 1</li>" : null;
		json.indiv.trarray[1] > 0 ? tratext += "<li style='list-style-type:none;float: none;'>Outlived spouse by 20+ years: " + json.indiv.trarray[1] + " </li>" : null;
		json.indiv.trarray[2] > 0 ? tratext += "<li style='list-style-type:none;float: none;'>Siblings died before age of 13: " + json.indiv.trarray[2] + " </li>"  : null;
		json.indiv.trarray[3] > 0 ? tratext += "<li style='list-style-type:none;float: none;'>Children died before age of 13: " + json.indiv.trarray[3] + " </li>"  : null;
		json.indiv.trarray[4] > 0 ? tratext += "<li style='list-style-type:none;float: none;'>Parents died during childhood: " + json.indiv.trarray[4] + " </li>"  : null;
		json.indiv.trarray[5] > 0 ? tratext += "<li style='list-style-type:none;float: none;'>Mental illness: " + json.indiv.trarray[5] + " </li>"  : null;
		tratext +='</ul>';
		occuTabs.append("li").html("<span id='tButton'><input type='button' class='tragedyButton' value='" + json.indiv.tragedy + "' /><span id='trarray' style='min-width:200px;'>"+tratext+"</span></span>")
	    }
	    if (json.indiv.children > 0) {
		occuTabs.insert("li","li").html("<span id='tButton'><input type='button' style='background:#800000;' class='inbredButton' value='" + json.indiv.children + "' /><span id='trarray' style='text-transform: none;'>" + (json.indiv.children > 1 ? json.indiv.children + " children" : "1 child") +" included in KB database</span></span>")
	    }
	    else {
		occuTabs.insert("li","li").html("<span id='tButton'><input type='button' style='background:#C0C0C0;' class='inbredButton' value='"+json.indiv.children+"' /><span id='trarray'>No children</span></span>")
	    }
	    var numWords = ['', '', 'two', 'three', 'four','five','six','seven','eight','nine','ten','eleven','twelve']
	    if (json.indiv.marriage > 0) {
		occuTabs.insert("li","li").html("<span id='tButton'><input type='button' style='background:#003333;' class='inbredButton' value='M" + (json.indiv.marriage > 1 ? json.indiv.marriage : "") + "' /><span id='trarray'>Married" + (json.indiv.marriage > 1 ? " " + numWords[json.indiv.marriage] + " times" : "") +"</span></span>")		
	    }
	    else {
		occuTabs.insert("li","li").html("<span id='tButton'><input type='button' style='background:#C0C0C0;' class='inbredButton' value='S' /><span id='trarray'>Unmarried</span></span>")
	    }	    
	    occuTabs.append("li").html("<span id='tButton'><input type='button' style='background:#0066CC;' class='inbredButton' value='" + json.indiv.depth + "' /><span id='trarray' style='text-transform: none;'>"+json.indiv.depth+" generation" + (json.indiv.depth == 1 ? "" : "s") +" of ancestors in KB</span></span>")
	    
	    if (json.indiv.inbred > 0) {
		occuTabs.append("li").html("<span id='tButton'><input type='button' class='inbredButton' value='" + json.indiv.inbred + "' /><span id='trarray'>Parents share a common ancestor "+json.indiv.inbred+" generations back</span></span>")
	    }
	    if (json.indiv.odnb == 0) {
		occuTabs.append("li").html("<span id='tButton'><input type='button' class='inbredButton' style='text-transform: none;background:#CCCC66;border-radius: 20px;border:1px gray solid;box-shadow: 2px 2px 2px 1px rgba(0,0,0,.2);' value='B' /><span id='trarray' style='text-transform: none;'>Has an entry in the Oxford Dictionary of National Biography</span></span>")
	    }
	   else {
		occuTabs.append("li").html("<span id='tButton'><input type='button' class='inbredButton' style='background:#0099CC;border-radius: 20px;border:1px gray solid;' value='"+json.indiv.odnb+"' /><span id='trarray' style='text-transform: none;'>Individual is "+json.indiv.odnb+" degree"+(json.indiv.odnb==1 ? "" : "s")+" from someone with an entry in the Oxford Dictionary of National Biography</span></span>")
	    }

	    //The last li needs to not float
	    var centralityDisplay = "x";
	    var centralityBG = "white";
	    var cenText = 'x';
	    switch(json.indiv.centrality )
{
case 9:
    centralityDisplay = "10";
    centralityBG = "Darkorange";
    cenText = 'KB network centrality: one of the 10 most central people in the network';
  break;
case 8:
    centralityDisplay = "100";
    centralityBG = "Darkorange";
    cenText = 'KB network centrality: one of the 100 most central people in the network';
  break;
case 7:
    centralityDisplay = "1k";
    centralityBG = "Darkorange";
    cenText = 'KB network centrality: one of the 1,000 most central people in the network';
  break;
case 6:
    centralityDisplay = "10k";
    centralityBG = "Darkorange";
    cenText = 'KB network centrality: one of the 10,000 most central people in the network';
  break;
case 5:
    centralityDisplay = "M";
    centralityBG = "DarkSalmon";
    cenText = 'KB network centrality: neither particularly central nor particularly peripheral';
  break;
case 4:
    centralityDisplay = "10k";
    centralityBG = "DarkOliveGreen";
    cenText = 'KB network centrality: one of the 10,000 least central people in the network';
  break;
case 3:
    centralityDisplay = "1k";
    centralityBG = "DarkOliveGreen";
    cenText = 'KB network centrality: one of the 1,000 least central people in the network';
  break;
case 2:
    centralityDisplay = "100";
    centralityBG = "DarkOliveGreen";
    cenText = 'KB network centrality: one of the 100 least central people in the network';
  break;
case 1:
    centralityDisplay = "10";
    centralityBG = "DarkOliveGreen";
    cenText = 'KB network centrality: one of the 10 least central people in the network';
  break;
}	    
	occuTabs.append("li").style("float","none").html("<span id='tButton'><input type='button' style='cursor:default;background: "+centralityBG+";' class='centralityButton' value='" + centralityDisplay + "' /><span id='trarray' style='text-transform:none;'>"+cenText+"</span></span>")

	    if (json.smallworld) {
		var storiesOL = hideDiv.append("ol").attr("class", divName + "other").style("display", "block");

		storiesOL.append("li").attr("id","storyListTitle").html('STORIES').style("font-weight", 900)
		var foundStories = false;
		for (x in storyCollection) {
		    if(storyCollection[x].participants.indexOf(json.indiv.id) > -1) {
	    		storiesOL.append("li").attr("class", divName + "plsites").html('<a onclick="createVignette(\''+x+'\',\''+divName+'\',\'#collapsible\')">'+storyCollection[x].title+'</a>');
			foundStories = true;
		    }
		    }
		    if (foundStories == false) {
			d3.select("#storyListTitle").remove();
		    }

		hideDiv.append("div").html("CLOSE LINKS").style("padding-top","10px").style("font-size","14px").style("line-height","20px")
		distTabs = hideDiv.append("table").attr("class", divName + "other").attr("id", "distancelist")
		var maxDiDi = d3.max(json.smallworld, function(p) {return p["distance"]});
		distTabs.selectAll("tr.clinks").data(json.smallworld).enter().append("tr").attr("class", "clinks").html(function(d) {
		    return '<td style="cursor:none;color: black; width:' + maxDiDi * 8 + 'px;font-size:12px;text-align: right;padding-right: 10px;">' + Array(d.distance + 1).join("&#9671;") + '</td> <td style="font-size: '+("16px")+';cursor:pointer;"><a onclick="pathViz(\'sent\',\'' + json.indiv.id + '\',\'' + d.id + '\')" title="Related through '+d.distance+' degree'+(d.distance==1 ? '' : 's')+'"> ' + d.name + (d.distance > 100 ? ' ' + d.distance + ' degrees ' : '') + '</a></td>'
		});
	    }

	    if (runPersonEvents == true) {
	    var contextEvents = [];
	    if (dateline[json.indiv.birthyear]) {
		contextEvents.push({byear: json.indiv.birthyear, fullname: "" + json.indiv.birthyear + " &mdash; " + dateline[json.indiv.birthyear], notes: "c", unixsort: Math.round(new Date("01/01/" + json.indiv.birthyear).getTime() / 1000)})
	    }
	    if (json.indiv.deathyear - json.indiv.birthyear > 2) {
	    if (dateline[Math.floor((json.indiv.deathyear + json.indiv.birthyear) / 2)]) {
		contextEvents.push({byear: Math.floor((json.indiv.deathyear + json.indiv.birthyear) / 2), fullname: "" + Math.floor((json.indiv.deathyear + json.indiv.birthyear) / 2) + " &mdash; " + dateline[Math.floor((json.indiv.deathyear + json.indiv.birthyear) / 2)], notes: "c", unixsort: Math.round(new Date("01/01/" + Math.floor((json.indiv.deathyear + json.indiv.birthyear) / 2)).getTime() / 1000)})
	    }
	    if (dateline[json.indiv.deathyear]) {
		contextEvents.push({byear: json.indiv.deathyear, fullname: "" + json.indiv.deathyear + " &mdash; " + dateline[json.indiv.deathyear], notes: "c", unixsort: Math.round(new Date("01/01/" + json.indiv.deathyear).getTime() / 1000)})
	    }
   	    }
	    newEvents = json.nodes.concat(json.events.concat(contextEvents)).sort(function(a,b) {return (a["unixsort"] ? a["unixsort"] : new Date("01/01/" + a["byear"]).getTime()) - (b["unixsort"] ? b["unixsort"] : new Date("01/01/" + b["byear"]).getTime())});
	    	if (divName != "bioFloatContents3") {
		hideDiv.append("div").html("<p style='font-size:14px;line-height:20px;font-weight:300;margin-bottom: 0;'>EVENTS</p> <input type='button' class='legendButton active' value='Personal' onclick='(d3.select(this).classed(\"active\") == true ? d3.select(this).classed(\"active\", false) : d3.select(this).classed(\"active\", true));showHideGeneric(\"."+divName + "life\", \"block\")' title='Events from the life of "+json.indiv.fullname+"' /> <input type='button' class='legendButton' value='Similar' onclick='(d3.select(this).classed(\"active\") == true ? d3.select(this).classed(\"active\", false) : d3.select(this).classed(\"active\", true));showHideGeneric(\"."+divName + "similar\", \"block\")'  title='Events from the lives of people similar to "+json.indiv.fullname+"' /> "+ (contextEvents.length > 0 ? "<input type='button' class='legendButton' value='Global' onclick='(d3.select(this).classed(\"active\") == true ? d3.select(this).classed(\"active\", false) : d3.select(this).classed(\"active\", true));showHideGeneric(\"."+divName + "context\", \"block\")'  title='Historical events that happened during the life of "+json.indiv.fullname+"'  />" : ""))
		.style("font-weight", 900)
		}
		plsites = hideDiv.append("div").style("overflow","auto").style("max-height","100px").append("ol").attr("class", divName + "plevents ")

		plsites.selectAll("li.plevents").data(divName == "bioFloatContents3" ? json.events : newEvents).enter().append("li").attr("class", divName + "plevents").style("font-size","16px").style("line-height","20px")
		.html(function(d,i) {
		    return (d.indiv_id) ? d.fullname + (d.notes.length > 1 ? '<a id="rarr'+divName+i+'" onclick="d3.select(this).style(\'display\',\'none\');d3.select(\'#'+divName+i+'\').style(\'display\',\'inline\');">&rarr;</a><span style="display:none;" id="'+divName+i+'">'+d.notes+'<a onclick="d3.select(\'#'+divName+i+'\').style(\'display\',\'none\');d3.select(\'#rarr'+divName+i+'\').style(\'display\',\'inline\')">&larr;</a></span>' : '')+' - <a onclick="pathViz(\'sent\',\'' +json.indiv.id +'\',\'' + d.indiv_id + '\')" class="pathAction" title: "Path to X.">' + d.indiv_name + '</a>' : '' + d.fullname + (d.notes.length > 1 ? '<a id="rarr'+divName+i+'" onclick="d3.select(this).style(\'display\',\'none\');d3.select(\'#'+divName+i+'\').style(\'display\',\'inline\');">&rarr;</a><span style="display:none;" id="'+divName+i+'">'+d.notes+'<a onclick="d3.select(\'#'+divName+i+'\').style(\'display\',\'none\');d3.select(\'#rarr'+divName+i+'\').style(\'display\',\'inline\')">&larr;</a></span>' : '') + ''
		})
		.attr("class", function(d) {return divName + "plevents " + (d.notes == "c" ? divName + "context" : (d.indiv_id ? divName + "similar" : divName + "life"))})
		.style("display", function(d) {return (d.indiv_id || d.notes == "c") ? "none" : "block"})
		.style("font-weight", function(d) {return d.notes == "c" ? "900" : "300"})
		.style("font-size", "16px")
		.style("color", function(d) {return (d.indiv_id || d.notes == "c") ? "#B2B2B2" : "#000000"})
		.style("padding", "2px 0")
		if (divName == "bioFloatContents3") {
		    plsites.selectAll("li").style("display", function(d,i) {return d.byear == 9999 && d.fullname.length > 13 ? "block" : "none"})
		}
	    }	
	//.style("cursor", "pointer")
	    //.style("display", function(d, i) {return (i > 4) ? "none" : "block"});

	    div.transition().duration(300).style("opacity", 1);
	    
	    bioLoading = false;

	})
	}
    }
}

function showHideGeneric(domID, displayValue) {
    if (d3.select(domID).style("display") == "none") {
    d3.selectAll(domID).style("display",displayValue)
    }
    else {
    d3.selectAll(domID).style("display","none")
    }
}

function showHide(divName, forceHide) {
    if (d3.select("#collapsible." + divName + "plsites").style("display") == "block" || forceHide) {
	d3.select("#indivSearchResults." + divName + "plsites").style("display", "none");
	d3.selectAll("#collapsible." + divName + "plsites").style("display", "none");
	d3.select("#darr" + divName).style("display", "inline")
	if (divName == 'bioFloatContents1' || divName == 'bioFloatContents2') {
	    d3.select("#"+divName).classed("shadowBio", false)
	}
    } else {
        restoreInitial(divName);
	d3.select("#indivSearchResults." + divName + "plsites").style("display", "block");
	d3.selectAll("#collapsible." + divName + "plsites").style("display", "block");
	d3.select("#darr" + divName).style("display", "none")
	if (divName == 'bioFloatContents1' || divName == 'bioFloatContents2') {
	    d3.select("#"+divName).classed("shadowBio", true)
	}
    }
}

function startDrag() {
    initialY = d3.event.pageY;
    m0 = this.id;
}

function mousemove() {

    if (m0) {
	d3.select(m0).text(initialY - d3.event.pageY);
    }

}

function mouseup() {
    m0 = null;
}


function triangulateViz(inputData) {
    currentHighlightedNode = "";
    var selectiontext = networkVis.selectAll("text.smallworld").data(inputData).enter().append("text").attr("class", "smallworld").attr("x", 80).attr("y", function(d, i) {
	return 480 + (i * 15)
    }).text(function(d) {
	return "" + d.name + ": " + d.distance
    }).on("click", function(d) {
	pathViz(d.id)
    });
}

function occuViz(inputData) {
    
    d3.selectAll("#legendG").remove();
    	
    var legendVis = d3.selectAll(".legendSVG").append("g").attr("id","legendG").each(
	function() {
    d3.select(this).selectAll("text.legendText").data([1,2,3,4,5]).enter().append("rect")
    .attr("height",30)
    .attr("width",86)
    .attr("class","legendRect")
    .style("fill", function(d,i) {return i == 2 ? "gray" : i < 2 ? '#67ccff' : '#caa6ff'})
    .attr("y", (30))
    .attr("x", function(d,i) {return ((i* 88))});
    d3.select(this)
    .selectAll("text.legendText").data(["male","","female"]).enter().append("text")
    .attr("class","legendText")
    .attr("y", (80))
    .attr("x", function(d,i) {return ((i * 219))})
    .attr("text-anchor", function(d,i) {return (i == 0 ? "start" : i == 2 ? "end" : "middle")})
    .text(function(d) {return d});
    d3.select(this)
    .append("text")
    .attr("class","legendName")
    .attr("y", (20))
    .attr("x", 0)
    .text("Gender");
	    //code
	}
	)
    
}

function highlightOcc(occInput) {
    force.stop();
    d3.selectAll("g.node").style('opacity', function(d, i) {
	return d.occus ? d.occus.indexOf(occInput) > -1 ? 1 : .1 : 0
    });
    d3.selectAll("g.hull").style('opacity', function(d, i) {
	return d.key == occInput ? 1 : .25
    });
}

function deHighlightOcc() {
    force.start();
    d3.selectAll("g.node").style('opacity', 1);
    d3.selectAll("g.hull").style('opacity', 1);
}


function pathViz(inputID, sentSource, sentTarget,storyTitle) {
    	_gaq.push(['_trackEvent', 'networkEvent', sentSource]);
	_gaq.push(['_trackEvent', 'networkEvent', sentTarget]);
	_gaq.push(['_trackEvent', 'pathEvent', "S: " + sentSource + ",T: " + sentTarget]);

    closeAllTabs();
    storyTitle = typeof storyTitle !== 'undefined' ? storyTitle : '';
    
    initializeNetworkVis(inputID);

    if (inputID == 'sent') {
	targetID = sentTarget;
	sourceID = sentSource;
	currentFocusID = targetID;
	lastFocusID = sourceID;
	currentHighlightedNode = "";
    } else if (inputID == 'link') {
	targetID = sentTarget;
	sourceID = sentSource;
	currentFocusID = targetID;
	lastFocusID = sourceID;

    } else if (inputID != 'again') {
	targetID = inputID;
	sourceID = currentFocusID;
	currentFocusID = targetID;
	lastFocusID = sourceID;
    } else {
	targetID = currentFocusID;
	sourceID = lastFocusID;
    }
    if (inputID == 'Form') {
	targetID = [document.getElementById("idInputBox").value];
	currentFocusID = targetID;
    }

    if (inputID == 'pregen') {
	inputID = 'I5';
	targetID = 'I4';
	step1(true);
    } else {
	currentSituatedPerspective = "path";

	newsFeed(sourceID, "kin", "bioFloatContents1");
	newsFeed(targetID, "kin", "bioFloatContents2");
	step1(false);
    }

    function step1(preGenerated) {
	
	activeNodesList = "";
	var bValue = 0;
	var aValue = 0;
	var cValue = 0;
	nodeHash = {};

	d3.json(pathQuery + sourceID + "&t=" + targetID + "&b=" + bValue + "&a=" + aValue + "&c=" + cValue, function(json) {
	    var sourceName = 'notset';
	    var targetName = 'notset';
	    if (preGenerated == true) {
		json = startupPaths;
	    }

	    for (x = 0; x < json.nodes.length; x++) {
		if (json.nodes[x].id == sourceID) {
		    sourceName = json.nodes[x].name;
		} else if (json.nodes[x].id == targetID) {
		    targetName = json.nodes[x].name;
		}
		nodes.push(json.nodes[x]);
		nodeHash[String(json.nodes[x].id)] = x;
		activeNodesList += "'" + json.nodes[x].id + "'" + ((json.nodes.length - 1) == x ? '' : ',');
	    }

	    for (x = 0; x < json.links.length; x++) {
		links.push({
		    source: json.nodes[nodeHash[json.links[x].sid]],
		    target: json.nodes[nodeHash[json.links[x].tid]],
		    "relation": json.links[x].relation,
		    "id": json.links[x].id
		});
	    }

	    bigComponent(sourceID,true);
	    
	    resizedNodes = false;
	    restart();

	    if (preGenerated == false) {
		occuViz(json.occu);
		fixNode(currentFocusID, 100, 100, 'path', fitNodesToCanvas);

		var kbSettings = window.location.hash.split("/");	
		window.location.hash = "/path/" + divLayout.network + "/" + divLayout.timeline + "/" + divLayout.map + "/" + sourceID + "/" + targetID + "/";
		updateUrlBox();
		changeTitle('People connecting ' + sourceName + ' to ' + targetName)
    	    queriesArray.push({name: currentTitle, queryVal: [sentSource,sentTarget,inputID], queryType: "path"});

	    }
	    
	    newsFeed(activeNodesList, "path", "dummy");
	    runSwim("path");
    	    if (storyTitle.length > 1) {
		runVignette(storyTitle);
	    }
	    networkLoaded = true;
	    d3.select("#nBT").classed("disabled", false);
	    d3.select("#nBP").classed("disabled", false);
            setActive('nBT','netLayoutButton');


	})
    }

} //end pathViz()

function labelNodes() {
    
    if (currentSituatedPerspective == "path" || currentSituatedPerspective == "person") {
    
    var endPoints = d3.selectAll("g.node").filter(function(d, i) { return d.id == currentFocusID; });
    if (currentSituatedPerspective == "path") {
    var titlePoints = pathEnds(nodes);
    var titleIDs = [titlePoints[0].id,titlePoints[1].id];
    endPoints = d3.selectAll("g.node").filter(function(d, i) { return titleIDs.indexOf(d.id) > -1; });
    }
    var endTitles = endPoints.append("text").text(function(d) {return d.name}).style("opacity",0).style("text-anchor", function(d,i) {return i == 0 ? "start" : "end"}).attr("y", -20)
    endTitles.transition().delay(function(d,i) {return 1000 + (i * 500)}).duration(1000).style("opacity",1);
    endTitles.transition().delay(5000).duration(1000).style("opacity",0).remove();

    }
}

function viz01(initialIDValue, initialType,initialDepth,storyTitle) {
    storyTitle = typeof storyTitle !== 'undefined' ? storyTitle : '';    
    initializeNetworkVis('kin');

    function step1() {
	activeNodesList = "";
	var savedFocus = currentFocusID;
	freshHash(initialType, initialIDValue);
	currentFocusID = savedFocus;

	if (initialType == "ego") {
	    closeAllTabs();
	    var pathClick = egoQuery + initialIDValue + "&q=gen";
	    _gaq.push(['_trackEvent', 'networkEvent', initialIDValue]);
	} else if (initialType == "kin") {
	    var pathClick = kinQuery + initialIDValue + "&fb=" + initialDirection + "&d=" + initialDepth;
	} else if (initialType == "loc") {
	    var pathClick = egoQuery + initialIDValue + "&q=loc";
	} else if (initialType == "occ") {
	    var pathClick = egoQuery + initialIDValue + "&q=occ";
	} else if (initialType == "name") {
	    var pathClick = egoQuery + initialIDValue + "&q=name";
	} else if (initialType == "lum") {
	    toggleDisplay("kbContents");
	    _gaq.push(['_trackEvent', 'networkEvent', "Luminary"]);
	    changeTitle('Some Luminaries in Kindred Britain');
	    var pathClick = egoQuery + initialIDValue + "&q=lum";
	    currentSituatedPerspective = "luminary";
	    window.location.hash = '';
	    updateUrlBox();
	} else if (initialType == "list") {
	    closeAllTabs();
	    var pathClick = egoQuery + initialIDValue + "&q=list";
	    currentSituatedPerspective = "luminary";
	    window.location.hash = '';
	    updateUrlBox();
	    _gaq.push(['_trackEvent', 'networkEvent', 'list']);

	} else {
	    var pathClick = egoQuery + initialIDValue + "&q=gen";
	}

	d3.json(pathClick, function(json) {
	    exportExposedData = json;
	    for (x = 0; x < json.nodes.length; x++) {
		nodes.push(json.nodes[x]);
		nodeHash[json.nodes[x].id] = x;
		activeNodesList += "'" + json.nodes[x].id + "'" + ((json.nodes.length - 1) == x ? '' : ',');
	    }
	    for (x = 0; x < json.links.length; x++) {
		links.push({
		    source: json.nodes[json.links[x].source],
		    target: json.nodes[json.links[x].target],
		    "relation": json.links[x].relation,
		    "id": json.links[x].id
		});

	    }
	    d3.selectAll(".bioContents").style("display", "none");
	    occuViz(json.occu);

	    if (initialType == "ego") {
		newsFeed(currentFocusID, "Person", "bioFloatContents1");
		resizedNodes = false;
	    }
	    restart();
	    if (initialType == "ego") {
		fixNode(currentFocusID, 250, 100, "kin", fitNodesToCanvas);
		if (nodes[nodeHash[currentFocusID]]) {
		changeTitle("The family of " + nodes[nodeHash[currentFocusID]].name)
		}
		else {
		changeTitle("");
		}
	    }
	    
	    labelNodes();
	    
	    queriesArray.push({name: currentTitle, queryVal: [initialIDValue,storyTitle], queryType: initialType});
	    runSwim(initialType);
	    placeOnMap(activeNodesList, "path");
	    if (storyTitle.length > 1) {
		runVignette(storyTitle);
	    }
	    networkLoaded = true;
	var oneComponent = bigComponent(nodes[0].id);		//code
	if (oneComponent.length == nodes.length) {
	    d3.select("#nBT").classed("disabled", false);	    
	    d3.select("#nBP").classed("disabled", false);
            setActive('nBT','netLayoutButton');
	}
	else {
	    d3.select("#nBT").classed("disabled", true);
	    d3.select("#nBP").classed("disabled", false);
	    d3.select("#nBPr").classed("disabled", false);
            setActive('nBF','netLayoutButton');
	}

	})
    }
    step1();
    //createTimeSlider();
} //end viz01()

marriageCurving = 1.25;
kinCurving = 1.001

function tick() {
        if (thisBrowser != 'Safari' || nodeDragging == true || safariTick == 10) {
	    safariTick = 0;
    gNetworkVis.selectAll("g.node").attr("transform", function(d) {
	return "translate(" + d.x + "," + d.y + ")";
    });


    gNetworkVis.selectAll("path.link").attr("d", function(d) {
	var dx = d.target.x - d.source.x,
	    dy = d.target.y - d.source.y,
	    dr = (d.relation == "purple" ? 0 : (dx > 0 ? Math.sqrt((dx * dx + dy * dy) * marriageCurving) : Math.sqrt((dx * dx + dy * dy) * marriageCurving)));
	return (dy > 0 ? "M" + d.source.x + "," + d.source.y + "C" + (d.source.x * kinCurving) + "," + (d.source.y * kinCurving) + " " + (d.target.x * kinCurving) + "," + (d.source.y * kinCurving) + " " + d.target.x + "," + d.target.y : "M" + d.source.x + "," + d.source.y + "C" + (d.source.x * kinCurving) + "," + (d.source.y * kinCurving) + " " + (d.target.x * kinCurving) + "," + (d.source.y * kinCurving) + " " + d.target.x + "," + d.target.y);
    }).attr("id", function(d, i) {
	return "lineid_" + d.id;
    })
    ;
    
    if (hullsActive == true) {
	    gNetworkVis.selectAll("path.hull").data(groups).attr("d", groupPath);

    if (thisBrowser != 'Safari') {
    gNetworkVis.selectAll(".hullTitles")
    .attr("x", 0)
    .attr("y", 0)
    .attr("transform", 
    function (d) {
    var bbox = document.getElementById("hull" + d.key).getBBox();
    return "translate(" + (bbox.x + bbox.width/2) + "," + (bbox.y + bbox.height/2) + ")";
    })
    }
    }
    }
    safariTick++;    
}

function restartNetwork(sentID) {
    if (networkLoaded == true) {
    networkLoaded = false;
    currentSituatedPerspective = 'person';
    currentHighlightedNode = '';

    currentFocusID = sentID;
    if (sentID == "Form") {
	sentID = [document.getElementById("idInputBox").value];
    }
    viz01(sentID, "ego");
    }
}

function addNodesText(sentID) {
    for (sent = 0; sent < sentID.length; sent++) {
	var pathClick = egoQuery + sentID[sent];
	d3.json(pathClick, function(json) {
	    for (x = 0; x < json.nodes.length; x++) {
		var found = false;
		for (y = 0; y < nodes.length; y++) {
		    if (nodes[y].id == json.nodes[x].id) {
			found = true;
			break;
		    }
		}
		if (found == false) {
		    nodes.push(json.nodes[x]);
		    nodeHash[json.nodes[x].id] = nodes.length - 1;
		}
	    }
	    for (x = 0; x < json.links.length; x++) {
		var found = false;
		for (y = 0; y < links.length; y++) {
		    if (links[y].id == json.links[x].id) {
			found = true;
			break;
		    }
		}
		if (found == false) {
		    links.push({
			source: nodes[nodeHash[json.links[x].sid]],
			target: nodes[nodeHash[json.links[x].tid]],
			"relation": json.links[x].relation,
			"id": json.links[x].id
		    });
		}
	    }
	    restart();
	})
    }
}

function restart() {

    resultsTable(nodes, "searchShare", 5, true, 'X');

    var node_drag = d3.behavior.drag().on("dragstart", dragstart).on("drag", dragmove).on("dragend", dragend);

    function dragstart(d, i) {
	hideThirdBio();

	clickNotDrag = true;
	clickDragTimer = setTimeout('draggingClicking()', 250);
	this.parentNode.appendChild(this);
    
	//disable the mouseover events
	d3.selectAll("g.node").on("mouseover", null).on("mouseout", null);
	d3.selectAll("g.link").on("mouseover", null).on("mouseout", null);
//	anyOut();
	force.stop() // stops the force auto positioning before you start dragging
	d3.select("#nodehover_" + d.id).style("opacity", .1);
    d3.selectAll("rect.nodeopacfilter").transition().delay(250).duration(500).style("opacity", .25)
    .style("fill", "black");
    d3.selectAll("rect.timelineopacfilter").transition().delay(250).duration(500).style("opacity", .25)
    .style("fill", "black");
    d3.selectAll("path.placeopacfilter").transition().delay(250).duration(500).style("opacity", .25)
    .style("fill", "black");
    d3.selectAll(".uaevents").style("fill", function(b) { return slightlyRandomColor(eventColor[b.eventtype],colorVariance)});
    d3.selectAll(".aevents").style("fill", function(b) { return slightlyRandomColor(eventColor[b.eventtype],colorVariance)});
    
    }

    function dragmove(d, i) {
	
	force.stop();
	nodeDragging = true;
	d.px += d3.event.dx;
	d.py += d3.event.dy;
	d.x += d3.event.dx;
	d.y += d3.event.dy;
	
	var oldHoverX = parseFloat(document.getElementById("hoverBoth").style.left);
	var oldHoverY = parseFloat(document.getElementById("hoverBoth").style.top);
	
	d3.selectAll("#hoverBoth").style("left", (oldHoverX + d3.event.dx) + "px").style("top", (oldHoverY + d3.event.dy) + "px")

	tick(); // this is the key to make it work together with updating both px,py,x,y on d !
	foundOverlap = 0;
//	var hoverContent = "";
	for (x in nodes) {
	    if (x != i) {
			var distanceBetween = Math.sqrt(Math.pow(nodes[x].x - nodes[i].x,2) + Math.pow(nodes[x].y - nodes[i].y,2))
		if (distanceBetween < 35) {
		    d3.select("#nodehover_" + d.id).style("fill", "#00b757").style("opacity", .1);
		    d3.select("#nodehover_" + nodes[x].id).style("fill", "#00b757").style("opacity", .1);
		    foundOverlap++;
		    hoverContent = "<p>" + d.name + "</p><p style='color: #808080;'>" + d.birthyear + " - " + (d.end != 2013 ? "" + d.end : "") + "</p>";
		    hoverContent += "<p>" + nodes[x].name + "</p><p style='color: #808080;'>" + nodes[x].birthyear + " - " + (nodes[x].end != 2013 ? "" + nodes[x].end : "") + "</p>";
		    hoverContent += "<p style='color: #808080;' class='emphasize'>Release to connect</p>";
		}
		else if  (distanceBetween < 70) {
		    d3.select("#nodehover_" + d.id).style("fill", "#ffba00").style("opacity", .2);
		    d3.select("#nodehover_" + nodes[x].id).style("fill", "#ffba00").style("opacity", .2);
		    foundOverlap++;
		    hoverContent = compareNodes(nodes[i], nodes[x]);
		}
		else {
		    d3.select("#nodehover_" + nodes[x].id).style("fill", "lightblue").style("opacity", 0);
		}
	    }
	}
	if (foundOverlap == 0) {
	    d3.selectAll("#hoverContent").html("<p>" + nodes[i].name + "</p><p style='color: #808080;'>" + nodes[i].birthyear + " - " + (nodes[i].end && nodes[i].end < 2013 ? nodes[i].end : '') + "</p>");
	    d3.select("#nodehover_" + d.id).style("fill", "#67ccff").style("opacity", .1);
	}
	else if (foundOverlap == 1) {
	    d3.selectAll("#hoverContent").html(hoverContent);
	} else {
	    d3.selectAll("#hoverContent").html("<p>" + nodes[i].name + "</p><p style='color: #808080;'>" + nodes[i].birthyear + " - " + (nodes[i].end && nodes[i].end < 2013 ? nodes[i].end : '') + "</p>");
	    d3.selectAll(".nodeHover").style("opacity", function(d) {
		return d3.select("#nodehover_" + d.id).style("opacity") > 0 ? .1 : 0
	    }).style("fill", "#000000");
	    d3.select("#nodehover_" + d.id).style("opacity", .1);
	}

    }

    function dragend(d, i) {
	d.fixed = true; // of course set the node to fixed so the force doesn't include the node in its auto positioning stuff
	nodeDragging = false;

	d3.selectAll(".nodeHover").style("opacity", 0);
	tick();
	force.resume();
	d3.selectAll("g.node").on("mouseover", nodeOver).on("mouseout", anyOut);
	d3.selectAll("g.link").on("mouseover", anyOver).on("mouseout", anyOut);

	if (clickNotDrag) {
	    showThirdBio(d.id);
	}
	else {
	for (x in nodes) {
	    if (x != i) {
		var distanceBetween = Math.sqrt(Math.pow(nodes[x].x - nodes[i].x,2) + Math.pow(nodes[x].y - nodes[i].y,2))
		if (foundOverlap > 1) {
		    break;
		}
		if (distanceBetween < 35) {
		    currentHighlightedNode = "";
		    pathViz('sent', nodes[i].id, nodes[x].id);
		    anyOut();
		    break;
		} else if (Math.abs(nodes[x].x - nodes[i].x) < 40 && Math.abs(nodes[x].y - nodes[i].y) < 40) {
		    anyOut();
		    break;

		}
	    }
	}
	}
    }

    var link = gNetworkVis.selectAll("g.link").data(links, function(d) {
	return d.source.id + "-" + d.target.id;
    });
    linkenter = link.enter().insert("g", "g.node")
    .attr("class","link")
    .on("mouseover", anyOver)
    .on("mouseout", anyOut)
    .style("display", function(d) {return d.relation == "none" ? "none" : "block"})

    
    linkenter.append("path")
    .attr("class", "link")
    .style("fill", "none")
    .style("stroke", "white")
    .attr("id", function(d, i) {
	return ("lineid_" + i)
    })
    .style("stroke-width", 10)
    .style("opacity", 0)
    .style("cursor", "default");
    
    linkenter.append("path")
    .attr("class", "link")
    .style("fill", "none")
    .style("stroke", function(d) {
	return connectionLines[d.relation]
    })
    .attr("id", function(d, i) {
	return ("lineid_" + i)
    })

    link.exit().remove();
    var node = gNetworkVis.selectAll("g.node").data(nodes, function(d) {
	return d.id
    });
    var nodeEnter = node.enter()
    .append("svg:g").attr("class", "node").call(node_drag).attr("id", function(d) {
	return (d.id)
    }).style("display", function(d) {return d.size == 1 ? "none" : "block"}).on("mouseover", nodeOver).on("mouseout", anyOut).style("cursor", "pointer");
    nodeEnter.append("svg:rect").attr("class", "nodeHover").attr("height", 70).attr("width", 70).attr("x", -35).attr("y", -35).attr("rx", 100).attr("rx", 100).style("fill", "lightblue").attr("id", function(d) {
	return ("nodehover_" + d.id)
    }).style("stroke", "none").style("stroke-width", 0).style("opacity", 0).style("pointer-events", "none");
    nodeEnter.append("svg:rect").attr("class", "nodeBackground")
    .attr("height", 30)
    .attr("width", 30)
    .attr("x", -15)
    .attr("y",  -15)
    .attr("rx", 100)
    .attr("ry", 100).style("fill", function(d) {
	return d.image == 'male' ? slightlyRandomColor('#67ccff',colorVariance) : slightlyRandomColor('#caa6ff',colorVariance)
    }).attr("id", function(d) {
	return ("nodebc_" + d.id)
    })
    
    nodeEnter.append("svg:rect").attr("class", "nodeopacfilter")
    .attr("height", 30)
    .attr("width", 30)
    .attr("x", -15)
    .attr("y",  -15)
    .attr("rx", 100)
    .attr("ry", 100)
    .style("fill", "black")
    .style("opacity", .25)
    
    nodeEnter.append("svg:image").attr("class", "nodeImage").attr("xlink:href", function(d) {
	return ("r/icons/" + d.image + ".png")
    }).attr("x", -15)
    .attr("y", -15)
    .attr("width", 30)
    .attr("height", 30)
    .style("opacity", .5)
    .style("pointer-events", "none");
    


    node.exit().remove();
    force.start();
    resizedNodes = false;
}

    function draggingClicking() {
    	clickNotDrag = false;
    }


function compareNodes(nodeA, nodeB) {
    var eraDifference = Math.abs(nodeA.birthyear - nodeB.birthyear);
    var ageDifference = Math.abs((nodeA.end - nodeA.birthyear) - (nodeB.end - nodeB.birthyear));
    
    var aDetails = "";
    var bDetails = "";
    var bothDetails = "<p style='color: #808080;'>";
/*    bothDetails += "Shared Places: ";
    
    if (nodeA["aevents"] && nodeB["aevents"]) {
    for (x in nodeA["aevents"]) {
	if (x) {
	    for (y in nodeB["aevents"]) {
		if (y) {
		    if (nodeB["aevents"][x]["place"] && nodeA["aevents"][x]["place"]) {
			if (nodeB["aevents"][x]["place"] == nodeA["aevents"][x]["place"]) {
			    bothDetails += "" + nodeA["aevents"][x]["place"] + ", ";
			    break;
			}
		    }
		}
	    }
	}
    }
    }
    */

    var foundOccu = false;
    var occuOverlap = [];
    for (x in nodeA["occus"]) {
	if (x) {
	    for (y in nodeB["occus"]) {
		if (y) {
			if (nodeB["occus"][x] == nodeA["occus"][x]) {
			    foundOccu = true;
			    occuOverlap.push(occuArray[nodeA["occus"][x]]["display-name"]);
			    break;
			}
		}
	    }
	}
    }
    if (foundOccu == true) {
	bothDetails += "</p><p style='color: #808080;'>Shared Occupations: " + occuOverlap.toString();	//code
    }
    bothDetails += "</p>";

    var hoverContent = "<p>" + nodeA.name + "</p><p style='color: #808080; line-height: 16px;'>" + nodeA.birthyear + " - " + (nodeA.end != 2013 ? "" + nodeA.end : "") + "</p>";
    hoverContent += "<p>" + nodeB.name + "</p><p style='color: #808080; line-height: 16px;'>" + nodeB.birthyear + " - " + (nodeB.end != 2013 ? "" + nodeB.end : "") + "</p>";

    if (nodeA.end > nodeB.birthyear && nodeA.birthyear < nodeB.end) {
	eraDifference = "Lifespans overlapped: birthdates separated by " + Math.abs(nodeB.birthyear - nodeA.birthyear) + " years."
    }
    else {
		var earlierNode = nodeA;
		var laterNode = nodeB;
	if (nodeB.end < nodeA.end) {
		var earlierNode = nodeB;
		var laterNode = nodeA;
	}
	eraDifference = earlierNode.name + " died " + (laterNode.birthyear - earlierNode.end) + " years before " + laterNode.name + " was born."
    }
    hoverContent += "<p style='color: #808080; padding-top: 10px;'>" + eraDifference + "</p>"
    
    
    if (nodeA.end != 2013 && nodeB.end != 2013) {
	hoverContent += "<p style='color: #808080;'>Lifespan difference of " + ageDifference + " years</p>" + bothDetails;
    }
//    d3.selectAll("#hoverContent").html(hoverContent);
    return hoverContent;

}

function addNodes(d, i) {
    var pathClick = egoQuery + d.id;
    d3.json(pathClick, function(json) {
	for (x = 0; x < json.nodes.length; x++) {
	    var found = false;
	    for (y = 0; y < nodes.length; y++) {
		if (nodes[y].id == json.nodes[x].id) {
		    found = true;
		    break;
		}
	    }
	    if (found == false) {
		activeNodesList += ",'" + json.nodes[x].id + "'";
		nodes.push(json.nodes[x]);
		nodeHash[json.nodes[x].id] = nodes.length - 1;
	    }
	}
	for (x = 0; x < json.links.length; x++) {
	    var found = false;
	    for (y = 0; y < links.length; y++) {
		if (links[y].id == json.links[x].id) {
		    found = true;
		    break;
		}
	    }
	    if (found == false) {
		links.push({
		    source: nodes[nodeHash[json.links[x].sid]],
		    target: nodes[nodeHash[json.links[x].tid]],
		    "relation": json.links[x].relation,
		    "id": json.links[x].id
		});
	    }
	}
	restart();
    })
}

function addOccNodes() {
    for (groupX in groups) {
	nodes.push(groups[groupX])
	nodeHash[groups[groupX].id] = nodes.length - 1;
	for (valX in groups[groupX]["values"]) {
	    links.push({
		source: nodes[nodes.length - 1],
		target: nodes[nodeHash[groups[groupX]["values"][valX].id]],
		"relation": "none",
		"id": 9999
	    })
	}
    }
    occNodes = true;
    restart();
}

function removeOccNodes() {
    force.stop();
    var x = nodes.length - 1;
    while (x >= 0) {
	if (nodes[x].isMetaNode) {
	    nodes.pop();
	}
	x--;
    }

    var x = links.length - 1;
    while (x >= 0) {
	if (links[x].relation == "none") {
	    links.pop();
	}
	x--;
    }
    
    gNetworkVis.selectAll("g.hull").remove();
    force.start();
}

//EMPHASIS


function emphasizeNode(idArray, color, isTemporary, emphDuration) {

    d3.selectAll("rect.nodeBackground").transition().duration(1000).style("fill", function(d) {
	return idArray[0].id == d.id ? "green" : "pink"
    }).style("opacity", function(d) {
	return idArray[0].id == d.id ? 1 : .25
    }).style("stroke", "green").style("stroke-width", function(d) {
	return idArray[0].id == d.id ? 5 : 0
    })

    d3.selectAll("rect.nodeBackground").transition().delay(2000).duration(1000).style("fill", "seagreen").style("opacity", 1).style("stroke-width", 0)
}
function emphasizeNodeRing(idArray, color, isTemporary, emphDuration) {
    for (x = 0; x < idArray.length; x++) { //append background color tag
	var bcolorID = "nodebc_" + idArray[x];
	var oldColor = d3.select(document.getElementById(bcolorID)).style("stroke");
	var oldSize = d3.select(document.getElementById(bcolorID)).style("stroke-width");
	d3.select(document.getElementById(bcolorID)).style("stroke", color).style("opacity", .9).style("stroke-width", 2);
	if (isTemporary == true) {
	    d3.select(document.getElementById(bcolorID)).transition().delay(emphDuration).duration(emphDuration).style("stroke-width", 1).style("stroke", "black").style("opacity", .3);
	}
    }
}
function emphasizeLink(idArray, color, isTemporary, emphDuration) {
    for (x = 0; x < idArray.length; x++) { //append background color tag
	for (y = 0; y < links.length; y++) {
	    if (idArray[x].sourceid == links[y].source.id && idArray[x].targetid == links[y].target.id) {
		var tarLink = "lineid_" + links[y].id;
		var oldColor = d3.select(document.getElementById(tarLink)).attr("stroke");
		d3.select(document.getElementById(tarLink)).transition().duration(emphDuration).style("stroke-width", 8).attr("stroke", color);
		if (isTemporary == true) {
		    d3.select(document.getElementById(tarLink)).transition().delay(emphDuration).duration(emphDuration).style("stroke-width", 4).attr("stroke", oldColor);
		}
		break;
	    }
	}
    }
} //LABELING


function onoffLabel(idArray, flip) {
    for (x = 0; x < idArray.length; x++) { //append background color tag
	var bcolorID = "nodelabel_" + idArray[x]; //    	if (d3.select(document.getElementById(bcolorID)).text() == "" && flip == true) {
	d3.select(document.getElementById(bcolorID)).transition().duration(2000).text(function(d) {
	    return d.name
	}) //	      .attr("x", function(d) { return -(d.name.length) })
	; //    	}
	/*    	else {
    		d3.select(document.getElementById(bcolorID))
    		.transition()
		    .duration(2000)
		      .text("")
    		}
    		*/
    }
} //OTHER


function nodeSizeWeight() {

    if (dynamicSizing == true) {
	sizeRamp = d3.scale.linear().domain([2, 10, 40]).range([16, 32, 64]).clamp(true);
	for (x = 0; x < nodes.length; x++) {
	    var bcolorID = "nodebc_" + nodes[x].id;
	    d3.select(document.getElementById(bcolorID)).attr("height", sizeRamp(nodes[x].weight)).attr("width", sizeRamp(nodes[x].weight)).attr("x", -(sizeRamp(nodes[x].weight) / 2)).attr("y", -(sizeRamp(nodes[x].weight) / 2));
	}
    }
    resizedNodes = true;
}

function nodeSizeImportance() {

    sizeRamp = d3.scale.linear().domain([0, 13, 60, 100]).range([14, 20, 30, 40]).clamp(true);
    opacityRamp = d3.scale.linear().domain([0, 100, 1000]).range([0, .25, 1]).clamp(true);

    /*
    for (x = 0; x < nodes.length; x++) {
	var bcolorID = "nodebc_" + nodes[x].id;
	d3.select(document.getElementById(bcolorID))
	//    	.style("opacity", sizeRamp(nodes[x].charsize))
	.attr("height", sizeRamp(nodes[x].end - nodes[x].birthyear)).attr("width", sizeRamp(nodes[x].end - nodes[x].birthyear) / 2).attr("x", -(sizeRamp(nodes[x].end - nodes[x].birthyear) / 4)).attr("y", -(sizeRamp(nodes[x].end - nodes[x].birthyear) / 2));
    }
    */
    d3.selectAll(".nodeBackground").attr("height", function(d) {return sizeRamp(d.end - d.birthyear)}).attr("width", function(d) {return sizeRamp(d.end - d.birthyear) / 2}).attr("x", function(d) {return -(sizeRamp(d.end - d.birthyear)) / 4}).attr("y", function(d) {return -(sizeRamp(d.end - d.birthyear)) / 2});
    d3.selectAll(".nodeImage").attr("height", function(d) {return sizeRamp(d.end - d.birthyear) / 1.5}).attr("width", function(d) {return sizeRamp(d.end - d.birthyear) / 3}).attr("x", function(d) {return -(sizeRamp(d.end - d.birthyear)) / 6}).attr("y", function(d) {return -(sizeRamp(d.end - d.birthyear)) / 3});
    resizedNodes = true;
}
function colorByAttribute(attrName, colorRange) {
    	_gaq.push(['_trackEvent', 'colorEvent', attrName]);

    	var attMin = d3.min(nodes, function(d) {return d[attrName]});
    	var attMax = d3.max(nodes, function(d) {return d[attrName]});
    	var attMean = (attMin + attMax) / 2

    var attrRamp = d3.scale.linear().domain([attMin,(attMin + attMean) / 2,attMean,(attMax + attMean) / 2,attMax]).range(legendColors);
    
    for (x = 0; x < nodes.length; x++) {
	var bcolorID = "#nodebc_" + nodes[x].id;
	d3.select(bcolorID).transition().duration(300).style("fill", slightlyRandomColor(attrRamp(nodes[x][attrName]),colorVariance));
    }
    
    d3.selectAll("rect.timelineBar").transition().duration(300).style("fill", function(d) {return  slightlyRandomColor(attrRamp(d[attrName]),colorVariance)});

    carto.selectAll("path.adminUnits").transition().duration(300).style("fill",
    function (d) {
	var colorByGeoArray = [];
	for (no in nodes) {
	    if (nodes[no].id) {
		if (d.properties.who.indexOf(nodes[no].id) > -1) {
		    colorByGeoArray.push(nodes[no][attrName]);
	    }
	}
    }
    var sum = colorByGeoArray.reduce(function(a, b) { return a + b });
    var avg = sum / colorByGeoArray.length;
    return slightlyRandomColor(attrRamp(avg),colorVariance)    
    }
    )

    
    var legendRamp = d3.scale.linear().domain([0,1,2,3,4]).range(legendColors).clamp(true);
    
    var legData = [attMin,attMean,attMax];
    
    if (["centrality"].indexOf(attrName) > -1) {
        legData = ['Less','','More']
    }
    
    if (["odnb"].indexOf(attrName) > -1) {
        legData = ['in ODNB','','Distance']
    }
    
    d3.select("#mapLegend").selectAll("rect.legendRect").style("fill", function(d,i) {return legendRamp(i)});
    d3.select("#networkLegend").selectAll("rect.legendRect").style("fill", function(d,i) {return legendRamp(i)}).style("display", "block").attr("x", function(d,i) {return ((i* 88))}).attr("width",86);
    d3.select("#timelineLegend").selectAll("rect.legendRect").style("fill", function(d,i) {return legendRamp(i)}).style("display", "block").attr("x", function(d,i) {return ((i* 88))}).attr("width",86);
    d3.select("#mapLegend").selectAll("text.legendText").data(legData).text(function (d) {return d});
    d3.select("#networkLegend").selectAll("text.legendText").data(legData).text(function (d) {return d});
    d3.select("#timelineLegend").selectAll("text.legendText").data(legData).text(function (d) {return d});

    var attrDisplayName = attrName.charAt(0).toUpperCase() + attrName.slice(1);
    
    if (attrName=="odnb") {
	attrDisplayName = "ODNB"
    }
    else if (attrName=="relatedness") {
	attrDisplayName = "Inbreeding"
    }
    else if (attrName=="parentless") {
	attrDisplayName = "Depth"
    }
    else if (attrName=="birthyear") {
	attrDisplayName = "Year of Birth"
    }
    
    d3.selectAll("text.legendName").text(attrDisplayName);
}

function colorByGender() {
    var attrRamp = d3.scale.linear().domain([0,1]).range(["#67ccff","#caa6ff"]);
    
    d3.selectAll("rect.nodeBackground").transition().duration(300).style("fill", function(d) {
	return d.image == 'male' ? slightlyRandomColor('#67ccff',colorVariance) : slightlyRandomColor('#caa6ff',colorVariance)
    })
	
    d3.selectAll("rect.timelineBar").transition().duration(300).style("fill", function(d) {
	return d.image == 'male' ? slightlyRandomColor('#67ccff',colorVariance) : slightlyRandomColor('#caa6ff',colorVariance)
    })
    
    carto.selectAll("path.adminUnits").transition().duration(300).style("fill",
    function (d) {
	var numMales = 0;
	var numFemales = 0;
	for (no in nodes) {
	    if (nodes[no].id) {
		if (d.properties.who.indexOf(nodes[no].id) > -1) {
		nodes[no].image == 'male' ? numMales++ : numFemales++;
	    }
	}
    }
    var avg = numFemales / (numFemales + numMales);
    return slightlyRandomColor(attrRamp(avg),colorVariance);
    }
    )
    
    var legendRamp = d3.scale.linear().domain([0,1,2,3,4]).range(genderColors).clamp(true);

    d3.select("#mapLegend").selectAll("rect.legendRect").style("fill", function(d,i) {return legendRamp(i)});
    d3.select("#networkLegend").selectAll("rect.legendRect").style("fill", function(d,i) {return i < 2 ? "#51a1c9" : "#8f68c9"}).style("display", function(d,i) {return (i != 2 ? "block" : "none")}).attr("width",function(d,i) {return (i == 4) ? 86 : (i==1 ? 130 : 140)}).attr("x", function(d,i) {return i == 3 ? 220 : (i* 88)});
    d3.select("#timelineLegend").selectAll("rect.legendRect").style("fill", function(d,i) {return i < 2 ? "#51a1c9" : "#8f68c9"}).style("display", function(d,i) {return (i != 2 ? "block" : "none")}).attr("width",function(d,i) {return (i == 4) ? 86 : (i==1 ? 130 : 140)}).attr("x", function(d,i) {return i == 3 ? 220 : (i* 88)});
    d3.select("#mapLegend").selectAll("text.legendText").data(["Male", "", "Female"]).text(function (d) {return d});
    d3.select("#networkLegend").selectAll("text.legendText").data(["Male", "", "Female"]).text(function (d) {return d});
    d3.select("#timelineLegend").selectAll("text.legendText").data(["Male", "", "Female"]).text(function (d) {return d});

    d3.selectAll("text.legendName").text("Gender");
}

function colorPartitionByAttribute(attrName, attrValue, colorName) {
    for (x = 0; x < nodes.length; x++) {
	var bcolorID = "nodebc_" + nodes[x].id;
	if (nodes[x][attrName] == attrValue) {
	    d3.select(document.getElementById(bcolorID)).transition().duration(2000).attr("fill", colorName);
	}
    }
}

function removeOnes() {
    for (y = links.length - 1; y >= 0; y--) {
	if (links[y].source.weight == 1 || links[y].target.weight == 1) {
	    links.splice(y, 1);
	}
    }
    var tempArray = new Array();
    for (x = nodes.length - 1; x >= 0; x--) {
	if (nodes[x].weight == 1) {
	    tempArray.push(nodes[x].id);
	    nodes.splice(x, 1); // remove b
	}
    }
    restart();
} //NOT WORKING


function changeForce() {
    force.gravity(.025).distance(100).charge(-100);
} //NOT WORKING

//NEW FUNCTIONS

function recolorGraph(fillColor) {
    d3.selectAll("rect.nodeBackground").transition().duration(300).style("fill", slightlyRandomColor(fillColor,colorVariance));
}

function highlightSubgraph(idArray, fillColor) {

    var bgNodes = d3.selectAll("rect.nodeBackground");
    
    var subgraph = bgNodes.select(function(d, i) { return idArray.indexOf(d.id) > -1 ? this : null; });
    
    subgraph.transition().duration(300).style("fill", slightlyRandomColor(fillColor,colorVariance));

    
}

function fixSingleNode(idArray, locationX, locationY) {
    for (x = 0; x < idArray.length; x++) {
	for (y = 0; y < nodes.length; y++) {
	    if (nodes[y].id == idArray[x]) {
		nodes[y].fixed = true;
		nodes[y].x = locationX * parseInt(networkVis.attr("width"));
		nodes[y].y = locationY * parseInt(networkVis.attr("height"));
		nodes[y].px = locationX * parseInt(networkVis.attr("width"));
		nodes[y].py = locationY * parseInt(networkVis.attr("height"));
		break;
	    }
	}
    }
    tick();
}

function hierarchicalLayout(centerID, locationX, locationY, pathKin, callback) {

    if (!(nodes[nodeHash[centerID]])) {
	centerID = nodes[0].id;
    }
    tick();
    force.stop();

    for (y = 0; y < nodes.length; y++) {
	nodes[y].fixed = false;
	nodes[y].x = 0;
    }

    nodes[nodeHash[centerID]].fixed = true;

    positionArray = [];

    for (g = 0; g < 100; g++) {
	positionArray[g] = [];
    }

//    positionArray[48] = []; //Grandparents
//    positionArray[49] = []; //Parents
    positionArray[50] = [centerID]; //Peers
//    positionArray[51] = []; //Children
//    positionArray[52] = []; //Grandchildren
    positionHash = {};
    positionHash[centerID] = 50;
    var foundNodes = true;
    while (foundNodes == true) {
	foundNodes = false;
//	for (x in links) {
	for (var x=0;x<links.length;x++) {
	    if (links[x].target.fixed == true && links[x].source.fixed == false) {
		var foundNodes = true;
		if (links[x].relation == "green" || links[x].relation == "purple") {
		    positionHash[links[x].source.id] = positionHash[links[x].target.id];
		} else {
		    positionHash[links[x].source.id] = positionHash[links[x].target.id] - 1;
		}
		positionArray[positionHash[links[x].source.id]].push(links[x].source.id);
		links[x].source.fixed = true;
	    } else if (links[x].source.fixed == true && links[x].target.fixed == false) {
		var foundNodes = true;
		if (links[x].relation == "green" || links[x].relation == "purple") {
		    positionHash[links[x].target.id] = positionHash[links[x].source.id];
		} else {
		    positionHash[links[x].target.id] = positionHash[links[x].source.id] + 1;
		}
		positionArray[positionHash[links[x].target.id]].push(links[x].target.id);
		links[x].target.fixed = true;
	    }
	}
    }

    if (pathKin == "kin") {
	hideThirdBio();

	var posMin = 99;
	var posMax = 0;
	for (x in positionHash) {
	(positionHash[x] > posMax) ? posMax = positionHash[x] : null;
	(positionHash[x] < posMin) ? posMin = positionHash[x] : null;	
	}

	linePositioning = {};

	
	var x = posMin;
	while (x <= posMax) {
	linePositioning[x] = Math.min(3,positionArray[x].length);
	x++;
	}

	////////////////////REORDER BY BIRTH YEAR AND MARRIAGE

	var x = posMin;
	while (x <= posMax) {
	    var newArray = [];
	    while (newArray.length < positionArray[x].length) {
		var replacementID = "";
		var minYear = 9999;
		// Find the youngest
		for (y in positionArray[x]) {
		    if (newArray.indexOf(positionArray[x][y]) == -1) {
			if (nodes[nodeHash[positionArray[x][y]]].birthyear <= minYear) {
			    minYear = nodes[nodeHash[positionArray[x][y]]].birthyear;
			    replacementID = positionArray[x][y];
			}
		    }
		}
		//Put them in the array
		newArray.push(replacementID);

		//If anyone else at this level is married to them, put them in first, and string their marriages off, if that happens (but let's hope it doesn't)
		var marriedPeople = [replacementID];
		for (z in links) {
		    if (marriedPeople.indexOf(links[z].source.id) > -1 && marriedPeople.indexOf(links[z].target.id) == -1 && links[z].relation == "green" && newArray.indexOf(links[z].target.id) == -1) {
			newArray.push(links[z].target.id);
			marriedPeople.push(links[z].target.id)
		    } else if (marriedPeople.indexOf(links[z].target.id) > -1 && marriedPeople.indexOf(links[z].source.id) == -1 && links[z].relation == "green" && newArray.indexOf(links[z].source.id) == -1) {
			newArray.push(links[z].source.id);
			marriedPeople.push(links[z].source.id)
		    }
		}

	    }
	    positionArray[x] = newArray;
	    x++;
	}


	////////////////////
	var x = posMin;
	while (x <= posMax) {
	    for (y in positionArray[x]) {
		var spacing = 400 / (positionArray[x].length + 3);
		// Find Married Couples
		for (z in links) {
		    var foundNodes = true;
		    while (foundNodes == true) {
			foundNodes = false;
			if ((links[z].source.id == positionArray[x][y] || links[z].target.id == positionArray[x][y]) && links[z].relation == "green") {
			    if (links[z].source.x == 0) {
				linePositioning[x] += .75;
				foundNodes = true;
				links[z].source.x = linePositioning[x] * spacing;
				links[z].source.px = linePositioning[x] * spacing;
				links[z].source.y = (x - 47) * 40;
				links[z].source.py = (x - 47) * 40;
				linePositioning[x] += .25;
			    }

			    if (links[z].target.x == 0) {
				linePositioning[x] += .75;
				foundNodes = true;
				links[z].target.x = (linePositioning[x]) * spacing;
				links[z].target.px = (linePositioning[x]) * spacing;
				links[z].target.y = (x - 47) * 40;
				links[z].target.py = (x - 47) * 40;
				linePositioning[x] += .25;
			    }
			    links[z].source.fixed = true;
			    links[z].target.fixed = true;
			}
		    }
		}
		if (nodes[nodeHash[positionArray[x][y]]].x == 0) {
		    linePositioning[x] += 1;
		    nodes[nodeHash[positionArray[x][y]]].x = linePositioning[x] * spacing;
		    nodes[nodeHash[positionArray[x][y]]].px = linePositioning[x] * spacing;
		    nodes[nodeHash[positionArray[x][y]]].y = (x - 47) * 40;
		    nodes[nodeHash[positionArray[x][y]]].py = (x - 47) * 40;
		    nodes[nodeHash[positionArray[x][y]]].fixed = true;
		    linePositioning[x] += 1;
		}
		linePositioning[x] += 1;
	    }
	    x++;
	}
    }

    callback();

}

function newPathLayout(centerID) {
	hideThirdBio();
    force.stop();
    
    	    for (y = 0; y < nodes.length; y++) {
		nodes[y].fixed = false;
	    }

    nodes[nodeHash[centerID]].fixed = true;
    nodes[nodeHash[centerID]].y = 100;
    nodes[nodeHash[centerID]].py = 100;
    nodes[nodeHash[centerID]].x = 100;
    nodes[nodeHash[centerID]].px = 100;

    var fixedNodes = 1;
    var currentNode = nodes[nodeHash[centerID]];
    var targetNode = {};
    var foundNode = false;
    var vert = "none";
    
    
    var override = 0;
    
    while (fixedNodes < nodes.length && override < 500) {
	override++;
	for (x in links) {
	    if (links[x]) {
		var foundNode = false;
		if (links[x].source == currentNode) {
		    targetNode = links[x].target;
		    foundNode = true;
		}
		else if (links[x].target == currentNode) {
		    targetNode = links[x].source;
		    foundNode = true;
		}
		if (foundNode == true) {
		    if (targetNode.fixed == false) {
			    targetNode.fixed = true;
			if (links[x].relation == "purple" || links[x].relation == "green") {
			    targetNode.x = currentNode.x + 1;
			    targetNode.px = currentNode.px + 1;
			    targetNode.y = currentNode.y;
			    targetNode.py = currentNode.py;
			    vert = "right";
			}
			else if (currentNode.birthyear < targetNode.birthyear) {
			    targetNode.x = vert == "up" ? currentNode.x + 1 : currentNode.x;
			    targetNode.px = vert == "up" ? currentNode.px + 1 : currentNode.px;
			    targetNode.y = currentNode.y + 1;
			    targetNode.py = currentNode.py + 1;
			    vert = "down";
			}
			else {
			    targetNode.x = vert == "down" ? currentNode.x + 1 : currentNode.x;
			    targetNode.px = vert == "down" ? currentNode.px + 1 : currentNode.px;
			    targetNode.y = currentNode.y - 1;
			    targetNode.py = currentNode.py - 1;
			    vert = "up";
			}
			currentNode = targetNode;
			fixedNodes++;
			foundNode = false;
		    }
		}
	    }
	}
    }
}

function fixNode(centerID, locationX, locationY, pathKin, callback) {

    setActive('nBT','netLayoutButton');
    d3.select("#nBPr").classed("disabled", true)

    if (centerID != 'pregen') {
	if (pathKin == "kin") {
	    if (nodes[nodeHash[centerID]]) {
	    hierarchicalLayout(centerID, locationX, locationY, pathKin, callback);
	    
	    var kbSettings = window.location.hash.split("/");
	    if (kbSettings.length > 2) {
	    if (currentFocusID.length > 1) {
		window.location.hash = "/kin/" + divLayout.network + "/" + divLayout.timeline + "/" + divLayout.map + "/" + currentFocusID + "//";
		updateUrlBox();
	    }
	    }
	    }
	} else {
	    	
	    centerID = nodes[0].id;
	    newPathLayout(centerID);
	    callback();
	}
    }
}

function fixOrbit(centerID, locationX, locationY, callback) {

    for (y = 0; y < nodes.length; y++) {
	nodes[y].fixed = false;
    }

    tick();
    force.stop();

    var orbitRank = 0;

    orbitArray = {};

    orbitArray[centerID] = 0;

    //	var centerID = idArray[0];
    var centerBirthYear = nodes[nodeHash[centerID]].birthyear;
    nodes[nodeHash[centerID]].fixed = true;
    nodes[nodeHash[centerID]].y = locationY;
    nodes[nodeHash[centerID]].py = locationY;
    nodes[nodeHash[centerID]].x = locationX;
    nodes[nodeHash[centerID]].px = locationX;

    //	var birthRamp=d3.scale.linear().domain([1700,1900]).range([50,950]).clamp(true);
    var totalLinks = links.length;
    var openLinks = 0;
    orbitalRings = [1, 0, 0, 0, 0, 0, 0, 0]

    while (openLinks < totalLinks) {
	for (z = 0; z < links.length; z++) {
	    if (links[z].target.fixed == true && links[z].target.fixed == true) {
		openLinks++;
	    } else if (links[z].target.fixed == true) {
		assignedID = (links[z].source.id);
		assignedValue = (orbitArray[links[z].target.id] + 1);
		links[z].source.fixed = true;
		orbitArray[assignedID] = assignedValue;
		orbitalRings[orbitArray[links[z].target.id] + 1]++;
	    } else if (links[z].source.fixed == true) {
		assignedID = (links[z].target.id);
		assignedValue = (orbitArray[links[z].source.id] + 1);
		links[z].target.fixed = true;
		orbitArray[assignedID] = assignedValue;
		orbitalRings[orbitArray[links[z].source.id] + 1]++;
	    }
	}
    }

    callback();
}

function fitNodesToCanvas() {
    var divBounds = refitDiv("network");

    // Minimum X is always 0
    var minX = d3.min(nodes, function(d) {
	return d["x"]
    });
    var maxX = d3.max(nodes, function(d) {
	return d["x"]
    });
    var minY = d3.min(nodes, function(d) {
	return d["y"]
    });
    var maxY = d3.max(nodes, function(d) {
	return d["y"]
    });

    var yBuffer = 75;
    var xBuffer = 75;
    
    heightRamp = d3.scale.linear().domain([minY, maxY]).range([yBuffer, (divBounds.maxy - (yBuffer * .5))]);
    widthRamp = d3.scale.linear().domain([minX, maxX]).range([xBuffer, (divBounds.maxx - xBuffer)]);

    for (y = 0; y < nodes.length; y++) {
	nodes[y].x = widthRamp(nodes[y].x);
	nodes[y].px = widthRamp(nodes[y].px);
	nodes[y].y = heightRamp(nodes[y].y);
	nodes[y].py = heightRamp(nodes[y].py);
    }
    
    placeFixedNetwork();

}
function fixbyBirthDate(idArray, locationX, locationY) {
    var birthRamp = d3.scale.linear().domain([1700, 1900]).range([50, 950]).clamp(true);
    for (y = 0; y < nodes.length; y++) {
	nodes[y].fixed = true;
	nodes[y].x = birthRamp(nodes[y].birthyear);
	nodes[y].px = birthRamp(nodes[y].birthyear);
    }
    tick();
}

function forceClick() {
    _gaq.push(['_trackEvent', 'layoutEvent', "force-directed"]);
    freeNodes();
}
function freeNodes() {

    hideThirdBio();

    d3.select("#nBPr").classed("disabled", false);

    networkVis.selectAll("g.axis").remove();
    nodes[0].px += 5;
    for (y = 0; y < nodes.length; y++) {
	nodes[y].fixed = false;
    }
    force.resume();
}

function anyOut() {

    force.start();
    d3.selectAll("#hoverBoth").style("display", "none")
    d3.selectAll("rect.nodeBackground").transition().delay(250).duration(100).style("stroke-width", 0);
    d3.selectAll(".nodeImage").transition().delay(250).duration(100).style("stroke-width", 0);

    d3.selectAll("rect.nodeopacfilter").transition().delay(250).duration(100).style("opacity", .25)
    .style("fill", "black");
    d3.selectAll("rect.timelineopacfilter").transition().delay(250).duration(100).style("opacity", .25)
    .style("fill", "black");
    d3.selectAll("path.placeopacfilter").transition().delay(250).duration(100).style("opacity", .25)
    .style("fill", "black");
    d3.selectAll(".uaevents").style("fill", function(b) { return slightlyRandomColor(eventColor[b.eventtype],colorVariance)});
    d3.selectAll(".aevents").style("fill", function(b) { return slightlyRandomColor(eventColor[b.eventtype],colorVariance)});

    d3.selectAll(".nodetitle").remove();

    d3.selectAll("path.link").transition().delay(250).duration(100).style("stroke", function(d) {
	return connectionLines[d.relation]
    });


}

function nodeOver(noded, nodei) {
    anyOver(noded, nodei, this)

}

function timelineBarOver(noded, nodei) {
    anyOver(noded, nodei, this)
}

function anyOver(noded, nodei, divID) {
    force.stop();
    var hoverContent = "";
    var idArray = [noded.id];
    
    //Event
    if (noded.actor) {
	idArray = noded.actor;
	var andOthers = false;
	var othersArray = []
	for (x in idArray) {
	    if (nodes[nodeHash[idArray[x]]]) {
		othersArray.push(nodes[nodeHash[idArray[x]]].name);
	    } else {
		andOthers = true;
	    }
	}
	if (andOthers == true) {
		//othersArray.push("others");
	}
	hoverContent = "<p style='color: #808080; font-style: italic; padding-bottom:10px;'>"
        hoverContent += othersArray.join(" and ");
	hoverContent += "</p>"

	if (noded.eventlabel) {
	    hoverContent += "<p style='color: #000000; padding-bottom:10px;'>" + noded.eventlabel + "</p>"
	} else {
	    hoverContent += "<p>Non-Person</p>"
	}
	if (noded.eventdate) {
	    hoverContent += "<p style='color: #808080;'>" + noded.eventdate + "</p>"	    
	}
	if (noded.eventplace) {
	    hoverContent += "<p style='color: #808080; padding-top: 0;'>" + noded.eventplace + "</p>"	    
	}

    }
    //Link
    else if (noded.source) {
	idArray = [noded.source.id, noded.target.id];
	hoverContent = "<p>" + relationDescription(noded) + "<p>";
    }
    //Locations currently store actor array in properties.who
    else if (noded.who) {
	hoverContent = "<p style='font-style: italic; color: #808080;'>" + noded.name + "</p>";
	idArray = noded.who;
	var alreadyAssigned = [];
	for (x in idArray) {
	    if (alreadyAssigned.indexOf(idArray[x]) == -1) {
		    hoverContent += "<p>" + nodes[nodeHash[idArray[x]]].name + "<p>";
		    alreadyAssigned.push(idArray[x])
	    }
	}
    } else {
	hoverContent += "<p>" + noded.name + "</p><p style='color: #808080;'>" + noded.birthyear + " - " + (noded.end && noded.end < 2013 ? noded.end : '') + "</p>";
	d3.select(divID).selectAll(".nodetitle").remove();
    }

	d3.selectAll("rect.nodeopacfilter").transition().duration(100).ease("out")
	.style("opacity", function(d) {
	    return idArray.indexOf(d.id) > -1 ? 0 : 1
	})
	.style("fill", "#cccccc");
	
	d3.selectAll("rect.timelineopacfilter").transition().duration(100).ease("out").style("opacity", function(d) {
	    return idArray.indexOf(d.id) > -1 ? 0 : 1
	})
	.style("fill", "#cccccc");
	
    d3.selectAll("g.timelines").each(function (d,i) {
	idArray.indexOf(d.id) > -1 ?
	d3.select(this).selectAll(".uaevents").style("fill", function(b) { return slightlyRandomColor(eventColor[b.eventtype],colorVariance)}) :
	d3.select(this).selectAll(".uaevents").style("fill", "#aaaaaa");	
	})
    
    d3.selectAll("g.timelines").each(function (d,i) {
	idArray.indexOf(d.id) > -1 ?
	d3.select(this).selectAll(".aevents").style("fill", function(b) { return slightlyRandomColor(eventColor[b.eventtype],colorVariance)}) :
	d3.select(this).selectAll(".aevents").style("fill", "#aaaaaa");	
	})

	
	if (noded.source) {
	d3.selectAll("path.link").transition().duration(100).ease("out").style("stroke", function(d) {
	    return noded.id == d.id ? "#82d3ff" : connectionLines[d.relation]
	})
	}
	else {
	d3.selectAll("path.link").transition().duration(100).ease("out").style("stroke", function(d) {
	    return idArray.indexOf(d.source.id) > -1 || idArray.indexOf(d.target.id) > -1 ? "#82d3ff" : connectionLines[d.relation]
	})
	}
    
    carto.selectAll("path.placeopacfilter").transition().ease("out").duration(100).style('opacity', function(d, i) {
	return arrayOverlap(d.properties.who, idArray) == true ? 0 : 1
    })
    .style("fill", "#cccccc");
    
    
    if (!(this.nodeName == "LI" || this.nodeName == 'A' || (noded.id == currentHighlightedNode && document.getElementById("bioFloatContents3").style.display == "block"))) {
    var arrowClass = 'arrow-right';
    var coords = d3.mouse(document.body);
    var leftBuffer = -230;
    if (coords[0] < 300 || (parseInt(document.getElementById("bioFloatContents3").style.left) + 730 > coords[0])) {
	leftBuffer = 30;
	arrowClass = 'arrow-left';
    }

    d3.selectAll("#hoverBoth").style("left", "" + (Math.floor(coords[0]) + leftBuffer) + "px").style("top", "" + Math.floor(coords[1]) + "px").style("display", "block");
    d3.selectAll("#hoverInfo #arrow").classed("arrow-left", false).classed("arrow-right", false);
    d3.selectAll("#hoverInfo #arrow").classed(arrowClass, true);
    d3.selectAll("#hoverContent").html(hoverContent);
    }
}

function relationDescription(linkInput) {
    var tenseTerm = linkInput.source.end == 2013 ? "is" : "was"
    var returnContent = "error in link description"
    if (linkInput.relation == "green") {
	returnContent = linkInput.source.name + " " + tenseTerm + " married to " + linkInput.target.name;
    }
    else if (linkInput.relation == "purple") {
	returnContent = linkInput.source.name + " " + tenseTerm + " the " + (linkInput.source.gender == "M" ? "brother" : "sister") + " of " + linkInput.target.name;
    }
    else if (linkInput.source.birthyear > linkInput.target.birthyear) {
	returnContent = linkInput.source.name + " " + tenseTerm + " the " + (linkInput.source.gender == "M" ? "son" : "daughter") + " of " + linkInput.target.name;
    }
    else {
	tenseTerm = linkInput.target.end == 2013 ? "is" : "was"
	returnContent = linkInput.target.name + " " + tenseTerm + " the " + (linkInput.target.gender == "M" ? "son" : "daughter") + " of " + linkInput.source.name;
    }
    return returnContent;
}

function arrayOverlap(arrayA, arrayB) {
    for (x in arrayA) {
	if (arrayB.indexOf(arrayA[x]) > -1) {
	    return true;
	}
    }
    return false;

}

function showThirdBio(nodeID) {

var leftRight = "left"
    var isCurrentlyBio = false;
    if (window.location.hash.length > 10) {
	var kbSettings = window.location.hash.split("/");

	    if (nodeID == kbSettings[5]) {
		showHide("bioFloatContents1");
	return;
	    }
	    else if (nodeID == kbSettings[6]) {
		showHide("bioFloatContents2");		
	return;
	    }
    }

anyOut();
    
    if (d3.select("#" + nodeID).empty()) {
	currentHighlightedNode = '';
    }
    else if (!d3.select("#timelineBar" + nodeID).empty()) {
    var nodeLocation = xyFromTranslate(d3.select("#" + nodeID));
    var zoomOffset = xyFromTranslate(d3.select("#" + nodeID));
    
    d3.selectAll(".bio3Tri").style("display", "none");
    var yOffset = (nodeLocation[1] + networkZoom.translate()[1] + 95)
    var xOffset = (nodeLocation[0] + networkZoom.translate()[0] - 425)
    if (xOffset < 100) {
	xOffset += 460;
	d3.select("#isocTriLeft").style("display", "block");
    }
    else {
	d3.select("#isocTriRight").style("display", "block");
	leftRight = "right";
    }
    if (d3.select("#vignettecontent").style("display") == "block") {
	xOffset += parseInt(document.getElementById("vignettecontent").clientWidth);
    }
    d3.select("#bioFloatContents3").style("top", "" + yOffset + "px").style("left", "" + xOffset + "px")
    if (isCurrentlyBio == false) {
	newsFeed(nodeID, "kin", "bioFloatContents3", leftRight);
    }

    }

}

function highlightNode(nodeID, hideBio) {

    if (hideBio != true) {
	hideThirdBio();
    }


    if (d3.select("#" + nodeID).empty()) {
	currentHighlightedNode = '';
    }
    
    else if (!d3.select("#timelineBar" + nodeID).empty()) {
    var nodeLocation = xyFromTranslate(d3.select("#" + nodeID));
    var zoomOffset = xyFromTranslate(d3.select("#" + nodeID));
        
    currentHighlightedNode = nodeID;
    }
}

function hideThirdBio() {
	d3.select("#bioFloatContents3").style("display", "none");
	currentHighlightedNode = "";

}

function removeThirdBio() {
    d3.selectAll(".bioFloatContents3plsites").remove();
    d3.selectAll(".bioFloatContents3plevents").remove();
    d3.selectAll(".bioFloatContents3other").remove();
}

function hideNodeText() {
    d3.selectAll("text.nodeValue").transition().duration(1000).style("opacity", 0)
}

function bigComponent(inputID, reorder) {
    var connectedArray = [inputID];
    var connectedList = {};
    connectedList[inputID] = 0;
    var currentPlace = 1;
    var completed = false;
    while (completed == false) {
	var startingSize = connectedArray.length;
	for (y in links) {
	    if (connectedArray.indexOf(links[y].source.id) > -1 && connectedArray.indexOf(links[y].target.id) == -1) {
		connectedArray.push(links[y].target.id);
		connectedList[links[y].target.id] = currentPlace;
		currentPlace++;
	    } else if (connectedArray.indexOf(links[y].target.id) > -1 && connectedArray.indexOf(links[y].source.id) == -1) {
		connectedArray.push(links[y].source.id);
		connectedList[links[y].source.id] = currentPlace;
		currentPlace++;
	    }
	}
	if (startingSize == connectedArray.length) {
	    completed = true;
	}
    }
    
    if (reorder==true) {
        nodes = nodes.sort(function(a,b) {return connectedList[a["id"]] - connectedList[b["id"]]});
	    
	    nodeHash = {};
	    for (x = 0; x < nodes.length; x++) {
		nodeHash[String(nodes[x].id)] = x;
	    }


    }
    
    return connectedArray;
}

function pathEnds(inArray) {
    var pathEnds = [];
    for (x in inArray) {
	if (inArray[x].weight == 1) {
	    pathEnds.push(inArray[x])
	}
    }
    return pathEnds;
}