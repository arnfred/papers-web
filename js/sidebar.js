define(["jquery", "radio"], function($) {

	//////////////////////////////////////////////
	//											//
	//               Interface					//
	//											//
	//////////////////////////////////////////////
	var sb = {};


	//////////////////////////////////////////////
	//											//
	//                Events					//
	//											//
	//////////////////////////////////////////////
	
	// On nodeclick, make sure the current node is selected in the graph
	radio("node:click").subscribe([sb.setCurrent, sb]);

	
	/**
	 * Initializes the sidebar plus events
	 * TODO: Break this function up to smaller bits and pull the events 
	 * out
	 */
	sb.init = function() {

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


	/**
	 * Add a list of nodes to the selectbox (done in the beginning)
	 * TODO: changes the nodes argument to be an array of ints
	 * TODO: Remember to call this function, probably from the ui
	 */
	sb.addNodes = function(nodes) {
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
	/**
	 * When a user clicks on an element in the list, this is the 
	 * function called
	 */
	sb.showElement = function(menuitem) {

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

	/**
	 * Sets the node of [index] to current and adds a click event
	 */
	sb.setCurrent = function (index, pdf) {

		var newNode	= $("li[rel=" + index + "]");
		var oldNode	= $("li.current");

		// Update the class
		oldNode.current").removeClass("current");
		newNode.addClass("current");

		// Add click event
		newNode.click(function() { window.open(pdf); });
	}


	/**
	 * What happens when we click on an item in the list
	 */
	sb.select = function(index) {

		// So far we just set it as Current
		// TODO: Fix the pdf
		this.setCurrent(index, "link/to/pdf");
	}


	/**
	 * Old function used to expand the items in the sidebar to reveal 
	 * more information
	 */
	sb.expand = function() {} // Nothing here

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


	// Export the controller
	return sb;
}
