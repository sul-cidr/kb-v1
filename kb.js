$(function() {
	var urlParams;
	function parseUrlParams(){
		var match,
	        pl     = /\+/g,  // Regex for replacing addition symbol with a space
	        search = /([^&=]+)=?([^&]*)/g,
	        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
	        query  = window.location.search.substring(1);

	    urlParams = {};
	    while (match = search.exec(query))
	       urlParams[decode(match[1])] = decode(match[2]);
	}

	$(document).ready(function() {
		hideAll();
		$('#closeViewIcon').hide();
		selectSection('originating');
		parseUrlParams();

		if(urlParams && urlParams.section){
			selectSection(urlParams.section);
		}
	});

	function hideAll() {
		$('.menuItem').removeClass("selected");
		$('.contentItem').hide();
	}

	function selectSection(section){
		$('#'+section).trigger('click');
	}

	var HEADER_HEIGHT = 75;
	// workaround for resize compatibility across browsers
	$(window).load(function () {
  		$(".content").height($(window).height() - HEADER_HEIGHT);
	});
	
	// workaround for resize compatibility across browsers
	$(window).resize(function (){
		$(".content").height($(window).height() - HEADER_HEIGHT);
	});

	$('#faq').click(function() {
		hideAll();
		$('#faq').addClass("selected");
		$('#faqSection').show();
	});

	$('#userGuide').click(function() {
		hideAll();
		$('#userGuide').addClass("selected");
		$('#userGuideSection').show();
	});

	$('#statistics').click(function() {
		hideAll();
		$('#statistics').addClass("selected");
		$('#statisticsSection').show();
	});

	$('#acknowledgements').click(function() {
		hideAll();
		$('#acknowledgements').addClass("selected");
		$('#acknowledgementsSection').show();
	});

	$('#glossary').click(function() {
		hideAll();
		$('#glossary').addClass("selected");
		$('#glossarySection').show();
	});

	$('#originating').click(function() {
		hideAll();
		$('#originating').addClass("selected");
		$('#originatingSection').show();
	});

	$('#developing').click(function() {
		hideAll();
		$('#developing').addClass("selected");
		$('#developingSection').show();
	});

	$('#designing').click(function() {
		hideAll();
		$('#designing').addClass("selected");
		$('#designingSection').show();
	});
	
	$('#launchButton').click(function() {
		window.location.href = window.location = "http://kindred.stanford.edu/";
	});

	//Generate TOC using javascript and jquery

	$(document).ready(function() {
		//toc for user guide
		$("#userguide_toc").append("<ul>");

		$('#userguide_content').find('h1, h2, h3').each(function(i) {
			var current = $(this);
			current.attr("id", "ug_title" + i);
			
			$("#userguide_toc").append("<li class='" + current.prop("tagName") + "link'><a id='ug_link" + i + "' href='#ug_title" 
				+ i + "'>" + current.html() + "</a></li>");
		});
		
		$("#userguide_toc").append("</ul>");

		//

		$('#userguide_toc').append("<p>For quick explanations of technical terms, you can also consult <span class='italic'>Kindred Britain</span>’s Glossary.</p>");
	
		
		$('#faq_content').append("<ul>");
		$('#faq_content').find('h1, h2, h3').each(function(i) {
			var current = $(this);
			current.attr("id", "faq_title" + i);
			$("#faq_toc").append("<li class='" + current.prop("tagName") + "link'><a id='faq_link" + i + "' href='#faq_title" 
				+ i + "'>" + current.html() + "</a><br />");
		});

		$('#faq_toc').append("<br />");
		$('faq_toc').append("</ul>");

	});
	

});


