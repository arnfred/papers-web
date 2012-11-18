define(["jquery", "radio", "util/truncate", "util/array", "util/screen", 'js!lib/jquery/jquery-ui-1.9.1.custom.min.js!order',"js!lib/jquery/multiselect!order", 'js!lib/jquery/jquery.transit.min.js!order'], function($, radio, truncate, arrrr, screen, tabbbb) {

	//////////////////////////////////////////////
	//											//
	//               Interface					//
	//											//
	//////////////////////////////////////////////
	var sidebar = {};

	var isOpen = true;
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
		
		// on mouseout in the sidebar, broadcast node:current
		radio("sidebar:hoverout").subscribe(function (id, e) { 
			radio("node:mouseout").broadcast(id, e);
		});

		// when we click remove in the sidebar, unscheduled the item
		radio("sidebar:remove").subscribe(function (id, e) { 
			radio("node:unschedule").broadcast(id, e);
		});
		
		// Hide the sidebar
		radio("sidebar:hide").subscribe(hide);
		
		// Show the sidebar
		radio("sidebar:show").subscribe(show);

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

		// Make generate schedule button work
		$(".downpdf").click("click", function () { abstractVerify(); });
		
		// Make generate schedule button work
		$(".downicn").click("click", function () { alert('Feature will come soon'); });

		// Call events
		sidebar.events();
		
		// Set the UI height:
		$('#tabs').css('height', screen.height()-40);
		
		// Init the tabs:
		$('#tabs').tabs();
		
		// Make sidebar open and close working:
		$("#closeSidebar").click( function() { toggleSidebar(); });
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
		
		// Add mouseout event
		item.mouseout(function (e) { 
			radio("sidebar:hoverout").broadcast(node,e); 
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
		if(confirm("Are you sure? ")) radio("sidebar:removeAll").broadcast(e);
	}


	/**
	 * Promps the user if they want to include an abstract with the pdf
	 */
	var abstractVerify = function() {
		
		var abst = (confirm("Do you want to include abstract of the papers? ")) ? 1: 0 ;
		withAbstract(abst);
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

	
	/**
	 * Open or close the sidebar
	 */
	var toggleSidebar = function() {
		if(isOpen){
			radio("sidebar:hide").broadcast();
			isOpen = false;
		}else{
			radio("sidebar:show").broadcast();
			isOpen = true;
		}
	}
	
	/**
	 * Hide the side bar
	 */
	
	var hide = function() {
		$('#tabs').animate({"left": "-310px"}, 300);
		$('#closeSidebar').animate({"left": "0px"}, 300);
		$('#closeSidebar div').transition({ rotate: '0deg' });
	}
	
	/**
	 * Show the side bar
	 */
	 
	 var show = function() {
	 	$('#tabs').animate({"left": "0px"}, 300);
	 	$('#closeSidebar').animate({"left": "310px"}, 300);
	 	$('#closeSidebar div').transition({ rotate: '180deg' });
	 }
	

	// Export the controller
	sidebar.init();
	return sidebar;
})
