egoQuery = "kinQuery.php?s=";
kinQuery = "kinQuery.php?s=";
pathQuery = "pathQuery.php?s=";
newsPersonQuery = "similarity.php?i=";
//newsPlaceQuery = "site_events_d3.php?i=";
newsPlaceQuery = "occu_events_d3.php?i=";
newsOccupationQuery = "occu_events_d3.php?i=";
currentFocusID = "I5906";
lastFocusID = "I5906";
currentYear = "1771";
degreeSize = true;
graphDistance = 20;
nodeOptions = ["fix","ego"];
networkStarted = false;
dynamicSizing = false;
isLoaded = false;
hullsActive = false;
occNodes = false;

//whenRamp=d3.scale.linear().domain([1631,1731,1831]).range(["slateblue","yellow","red"]).clamp(true);

w = 400;
h = 600;

function nextViz(target) {
	newsFeed(target, "Person");
}

eventColor = {"GRAD": "blue",
	"EDUC": "lightblue",
	"RETI": "darkgrey",
	"NATU": "brown",
	"RESI": "red",
	"BIRT": "cyan",
	"DIV": "purple",
	"BAPM": "gold",
	"BURI": "pink",
	"ANUL": "coral",
	"OCCU": "orange",
	"EVEN": "blueviolet",
	"IMMI": "lightgreen",
	"MARR": "green",
	"DEAT": "grey"};

