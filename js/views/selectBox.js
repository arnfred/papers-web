define(["jquery", "models/nodes", "radio"], function ($, model, radio) {

	//////////////////////////////////////////////
	//											//
	//               Interface					//
	//											//
	//////////////////////////////////////////////
	var selectBox = {};



	//////////////////////////////////////////////
	//											//
	//                Events					//
	//											//
	//////////////////////////////////////////////


	selectBox.events = function () {

		/**
		 * Broadcast
		 */
		// Broadcast when the mouse enters the selectBox
		$("#clickbox").hover(
			function() { radio("selectBox:mouseover").broadcast(this); },
			function() { radio("selectBox:mouseout").broadcast(this); }
		)

		// Broadcast when a the select field is clicked
		$("#select").click(function () { radio("node:toggleScheduled").broadcast(model.selected); });


		/**
		 * Subscribe
		 */

		// On Click, add the abstract etc
		radio("node:click").subscribe(showselectBox);

		// On mouseOver, cancel animation, then when the mouse leaves, 
		// restart the animation
		radio("selectBox:mouseover").subscribe(cancelAnimation);
		radio("selectBox:mouseout").subscribe(restartAnimation);

		// On select or deselect, change image
		radio("node:scheduled").subscribe(setUnscheduled);
		radio("node:unscheduled").subscribe(setScheduled);

	}



	//////////////////////////////////////////////
	//											//
	//           Private Functions				//
	//											//
	//////////////////////////////////////////////

	// Shows the small box that selectBoxs the graph when you click on a 
	// node
	var showselectBox = function(id, e) {

		// Get node data
		var data = model.getDataFromId(id);

		// set select image
		if (model.isScheduled(id)) { setUnscheduled(id); }
		else setScheduled(id);

		// Set download link
		$("#download a").attr("href", data.pdf).attr("target", "_blank");

		// Change position of and fade in
		$("#clickwrap")
			.stop(true, true)
			.css("left",e.clientX + "px")
			.css("top", e.clientY + "px")
			.fadeIn().delay(3000).fadeOut();
	}


	// Sets the image on the selectBox as selected
	var setScheduled = function(id) {
		$("#select img").attr("src","img/icons/calendar.png").css("padding-top",0);	
		$("#select a").attr("title","Add to Schedule");
	}


	// Sets the image on the selectBox as deselected
	var setUnscheduled = function() {
		$("#select img").attr("src","img/icons/remove.png").css("padding-top","2px");	
		$("#select a").attr("title","Remove from Schedule");
	}


	// Cancels the animation in case the mouse is over the selectBox
	var cancelAnimation = function() {
		$("#clickwrap").stop(true,true);
	}


	// Restarts the animation for when the mouse leaves the selectBox
	var restartAnimation = function() {
		$("#clickwrap").stop(true,true).delay(500).fadeOut();
	}


	// Initialize and set events
	selectBox.events();
	return selectBox;
});
