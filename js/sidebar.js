define(["jquery", "radio", "model", "util/truncate"], function($, radio, model, truncate) {

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
		radio("node:select").subscribe(select);

		// Deselect node
		radio("node:deselect").subscribe(deselect);

		// On deselect all nodes, we should close "are you sure?"
		radio("sidebar:removeAll").subscribe(function () { $(".scheduleSelect").hide(); });
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

		// Deselect all nodes
		$("#sureYes").click(function (e) { radio("sidebar:removeAll").broadcast(e); });

		// Make generate schedule button work
		$(".downpdf").click("click", function () { abstractVerify(); });

		// Bind getSmall link to fetching articles without abstract
		$("#getSmall").click(function () { withAbstract(0); });
		$("#getLarge").click(function () { withAbstract(1); });

		// Call events
		sidebar.events();
		
	}



	//////////////////////////////////////////////
	//											//
	//             Private Functions			//
	//											//
	//////////////////////////////////////////////
	

	/**
	 * Updates the list with the current element
	 */
	var setCurrent = function (id) {

		// Removes current from last list item
		$(".listItem.current").removeClass("current");

		// Adds curren to the current list item
		$("#" + id).addClass("current");
	}



	/**
	 * What happens when a node is selected
	 */
	var select = function(id) {

		// Get data from model
		var data = model.getDataFromId(id);

		// Clone listItemTemplate and fill out title
		var item = $("#listItemTemplate").clone().attr("id",id);
		item.find(".listItemText").html(truncate(data.title, 65));

		// Add it to the list
		$("#sidebar").append(item);

		// Set it as the current element
		setCurrent(id);

		// Fade in
		$(".info, #" + id).fadeIn("fast");

		// set current
		radio("node:current").broadcast(id);
		
		// Add mouseover event
		$("#" + id).mouseover(function (e) { radio("node:current").broadcast(id); });
	}


	/**
	 * What happens when a node is selected
	 */
	var deselect = function(id) {

		// Get item
		var item = $("#" + id);

		// Fade out and delete
		item.fadeOut("fast", function() { item.remove(); });

		// If the list is empty, fade out the info box too
		if ($(".listItem:visible").length == 0) $(".info").fadeOut("fast");
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

		$(".scheduleSelect").hide();
		return false;
	}



	// Export the controller
	sidebar.init();
	return sidebar;
})
