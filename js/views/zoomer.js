define(["jquery", "radio", "params", "models/zoom", 'js!lib/jquery/jquery-ui-1.9.1.custom.min.js!order'], function($, radio, config, zoom) {

	
	/////////////////////////////////////////////
	//											//
	//               Interface					//
	//											//
	//////////////////////////////////////////////
	var zoomer = {};

	zoomer.pos
	//////////////////////////////////////////////
	//											//
	//                Events					//
	//											//
	//////////////////////////////////////////////
	
	zoomer.events = function () {
	
		/**
		 * Broadcast
		 */
	
	
	
		/**
		 * Subscribe
		 */
	
		radio("zoom:change").subscribe(changeZoomer);
	}
	
	
	//////////////////////////////////////////////
	//											//
	//                  Init					//
	//											//
	//////////////////////////////////////////////
	
	zoomer.init = function() {
		
		// Set parameter
		zoomer.wrapper = $('#zoomer');
		zoomer.height = $('#scale').css('height').replace(/[^-\d\.]/g, '');
		zoomer.isDragging = false;
		zoomer.increment =  (config['zoomMax'] - config['zoomMin']) / config['nbIncrement'];
		
		// Place initially:
		changeZoomer();
		
		// Set up the UI:
		$( "#indicator" ).draggable({ axis: "y", containment: $("#scale"), drag: updateZoom, start: function() { zoomer.isDragging = true; }, stop: function() { zoomer.isDragging = false; }});
		
		
		// Plus:
		$( "#zoomer .plus" ).on('click', function() {
			zoom.moveTo(zoom.pos.s + zoomer.increment, [zoom.pos.x, zoom.pos.y]);
		});
		
		// Minus:
		$( "#zoomer .moins" ).on('click', function() {
			zoom.moveTo(zoom.pos.s - zoomer.increment, [zoom.pos.x, zoom.pos.y]);
		});
		
		
		// Set event:
		zoomer.events();
	
	}
	
	var changeZoomer = function() {
	
		if(!zoomer.isDragging)
			$('#indicator').css('top', getPosition(zoom.pos.s) );
	
	}
	
	// Update the zoom to follow the indicator:s
	var updateZoom = function(event, ui) {
		//zoomer.isDragging = true;
		var s = $('#indicator').css('top').replace(/[^-\d\.]/g, '')/zoomer.height*config['zoomMax']+config['zoomMin'];
		zoom.moveTo(s, [zoom.pos.x, zoom.pos.y]);
		//console.log(ui.offset.top);
	
	}
	
	var getPosition = function(t){

		return zoomer.height * (t - config['zoomMin'])/config['zoomMax'];
		
	}
	
	
	
	
	// Export the controller
	zoomer.init();
	return zoomer;

});