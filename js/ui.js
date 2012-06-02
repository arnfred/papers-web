$(document).ready(function() {

	// Make search box work
	$("#searchField").keyup(function (e) { searchKeyPress(e); });

	// Make menu work
	$("#menulist li").click(function () { showInfo($(this)); return false; });

	// Make Surprise Me work
	$("#surprise").click(function () { return imFeelingLucky(); });


	// Selects all results of a particular search
	$("#selectAll").click(function () { vis.selectAll("circle.search").each( function (d,i) { select(d.index) }); });

	// Make the buttons on top of the schedule work
	setupScheduleMenu();

	// Make clickbox buttons work
	setupClickBox();

});


function setupScheduleMenu() {

	// Dropdown box
	var box		= $("<div>").addClass("scheduleSelect");

	// Contents for Download
	var hidden	= $("<input>").attr("type","hidden").attr("name","abstract").attr("value",0)
	var content	= $("<p>").html("Include Abstract?").after($("<p>").addClass("click").attr("id","getLarge").html("Yes")).after($("<p>").html("/")).after($("<p>").addClass("click").attr("id","getSmall").html("No"))
	var dl		= box.clone().append(content).append(hidden).attr("id","downloadType");

	// Contents for Remove
	var yesno	= $("<p>").addClass("click").attr("id","sureYes").html("Yes").after($("<p>").html("/")).after($("<p>").addClass("click").attr("id","sureNo").html("No"));
	var sure	= $("<p>").html("Are you sure?").after(yesno);
	var rem		= box.clone().append(sure).attr("id","sure")

	// Make remove button work
	$(".removeall").one("click", function () { 

		// Hide downloadType if open
		$("#downloadType").hide();

		// Append box
		$(".info").after(rem);

		// Fade in
		$("#sure").slideToggle("fast");

		// Rebind click event
		$(".removeall").click(function () { $("#downloadType").hide(); $("#sure").slideToggle("fast"); });
		
		// Bind sureYes link to the deletion of all the articles
		$("#sureYes").click(function () { 
			$(".scheduleSelect").hide();
			$("li.asmListItem").map(function () { deselect($(this).attr("rel")); });
			return false;
		})

		// Close on click
		$("#sureNo").click(function () { $("#sure").slideToggle("fast"); });

	});

	// Make generate schedule button work
	$(".downpdf").one("click", function () { 

		// Hide sure if open
		$("#sure").hide();

		// Append box
		$(".info").after(dl);

		// Fade in
		$("#downloadType").slideToggle("fast");

		// Rebind click event
		$(".downpdf").click(function () { $("#sure").hide(); $("#downloadType").slideToggle("fast"); });

		// Bind getSmall link to fetching articles without abstract
		$("#getSmall").click(function () { 
			console.log("here2")
			
			// Update hidden field
			$("input[name=abstract]").attr("value",0);

			// Submit form
			document.schedule.submit(); 
			return false;

			// Scroll up
			$("#downloadType").slideToggle("fast");
		})
		
		// Bind getLarge link to fetching articles with abstract
		$("#getLarge").click(function () { 
			console.log("here")
			
			// Update hidden field
			$("input[name=abstract]").attr("value",1);

			// Submit form
			document.schedule.submit(); 
			return false;

			// Scroll up
			$("#downloadType").slideToggle("fast");
		});

		// Close on click
		$("#getLarge, #getSmall").click(function () { $(".scheduleSelect").slideToggle("fast"); });

	});
	
}

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
		select.prepend("<option value=\"" + i + "\" id=\"" + i + "\">" + truncate(this.authors + ": " + this.title,60) + "</option>"); 
	});

	// Create selectbox
    $("select[multiple]").asmSelect({ addItemTarget: 'top', sortable: true });

	// Select nodes from last session
	loadSelected();
}

function expand() {} // Nothing here

// // Expand a section to show more information
// function expand(index) {

// 	// Get data in question and list item
// 	var data = getDataFromIndex(index);
// 	var item = $("li[rel=" + index + "]");
// 	var date = new Date(parseInt(data.date));

// 	// Pictures
// 	var span
// 	var title_img	= $("<img />").attr("src", "img/icons/title3.png").attr("alt","Title").addClass("imgtitle")
// 	var authors_img	= $("<img />").attr("src", "img/icons/authors.png").attr("alt","Authors").addClass("imgauthors")
// 	var link_img	= $("<img />").attr("src", "img/icons/download.png").attr("alt","Download").addClass("imgdownload")
// 	var talk_img	= $("<img />").attr("src", "img/icons/talk.png").attr("alt","Presentation").addClass("imgpresentation")

// 	// Prepare html
// 	var ul		= $("<ul></ul>").addClass("infoList");
// 	var li 		= $("<li></li>").addClass("infoItem");
// 	var span	= $("<span></span>")
// 	var img		= span.clone().addClass("img");
// 	var label	= span.clone().addClass("label");
// 	var info	= span.clone().addClass("info");
// 	var talk	= span.clone().addClass("talk");

// 	var title	= li.clone().append(img.clone().append(title_img))
// 							.append(info.clone().append(data.title));

// 	var authors	= li.clone().append(img.clone().append(authors_img))
// 							.append(info.clone().append(data.authors));

// 	var talk	= li.clone().append(img.clone().append(talk_img))
// 							.append(info.clone().append(date.format("HH:MM") + " on " + date.format("dddd mmm d, yyyy")));

// 	var url		= li.clone().append(img.clone().append(link_img))
// 							.append(info.clone().append($("<a></a>").attr("href",data.pdf).append("Full Article")));

// 	var list	= ul.append(title).append(authors).append(talk).append(url).append(li).hide();

// 	// Add html to element
// 	item.append(list);

// 	// Show list
// 	list.slideDown(function () {
// 		// swap icons
// 		item.children(".expandArrow").hide();
// 		item.children(".contractArrow").show();
// 	});

// }

// // Contract a section to show less information
// function contract(index) {
// 	// Get element
// 	var item = $("li[rel=" + index + "]");

// 	// Hide info
// 	item.children("ul").slideUp(function () {
// 		// swap icons
// 		item.children(".contractArrow").hide();
// 		item.children(".expandArrow").show();
// 		item.children("ul").remove();
// 	});

// }

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

	setAbstract(node)

	// Set abstract to loading
	// setAbstract(node, "<img src=\"img/ajax-loader_dark.gif\"/> Loading Abstract ...");

	// // Fetch Abstract
	// $.get("ajax.php", { task: "abstract", id: index }, function (data) { setAbstract(node, data); });

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
	if (!node.classed("selected")) {
		$("#select img").attr("src","img/icons/calendar.png").css("padding-top",0);	
		$("#select a").attr("title","Add to Schedule");
	}
	else {
		$("#select img").attr("src","img/icons/remove.png").css("padding-top","2px");	
		$("#select a").attr("title","Remove from Schedule");
	}
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

}

function setAbstract(node) {
	
	// Default abstract
	var abstr		= node.attr("abstract");
	
	// get time, date and room
	node.each(function (d) {

		// If the abstract isn't catched, fetch it
		if (abstr == null) {
			// Fetch Abstract
			$.get("ajax.php", { task: "abstract", id: d.index }, function (data) { 
				$("#infoAbstract").html(data); 
				node.attr("abstract",data);
			});
			abstr = "<img class=\"loading\" src=\"img/ajax-loader_dark.gif\" style=\"margin:3px 0\"/><span class=\"loading-text\">Loading Abstract...</span>";
		}

		// Prepare other variables
		var date		= new Date(parseInt(d.date));
		var time		= date.format("HH:MM") + " on " + date.format("dddd mmm d, yyyy");
		var room		= "&nbsp;Room " + d.room + "";
		var title		= d.title;
		var authors		= "By " + d.authors;

		var html		= "<p class=\"ii\" id=\"infoTitle\">" + title + "</p>";
		html		   += "<p class=\"ii\" id=\"infoAuthors\">" + authors + "</p>";
		html		   += "<p class=\"ii\" id=\"infoAbstract\">" + abstr + "</p>";
		html		   += "<p class=\"ii\" id=\"infoRoom\">" + room + "</p>";
		html		   += "<p class=\"ii\" id=\"infoTime\">" + time + ", </p>";
		html		   += "<br class=\"clear\"/>";


		// Append html
		$("#info").stop(true,true).fadeIn().html(html);
	})

	
}
