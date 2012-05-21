$(document).ready(function() {

	// Make search box work
	$("#searchField").keyup(function (e) { searchKeyPress(e); });

	// Make menu work
	$("#menulist li").click(function () { showInfo($(this)); return false; });

	// Make Surprise Me work
	$("#surprise").click(function () { return imFeelingLucky(); });

	// Make remove button work
	$(".removeall").click(function () { 
		$("li.asmListItem").map(function () { deselect($(this).attr("rel")); });
		return false;
	});

	// Make generate schedule button work
	$(".downpdf").click(function () { document.schedule.submit(); return false; });

	// Selects all results of a particular search
	$("#selectAll").click(function () { vis.selectAll("circle.search").each( function (d,i) { select(d.index) }); });

	// Make clickbox buttons work
	setupClickBox();

});

function showInfo(menuitem) {

	// Remove current class from former current menu item
	$(".currentInfo").removeClass("currentInfo");

	// Get box
	box = $("#" + menuitem.attr("class"))
	boxmm = box.add(".move");

	// set current class on currently active link
	menuitem.addClass("currentInfo");

	// If this box is already visible, hide it and remove class
	if (box.is(":visible")) {
		boxmm.slideUp();
		menuitem.removeClass("currentInfo");
	}

	// If some box is already visible, replace it with new one
	else if ($(".desc").is(":visible")) {
		$(".desc:visible").hide();
		box.show();
	}

	// Else slide it down
	else boxmm.slideDown();
}


function searchKeyPress(e) {

	var delay = (function(){
		var timer = 0;
		return function(callback, ms){
			clearTimeout (timer);
			timer = setTimeout(callback, ms);
		};
	})();

	// Get field and term
	field 	= $("#searchField");
	term	= field.val();

	// If enter, deselect field
	if (e.which == 13) field.blur();

	// Check that there is something in the search box
	if (term.length == "") term = "Blablabla";

	// Search for current term 
	delay( function(){ searchPaper(term); }, 200 );
}


function selectInit(nodes) {
	var select 	= $("#papers");
	var img		= "<img src=\"img/icons/paper.png\" />";
	$(nodes).each(function (i) { // construct an option field
		select.prepend("<option value=\"" + i + "\" id=\"" + i + "\">" + truncate(this.authors + ": " + this.title,50) + "</option>"); 
	});

	// Create selectbox
    $("select[multiple]").asmSelect({ addItemTarget: 'top', sortable: true });

	// Select nodes from last session
	loadSelected();
}


// Expand a section to show more information
function expand(index) {

	// Get data in question and list item
	var data = getDataFromIndex(index);
	var item = $("li[rel=" + index + "]");
	var date = new Date(parseInt(data.date));

	// Pictures
	var span
	var title_img	= $("<img />").attr("src", "img/icons/title3.png").attr("alt","Title").addClass("imgtitle")
	var authors_img	= $("<img />").attr("src", "img/icons/authors.png").attr("alt","Authors").addClass("imgauthors")
	var link_img	= $("<img />").attr("src", "img/icons/download.png").attr("alt","Download").addClass("imgdownload")
	var talk_img	= $("<img />").attr("src", "img/icons/talk.png").attr("alt","Presentation").addClass("imgpresentation")

	// Prepare html
	var ul		= $("<ul></ul>").addClass("infoList");
	var li 		= $("<li></li>").addClass("infoItem");
	var span	= $("<span></span>")
	var img		= span.clone().addClass("img");
	var label	= span.clone().addClass("label");
	var info	= span.clone().addClass("info");
	var talk	= span.clone().addClass("talk");

	var title	= li.clone().append(img.clone().append(title_img))
							.append(info.clone().append(data.title));

	var authors	= li.clone().append(img.clone().append(authors_img))
							.append(info.clone().append(data.authors));

	var talk	= li.clone().append(img.clone().append(talk_img))
							.append(info.clone().append(date.format("HH:MM") + " on " + date.format("dddd mmm d, yyyy")));

	var url		= li.clone().append(img.clone().append(link_img))
							.append(info.clone().append($("<a></a>").attr("href",data.pdf).append("Full Article")));

	var list	= ul.append(title).append(authors).append(talk).append(url).append(li).hide();

	// Add html to element
	item.append(list);

	// Show list
	list.slideDown(function () {
		// swap icons
		item.children(".expandArrow").hide();
		item.children(".contractArrow").show();
	});

}

// Contract a section to show less information
function contract(index) {
	// Get element
	var item = $("li[rel=" + index + "]");

	// Hide info
	item.children("ul").slideUp(function () {
		// swap icons
		item.children(".contractArrow").hide();
		item.children(".expandArrow").show();
		item.children("ul").remove();
	});

}

// Saves the selected papers
function saveSelected() {
	// get ids
	var ids = $("li.asmListItem").map(function () { return $(this).attr("rel"); });
	
	// get current
	var cur = $("li.current").attr("rel");

	// Save ids and current
	$.cookie("selected", $.makeArray(ids).reverse().join(","), { expires: 365 });
	$.cookie("current", cur, { expires: 365 });

	// If there is no current, delete current cookie
	if (cur == undefined) $.cookie("current", null);
	
}

// Load selected papers
function loadSelected() {
	// get strings
	var txt = $.cookie("selected");
	var cur = $.cookie("current")
	var ids = txt ? txt.split(",") : [];

	// For each id, load it to the list
	for (i = 0; i < ids.length; i++) {
		if (!isNaN(parseInt(ids[i]))) select(ids[i]);
	}

	if (cur != null) select(parseInt(cur));
}


// What happens when we click on a node
function nodeClick(data) {

	// Get index and node
	var index = data.index;
	var node = getNodeFromIndex(index);

	// Set abstract to loading
	$("#clickwrap").attr("abstract", "Loading abstract ...");

	// Read abstract from server and save it
	$.get("ajax.php",{ task: "abstract", id: index }, function (data) { 
		node.attr("abstract", data); });

	// Set current index in clickwrap (stupid html javascript content swapping)
	$("#clickwrap").attr("index",index);

	// If node is selected, change image to Remove
	setClickBoxImage(index);

	// Set download link
	node.each(function (d) { $("#download a").attr("href", d.pdf); });
		
	// Change position of and fade in
	pos = $(node[0][0]).position();
	$("#clickwrap")
		.stop(true, true)
		.css("left",pos.left + 5 + "px")
		.css("top", pos.top + 6 + "px")
		.fadeIn().delay(3000).fadeOut();

}

function setClickBoxImage(index) {
	// Get node
	var node = getNodeFromIndex(index);

	// Check if node is selected
	if (!node.classed("selected"))
		$("#select img").attr("src","img/icons/calendar.png").css("padding-top",0);	
	else
		$("#select img").attr("src","img/icons/remove.png").css("padding-top","2px");	
}


function setupClickBox() {

	// Make sure box doesn't dissappear before the mouse leaves
	$("#clickwrap").hover(function () { $(this).stop(true,true); }, function () { $(this).stop(true,true).delay(500).fadeOut(); })

	// Set up select
	$("#select").click(function () { 
		// Get index
		var index = $(this).parent().parent().attr("index");

		// Select or deselect paper
		selectToggle(index); 

		// Change image
		setClickBoxImage(index);
	});

	// Set up abstract
	$("#abstract").click(function () {

		// Get index and node
		var index	= $("#clickwrap").attr("index");
		var node	= getNodeFromIndex(index);

		// Check if abstract is cached, if not, get it
		if (node.attr("abstract") == null) {
			$.get("ajax.php", { task: "abstract", id: index }, function (data) { setAbstract(node, data); });
		}

		// If abstract is cached, just set it
		else setAbstract(node, node.attr("abstract"))
	})
}

function setAbstract(node, abstract) {
	
	// get time, date and room
	node.each(function (d) {
		var date		= new Date(parseInt(d.date));
		var time		= date.format("HH:MM") + " on " + date.format("dddd mmm d, yyyy");
		var room		= "&nbsp;Room " + d.room + "";
		var title		= d.title;
		var authors		= "By " + d.authors;

		var html		= "<p class=\"ii\" id=\"infoTitle\">" + title + "</p>";
		html		   += "<p class=\"ii\" id=\"infoAuthors\">" + authors + "</p>";
		html		   += "<p class=\"ii\" id=\"infoAbstract\">" + abstract + "</p>";
		html		   += "<p class=\"ii\" id=\"infoRoom\">" + room + "</p>";
		html		   += "<p class=\"ii\" id=\"infoTime\">" + time + ", </p>";
		html		   += "<br class=\"clear\"/>";

		// Append html
		$("#info").stop(true,true).fadeIn().html(html);
	})
}

Function.prototype.partial = function(){
	var fn = this, args = Array.prototype.slice.call(arguments);
	return function(){
		var arg = 0;
		for ( var i = 0; i < args.length && arg < arguments.length; i++ )
			if ( args[i] === undefined )
				args[i] = arguments[arg++];
	return fn.apply(this, args);
	};
};
