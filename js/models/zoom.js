// To be use along radio to avoid passing its reference from object ot object


define(["lib/d3", "radio"], function (d3, radio) {
	
	
	// Create a zoom behavior:
	var zoom = d3.behavior.zoom();
	zoom.pos.x = 0;
	zoom.pos.y = 0;
	zoom.pos.s = 0;
	zoom.init = function(){
		// Publish event:
		zoom.on("zoom", function() {
			
			var e = d3.event;
			var transfrom = e.translate;
			var scale = e.scale;
			
			zoom.pos.x = transfrom[0];
			zoom.pos.y = transfrom[1];
			zoom.pos.s = scale;
			
			radio("zoom:change").broadcast(transform, scale, e);
		});
	}
	return zoom;
});