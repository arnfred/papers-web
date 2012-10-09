define(["jquery", "graph", "model", "radio"], function ($, graph, model, radio) {

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


		/**
		 * Subscribe
		 */

		// On Click, add the abstract etc
		radio("node:click").subscribe(showOverlay);

		// On mouseOver, cancel animation, then when the mouse leaves, 
		// restart the animation
		radio("overlay:mouseover").subscribe(cancelAnimation);
		radio("overlay:mouseout").subscribe(restartAnimation);

	}



	//////////////////////////////////////////////
	//											//
	//           Private Functions				//
	//											//

	// Shows the small box that overlays the graph when you click on a 
	// node
	var showOverlay = function(id) {

		// Get node
		var node = graph.getNodeFromId(id);

		// set image
		setOverlayImage(id, node);

		// Set download link
		node.each(function (d) { $("#download a").attr("href", d.pdf).attr("target", "_blank"); });
			
		// Change position of and fade in
		// TODO: set position after cursor
		pos = $(node[0][0]).position();
		$("#clickwrap")
			.stop(true, true)
			.css("left",pos.left + 5 + "px")
			.css("top", pos.top + 6 + "px")
			.fadeIn().delay(3000).fadeOut();
	}


	// The function which is called when we click on the select or 
	// remove. This function is set by 'setSelect'.
	var select = function () { /* Nothing here */ };

	// Sets the image on the overlay depending on whether it's selected
	var setSelect = function(id, node) {

		// Check if node is selected
		if (!node.classed("selected")) {
			$("#select img").attr("src","img/icons/calendar.png").css("padding-top",0);	
			$("#select a").attr("title","Add to Schedule");
			select = function() { radio("node:select".broadcast(id); };
		}
		else {
			$("#select img").attr("src","img/icons/remove.png").css("padding-top","2px");	
			$("#select a").attr("title","Remove from Schedule");
			select = function() { radio("node:deselect".broadcast(id); };
		}
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
		$("#select").click(function () { 
			// Get index
			var id = $(this).parent().parent().attr("id");

			// Select or deselect paper
			selectToggle(id); 

			// Change image
			setClickBoxImage(id);
		});

	}


	// Initialize and set events
	setupOverlay();
	overlay.events();
	return overlay;
});
