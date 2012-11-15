define(["jquery", "radio", "models/nodes", "util/truncate", "util/array", "util/screen", 'js!lib/jquery/jquery-ui-tabs.min.js!order'], function($, radio, model, truncate, arrrr, screen, tabbbb) {

	//////////////////////////////////////////////
	//											//
	//               Interface					//
	//											//
	//////////////////////////////////////////////
	var sidebar = {};


	//////////////////////////////////////////////
	//											//
	//                Events					//
	//											//
	//////////////////////////////////////////////
	

	sidebar.events = function () {

		/**
		 * Broadcast
		 */



		/**
		 * Subscribe
		 */

		// Current node
		radio("node:current").subscribe(setCurrent);

		// Select node
		radio("node:scheduled").subscribe(scheduled);

		// unscheduled node
		radio("node:unscheduled").subscribe(unscheduled);

		// On unscheduled all nodes, we should close "are you sure?"
		radio("sidebar:removeAll").subscribe(removeAll);

		// on hover in the sidebar, broadcast node:current
		radio("sidebar:hover").subscribe(function (id, e) { 
			radio("node:mouseover").broadcast(id, e);
		});

		// when we click remove in the sidebar, unscheduled the item
		radio("sidebar:remove").subscribe(function (id, e) { 
			radio("node:unscheduled").broadcast(id, e);
		});

	}


	//////////////////////////////////////////////
	//											//
	//                  Init					//
	//											//
	//////////////////////////////////////////////

	
	/**
	 * Initializes the sidebar plus events
	 * TODO: Break this function up to smaller bits and pull the events 
	 * out
	 */
	sidebar.init = function() {

		// Make remove button work
		$(".removeall").click( function() { removeVerify(); });

		// Close "Are you sure" on click on "No"
		$("#sureNo").click(function () { $("#sure").slideToggle("fast"); });

		// unscheduled all nodes
		$("#sureYes").click(function (e) { radio("sidebar:removeAll").broadcast(e); });

		// Make generate schedule button work
		$(".downpdf").click("click", function () { abstractVerify(); });

		// Bind getSmall link to fetching articles without abstract
		$("#getSmall").click(function () { withAbstract(0); });
		$("#getLarge").click(function () { withAbstract(1); });

		// Call events
		sidebar.events();
		
		// Set the UI height:
		$('#tabs').css('height', screen.height()-40);
		
		// Init the tabs:
		$('#tabs').tabs();
		
		
	}



	//////////////////////////////////////////////
	//											//
	//             Private Functions			//
	//											//
	//////////////////////////////////////////////
	

	/**
	 * Updates the list with the current element
	 */
	var setCurrent = function (node) {

		// Removes current from last list item
		$(".listItem.current").removeClass("current");

		// Adds curren to the current list item
		$("#" + node.id).addClass("current");
	}



	/**
	 * What happens when a node is scheduled
	 */
	var scheduled = function(node) {

		// Clone listItemTemplate
		var item = $("#listItemTemplate").clone();
		item.css("display","none");
		item.attr("id", node.id);

		// Add information
		item.find(".listItemText").html(truncate(node.title, 62));
		item.find(".listItemPdfLink").attr("href",node.pdf);
		item.find("input").attr("value", node.id);

		// Add it to the list
		$("#sidebar").append(item);

		// Set it as the current element
		setCurrent(node);

		// Fade in
		$(".info, #" + node.id).fadeIn("fast");

		// Add mouseover event
		item.mouseover(function (e) { 
			radio("sidebar:hover").broadcast(node,e); 
		});

		// Add remove event
		item.find(".listItemRemove").click(function (e) { 
			radio("sidebar:remove").broadcast(node,e); 
		});
	}


	/**
	 * What happens when a node is scheduled
	 */
	var unscheduled = function(node) {

		// Get item
		var item = $("#" + node.id);

		// Fade out and delete
		item.fadeOut("fast", function() { 

			// If the list is empty, fade out the info box too
			if ($(".listItem:visible").length == 0) {
				$(".info").fadeOut("fast");
				$("#sure").fadeOut("fast");
			}

			// Remove the jquery item from the DOM
			item.remove(); 
		});
	}

	/**
	 * Prompts the user if the want to remove all nodes from list
	 */
	var removeVerify = function() {

		// Hide downloadType if open
		$("#downloadType").hide();

		// Fade in
		$("#sure").slideToggle("fast");
	}


	/**
	 * Promps the user if they want to include an abstract with the pdf
	 */
	var abstractVerify = function() {

		// Hide sure if open
		$("#sure").hide();

		// Fade in
		$("#downloadType").slideToggle("fast");
	}


	/**
	 * What happens when we click on getSmall
	 */
	var withAbstract = function(n) {

		// Update hidden field
		$("input[name=abstract]").attr("value",n);

		// Submit form
		document.schedule.submit(); 

		// Scroll up
		$("#downloadType").slideToggle("fast");
	}




	/**
	 * Removes all nodes from list
	 */
	var removeAll = function() {

		// Hide the scheduleselect box
		//$(".scheduleSelect").slideToggle("fast");

		// Get all selected nodes
		var scheduled = model.scheduled;

		// Call unscheduled signal for all nodes in the list
		scheduled.map(function (s) { radio("node:unscheduled").broadcast(s); })
	}



	// Export the controller
	sidebar.init();
	return sidebar;
})
