// To be use along radio to avoid passing its reference from object ot object


define(["lib/d3", "radio"], function (d3, radio) {
	
	
	// Create a zoom behavior:
	var zoom = d3.behavior.zoom();
	
	// Track the position:
	zoom.pos = {};
	zoom.pos.x = 100;
	zoom.pos.y = -200;
	zoom.pos.s = 1.5;
	zoom.canvas = null;
	zoom.init = function(_canvas){
		
		zoom.canvas = _canvas;
		
		
		
		
		// Publish event:
		zoom.on("zoom", function() {
			
			var e = d3.event;
			var transform = e.translate;
			var scale = e.scale;
			
			zoom.moveTo(scale, transform);
			 
		});
		
		
		//Initializing position:
		
		zoom.translate([zoom.pos.x, zoom.pos.y]);
		zoom.scale(zoom.pos.s);
		
		transitionTo();
		
		// Prototype style!
		return zoom;
	}
	
	
	//////////////////////////////////////////////
	//											//
	//            Public Functions				//
	//											//
	//////////////////////////////////////////////
	
	// Move the canvas to the new position:
	zoom.moveTo = function(scale, transform){
	
		
		
		setValue(scale, transform);
		goTo();
	} 
	
	// Manually move the canvas to the new position:
	zoom.transitionTo = function(scale, transform){
		
		setValue(scale, transform);
		
		// Update the zoom with new position:
		zoom.translate(transform);
		zoom.scale(scale);
		
		
		
		transitionTo();
	
	}
	
	//////////////////////////////////////////////
	//											//
	//            private Functions				//
	//											//
	//////////////////////////////////////////////
	var setValue = function(scale, transform) {
		zoom.pos.x = transform[0];
		zoom.pos.y = transform[1];
		zoom.pos.s = scale;
	}
	
	
	var goTo = function() {
		
		zoom.canvas.attr("transform", "translate(" + zoom.pos.x + ", "+zoom.pos.y+") scale(" + zoom.pos.s + ")");
		
	}
	
	var transitionTo = function() {
		
		// Smooth transition of the canvas to:
		zoom.canvas.transition().attr('transform', "translate("+zoom.pos.x+", "+zoom.pos.y+") scale("+zoom.pos.s+")");
	
	}
	
	return zoom;
});