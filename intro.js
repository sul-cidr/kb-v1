function hideInitial(divID) {
    d3.selectAll("#"+divID+" .generated").remove();    
    d3.selectAll("#"+divID+" .initial").style("display","none");
}

function restoreInitial(divID) {
    d3.selectAll("#"+divID+" .generated").remove();
    d3.selectAll("#"+divID+" .initial").style("display","block");    
}

function createOverlay(pageType){

	  d3.selectAll(".newContentDiv").remove();
 		var wrapperDiv = d3.select("#kbContents").append("div").attr("class", "newContentDiv").style("overflow","auto");
 		var contentDiv = wrapperDiv.append("div").style("padding","0");

 	switch(pageType) {
 	case "title":
                var titleDiv = contentDiv.append("div").attr("id","kbSubCont").style("width","410px").style("padding","0 20px").style("overflow","auto");
 		titleDiv.append("p").attr("class", "startPage").html('<span class="emphasize">Kindred Britain</span> is a network of nearly 30,000 individuals &mdash; many of them iconic figures in British culture &mdash; connected through family relationships of blood, marriage, or affiliation. It is a vision of the nation&rsquo;s history as a giant family affair.')
                titleDiv.append("p").attr("class", "startPage").html('<input type="button" class="legendButton" onclick="viz01(\'lum\',\'lum\',1)" value="Start &rarr;" /><input type="button" class="legendButton" onclick="createOverlay(\'learnmore\')" style="float:none;" value="Learn More &rarr;" />')
		titleDiv.append("p").attr("class", "startPage").style("margin-top", "20px").style("color", "#808080").html('EXPLORING THE SITE');
		titleDiv.append("p").attr("class", "startPage").html('Drag circles onto each other to connect people.');
		titleDiv.append("p").attr("class", "startPage").html('<img src="images/visual_guide_1.png" />');
		titleDiv.append("p").style("border-top", "solid 1px #eee").style("padding-top", "15px").attr("class", "startPage").html('Click a circle to see that person&rsquo;s profile.')
		titleDiv.append("p").attr("class", "startPage").html('<img src="images/visual_guide_2.png" />');
		titleDiv.append("p").style("border-top", "solid 1px #eee").style("padding-top", "15px").attr("class", "startPage").html('Click <span class="emphasize">Timeline</span> and <span class="emphasize">Geography</span> to see more.');
		titleDiv.append("p").attr("class", "startPage").html('<img src="images/visual_guide_3.png" />');
		titleDiv.append("p").style("border-top", "solid 1px #eee").style("padding-top", "15px").attr("class", "startPage").html('Discover <span class="emphasize">People</span>, <span class="emphasize">Connections</span>, and <span class="emphasize">Stories</span>.');
		titleDiv.append("p").attr("class", "startPage").html('<img src="images/visual_guide_4.png" />');
		titleDiv.append("p").style("border-top", "solid 1px #eee").style("padding-top", "15px").attr("class", "startPage").html('Click on the title for a list of people shown.');
		titleDiv.append("p").attr("class", "startPage").html('<img src="images/visual_guide_5.png" />');
		titleDiv.append("p").style("border-top", "solid 1px #eee").style("padding-top", "15px").attr("class", "startPage").html('Click the question mark to read more or get help.');
		titleDiv.append("p").attr("class", "startPage").html('<img src="images/visual_guide_6.png" />');
	  break;
 	case "learnmore":
var subDiv = contentDiv.append("div").attr("class", "newContentDiv").style("width","410px").style("padding","0").style("height","30px");
subDiv.style("margin","0")
.style("border-bottom-color", "#E8E7EF")
.style("border-bottom-width", "1px")
.style("border-bottom-style", "solid")
.style("height", "30px")
.style("width", "100%")
.style("padding", "10px 0 0")
.style("text-align", "center")
.style("overflow", "hidden")
.attr("class", "startPage lessarrow")
.attr("onclick", "createOverlay(\'title\')")
.html("&larr;");

var secDiv = contentDiv.append("div").attr("id","kbSubCont").style("width","410px").style("padding","0 20px").style("overflow","auto");

secDiv.append("h3").attr("class", "sectionheading").html("Learn More")
var tocList = secDiv.append("ul");
tocList.append("li").style("list-style-type", "disc").html('<a onclick="createOverlay(\'tocBasics\')">Basics</a>')
tocList.append("li").style("list-style-type", "disc").html('<a onclick="createOverlay(\'tocStarted\')">Getting Started</a>')
tocList.append("li").style("list-style-type", "disc").html('<a onclick="createOverlay(\'tocDetails\')">The Details</a>')
tocList.append("li").style("list-style-type", "disc").html('<a onclick="createOverlay(\'tocIdea\')">The Idea</a>')
tocList.append("li").style("list-style-type", "disc").html('<a onclick="createOverlay(\'tocDesign\')">Site Design</a>')
tocList.append("li").style("list-style-type", "disc").html('<a onclick="createOverlay(\'tocPanes\')">Network, Timeline, Geography</a>')
tocList.append("li").style("list-style-type", "disc").html('<a onclick="createOverlay(\'tocContext\')">Context Over Isolation</a>')
tocList.append("li").style("list-style-type", "disc").html('<a onclick="createOverlay(\'tocGoals\')">Goals</a>')
tocList.append("li").style("list-style-type", "disc").html('<a onclick="createOverlay(\'tocMore\')">Learning (Still) More</a>')

break;

case "tocBasics":
var subDiv = contentDiv.append("div").attr("class", "newContentDiv").style("width","410px").style("padding","0").style("height","30px");
subDiv.style("margin","0")
.style("border-bottom-color", "#E8E7EF")
.style("border-bottom-width", "1px")
.style("border-bottom-style", "solid")
.style("height", "30px")
.style("width", "100%")
.style("padding", "10px 0 0")
.style("text-align", "center")
.style("overflow", "hidden")
.attr("class", "startPage lessarrow")
.attr("onclick", "createOverlay(\'learnmore\')")
.html("&larr;");

var secDiv = contentDiv.append("div").attr("id","kbSubCont").style("width","410px").style("padding","0 20px").style("overflow","auto");

secDiv.append("h3").attr("class", "sectionheading").attr("id", "tocBasics").html("Basics")
secDiv.append("p").html('<span class="emphasize">Kindred Britain</span> assembles and visualizes records of nearly 30,000 individuals, mainly (but not exclusively) British. Many of them are extremely well-known in the nation&rsquo;s culture. The database in its entirety spans more than 1,500 years, but the time-period of densest concentration comes in the 19th century. Any person recorded here can be connected to any other person in the network through family relationships of ancestry, descent, siblinghood, marriage or some other type of familial affiliation. In <span class="emphasize">Kindred Britain</span>, family is all. The site is a panorama of engineers and painters, novelists and generals, scientists and merchants, and even a few reprobates, misanthropes and monsters.')

break;

case "tocStarted":
var subDiv = contentDiv.append("div").attr("class", "newContentDiv").style("width","410px").style("padding","0").style("height","30px");
subDiv.style("margin","0")
.style("border-bottom-color", "#E8E7EF")
.style("border-bottom-width", "1px")
.style("border-bottom-style", "solid")
.style("height", "30px")
.style("width", "100%")
.style("padding", "10px 0 0")
.style("text-align", "center")
.style("overflow", "hidden")
.attr("class", "startPage lessarrow")
.attr("onclick", "createOverlay(\'learnmore\')")
.html("&larr;");

var secDiv = contentDiv.append("div").attr("id","kbSubCont").style("width","410px").style("padding","0 20px").style("overflow","auto");

secDiv.append("h3").attr("class", "sectionheading").attr("id", "tocStarted").html("Getting Started")
secDiv.append("p").html('One good way to begin using <span class="emphasize">Kindred Britain</span> is by exploring the surprising family connections amongst a selection of the influential figures who are represented on the opening screen. Each circle (or node) is a person. Drag one node over any other you see to establish a relationship. For example, relate <a onclick="pathViz(\'sent\',\'I21391\',\'I7674\')">Jane Austen to Virginia Woolf</a>, or <a onclick="pathViz(\'sent\',\'I15189\',\'I7462\')">Isaac Newton to Charles Darwin</a>. Or (because some non-British people with British ancestry are included in the site) see the relationship between <a onclick="pathViz(\'sent\',\'I1797\',\'I27868\')">Francis Bacon and Kevin Bacon</a>. <span class="emphasize">Kindred Britain</span> encourages you to discover, experiment, speculate and play. If you need help, you can click on &lsquo;Learning (Still) More&rsquo; in the content list above.')
break;

case "tocDetails":
var subDiv = contentDiv.append("div").attr("class", "newContentDiv").style("width","410px").style("padding","0").style("height","30px");
subDiv.style("margin","0")
.style("border-bottom-color", "#E8E7EF")
.style("border-bottom-width", "1px")
.style("border-bottom-style", "solid")
.style("height", "30px")
.style("width", "100%")
.style("padding", "10px 0 0")
.style("text-align", "center")
.style("overflow", "hidden")
.attr("class", "startPage lessarrow")
.attr("onclick", "createOverlay(\'learnmore\')")
.html("&larr;");

var secDiv = contentDiv.append("div").attr("id","kbSubCont").style("width","410px").style("padding","0 20px").style("overflow","auto");

secDiv.append("h3").attr("class", "sectionheading").attr("id", "tocDetails").html("The Details")
secDiv.append("p").html('<span class="emphasize">Kindred Britain</span> takes the oldest form of network visualization – the family tree – and brings this diagram from the age of parchment into the midst of the new possibilities for knowledge and analysis enabled by 21st century digital technology. With around 30,000 individuals included, there are over 897 million different paths through the network. Many fascinating and defamiliarizing relationships emerge here that have remained hidden until now. And these connection-paths generate an almost infinite plenitude of local narratives. A few exemplary instances are spelled out in the &lsquo;Stories&rsquo; section here: the rest are there to be extracted and told following your own interests.')
break;

case "tocIdea":
var subDiv = contentDiv.append("div").attr("class", "newContentDiv").style("width","410px").style("padding","0").style("height","30px");
subDiv.style("margin","0")
.style("border-bottom-color", "#E8E7EF")
.style("border-bottom-width", "1px")
.style("border-bottom-style", "solid")
.style("height", "30px")
.style("width", "100%")
.style("padding", "10px 0 0")
.style("text-align", "center")
.style("overflow", "hidden")
.attr("class", "startPage lessarrow")
.attr("onclick", "createOverlay(\'learnmore\')")
.html("&larr;");

var secDiv = contentDiv.append("div").attr("id","kbSubCont").style("width","410px").style("padding","0 20px").style("overflow","auto");

secDiv.append("h3").attr("class", "sectionheading").attr("id", "tocIdea").html("The Idea")
secDiv.append("p").html('In <span class="emphasize">Kindred Britain</span> a monarch connects to a sea captain. A composer to a squire. A diarist to a doctor. A novelist to a banker. Whatever chasms of fortune, profession or fate separate these people, all are unified in <span class="emphasize">Kindred Britain</span> into an image of the British past, made viewable from numerous angles through the sorting, shaping and visualizing powers of contemporary software. A core proposition underwrites <span class="emphasize">Kindred Britain</span>&rsquo;s multiplicity of stories about individuals, families and personal histories. The site shows that, for better or worse, you can understand British history as being something miraculously (or eerily) close to a family affair.')
break;

case "tocDesign":
var subDiv = contentDiv.append("div").attr("class", "newContentDiv").style("width","410px").style("padding","0").style("height","30px");
subDiv.style("margin","0")
.style("border-bottom-color", "#E8E7EF")
.style("border-bottom-width", "1px")
.style("border-bottom-style", "solid")
.style("height", "30px")
.style("width", "100%")
.style("padding", "10px 0 0")
.style("text-align", "center")
.style("overflow", "hidden")
.attr("class", "startPage lessarrow")
.attr("onclick", "createOverlay(\'learnmore\')")
.html("&larr;");

var secDiv = contentDiv.append("div").attr("id","kbSubCont").style("width","410px").style("padding","0 20px").style("overflow","auto");

secDiv.append("h3").attr("class", "sectionheading").attr("id", "tocDesign").html("Site Design")
secDiv.append("p").html('This website is organized into three main interactive visualization panes: &lsquo;Network&rsquo;, &lsquo;Timeline&rsquo; and &lsquo;Geography&rsquo;. These visualizations respond to queries you can make through the &lsquo;Search&rsquo; box and to curated choices available through the dropdown menus in &lsquo;People&rsquo;, &lsquo;Connections&rsquo; and &lsquo;Stories&rsquo;. Using these tools, and the profile panels that will propagate on the left and right of the main screen, you can browse through an infinite variety of connections and groupings, following your own interests and promptings. If you get lost, you can invoke &lsquo;Help&rsquo; at any point by clicking the &lsquo;?&rsquo; button or you can return to the site&rsquo;s ground zero by clicking &lsquo;Start&rsquo;.')
break;

case "tocPanes":
var subDiv = contentDiv.append("div").attr("class", "newContentDiv").style("width","410px").style("padding","0").style("height","30px");
subDiv.style("margin","0")
.style("border-bottom-color", "#E8E7EF")
.style("border-bottom-width", "1px")
.style("border-bottom-style", "solid")
.style("height", "30px")
.style("width", "100%")
.style("padding", "10px 0 0")
.style("text-align", "center")
.style("overflow", "hidden")
.attr("class", "startPage lessarrow")
.attr("onclick", "createOverlay(\'learnmore\')")
.html("&larr;");

var secDiv = contentDiv.append("div").attr("id","kbSubCont").style("width","410px").style("padding","0 20px").style("overflow","auto");

secDiv.append("h3").attr("class", "sectionheading").attr("id", "tocPanes").html("Network, Timeline, Geography")
secDiv.append("p").html('The &lsquo;Network&rsquo; panels plots the family path between two individuals, shows you an individual in the context of their family or assembles groups of individuals on the basis of factors such as profession. &lsquo;Timeline&rsquo; allows you to contextualize the events in any individual&rsquo;s life against events from the lives of other family members or against a baseline of events of broad historical significance. &lsquo;Geography&rsquo; highlights parts of the country or (because for much of the time covered by <span class="emphasize">Kindred Britain</span> the country was an empire) parts of the world associated with figures or families you are exploring.')
break;

case "tocContext":
var subDiv = contentDiv.append("div").attr("class", "newContentDiv").style("width","410px").style("padding","0").style("height","30px");
subDiv.style("margin","0")
.style("border-bottom-color", "#E8E7EF")
.style("border-bottom-width", "1px")
.style("border-bottom-style", "solid")
.style("height", "30px")
.style("width", "100%")
.style("padding", "10px 0 0")
.style("text-align", "center")
.style("overflow", "hidden")
.attr("class", "startPage lessarrow")
.attr("onclick", "createOverlay(\'learnmore\')")
.html("&larr;");

var secDiv = contentDiv.append("div").attr("id","kbSubCont").style("width","410px").style("padding","0 20px").style("overflow","auto");

secDiv.append("h3").attr("class", "sectionheading").attr("id", "tocContext").html("Context Over Isolation")
secDiv.append("p").html('<span class="emphasize">Kindred Britain</span>&rsquo;s emphases are social and contextual: this site is not about individuals in isolation. It is about groups and families and about connections between people who are normally not aligned with one another. And the site&rsquo;s form mirrors the site&rsquo;s approach to content. The three visualization panes do not exist as separate informational silos but respond symbiotically to each other: they are, so to speak, a &lsquo;family&rsquo; of visualizations. You can focus on a single view if you choose. But if you have two or three panes open at the same time, your interactions in one pane will be reflected in the other open panes as well, furnishing a prismatic viewpoint for your inquiry.')
break;

case "tocGoals":
var subDiv = contentDiv.append("div").attr("class", "newContentDiv").style("width","410px").style("padding","0").style("height","30px");
subDiv.style("margin","0")
.style("border-bottom-color", "#E8E7EF")
.style("border-bottom-width", "1px")
.style("border-bottom-style", "solid")
.style("height", "30px")
.style("width", "100%")
.style("padding", "10px 0 0")
.style("text-align", "center")
.style("overflow", "hidden")
.attr("class", "startPage lessarrow")
.attr("onclick", "createOverlay(\'learnmore\')")
.html("&larr;");

var secDiv = contentDiv.append("div").attr("id","kbSubCont").style("width","410px").style("padding","0 20px").style("overflow","auto");

secDiv.append("h3").attr("class", "sectionheading").attr("id", "tocGoals").html("Goals")
secDiv.append("p").html('<span class="emphasize">Kindred Britain</span> is not an exhaustive account of British families. The details it gives are often selective and emblematic. Rather, the site undertakes a more expansive endeavour: it is about tracing paths, about connecting disparate, far-flung worlds, about re-embedding individuals in their kindred and professional groups. And <span class="emphasize">Kindred Britain</span> is also not about supplying definitive answers. Instead, on a broad foundation of historical fact, it deploys modern computational methods to suggest possibilities, metaphors, ideas about Britain, about its subjects and its culture. Use it to recapture truths about the British past. Or use it to reflect on the present and what &lsquo;family&rsquo; might mean today. Our hope for <span class="emphasize">Kindred Britain</span> is that, as a novelist once put it, &lsquo;you shall find there according to your deserts: encouragement, consolation, fear, charm &mdash; all you demand; and, perhaps, also that glimpse of truth for which you have forgotten to ask.&rsquo;')
break;

case "tocMore":
var subDiv = contentDiv.append("div").attr("class", "newContentDiv").style("width","410px").style("padding","0").style("height","30px");
subDiv.style("margin","0")
.style("border-bottom-color", "#E8E7EF")
.style("border-bottom-width", "1px")
.style("border-bottom-style", "solid")
.style("height", "30px")
.style("width", "100%")
.style("padding", "10px 0 0")
.style("text-align", "center")
.style("overflow", "hidden")
.attr("class", "startPage lessarrow")
.attr("onclick", "createOverlay(\'learnmore\')")
.html("&larr;");

var secDiv = contentDiv.append("div").attr("id","kbSubCont").style("width","410px").style("padding","0 20px").style("overflow","auto");

secDiv.append("h3").attr("class", "sectionheading").attr("id", "tocMore").html("Learning (Still) More")
secDiv.append("p").html('If you need further information with the site&rsquo;s content, design or functionality, there is a complete <a target="_blank" href="http://kindred.stanford.edu/notes.html?section=userGuide">User&rsquo;s Guide</a>, a <a target="_blank" href="http://kindred.stanford.edu/notes.html?section=faq">FAQs</a> section and a <a  target="_blank" href="http://kindred.stanford.edu/notes.html?section=glossary">Glossary</a> for you to consult. Or, for brief tutorials on using the site, you can visit the <a target="_blank" href="http://www.youtube.com/channel/UCe66d9SwwEprbaa7xm0XzQA"><span class="emphasize">Kindred Britain</span> YouTube channel</a>. If you wish, you can read essays about the site by <span class="emphasize">Kindred Britain</span>&rsquo;s <a target="_blank" href="http://kindred.stanford.edu/notes.html?section=originating">compiler<a/>, <a target="_blank" href="http://kindred.stanford.edu/notes.html?section=developing">developers</a> and <a target="_blank" href="http://kindred.stanford.edu/notes.html?section=designing">designer</a> and you can see a <a target="_blank" href="http://kindred.stanford.edu/notes.html?section=statistics">statistical analysis</a>.')
secDiv.append("p").attr("class", "startPage").html('<span class="emphasize">&mdash; Nicholas Jenkins');

break;
 	}

    wrapperDiv.append("div").attr("class", "lessarrow")
    .style("margin","0")
    .style("width", "100%")
    .style("text-align", "center")
    .attr("class", "lessarrow")
    .attr("onclick", "toggleDisplay(\"kbContents\",document.getElementById(\"kbContents\"))")
    .html("&uarr;")

    resizeKBContent();

}