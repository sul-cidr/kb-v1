egoQuery = "kinQuery.php?s=";
kinQuery = "kinQuery.php?s=";
pathQuery = "pathQuery.php?s=";
newsPersonQuery = "similarity.php?i=";
//newsPlaceQuery = "site_events_d3.php?i=";
newsPlaceQuery = "occu_events_d3.php?i=";
newsOccupationQuery = "occu_events_d3.php?i=";
foundOverlap = 99;
currentFocusID = "";
lastFocusID = "";
currentYear = "1771";
whenVal = 1771;
currentHighlightedNode = "";
degreeSize = true;
graphDistance = 20;
nodeOptions = ["fix","ego"];
networkStarted = false;
networkLoaded = false;
dynamicSizing = false;
isLoaded = false;
bioLoading = false;
hullsActive = false;
occNodes = false;
graphRunning = true;
currentSituatedPerspective = 'person';
divNames = {"bio": "biography", "network": "network", "timeline": "timeline", "map": "map"};
divLayout = {"network": "full", "timeline": "none", "map": "none"};
welcomeScreen = true;
colorVariance = 3;
currentStory = "erasmus";
laneLength = 10;
queriesArray = [];
currentTitle = "Most interesting people in Kindred Britain";
refreshTimer = null;
refreshSet = 0;
occupationSearchList = [];
clickNotDrag = true;
focusClickDelay = 100;
vA = '';
permaStory = false;
thisBrowser = 'unknown';
safariTick = 0;
nodeDragging = false;
nodes = [];

arbitraryPlaceArray = [
	{size: 3,rounding: 5,coords: [51.511, -0.119],label: "London",pulsing: false,color: "black"},
	{size: 3,rounding: 5,coords: [48.856614,2.352222],label: "Paris",pulsing: false,color: "black"},
	{size: 3,rounding: 5,coords: [41.892916,12.48252],label: "Rome",pulsing: false,color: "black"},
	{size: 3,rounding: 5,coords: [40.416775,-3.70379],label: "Madrid",pulsing: false,color: "black"},
	{size: 3,rounding: 5,coords: [59.32893,18.06491],label: "Stockholm",pulsing: false,color: "black"},
	{size: 3,rounding: 5,coords: [41.00527,28.97696],label: "Istanbul",pulsing: false,color: "black"},
	{size: 3,rounding: 5,coords: [48.136607,11.577085],label: "Munich",pulsing: false,color: "black"},
	{size: 3,rounding: 5,coords: [40.714353,-74.005973],label: "New York",pulsing: false,color: "black"},
	{size: 3,rounding: 5,coords: [50.075538,14.4378],label: "Prague",pulsing: false,color: "black"},
	{size: 3,rounding: 5,coords: [-22.903539,-43.209587],label: "Rio de Janeiro",pulsing: false,color: "black"},
	{size: 3,rounding: 5,coords: [53.349805,-6.26031],label: "Dublin",pulsing: false,color: "black"},
	{size: 3,rounding: 5,coords: [19.075984,72.877656],label: "Mumbai",pulsing: false,color: "black"},
	{size: 3,rounding: 5,coords: [39.90403,116.407526],label: "Beijing",pulsing: false,color: "black"},
	{size: 3,rounding: 5,coords: [31.230393,121.473704],label: "Shanghai",pulsing: false,color: "black"},
	{size: 3,rounding: 5,coords: [31.768319,35.21371],label: "Jerusalem",pulsing: false,color: "black"},
	{size: 3,rounding: 5,coords: [55.751242,37.618422],label: "Moscow",pulsing: false,color: "black"},
	{size: 3,rounding: 5,coords: [37.983716,23.72931],label: "Athens",pulsing: false,color: "black"},
	{size: 3,rounding: 5,coords: [30.04442,31.235712],label: "Cairo",pulsing: false,color: "black"}
	];

//whenRamp=d3.scale.linear().domain([1631,1731,1831]).range(["slateblue","yellow","red"]).clamp(true);

w = 400;
h = 600;

legendColors = ["#c7e9b4","#7fcdbb","#41b6c4","#2c7fb8","#253494"];
genderColors = ["#51a1c9","#6f9cc9","#8d97c9","#8f83c9","#8f68c9"];
//legendColors = ["#DDF2D2","#B2E1D6","#8DD3DC","#80B2D4","#7C85BF"];

eventColor = {"GRAD": "#938FBF",
	"EDUC": "#938FBF",
	"RETI": "#938FBF",
	"NATU": "#938FBF",
	"RESI": "#938FBF",
	"BIRT": "#0D00BE",
	"DIV": "#808080",
	"BAPM": "#0D00BE",
	"BURI": "#938FBF",
	"ANUL": "#808080",
	"OCCU": "#938FBF",
	"EVEN": "#938FBF",
	"IMMI": "#938FBF",
	"MARR": "#938FBF",
	"DEAT": "#0D00BE"};

connectionLines = {"purple": "#FF8133",
		"blue": "#FFCC00",
		"green": "#FF1EF2",
                "none": "none"
}
