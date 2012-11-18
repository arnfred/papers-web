// To be use along radio to avoid passing its reference from object ot object


define(["lib/d3", "radio", 'params'], function (d3, radio, config) {
	
	
	// Create a zoom behavior:
	var zoom = d3.behavior.zoom();
	
	// Track the position:
	zoom.pos = {};
	zoom.pos.x = 100;
	zoom.pos.y = -200;
	zoom.pos.s = 1.5;
	zoom.canvas = null;
	
	
	
	// Add a custom transition for the canvas:
//	d3.interpolators.push(function(a, b) {
//	    return function(t) {
//	    
	      // Interpolation
//	      var posx = a.x + (b.x-a.x) * t;
//	      var posy = a.y + (b.y-a.y) * t;
//	      var s = a.s + (b.s-a.s) * t;
//	      
//	      setValue(s, [posx, posy]);
//
	      // Update the zoom with new position:
//	      zoom.translate([posx, posy]);
//	      zoom.scale(s);
//	      
	      // Change canvas:
//	      goTo();
//	      
//	      return [posx, posy, s];
//	    }
//	});
	
	
	
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
		
		goTo();
		
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
		
		
		// Avoid weird behavior
		//if( scale < config['zoomMax'] && scale > config['zoomMin'] ) {
			setValueManually(scale, transform);
			goTo();
		//}
	} 
	
	// Manually move the canvas to the new position:
	zoom.transitionTo = function(scale, transform){
		
		var transTo = {};
		transTo.x = transform[0];
		transTo.y = transform[1];
		transTo.s = scale;
		
		zoom.canvas.transition().tween('transform', function() {
			
			var a = zoom.pos;
			var b = transTo;
			
			return function(t) {
				    
				      // Interpolation
				      var posx = a.x + (b.x-a.x) * t;
				      var posy = a.y + (b.y-a.y) * t;
				      var s = a.s + (b.s-a.s) * t;
				      
				      
				      setValueManually(s, [posx, posy]);
				      
				      // Change canvas:
				      goTo();
				      return null; //"translate(" + posx + ", "+posy+") scale(" + s + ")";
				   }
		});
		
		//transitionTo();
	
	}
	
	//////////////////////////////////////////////
	//											//
	//            private Functions				//
	//											//
	//////////////////////////////////////////////
	var setValue = function(scale, transform) {
		zoom.pos.x = transform[0];
		zoom.pos.y = transform[1];
		zoom.pos.s = clipScale(scale);
	}
	
	var setValueManually = function(scale, transform) {
		
		var scale = clipScale(scale);
		
		setValue(scale, [transform[0], transform[1]]);
		
       // Update the zoom with new position:
       zoom.translate(transform);
       zoom.scale(scale);
	}
	
	var clipScale = function(s){
		var s = s > config['zoomMax'] ? config['zoomMax'] : s;
		s = s < config['zoomMin'] ? config['zoomMin'] : s;
		
		
		return s;
	}
	
	var goTo = function() {
		
		radio("zoom:change").broadcast(zoom);
		zoom.canvas.attr("transform", "translate(" + zoom.pos.x + ", "+zoom.pos.y+") scale(" + zoom.pos.s + ")");
		
	}
	
	var transitionTo = function() {
		
		
		// Smooth transition of the canvas to:
		zoom.canvas.transition().attr('transform', "translate("+zoom.pos.x+", "+zoom.pos.y+") scale("+zoom.pos.s+")");
	
	}
	
	return zoom;
});