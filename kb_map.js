function freshHash(viewType, otherID) {
	var newHash = "/" + viewType + "/" + divLayout.network + "/" + divLayout.timeline + "/" + divLayout.map + "///";
	window.location.hash = newHash;
	updateUrlBox();
	currentHighlightedNode = '';
	currentFocusID = '';
}

function closeAllTabs() {
	d3.selectAll(".topContents").style("display","none");
	d3.selectAll(".centerContents").style("display","none");
	d3.selectAll(".paneOptions").style("display", "none")
	searchBrush.clear();
	resetSearchBrush();
	document.getElementById('idInputBox').value = "";
	document.getElementById('familyInputBox').value = "";
	document.getElementById('locationInputBox').value = "";
	d3.selectAll(".topButton").classed("active", false).classed("shadowBio", false);
	d3.selectAll(".topButtonTop").classed("active", false).classed("shadowBio", false);
	d3.select("#kbCont").classed("active", false).classed("shadowBio", false);
	d3.select("g.brush").call(searchBrush);
	d3.select("#searchTimeTextDescription").html("Born anytime");
	d3.select("#centerbox").classed("shadowBio", false);
	d3.select("#titletext").classed("isactive", false);
	d3.selectAll(".occSelectButton").style("opacity", .5);	
	updateActivity();
}

function setActive(objID, classID) {
	d3.selectAll("." + classID).classed("active", false);
	d3.selectAll("#" + objID).classed("active", true);
}

function createGroupSearch() {

	    activityTabs = d3.select("#groupHeader")

	    occuTransform = [];
	    
	    for (activity in occuArray) {
			if (activity) {
				occuTransform.push(occuArray[activity])
				occuTransform[occuTransform.length - 1]["active"] = "active";
			}
	    }
	    
	    var actLi = activityTabs.selectAll("div.activities").data(occuTransform).enter()
	    .append("div")
	    .attr("class", "activity")
	    .style("cursor", "pointer")
	    .style("float","left")
	    .style("padding","2px")
	    .style("width","22px")
    	    .on("mouseover", groupOccOver)
	    .style("display",function(d) {return d.name == 'unknown' ? "none" : "block"})
	    
	    floatDiv = actLi.append("div")
	    .style("position","absolute")
	    .attr("id", function(d) {return "float"+d.name})
	    
	    var actInp = actLi.append("input")
	    .attr("class", "tragedyButton activities")
	    .style("position","relative")
	    .style("width", "22px")
	    .style("padding",0)
	    .style("border-radius", 0)
	    .style("height", "26px")
	    .style("background-color", function(d) {return halfWhite(d.color)})
	    .attr("type","button")
    	    .on("click", groupOcc)
    	    .style("cursor", "pointer")
	    
	var floatContentDiv = floatDiv.append("div")
	    .style("position","fixed")
	    .style("background","white")
	    .style("z-index",1)
	    .style("border", "1px #E5E5E5 solid")
	    .style("top","230px")
	    .style("right","167px")
	    .style("width","520px")
	    .style("padding","5px 0")
	    .attr("id","occupationParent")
	    .attr("class","shadowBio")

	    
	    floatDiv.append("div")
	    .style("position","relative")
	    .style("background", "white")
	    .style("border", "1px #E5E5E5 solid")
	    .style("border-bottom", "none")
	    .style("border-top", "none")
	    .style("z-index",2)
	    .style("top","26px")
	    .style("height", "6px")
	    .style("width", "20px")	    
	    
	    floatContentDiv.append("div")
	    .attr("class","sectionheading")
	    .style("padding", "0 0 5px 10px")
	    .html(function (d) {return d["display-name"]})

	    floatContentDiv.append("div")
	    .attr("id","occupationSelector")
	    .append("div")
	    .attr("id","occsCart")
	    
	          d3.csv("occupations.txt", function(error, occText) {
	occupationText = occText;
	occupationHash = {};
	
	for (x in occupationText) {
		occupationHash[occupationText[x].occupation] = {name: occupationText[x].occupation, displayname: occupationText[x].displayname,  category: occupationText[x].category, id: occupationText[x].id};
	}
	
occupationText.sort(function(a,b) {
    if(a.displayname.length < 15 && b.displayname.length > 15) return -1;
    if(a.displayname.length > 15 && b.displayname.length < 15) return 1;
    if(a.displayname<b.displayname) return -1;
    if(a.displayname>b.displayname) return 1;
    return 0;})

	var occSpans = d3.select("#occsCart").selectAll("div.occselect").data(occupationText).enter().append("div")
	.attr("class", "occselect")
	.style("padding", "0 10px")
	.style("width", "145px")
	.style("float", "left")
	.style("vertical-align","middle")
	
	occSpans.append("input")
	.attr("type", "button")
	.attr("class", "tragedyButton occSelectButton")
	.attr("id", function(d) {return "but-" + d.occupation.replace(/ /g,"-")} )
	.style("background-color", function (d) {return occuArray[d.category]["color"]})
	.style("border-radius", 0)
	.style("height", "26px")
	.style("opacity", .5)
	.style("margin", "5px 5px 0 0")
	.style("float", "left")
	.attr("value", "")
	.style("cursor","pointer")
	.on("click", selectOccupation);
	
	occSpans.append("div")
	.style("margin-top", "8px")
	.style("margin-left", "45px")
	.style("text-indent", "-15px")
	.style("text-transform", "capitalize")
	.html(function (d) {return d.displayname})
	
      });

}

function groupOcc(d,i) {

	if (d["active"] == "active") {
		d3.selectAll(".occselect input").filter(function(b, j) { return b.category == d["name"]; }).style("opacity",.5);
	}
	else {
		d3.selectAll(".occselect input").filter(function(b, j) { return b.category == d["name"]; }).style("opacity",1);
	}
	updateActivity();

}

function groupOccOver(d,i) {
	d3.selectAll("#occsCart").each(function() { if(d3.select(this).html() == '') {d3.select(this).remove();}})
	document.querySelector("#float"+d["name"]+" #occupationParent #occupationSelector").appendChild(document.querySelector("#occsCart"));
	d3.selectAll(".occselect").style("display", function (b) {return b.category == d["name"] ? "block" : "none"});
}

function selectOccupation(d,i) {
	if (d3.select(this).style("opacity") < 1) {
		d3.select(this).style("opacity", 1)
	}
	else {
		d3.select(this).style("opacity", .5)		
	}
	updateActivity();
}

function updateActivity() {
occupationSearchList = [];

for (x in occuTransform) {
	occuTransform[x]["active"] = "unknown";
}

for (x in occupationText) {
	if (x) {
		var thisCategory = '';
		var thisVal = '';
		d3.select(("#but-"+occupationText[x].occupation).replace(/ /g,"-")).each(function (d) {thisCategory = d["category"]; thisVal = d["id"]});
		var occIsActive = null;
		var occIsActive = null;
		if (d3.select(("#but-"+occupationText[x].occupation).replace(/ /g,"-")).style("opacity") == .5) {
			occIsActive = false;
		}
		else {
		occIsActive = true;
//Append to list for query
		occupationSearchList.push(thisVal);

		}
		for (x in occuTransform) {
			if (occuTransform[x]["name"] == thisCategory) {
				if ((occuTransform[x]["active"] == "inactive" && occIsActive == true)|| (occuTransform[x]["active"] == "active" && occIsActive == false)) {
					occuTransform[x]["active"] = "mixed"
				}
				else if (occuTransform[x]["active"] == "unknown" && occIsActive == true) {
					occuTransform[x]["active"] = "active"
				}
				else if (occuTransform[x]["active"] == "unknown" && occIsActive == false) {
					occuTransform[x]["active"] = "inactive"
				}
				break;
			}
		}
	}
}

d3.selectAll("input.activities").filter(function(d) { return d.active == "mixed"})
.style("background", function(d) {return d.color})
.style("background", function(d) {return "-moz-linear-gradient(-45deg, "+halfWhite(d.color)+" 50%, "+(d.color)+" 50%)"})
.style("background", function(d) {return "-webkit-linear-gradient(-45deg, "+halfWhite(d.color)+" 50%,"+(d.color)+" 50%)"})
.style("background", function(d) {return "-o-linear-gradient(-45deg, "+halfWhite(d.color)+" 50%,"+(d.color)+" 50%)"})
.style("background", function(d) {return "-ms-linear-gradient(-45deg, "+halfWhite(d.color)+" 50%,"+(d.color)+" 50%)"})
.style("background", function(d) {return "linear-gradient(135deg, "+halfWhite(d.color)+" 50%,"+(d.color)+" 50%)"})
.style("background", function(d) {return "filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='"+halfWhite(d.color)+"', endColorstr='"+(d.color)+"',GradientType=1 )"})

d3.selectAll("input.activities").filter(function(d) { return d.active == "active"})
.style("background", function(d) {return d.color})

d3.selectAll("input.activities").filter(function(d) { return d.active == "inactive"})
.style("background", function(d) {return halfWhite(d.color)})

}
function halfWhite(inColor) {
	var whiteRamp=d3.scale.linear().domain([0,1]).range(["white",inColor]).clamp(true);

	return whiteRamp(.5);
}

function kbStartUp() {
	document.getElementById("linkUrlBox").select();
	!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');
	!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');
	(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/all.js#xfbml=1";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
  (function() {
    var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
    po.src = 'https://apis.google.com/js/plusone.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
  })();

	var browserTest = navigator.sayswho= (function(){
  var N= navigator.appName, ua= navigator.userAgent, tem;
  var M= ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
  if(M && (tem= ua.match(/version\/([\.\d]+)/i))!= null) M[2]= tem[1];
  M= M? [M[1], M[2]]: [N, navigator.appVersion,'-?'];
  return M;
 })();
	console.log(browserTest)
	if (browserTest[0] == "MSIE") {
		document.getElementById("modalSearch").style.display = "block";
		document.getElementById("fullcontent").style.display = "none";
		_gaq.push(['_trackEvent', 'errorEvent', "browser_unsupported, T: " + browserTest[0]]);

		return;
	}
	thisBrowser = browserTest[0];
	resizeKBContent();
	
	createGroupSearch();
	createSearchBrush();

	var incomingHash = window.location.hash;
	
	//"#/path/third/half/full/I5906/I17735/I3541/1860/15/erasmus"
	//hash/1viewType/2networkpane/3timelinepane/4mappane/5source/6target/7highlight/8date/9otherid/10story
	//
d3.json("world-50m.json", function(error, inTopo) {
	world = inTopo;

      d3.csv("timeline_events.csv", function(error, eventscsv){
				
		dateline = {0: "..."};
		for (eventEntry in eventscsv) {
			if (eventscsv[eventEntry]) {
				dateline[eventscsv[eventEntry].beginyear] = eventscsv[eventEntry].title
			}
		}
		

	if (incomingHash.length < 10) {
		kb_map(function() {viz01("lum","lum",1);});
		d3.select("#networkOptions").style("display","block").classed("shadowBio", true);
		d3.select("#kbContents").style("display","block").classed("shadowBio", true);
	}
	else {
		var kbSettings = incomingHash.split("/");
		
		divLayout.network = kbSettings[2];
		divLayout.timeline = kbSettings[3];
		divLayout.map = kbSettings[4];
		permaStory = false;
		switch(kbSettings[1])
		{
		case "kin":
			currentFocusID = kbSettings[5];
			kb_map(function() {
			viz01(kbSettings[5], "ego",1,kbSettings[7]);
			}
			)
			break;
		case "path":
			kb_map(function() {
			pathViz('link',kbSettings[5],kbSettings[6],kbSettings[7]);
			})
			break;
		case "story":
			permaStory = true;
			kb_map(function() {
				viz01("lum","lum",1);
				vA = kbSettings[7];
				});
			break;
		default:
			kb_map(function() {viz01("lum","lum",1);});
			break;
		}
	}
	})
      });


}

function createSearchBrush() {
	var sbSVG = d3.select("#searchBrushSVG");

	var kbX = d3.scale.linear()
	.domain([468,2013]).range([30, 525]);
	
	var noFormat = d3.format("d");
	
	sbSVG.append("g")
        .attr("transform", "translate(10,60)")
	.attr("class", "axis")
	.style("pointer-events", "none")
	.call(d3.svg.axis().scale(kbX).orient("bottom").tickValues([600, 800, 1000, 1200, 1400, 1600, 1800, 2000]).tickFormat(noFormat));
	
	searchBrush = d3.svg.brush().x(kbX).on("brushstart", brushstart).on("brush", brushmove).on("brushend", brushend);
	
	sbSVG.append("g")
	.attr("transform","translate(10,20)")
    .attr("class", "brush")
.call(searchBrush)
  .selectAll("rect")
    .attr("height", 40);

    function brushstart() {
//	sbSVG.classed("selecting", true);
}

function brushmove() {
  var s = d3.event.target.extent();
  var exWidth = d3.select("rect.extent").attr("width") / 2;
  var exYears = Math.abs(Math.floor(s[1]) - Math.floor(s[0]));
  if (exYears < 50) {
	exYears = "";
  }
  else if (exYears > 150) {
	exYears = "" + exYears + " years";
  }
	if (!searchBrush.empty()) {
	d3.select("#westSearchText").style("text-anchor","end").text(noFormat(Math.floor(s[0])));
	d3.select("#eastSearchText").text(noFormat(Math.floor(s[1])));
	d3.select("#searchYears").attr("x", exWidth);
	d3.select("#searchYears").text(exYears);
	}
	else {
		resetSearchBrush();
	}
}

function brushend() {
//  sbSVG.classed("selecting", !d3.event.target.empty());
}

d3.select(".resize.w").append("rect").attr("width",7).attr("height",30).style("fill","#e1e1e1").attr("rx",1).attr("y",5).attr("x",-7)
d3.select(".resize.w").append("rect").attr("x",-3).attr("y",10).attr("width",1).attr("height",20).style("fill","black")
d3.select(".resize.w").append("rect").attr("x",-5).attr("y",10).attr("width",1).attr("height",20).style("fill","black")
d3.select(".resize.w").append("text").style("text-anchor","start").style("font-size","14px").style("fill","#00877d").attr("x",-5).attr("y",-8).attr("id","westSearchText").text("Born anytime")
d3.select(".resize.w").append("text").style("text-anchor","middle").style("font-size","14px").attr("x",-5).attr("y",25).attr("id","searchYears").text("").style("pointer-events","none")

d3.select(".resize.e").append("rect").attr("width",7).attr("height",30).style("stroke","#f8f8f8").style("fill","#e1e1e1").attr("rx",1).attr("y",5)
d3.select(".resize.e").append("rect").attr("x",2).attr("y",10).attr("width",1).attr("height",20).style("fill","black")
d3.select(".resize.e").append("rect").attr("x",4).attr("y",10).attr("width",1).attr("height",20).style("fill","black")
d3.select(".resize.e").append("text").style("text-anchor","start").style("font-size","14px").style("fill","#00877d").attr("x",-5).attr("y",-8).attr("id","eastSearchText").text("")

d3.select(".extent").style("fill","#00d5c5").style("fill-opacity",1).style("stroke","#6eb0ac").attr("rx",2)
}

function resetSearchBrush() {
	searchBrush.extent([468,2013]);
	d3.select(".brush").call(searchBrush.extent([468,2013]));
	d3.select("#westSearchText").style("text-anchor","start").text("Born anytime");
	d3.select("#eastSearchText").text("");
	d3.select("#searchYears").text("");
}


window.onresize = function(event) {
	resizePanes();
	resizeKBContent();
}

function resizeKBContent() {
	var canvasSize = parseFloat(document.getElementById("fullcontent").clientHeight);
	d3.select("#kbContents").style("max-height", "" + Math.max(canvasSize - 300,600) + "px");
	d3.select("#kbSubCont").style("max-height", "" + Math.max(canvasSize - 400,500) + "px");	
}

function adjustToSize() {
	defocusMap();
	defocusNetwork();
	defocusTimeline();
}

function linkImageUpdate() {
	d3.select("#linkInputButton").transition().delay(300).attr("src", "images/facebook_icon.png")
	d3.select("#linkInputButton").transition().delay(600).attr("src", "images/google_plus_icon.png")
	d3.select("#linkInputButton").transition().delay(900).attr("src", "images/twitter_icon.png")
	d3.select("#linkInputButton").transition().delay(1200).attr("src", "images/link_icon.png")
	}

function updateUrlBox() {
	document.getElementById('linkUrlBox').value = window.location.toString();
}

function toggleDisplay(divName,sentDiv) {
restoreInitial(divName);

	var isOpen = true;
	if (d3.select("#"+divName).style("display") == "none") {
		isOpen = false;
	}
closeAllTabs();
	if (isOpen == false) {
		d3.select(".brush").call(searchBrush.extent([468,2013]))

		d3.select("#"+divName).style("display","block").classed("shadowBio", true);
		d3.select(sentDiv).classed("active",true).classed("isactive", true);
		if (divName == "searchShare") {
			d3.select("#centerbox").classed("shadowBio", true);
			d3.select("#titletext").classed("isactive", true);
		}
		if (divName == "kbContents") {
			d3.select("#kbCont").classed("shadowBio", true);
		}
	}
}

function adjustEvents(barHeight) {
	var newScale = Math.min(1, timelineZoom.scale());
	
	if (newScale < .5 && d3.selectAll("g.aevents").style("display") != "none") {
		d3.selectAll(".aevents").style("display", "none")
	}
	else if (newScale > .5 && d3.selectAll("g.aevents").style("display") == "none") {
		d3.selectAll(".aevents").style("display", "block")
	}
	if (newScale > .5) {
					var xinc = 0;
				while (xinc < aevents[0].length) {
					var minLane = 100;
					var maxLane = 0;
					var yinc = 0;
					while (yinc < rects[0].length) {
						if (aevents[0][xinc]["__data__"]["actor"].indexOf(rects[0][yinc]["__data__"]["id"]) > -1) {
							minLane = Math.min(rects[0][yinc]["__data__"]["lane"], minLane);
							maxLane = Math.max(rects[0][yinc]["__data__"]["lane"], maxLane);
						}
						yinc++;
					}
					// if this event is the top event, then stretch it out
					if (minLane == aevents[0][xinc].parentNode.parentNode["__data__"]["lane"]) {
						
						d3.select(aevents[0][xinc])
						.attr("height", Math.max(((barHeight + ((maxLane - minLane) * (barHeight * 2)))),barHeight))
						.attr("width", barHeight)
						.style("stroke-width", 1)
						.attr("rx", barHeight / 2)
						.attr("ry", barHeight / 2);
					}
					else {
						d3.select(aevents[0][xinc])
						.attr("width", barHeight)
						.attr("height", barHeight )
						.attr("x", -(barHeight / 2))
						.style("opacity", 1)
						.attr("rx", barHeight / 2)
						.attr("ry", barHeight / 2);
					}
					xinc++;
				}
					d3.selectAll("rect.uaevents")
						.attr("width", barHeight)
						.attr("height", barHeight )
						.attr("x", -(barHeight / 2))
						.attr("rx", barHeight / 2)
						.attr("ry", barHeight / 2);
	}
}

function press(e,searchValue,a,b,searchTarget) {
    var evt = e || window.event
    if ( evt.keyCode === 13 ) {
	createSearchTable(searchValue,a,b,searchTarget);
        return false
    }    
}
function closeVignette(){
	d3.select("#fullcontent").style("width", "100%");
	d3.select("#bioFloatContents1").style("left","0px").style("width","31.5%");
	d3.select("#bioFloatContents2").style("width","31.5%");
	d3.select("#centerbox").style("margin-left","31.2%").style("margin-right","31.2%");
	d3.select("#vignettecontent").style("display", "none");
	var kbSettings = window.location.hash.split("/");
	window.location.hash = kbSettings.join('/');
	updateUrlBox();
	adjustToSize();
}

function createVignette(storyVal, divID, insertDiv) {
	
	if (!storyCollection[storyVal] || (typeof timelineZoom != 'function')) {
		return;
	}
	hideInitial(divID);
		
	var newContents = d3.select("#" + divID).insert("div",insertDiv).attr("class","generated").style("width", "100%")
	var subcontents1 = newContents;
	var subcontents2 = newContents;

	newContents.append("div").style("width", "auto").html('<input type="button" class="topButton" style="border-bottom: 1px #d3d3d3 solid;width:100%; margin-top: 0px;" onclick=\'restoreInitial("'+divID+'")\' value="&larr;" /input>');
	if (divID == 'storyContents') {
		subcontents1 = newContents.append("div").style("width", "50%").style("float","left").style("padding","20px 0");
		subcontents2 = newContents.append("div").style("width", "50%").style("float","left").style("padding","20px 0");
	}
	subcontents1.append("div").style("width", "auto").html('<img src="images/'+ storyCollection[storyVal].image +'" title="" alt="" style="width:90%;max-width:800px;padding:0 20px;" />');
	subcontents2.append("div").style("line-height","0px").html('<h3>'+storyCollection[storyVal].title+'</h3>').style("max-width","800px").style("padding","20px 20px 0 20px");
	subcontents2.append("div").html(''+ storyCollection[storyVal].content[0].substr(0,250) +'...</p>').style("max-width","800px").style("padding","0 20px");
	subcontents2.append("div").html('<a onclick="runVignette(\''+storyVal+'\');restoreInitial(\''+divID+'\')">Read more &rarr;</a>').style("padding","20px 20px 0 20px");
	
}



function runVignette(storyVal){

	closeAllTabs();

	if (!storyCollection[storyVal] || (typeof timelineZoom != 'function')) {
		return;
	}

	d3.selectAll(".vignetteContent").remove();

	d3.select("#fullcontent").style("width", "69.9%");
	d3.select("#bioFloatContents1").style("left","30%");
	d3.select("#bioFloatContents2");
	d3.select("#centerbox").style("margin-left","28.7%").style("margin-right","28.7%");
	
	var div = d3.select("#vignettecontent").style("display", "block").append("div").attr("class","vignetteContent").style("padding", "20px").style("height","100%");
	
	var div2 = div.append("div").style("width", "100%").attr("id","vContent");

	var vTitleDiv = div2.append("div").style("width","100%").style("overflow","hidden").attr("id","vTitle");
	var vContentDiv = div2.append("div").attr("id","vCont").style("width","100%").style("overflow","auto");
	var vPagerDiv = div.append("div").style("height","30px").style("padding-top", "10px").style("overflow","hidden");

	adjustToSize();
	vTitleDiv.append("h3").attr("class", "primaryheading").html(storyCollection[storyVal].title);
	if (storyCollection[storyVal].currentPage == 0) {
		vTitleDiv.append("p").style("font-size","16px").style("line-height","30px").attr("class", "emphasize").html("by " + storyCollection[storyVal].author);
		vTitleDiv.append("p").attr("class", "vignetteoverview").html("<span class='emphasize'>Kindred Britain</span>'s stories have highlighted text that trigger custom maps, illustrating the subject matter. Click the highlighted areas to change the view and use the <span class='emphasize'>Next</span> button to move to the next part of the story.");
	}
	vTitleDiv.append("h3").attr("class", "sectionheading").html(storyCollection[storyVal].sectionHeading[storyCollection[storyVal].currentPage]);

	vContentDiv.html(storyCollection[storyVal].content[storyCollection[storyVal].currentPage]);

	vContentDiv.selectAll("a")
	.each(function() {
		var origClick = d3.select(this).attr("onclick");
		d3.select(this).attr("onclick", 'd3.select("#vCont").selectAll("a").style("border","none");d3.select(this).style("border", "1px dotted #F7941D");' + origClick);
	})

	var disableBack = ((storyCollection[storyVal].currentPage + 1) == 1) ? "disabled" : "";
	var disableForward = ((storyCollection[storyVal].currentPage + 1) == storyCollection[storyVal].content.length) ? "disabled" : "";

	vPagerDiv.append("div").style("width", "35%").style("float", "left").html("<input type='button' style='margin: 0;' onclick='changeStoryPage(\""+storyVal+"\",-1)' class='legendButton "+disableBack+"' value='&larr; prev' />")
	vPagerDiv.append("div").style("width", "30%").style("float", "left").append("span").attr("class", "vignettepage").html("" + (storyCollection[storyVal].currentPage + 1) + " of " + storyCollection[storyVal].content.length)
	vPagerDiv.append("div").style("width", "35%").style("float", "right").html("<input type='button' style='margin: 0; float: right;' onclick='changeStoryPage(\""+storyVal+"\",+1)' class='legendButton "+disableForward+"' value='next &rarr;' />")
	vA = storyVal;

	if (storyCollection[storyVal]["initialFunction"][storyCollection[storyVal].currentPage]) {
	  eval(storyCollection[storyVal]["initialFunction"][storyCollection[storyVal].currentPage]);
	}
	_gaq.push(['_trackEvent', 'storyEvent', vA + ", P: " + storyCollection[storyVal].currentPage]);

}

function changeStoryPage(storyVal,x) {
	storyCollection[storyVal].currentPage += x;
	runVignette(storyVal);
}

function showParas(divID) {
		var item = document.getElementById(divID);
		    (item.className == 'hidden') ? item.className= 'unhidden' : item.className = 'hidden';
		    d3.select("#bioFloatContents2").style("display", "none");
		    d3.select("#bioFloatContents2").style("display", "block");
}

function updatePastList() {
	d3.selectAll("li.pastItems").remove();
	
	if (queriesArray.length > 5) {
		queriesArray.shift();
	}
	
	d3.select("#pastList").selectAll("li").data(queriesArray)
	.enter()
	.append("li")
	.attr("class", "pastItems")
	.html(function(d,i) {return "<a onclick='pastViz(\""+ i + "\")'>"+d.name+"</a>"})
	.style("cursor", "pointer");
}

function pastViz(i) {
	
	currentFocusID = queriesArray[i].queryVal[0];
	changeTitle(queriesArray[i].name)
	switch(queriesArray[i].queryType)
	{
		case "lum":
		viz01("lum","lum",1);
		break;
		case "ego":
		viz01(queriesArray[i].queryVal[0], "ego",1,"story");
		break;
		case "path":
		pathViz('link',queriesArray[i].queryVal[0],queriesArray[i].queryVal[1],"story");
		break;
		case "list":
		viz01(queriesArray[i].queryVal[0],"list",1,"story");
		break;
	}
	
}

function randomSearch(){
	var IDArray = ["I5906", "I7462", "I17722", "I2135", "I27325", "I5", "I2105"]
	var randomID = IDArray[Math.floor(Math.random()*IDArray.length)]
	indivClick(randomID,1850);
}

function initializeNetworkVis(inputVal) {
	if (inputVal != 'pregen') {
		welcomeScreen = false;
	}
	nodeHash = {};
    var bDiv = document.getElementById("network");

	h = parseInt(bDiv.clientHeight);
	w = parseInt(bDiv.clientWidth);
	
	hullsActive = false;
	occNodes = false;
	if (networkStarted == true) {
		networkVis.remove();
	}
	else {
		networkStarted = true
	}

	force = d3.layout.force()
	.gravity(.05)
	.linkDistance(100)
	//.distance(function (d) {return linkramp(d.source.weight + d.target.weight)})
	.charge(-100)
	.size([w, h])
	.on("tick", tick);

	
	nodes = force.nodes(),
	links = force.links();
	
	networkZoom = d3.behavior.zoom()
    .on("zoom", networkAdjust);
	
	networkVis = d3.select("#network").append("svg:svg")
	.attr("width", w)
	.attr("height", h)
	.attr("id", "foregroundSVG")
	.call(networkZoom)
	.on("dblclick.zoom", null)
	.on("mousewheel.zoom", null)
	;
	
	gNetworkVis = networkVis
	.append("g")
	.attr("transform","translate(0,0)")
	.attr("id", "backgroundSVG")
	;
	
	function networkAdjust() {
		var tx = d3.event.scale + d3.event.translate[0];
	    var ty = d3.event.scale + d3.event.translate[1];
	    
	    var oldBioXY = [parseFloat(d3.select("#bioFloatContents3").style("top")), parseFloat(d3.select("#bioFloatContents3").style("left"))]
	    var oldNZXY = xyFromTranslate(gNetworkVis)	    
	    gNetworkVis.attr("transform", "translate("+tx+","+ty+")");
		
	    d3.select("#bioFloatContents3").style("top", "" + (oldBioXY[0] + (ty - oldNZXY[1])) + "px").style("left", "" + (oldBioXY[1] + (tx - oldNZXY[0])) + "px")
	    d3.select("#foregroundSVG").selectAll(".axis").remove();
	}
	
}
function highlightLoc(whoInput) {
	d3.selectAll("g.node")
	.transition()
	.duration(750)
	.style('opacity', function (d,i) { return whoInput.indexOf(d.id) > -1 ? 1 : .2});
	d3.selectAll("g.timelines")
	.transition()
	.duration(750)
	.style('opacity', function (d,i) { return whoInput.indexOf(d.id) > -1 ? 1 : .2});
}

function div_sizes() {

	var aDiv = document.getElementById("map"),
    bDiv = document.getElementById("network"),
//    cDiv = document.getElementById("bio"),
    dDiv = document.getElementById("timeline")
    ;
	
	if ((parseInt(aDiv.clientHeight) < 100)) {
	}
	if ((parseInt(bDiv.clientHeight) < 100)) {
	}
	if ((parseInt(dDiv.clientHeight) < 100)) {
	}

}

function placeFixedNetwork() {
	d3.selectAll("g.node")
	.transition()
	.duration(1000)
	.attr("transform", function(d) {return "translate("+d.x+","+d.y+")"})
	.each("end", function() {force.resume();});

	d3.selectAll("path.link")
	.transition()
	.duration(1000)
	.attr("d", function(d) {
	var dx = d.target.x - d.source.x,
	    dy = d.target.y - d.source.y,
	    dr = (d.relation == "purple" ? 0 : (dx > 0 ? Math.sqrt((dx * dx + dy * dy) * marriageCurving) : Math.sqrt((dx * dx + dy * dy) * marriageCurving)));
	return (dy > 0 ? "M" + d.source.x + "," + d.source.y + "C" + (d.source.x * kinCurving) + "," + (d.source.y * kinCurving) + " " + (d.target.x * kinCurving) + "," + (d.source.y * kinCurving) + " " + d.target.x + "," + d.target.y : "M" + d.source.x + "," + d.source.y + "C" + (d.source.x * kinCurving) + "," + (d.source.y * kinCurving) + " " + (d.target.x * kinCurving) + "," + (d.source.y * kinCurving) + " " + d.target.x + "," + d.target.y);
    });

}

function refitDiv(divID) {
	var bDiv = document.getElementById(divID);
	var minX = 0;
	var maxX = parseInt(bDiv.clientWidth);
	var minY = 0;
	var maxY = parseInt(bDiv.clientHeight);

	return {"minx": minX, "maxx": maxX, "miny": minY, "maxy": maxY};
}

function getAvailableWidth() {
	if (document.getElementById("bioFloatContents1").clientHeight > 100) {
		return true;
	}
	else {
		return false;
	}

}

function plotNetwork(xPlotAtt,yPlotAtt) {
	_gaq.push(['_trackEvent', 'layoutEvent', "plot"]);

	hideThirdBio();
	networkZoom.translate([0,0]);
	gNetworkVis.transition().duration(500).attr("transform", "translate(0,0)");
	d3.select("#nBPr").classed("disabled", true);
	var divBounds = refitDiv("network");
	force.stop();

	
	var	xMin = d3.min(nodes, function(d) {return d[xPlotAtt]});
	var	xMax = d3.max(nodes, function(d) {return d[xPlotAtt]});
	var	yMin = d3.min(nodes, function(d) {return d[yPlotAtt]});
	var	yMax = d3.max(nodes, function(d) {return d[yPlotAtt]});

	var rampMargin = 60;
	var widthRamp=d3.scale.linear().domain([xMin,xMax]).range([rampMargin,divBounds.maxx - rampMargin]).clamp(true);
	var heightRamp=d3.scale.linear().domain([yMin,yMax]).range([divBounds.maxy - (rampMargin * .5),rampMargin]).clamp(true);
	
	networkVis.selectAll("g.axis").remove();
	
	var xAxis = d3.svg.axis()
    .scale(widthRamp)
    .orient("bottom")
    .ticks(10)
    .tickFormat(d3.format("d"));
	
	var yAxis = d3.svg.axis()
    .scale(heightRamp)
    .orient("right")
    .ticks(5)
    .tickFormat(d3.format("d"));
	
	networkVis.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + (divBounds.maxy - 22) + ")")
    .call(xAxis)
    .append("text").text("Year of Birth").attr("x", 22).attr("y", 22);
	
	networkVis.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(22,-10)")
    .call(yAxis)
    .append("text").text("Year of Death").attr("x", 12).attr("y", 25);

	for ( y = 0; y < nodes.length; y++ ) {
		nodes[y].x = widthRamp(nodes[y][xPlotAtt]);
		nodes[y].px = widthRamp(nodes[y][xPlotAtt]);
		nodes[y].y = heightRamp(nodes[y][yPlotAtt]);
		nodes[y].py = heightRamp(nodes[y][yPlotAtt]);
		nodes[y].fixed = true;
	}
	
	placeFixedNetwork();

}

function focusNetwork() {
		
	var divBounds = refitDiv("network");
	
	force.stop();

	networkVis
	.attr("width", parseInt(divBounds.maxx))
	.attr("height", parseInt(divBounds.maxy));
	
	placeFixedNetwork();
}

function hierarchicalClick() {
	_gaq.push(['_trackEvent', 'layoutEvent', "hierarchical"]);
	defocusNetwork();
}
function defocusNetwork() {
	var divBounds = refitDiv("network");
	d3.select("#foregroundSVG")
	.attr("width", divBounds.maxx)
	.attr("height", divBounds.maxy);
	
	d3.select("#foregroundSVG").selectAll("g.axis").remove();
	var oneComponent = [];
	if (nodes.length > 1) {
		oneComponent = bigComponent(nodes[0].id);		//code

	if (oneComponent.length == nodes.length) {
	labelNodes();
	networkZoom.translate([0,0]);
	gNetworkVis.transition().duration(500).attr("transform", "translate(0,0)");
	if (currentSituatedPerspective == "path") {
		fixNode(currentFocusID, 250, 100,'path',fitNodesToCanvas);
	}
	else {
		fixNode(nodes[0].id, 100, 100,'kin',fitNodesToCanvas);
	}
	}
	else if (nodes[0].fixed == true && nodes[nodes.length - 1].fixed == true) {
		force.stop();
		fitNodesToCanvas();
	}
	}
	
}

function defocusTimeline() {
	var divBounds = refitDiv("timeline");
	d3.select("#timelineViz")
		.attr("width", divBounds.maxx)
		.attr("height", divBounds.maxy);
	var curYX = [0,0]
	if (!d3.select("#tlaxis").empty()) {	
	curYX = xyFromTranslate(d3.select("#tlaxis"));
	}
	d3.select("#tlaxis").transition().duration(0).attr("transform","translate("+(curYX[0])+","+ divBounds.maxy +")")
}

function moveTimeline(tlDuration,tlX,tlY) {
	var divBounds = refitDiv("timeline");

	d3.select("g.main").transition().duration(tlDuration).attr("transform", "translate("+-(tvAxisScale(tlX))+","+tlY+")")
	timelineZoom.translate([-(tvAxisScale(tlX)),tlY]);
//	timelineAxis.transition().duration(tlDuration).attr("transform","translate("+(-(tvAxisScale(tlX)))+","+ divBounds.maxy +")")
//	sliceG.transition().duration(tlDuration).attr("x", -(tvAxisScale(tlX))).each("end", function () {
	d3.select("#timelineViz").select(".axis").attr("transform","translate("+ -(tvAxisScale(tlX)) + "," + divBounds.maxy +")")
	d3.select("#sliceLine").attr("transform","translate("+ -(tvAxisScale(tlX)) + "," + divBounds.maxy +")")
	updateTimelineAxis();

}

function runTimeline(w,h,gw,gh) {
var	timeBegin = d3.min(items, function(p) {return p["birthyear"]}) - 10;
var	timeEnd = d3.max(items, function(p) {return p["end"]}) + 10;

var x1 = d3.scale.linear()
.domain([timeBegin, timeEnd])
.range([0, gw]);
var x1StepSize = x1(timeBegin + 1);
var y1 = d3.scale.linear()
.domain([0, laneLength])
.range([0, gh - 10]);

	//update main item rects
	rects
		.transition()
		.duration(3000)
	    .attr("transform",function(d) {return "translate("+x1(d.birthyear)+","+y1(d.lane)+")"});
	
	d3.selectAll(".timelineBar")
		.transition()
		.duration(3000)
		.attr("width", function(d) {return x1(d.end) - x1(d.birthyear);})
		.attr("height", 10)
		.style("fill", function(d) {return d.relation});

	timelineLabels
	.text('')
	.style("opacity", 0)
	.attr("transform", "rotate(0)");
	
	adjustEvents(15);
}

function paneClick(paneName) {

	if (d3.select("#nBPr").classed("active") == true) {
		addHull()
	}

	if (divLayout[paneName] == "full") {
		_gaq.push(['_trackEvent', 'paneEvent', paneName + ", S: full"]);
		return;
	}
	
	if (divLayout[paneName] == "third") {
		for (x in divLayout) {
			if (x) {
				if (x == paneName) {
				divLayout[x] = "none";
				_gaq.push(['_trackEvent', 'paneEvent', paneName + ", S: close"]);
				}
				else {
					divLayout[x] = "half";
				_gaq.push(['_trackEvent', 'paneEvent', paneName + ", S: half"]);
				}
			}
		}
	}
	else if (divLayout[paneName] == "half") {
		divLayout[paneName] = "none"
		_gaq.push(['_trackEvent', 'paneEvent', paneName + ", S: close"]);
		for (x in divLayout) {
			if (x) {
				if (divLayout[x] == "half") {
					divLayout[x] = "full";
				}
			}
		}
	}
	else {
		var finalState = "third";
		for (x in divLayout) {
			if (x) {
				if (divLayout[x] == "full") {
					divLayout[x] = "half";
					finalState = "half";
				}
				else if (divLayout[x] == "half") {
					divLayout[x] = "third";
				}
			}
		}
		divLayout[paneName] = finalState;
		_gaq.push(['_trackEvent', 'paneEvent', paneName + ", S: third"]);
	}
	resizePanes();
	
	var incomingHash = window.location.hash;
	var kbSettings = incomingHash.split("/");
	var newHash = "/" + kbSettings[1] + "/" + divLayout.network + "/" + divLayout.timeline + "/" + divLayout.map + "/" + kbSettings[5] + "/" + kbSettings[6] +"/";
	
	if (kbSettings[1]) {
		window.location.hash = newHash;
		updateUrlBox();
	}
}

function resizePanes() {

	hideThirdBio();
	var newSize = {full: "600px", half: "300px", third: "200px", none: "38px"}

	var bDiv = document.getElementById("fullcontent");
	var canvasSize = parseFloat(bDiv.clientHeight);

	newSize.full = "" + (canvasSize - 76 - 124) + "px";
	newSize.third = "" + ((canvasSize - 124) / 3) + "px";
	newSize.half = "" + ((canvasSize -38 - 124) / 2) + "px";
	
	d3.select("#network").transition().duration(300).style("height", newSize[divLayout.network]).each("end", function () {
		defocusNetwork();})
	d3.select("#timeline").transition().duration(300).style("height", newSize[divLayout.timeline]).each("end", function () {
		defocusTimeline();})
	d3.select("#map").transition().duration(300).style("height", newSize[divLayout.map]).each("end", function () {
		defocusMap();})
	
	d3.select("#networkGearButton").style("display", divLayout.network == "none" ? "none" : "block");
	d3.select("#timelineGearButton").style("display", divLayout.timeline == "none" ? "none" : "block");
	d3.select("#mapGearButton").style("display", divLayout.map == "none" ? "none" : "block");
	
	
	var mainHeight = parseInt(document.body.clientHeight) - 150;
	if (!d3.select("#vContent").empty()) {
	d3.select("#vContent").style("height", "" + mainHeight + "px")
	var vContentH = parseInt(document.getElementById("vignettecontent").clientHeight);
	var vTitleH = parseInt(document.getElementById("vTitle").clientHeight);
	d3.select("#vCont").style("height", "" + (vContentH - vTitleH - 160) + "px").style("width", "auto")
	}

}

function focusMap() {
	
	var bDiv = document.getElementById("map");

	d3.select("#mapViz")
	.attr("height", parseInt(bDiv.clientHeight))
	.attr("width", parseInt(bDiv.clientWidth));
	/*
	sites2
	.transition()
	.duration(3000)
	.style("opacity", 1)
	*/
}

function defocusMap() {

	var bDiv = document.getElementById("map");

	d3.select("#mapViz")
	.attr("height", parseInt(bDiv.clientHeight))
	.attr("width", parseInt(bDiv.clientWidth));
	/*
	sites2
	.transition()
	.duration(3000)
	.style("opacity", 0)
	*/
}

function focusTimeline() {
		
	var bDiv = document.getElementById("timeline");

	d3.select("#timelineViz")
	.attr("height", parseInt(bDiv.clientHeight));
	timelineAxis.attr("transform","translate(0,"+ (parseInt(bDiv.clientHeight)) +")")

}

function traditionalTimelines() {
	var divBounds = refitDiv("timeline");
	
	w = divBounds.maxx,
	h = divBounds.maxy,
	gw = w * 2;
	gh = laneLength * 20;

d3.select("#timelineViz")
	.attr("width", divBounds.maxx)
	.attr("height", divBounds.maxy);

d3.select("g.main").transition().duration(3000).attr("transform", "translate(0,10)")
runTimeline(w,h,gw,gh);
}

function verticalTimelines() {

	var rectLength = items.length;
	var bDiv = document.getElementById("timeline");
	var minX = parseInt(bDiv.clientWidth);
	var maxX = (parseInt(bDiv.clientWidth) * Math.max(1,rectLength / 10));
	var minY = parseInt(bDiv.clientHeight);
	var maxY = parseInt(bDiv.clientHeight);
	
	var	attMin = d3.min(items, function(d,i) {return d["birthyear"]});
	var	attMax = d3.max(items, function(d,i) {return d["end"]});
	var timelineYRamp=d3.scale.linear().domain([attMin,attMax]).range([maxY,minY]).clamp(true);
	var timelineXRamp=d3.scale.linear().domain([0,rectLength]).range([minX,maxX]).clamp(true);
	var timelineXScale = rectLength / 20;

	d3.selectAll(".timelineBar")
	.transition()
	.duration(3000)
	.attr("x", 0)
	.attr("y", 0)
	.attr("height",20)
	.style("fill", "seagreen");
	
	d3.selectAll(".aevents")
	.transition()
	.duration(3000)
	.attr("height",20)
	.attr("rx", 0)
	.attr("ry", 0)
	;

rects.transition().duration(3000).attr("transform", function(d,i) {return "matrix(0,-1,2,1,"+timelineXRamp(i)+","+(timelineYRamp(items[i]["birthyear"]))+")"})
d3.select("g.main").transition().duration(3000).attr("transform", "translate(-1000,-50)");
timelineZoom.translate([-1000,-50]);
//rects.transition().duration(3000).attr("transform", function(d,i) {return "matrix(0,-1,2,1,0,0"})

timelineLabels
.text(function(d) {return d.name;});

timelineLabels
.transition()
.duration(3000)
.style("opacity", .5)
.attr("transform", function(d,i) {return "rotate(27.5 "+timelineXRamp(i)+","+(timelineYRamp(items[i]["birthyear"]))+")"})
.attr("x",function(d,i) {return timelineXRamp(i)})
.attr("y",function(d,i) {return timelineYRamp(items[i]["birthyear"]) + 12})

}

function xyFromTranslate(inObject) {
	if (inObject) {
		if (inObject.attr("transform")) {
		var curXYa = String(inObject.attr("transform"));
		var curXYb = curXYa.split(",");
		var curXa = curXYb[1].split(")");
		var curX = parseInt(curXa[0]);
		var curYa = curXYb[0].split("(");
		var curY = parseInt(curYa[1]);
		return [curY,curX];
		}
	}
		return [0,0];
}

function translateProjection(ll) {
	var pointPosition = projection([ll[1],ll[0]]);
	return "translate("+pointPosition[0]+","+pointPosition[1]+")";
}

function placeArbitraryPlace(placeArray) {

//Rome: 41,12.5
carto.selectAll("g.arbPlace").remove();

var arbPoint = carto.selectAll("g.arbPlace")
		.data(placeArray);
		
		arbPoint.enter()
		.append("g")
		.attr("transform", function (d) {return translateProjection(d.coords)})
 	    	.attr("class","arbPlace")
		.style("pointer-events","none")

		arbPoint
		.append("rect")
		.attr("height",1)
		.attr("width",1)
		  .attr("rx", function(d) {return (d.rounding * 2) + 40})
		  .attr("ry", function(d) {return (d.rounding * 2) + 40})
		  .style("fill", "none")
		  .style("stroke", "black")
		  .style("stroke-width", 5)
		  .style("opacity",1)
		  .transition()
		  .duration(1000)
		  .style("opacity",0)
			.attr("x", function(d) {return 0 - (d.size + 20)})
			.attr("y", function(d) {return 0 - (d.size + 20)})
			.attr("height", function(d) {return (d.size * 2) + 40})
			.attr("width", function(d) {return (d.size * 2) + 40})
		  .each("end", animate);


		  function animate(d) {
			if(d.pulsing) {
			d3.select(this)
			.attr("x",0)
			.attr("y",0)
			.attr("height",1)
			.attr("width",1)
			.style("opacity",1)
			.transition()
			.duration(1000)
			.style("opacity",0)
			.attr("x", function(d) {return 0 - (d.size + 20)})
			.attr("y", function(d) {return 0 - (d.size + 20)})
			.attr("height", function(d) {return (d.size * 2) + 40})
			.attr("width", function(d) {return (d.size * 2) + 40})
			.each("end", animate);
			}
		  }
		
		arbPoint
		.append("rect")
		  .attr("x", function(d) {return 0 - d.size})
		  .attr("y", function(d) {return 0 - d.size})
 	    	  .attr("height", function(d) {return d.size * 2})
 	    	  .attr("width", function(d) {return d.size * 2})
		  .attr("rx", function(d) {return d.rounding * 2})
		  .attr("ry", function(d) {return d.rounding * 2})
		  .style("fill", function(d) {return d.color})
		  .style("stroke", "black")
 	    	  .style("cursor", "pointer")
		  .style("opacity",0)
		  .transition()
		  .duration(1000)
		  .style("opacity",1);
		  
		  arbPoint
			.append("text")
			.text(function(d) {return d.label ? d.label : ''})
			.style("opacity",0)
			.style("text-anchor", "middle")
			.style("stroke", "white")
			.style("stroke-width", 3)
			.attr("y", -7)
			.attr("x", 5)
			.transition()
			.delay(500)
			.duration(1000)
			.style("opacity",.66)

		  arbPoint
			.append("text")
			.text(function(d) {return d.label ? d.label : ''})
			.style("opacity",0)
			.style("text-anchor", "middle")
			.attr("y", -7)
			.attr("x", 5)
			.transition()
			.delay(500)
			.duration(1000)
			.style("opacity",1)
		  
		  var ob = {size: 10,
			rounding: 5,
			coords: [41,12.5],
			label: "Rome",
			pulsing: false,
			color: "red"
		  }

}

function placeOnMap(indivVal, qType) {

	d3.selectAll("path.adminUnits").remove();
	d3.selectAll("path.placeopacfilter").remove();
	
	d3.json("countyQuery.php?s="+indivVal+"&q="+qType, function(collection2) {
		  bounds0 = d3.geo.bounds(collection2);
		  
		var tproj = projection.scale(1).translate([0,0]),
                bounds = bounds0.map(tproj),
                xscale = (1000)/
                    Math.abs(bounds[1][0] - bounds[0][0]),
                yscale = (300)/
                    Math.abs(bounds[1][1] - bounds[0][1]),
                pscale = Math.min(xscale, yscale);
		
		projection.scale(Math.min(pscale,2500));
		projection.translate(projection([-bounds0[0][0], -bounds0[1][1]]));

	mapZoom.scale(Math.min(pscale,2500) / 150);
      
      var t = projection.translate();

      mapZoom.translate([t[0] - 480 * mapZoom.scale(), t[1] - 250 * mapZoom.scale()]);      
      
		carto.selectAll("path").attr("d", path);
		
		carto.selectAll("g.arbPlace").remove();
		
		var geoPlaces = carto.selectAll("g.places").data(collection2.features).enter().append("g")
		
		  feature2 = geoPlaces
 	    	  .append("path")
 	    	  .attr("class","adminUnits")
 	    	  .attr("d", path)
 	    	  .on("mouseover", function (d) {anyOver(d.properties) })
 	    	  .on("mouseout", function (d) {anyOut(d.properties) });
		  
		  feature3 = geoPlaces
 	    	  .append("path")
 	    	  .attr("class","placeopacfilter")
 	    	  .attr("d", path)
		  .style("fill", "black")
		  .style("opacity", .25)
		  .style("pointer-events", "none");


		var featureScale = d3.extent(collection2.features, function(d) { return d.properties.when});
		var featureRamp=d3.scale.linear().domain([featureScale[0],((featureScale[0] + featureScale[1]) / 2),featureScale[1]]).range(["#3366CC","#FFFF99","#993333"]).clamp(true);

		feature2.style("fill", function(d) {return slightlyRandomColor(featureRamp(d.properties.when),colorVariance)}).style("opacity", 1);

		placeInitialCities();
		colorByGender();
		resizePanes();
		
    if (permaStory == false) {
    if (vA.length > 1) {
	var newHash = "/story/" + divLayout.network + "/" + divLayout.timeline + "/" + divLayout.map + "///"+vA;
	window.location.hash = newHash;
	updateUrlBox();
	currentHighlightedNode = '';
	currentFocusID = '';
	changeTitle(vA);
	vA = '';
    }
    else {
    closeVignette();
    updatePastList();
    }
    }
    else {
     changeTitle(vA);
	runVignette(vA);
     permaStory = false;
    }
		});
			
	
}

function kb_map(callback) {

	var bDiv = document.getElementById("map");
	var w = parseInt(bDiv.clientWidth);
	var h = parseInt(bDiv.clientHeight);
	var halfw = w/2;
    
/*    projection = d3.geo.vanDerGrinten4()
    .scale(125)
    .precision(.1); */
        
    projection = d3.geo.aitoff();

    path = d3.geo.path().projection(projection);

    var t = projection.translate(); // the projection's default translation
    var s = projection.scale() // the projection's default scale
    
    	mapZoom = d3.behavior.zoom()
	    .on("zoom", redraw)
	    .scaleExtent([2,25]);

    map = d3.select("#map").insert("svg:svg",".focusButton")
        .attr("width", w)
        .attr("height", h)
        .attr("id", "mapViz")
        .call(mapZoom);

    carto = map.append("svg:g").attr("id", "world").attr("transform", "translate("+ (w / 4) + ",0)");

   carto.insert("path", ".adminUnits")
      .datum(topojson.object(world, world.objects.land))
      .attr("class", "hirez land")
      .attr("d", path);
      
      d3.json("world-110m.json", function(error, world) {
  carto.insert("path", ".adminUnits")
      .datum(topojson.object(world, world.objects.land))
      .attr("class", "lowrez land")
      .attr("d", path)
      .style("display", "none");      
      
});
    function redraw() {
	
      var newCenter = projection.invert(d3.mouse(document.getElementById("mapViz")));
      var tx = (t[0] * d3.event.scale) + d3.event.translate[0];
      var ty = (t[1] * d3.event.scale) + d3.event.translate[1];
      projection.translate([tx, ty]);

      var oldScale = projection.scale();
      projection.scale(s * d3.event.scale);
      if (oldScale != projection.scale()) {
      }

      // redraw the map
	refreshTimer = setTimeout('refreshMap()', 100);
      mapRefresh();
      
    }
	  
	  createOverlay("title");
		d3.selectAll(".pane").style("height", "38px");
		d3.select("#network").style("height", "70%");
		
		callback();
		
}

function refreshMap() {
	refreshSet--

	if (refreshSet == 0) {
	carto.selectAll(".hirez").attr("d", path).style("display","block");
	carto.selectAll(".adminUnits").attr("d", path).style("display","block");
	carto.selectAll(".placeopacfilter").attr("d", path).style("display","block");
	carto.selectAll(".lowrez").style("display","none");
	}
}

function mapRefresh() {
	
	clearTimeout(refreshTimer);
	refreshTimer = setTimeout('refreshMap()', 100);
	refreshSet++;

	carto.selectAll(".hirez").style("display","none");
	carto.selectAll(".adminUnits").style("display","none");
	carto.selectAll(".placeopacfilter").style("display","none");
	carto.selectAll(".lowrez").attr("d", path).style("display","block");
	
	if (!d3.selectAll("g.arbPlace").empty()) {
		d3.selectAll("g.arbPlace").attr("transform", function (d) {return translateProjection(d.coords)});
	}
}

function zoomByPreset(scale,coords) {
	mapZoom.translate(coords)
	mapZoom.scale(scale);
	projection.scale(mapZoom.scale() * 150);
      var tx = 480 * mapZoom.scale() + mapZoom.translate()[0];
      var ty = 250 * mapZoom.scale() + mapZoom.translate()[1];
      projection.translate([tx, ty]);

	mapRefresh();
	}
	  
function modalClose(divName) {
	d3.selectAll("#modalSearchContents > div").remove();
	d3.select('#'+divName).style("display", "none").style("pointer-events", "none")
}

function placeInitialCities() {
       workingArbitraryPlaceArray = arbitraryPlaceArray.slice(0);
       placeArbitraryPlace(workingArbitraryPlaceArray)
}

function onOffCities() {
	d3.selectAll(".mapDisplayButton").classed("active", false)
	if (!d3.selectAll("g.arbPlace").empty()) {
		d3.selectAll("g.arbPlace").remove();
	d3.select("#mBCh").classed("active", true)
	_gaq.push(['_trackEvent', 'layoutEvent', "hide_cities"]);
	}
	else {
		placeInitialCities();
	d3.select("#mBC").classed("active", true)
	}
}

function searchButtonClick(sentID) {
	d3.selectAll(".occSelectButton").style("opacity", .5);	
	updateActivity();
	resetSearchBrush();
	d3.selectAll(".searchButton").classed("active", false)
	d3.select("#" + sentID).classed("active", true)
	d3.selectAll(".groupSearch").style("display","none")
	d3.selectAll(".recentSearch").style("display","none")
	d3.selectAll(".baseSearch").style("display","block")
	
	d3.select("#runSearchButton").attr("onClick", "createSearchTable(document.getElementById('idInputBox').value,'search','X','searchResultsDiv')");
	d3.select("#idInputBox").attr("onkeydown", "return press( event,document.getElementById('idInputBox').value,\'search\','X','searchResultsDiv')");

	document.getElementById('idInputBox').value = '';
	document.getElementById('idInputBox').placeholder = 'name to search';
	document.getElementById('familyInputBox').value = '';
	document.getElementById('locationInputBox').value = '';
	restoreInitial("searchContents");

	
	if (sentID == "connectSearchButton") {
		document.getElementById('idInputBox').placeholder = 'first name to search';
	}	
	if (sentID == "groupSearchButton") {
		d3.selectAll(".groupSearch").style("display","block")
		d3.select("#idSearchForm").style("display","none");
	}
	
	if (sentID == "recentSearchButton") {
		d3.selectAll(".recentSearch").style("display","block")
		d3.selectAll(".baseSearch").style("display","none")
	}

}
	  
function createSearchTable(searchString, inputType, sourceID, targetDiv){

if (document.querySelector("#"+targetDiv)) {
	var targetParent = d3.select(document.querySelector("#"+targetDiv).parentNode).attr("id");
	hideInitial(targetParent);
}
	
	  d3.select("#newSearchDiv").remove();
 	d3.select(".modalDialog").style("display", "block").style("pointer-events", "auto")
	  var newSearchDiv = d3.select("#modalSearchContents").append("div").attr("id", "newSearchDiv").style("overflow","auto");
		  switch(inputType) {
		  case "person":
		  newSearchDiv.append("h2").html(searchString.name);
		  newSearchDiv.append("h3").html('<a onClick="changeTitle(\'The family of '+searchString.properties.name+'\');indivClick(\''+searchString.id+'\','+searchString.birthyear+')">Jump to '+searchString.name+'</a>');
		  newSearchDiv.append("p").html('Here we can put some summary information about the individual clicked.');
		  var sourceName = searchString.properties.name;
		  break;
		  case "search":
		d3.select(".modalDialog").style("display", "none")

	  newSearchDiv.append("h2").html("Search Results");
	  var searchDateRange = [0,2050];
	  if (!searchBrush.empty()) {
		var s = searchBrush.extent();
		searchDateRange = [Math.floor(s[0]),Math.floor(s[1])];
	  }

	  var geoString = document.getElementById("locationInputBox").value;
	  var occString = occupationSearchList.toString();
	  
	d3.json("search.php?s="+searchString+"&y="+searchDateRange[0]+"&ye="+searchDateRange[1]+"&g="+geoString+"&o="+occString, function(searchResults) {
		_gaq.push(['_trackEvent', 'searchEvent', "sString: " + searchString]);
		_gaq.push(['_trackEvent', 'searchEvent', "sDate: " + searchDateRange[0] +","+searchDateRange[1]]);
		_gaq.push(['_trackEvent', 'searchEvent', "sBoth: " + searchString +"," + searchDateRange[0] +","+searchDateRange[1]]);
		_gaq.push(['_trackEvent', 'searchEvent', "sDate: " + searchDateRange[0] +","+searchDateRange[1]]);
		_gaq.push(['_trackEvent', 'searchEvent', "sGeo: " + geoString]);
		_gaq.push(['_trackEvent', 'searchEvent', "sOcc: " + occString]);
		resultsTable(searchResults,targetDiv,5,false,sourceID,sourceName);
			
	})
		break;
	  }
		}

function connectToSearch(sourceID,divID,sourceName) {
	d3.selectAll("#" + divID + " p").remove();
	d3.selectAll("#" + divID + " ol").remove();
	
	document.getElementById('idInputBox').value = '';
	document.getElementById('idInputBox').placeholder = 'second name to search';

        d3.select("#searchBody").style("display","block")

	var leftArrowFunction = d3.select("#leftRemove").attr("onclick");
	d3.select(".leftRemove").remove()
	
	d3.select("#" + divID).insert("div", ".lessarrow").attr("id", "resultsTable").style("padding", 0).style("width", "100%").attr("class", "generated").attr("display", divID == "searchShare" ? "none" : "block")
	.style("padding","10px 20px")
	.style("margin-left", "-5px")
	.html("<a onclick='"+leftArrowFunction+"'>&larr;</a> Connecting <a onclick='restartNetwork(\""+sourceID+"\");'>"+sourceName+"</a> to...");
	d3.select("#runSearchButton").attr("onClick", "createSearchTable(document.getElementById('idInputBox').value,'search','"+sourceID+"','searchResultsDiv')");
	d3.select("#idInputBox").attr("onkeydown", "return press( event,document.getElementById('idInputBox').value,\'search\','"+sourceID+"','searchResultsDiv')");

}

function resultsTable(inData,divID,previewRows,fixedColumns,sourceID,sourceName) {
	var placeName = '';
	if (inData.searchResults) {
		if (inData.placename) {
			placeName = inData.placename
		}
		inData = inData.searchResults;
	}
	
	var parID = document.querySelector("#" + divID).parentNode.id;

	var leftArrowFunction = 'restoreInitial("'+parID+'")';

	if (d3.select("#connectSearchButton").classed("active") == true) {
		leftArrowFunction += ';searchButtonClick("connectSearchButton")';
	}

	
	d3.selectAll("#" + divID + " > #resultsTable").remove();
	d3.select("#" + divID).insert("div", ".lessarrow").attr("id", "resultsTable").style("padding", 0).style("width", "100%").attr("class", "generated leftRemove").attr("display", divID == "searchShare" ? "none" : "block").html('<input id="leftRemove" type="button" class="topButton" style="width:100%; margin: 0px; border-bottom: 1px solid #D3D3D3;" onclick=\''+leftArrowFunction+'\' value="&larr;" /input>');
	var divLocation = d3.select("#" + divID).insert("div", ".lessarrow").attr("id", "resultsTable").attr("class", divID == "searchShare" ? "" : "generated").style("max-height",  divID == "searchShare" ? "200px" : "430px").style("overflow","auto");

	var columns = ["id","name","gender","birthyear"];

	var searchClickStringFront = '';
	var searchClickStringBack = '';
	
	var searchString = 'pathViz(\'sent\',\'';
	var sendSource = false;
	
	  if (sourceID != 'X') {
		divLocation.insert("div", ".resultsTable").attr("id", "resultsTable").style("padding", 0).style("width", "100%").attr("class", "generated").attr("display", divID == "searchShare" ? "none" : "block")
		.html("Connect to:");
		  searchClickStringFront = 'pathViz(\'sent\',\''+sourceID+'\',\'';
		  searchClickStringBack = '\');searchButtonClick(\'connectSearchButton\')';
	  }
	  else if (divID == 'searchShare') {
		  d3.select("#searchShare > .sectionheading").html("" + nodes.length + " shown in current view:")
		  searchClickStringFront = 'restartNetwork(\'';
		  searchClickStringBack = '\')';
	  }
	  else if (d3.select("#connectSearchButton").classed("active") == true) {
		sendSource = true;
		searchClickStringFront = "connectToSearch('";
		  searchClickStringBack = "','"+divID+"','"+sourceName+"')";

	  }
	  else {
		  searchClickStringFront = 'restartNetwork(\'';
		  searchClickStringBack = '\')';
	  }
	  
	  var displayNum = 15
	  if (placeName.length > 1) {
		divLocation.append("p").style("padding-left", "10px").html("Associated with " + placeName);
		displayNum = 13;
	  }

	  var searchList = divLocation.append("ol").style("padding", "0 10px");
	  
	  var noResultsText = '<p>Your search did not return a result. Check the spelling and try alternatives if plausible. If your search was for a particular person, consider three factors. First, the database is selective not exhaustive. Second, the iron law for possible inclusion in Kindred Britain is that an individual be related by family or by marriage to someone already included. Third, one person compiled this database: omissions are inevitable.</p>';
	  
	  var moreItems = searchList.selectAll("li")
	    .data(inData)
	    .enter()
	    .append("li")
	    .style("display", function(d,i) {return ((i < displayNum || divID == "searchShare") && (!d.isMetaNode) ? "block" : "none")})
	      .html(function(d,i) { return d.id == 0 ? noResultsText : '<a onClick="' + (sendSource ? "connectToSearch('"+d.id+"','"+divID+"','"+d.name+"')" : searchClickStringFront+d.id+searchClickStringBack)+'; modalClose(\'modalSearch\')">'+d.name+' ('+d.birthyear+' - '+(d.end < 2013 ? d.end : '')+') '+(d.occupation ? d.occupation : '')+'</a>'
	})
	      .on("mouseover", anyOver)
	      .on("mouseout", anyOut);

	searchList.append("li").html("&nbsp;");

	if (divID != "searchShare" && inData.length > displayNum) {
		searchList.insert("li").attr("id", ""+divID+"morebutton").html('<a onClick="d3.select(this).remove();displayMoreResults(\''+divID+'\')">More &rarr;</a>');
	}
}

function displayMoreResults(divID) {
	d3.selectAll("#"+divID+" li").style("display", "block");
	d3.select("#"+divID+"morebutton").style("display", "none");
}

function project(x) {
    var point = map.latLngToLayerPoint(new L.LatLng(x[1], x[0]));
    return [point.x, point.y];
  }

function indivClick(state,searchDate) {

	currentHighlightedNode = "";
	modalClose("modalSearch");
	if(state=="new") {
		targetID = [document.getElementById("idInputBox").value];
	}
	else{
		targetID = state;
	}

		if (state=="again") {
			newsClick("again");
		}
		else{
			newsClick(targetID);
		}

}

function eventView() {
	_gaq.push(['_trackEvent', 'layoutEvent', "event_view"]);

	d3.selectAll(".timelineLayoutButton").classed("active", false);
	d3.select("#tBE").classed("active", true);

	d3.selectAll("rect.timelineBar").style("display", "none").classed("suppressed" ,true);
	d3.selectAll("rect.timelineopacfilter").style("display", "none").classed("suppressed" ,true);
	
	d3.selectAll("g.timelines").each(function(d) {
		var g = d3.select(this);
		var notablePosition = notableEvent (d.aevents);
		g.selectAll("rect.uaevents").style("display", function (p,q) {return q == notablePosition ? "block" : "none"}).classed("suppressed",true)
		g.selectAll("rect.aevents").style("display", "none").classed("suppressed",true)
		g.append("text")
		.style("pointer-events","none")
		.text(d["aevents"][notablePosition]["eventlabel"].length > 30 ? d["aevents"][notablePosition]["eventlabel"].substr(0,30) + "..." : d["aevents"][notablePosition]["eventlabel"])
		.classed("suppressed",true).attr("text-anchor", "middle")
		.attr("x", d3.select(g.selectAll("rect.aevents")[0][notablePosition]).attr("x"))
			}
		   )
	.on("click", showSuppressed)

}

function eventViewOff() {
	d3.selectAll(".timelineLayoutButton").classed("active", false);
	d3.select("#tBT").classed("active", true);

	d3.selectAll(".suppressed").style("display", "block");
	d3.selectAll("text.suppressed").remove();
	d3.selectAll(".suppressed").classed("suppressed", false)
}

function resetButtons() {
	d3.selectAll(".colorButton").classed("active", false);
	d3.selectAll("#colorG").classed("active", true);
	d3.selectAll(".timelineLayoutButton").classed("active", false);
	d3.select("#tBT").classed("active", true);
	d3.selectAll(".mapDisplayButton").classed("active", false);
	d3.select("#mBC").classed("active", true);
	d3.selectAll(".timelineGuideButton").classed("active", false);
	d3.select("#tBVh").classed("active", true);	

}
function showSuppressed() {
	var g = d3.select(this).style("display", "block")
	g.selectAll("rect").style("display", "block")
	g.selectAll("text").remove()
	
      	g.on("click", function(d) {highlightNode(d.id)})
}

function notableEvent(aeventsObject) {
	
	var eventValue = {
	"STOR": 10,
	"GRAD": 5,
	"EDUC": 4,
	"RETI": 3,
	"NATU": 2,
	"RESI": 2,
	"BIRT": -1,
	"DIV": 1,
	"BAPM": -1,
	"BURI": -1,
	"ANUL": -1,
	"OCCU": 4,
	"EVEN": 6,
	"IMMI": 1,
	"MARR": 1,
	"DEAT": -1}
	
	var retPosition = 0;
	var retValue = 0;
	var curPos = 0;
	for (x in aeventsObject) {
		if (aeventsObject[x]) {
			if (eventValue[aeventsObject[x]["eventtype"]] > retValue) {
				retValue = eventValue[aeventsObject[x]["eventtype"]]
				retPosition = curPos;
			}
		}
		curPos++;
	}
	return retPosition;
}
