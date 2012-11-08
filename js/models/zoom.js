// To be use along radio to avoid passing its reference from object ot object


define(["lib/d3", "radio"], function (d3, radio) {
	
	
	// Create a zoom behavior:
	var zoom = d3.behavior.zoom();
	
	// Track the position:
	zoom.pos = {};
	zoom.pos.x = 0;
	zoom.pos.y = 0;
	zoom.pos.s = 0;
	zoom.canvas = null;
	zoom.init = function(_canvas){
		
		zoom.canvas = _canvas;
		
		// Publish event:
		zoom.on("zoom", function() {
			
			var e = d3.event;
			var transform = e.translate;
			var scale = e.scale;
			
			 zoom.canvas.attr("transform",
			 	 "translate(" + transform + ")"
			 		+ " scale(" + scale + ")");
			 
			 zoom.pos.x = transform[0];
			 zoom.pos.y = transform[1];
			 zoom.pos.s = scale;
		});
		
		// Prototype style!
		return zoom;
	}
	return zoom;
});