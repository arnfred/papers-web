define(["jquery", "radio", "util/truncate", "util/array", "util/screen", 'js!lib/jquery/jquery-ui-1.9.1.custom.min.js!order',"js!lib/jquery/multiselect!order"], function($, radio, truncate, arrrr, screen, tabbbb) {

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
		radio("node:focus").subscribe(setFocus);

		// Select node
		radio("node:schedule").subscribe(schedule);

		// unscheduled node
		radio("node:unschedule").subscribe(unschedule);

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
		
		// Set up form handler for the filters:
		$("#context-select")
		   .multiselect({
		      noneSelectedText: 'Add some context to filter',
		      selectedList: 4
		   });
		   //.multiselectfilter();
		 $('button.ui-multiselect').css('width', '100%');
		
		// Set up the calendar:
		$( ".date_picker2" ).each(function () { 
					$(this).datepicker({ buttonImage: "./img	/calendar_gray.png", 
										 buttonImageOnly: true, 
										 showOn: "button",
										 constrainInput: false
									}); 
					});
		
	}



	//////////////////////////////////////////////
	//											//
	//             Private Functions			//
	//											//
	//////////////////////////////////////////////
	

	/**
	 * Updates the list with the current element
	 */
	var setFocus = function (node) {

		// Removes current from last list item
		$(".listItem.current").removeClass("current");

		// Adds curren to the current list item
		$("#" + node.id).addClass("current");
	}



	/**
	 * What happens when a node is scheduled
	 */
	var schedule = function(node) {

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
		setFocus(node);

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
	var unschedule = function(node) {

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

		radio("node:unscheduleall").broadcast();
	}



	// Export the controller
	sidebar.init();
	return sidebar;
})
