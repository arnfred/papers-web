define(["jquery", "model", "radio"], function ($, model, radio) {

	//////////////////////////////////////////////
	//											//
	//               Interface					//
	//											//
	//////////////////////////////////////////////
	var overlay = {};



	//////////////////////////////////////////////
	//											//
	//                Events					//
	//											//
	//////////////////////////////////////////////


	overlay.events = function () {

		/**
		 * Broadcast
		 */
		// Broadcast when the mouse enters the overlay
		$("#clickbox").hover(
			function() { radio("overlay:mouseover").broadcast(this); },
			function() { radio("overlay:mouseout").broadcast(this); }
		)

		// Broadcast when a the select field is clicked
		$("#select").click(function () { radio("node:toggleSelect").broadcast(model.current); });


		/**
		 * Subscribe
		 */

		// On Click, add the abstract etc
		radio("node:click").subscribe(showOverlay);

		// On mouseOver, cancel animation, then when the mouse leaves, 
		// restart the animation
		radio("overlay:mouseover").subscribe(cancelAnimation);
		radio("overlay:mouseout").subscribe(restartAnimation);

		// On select or deselect, change image
		radio("node:select").subscribe(setDeselect);
		radio("node:deselect").subscribe(setSelect);

	}



	//////////////////////////////////////////////
	//											//
	//           Private Functions				//
	//											//

	// Shows the small box that overlays the graph when you click on a 
	// node
	var showOverlay = function(id, e) {

		// Get node data
		var data = model.getDataFromId(id);

		// set select image
		if (model.isSelected(id)) { setDeselect(id); }
		else setSelect(id);

		// Set download link
		$("#download a").attr("href", data.pdf).attr("target", "_blank");

		// Change position of and fade in
		$("#clickwrap")
			.stop(true, true)
			.css("left",e.clientX + "px")
			.css("top", e.clientY + "px")
			.fadeIn().delay(3000).fadeOut();
	}


	// Sets the image on the overlay as selected
	var setSelect = function(id) {
		$("#select img").attr("src","img/icons/calendar.png").css("padding-top",0);	
		$("#select a").attr("title","Add to Schedule");
	}


	// Sets the image on the overlay as deselected
	var setDeselect = function() {
		$("#select img").attr("src","img/icons/remove.png").css("padding-top","2px");	
		$("#select a").attr("title","Remove from Schedule");
	}


	// Cancels the animation in case the mouse is over the overlay
	var cancelAnimation = function() {
		$("#clickwrap").stop(true,true);
	}


	// Restarts the animation for when the mouse leaves the overlay
	var restartAnimation = function() {
		$("#clickwrap").stop(true,true).delay(500).fadeOut();
	}


	// Set up various events. TODO: get rid of this
	var setupOverlay = function() {

		// Set up select
		// $("#select").click(function () { // Get index
		// 	var id = $(this).parent().parent().attr("id");

		// 	// Select or deselect paper
		// 	selectToggle(id); 

		// 	// Change image
		// 	setClickBoxImage(id);
		// });

	}


	// Initialize and set events
	setupOverlay();
	overlay.events();
	return overlay;
});
