//////////////////////////////////////////////
//											//
//            Events of the links			//
//											//
//////////////////////////////////////////////


define(["lib/d3", "radio", "util/array"], function(d3, radio, arrrr) {
	
	
	// GLOBAL VARIABLES: 

	var nodes = null, // Global variable of the nodes
		zoomer = null,
	    events = {};
	    
	    
    // Function that subscribe node event the 
	events.init = function (_nodes, _zoomer) {
		
		
		// Stupid initializer for nodes:
		nodes = _nodes;
		zoomer = _zoomer;
		/**
		 * Subscribe
		 */

		// On lino click, we jump to the next link	
		 radio("node:click").subscribe(makeLinkclickable);

		// 
		 // On node mouseover
		// radio("link:mouseover").subscribe(hover);

		 // On node mouseout
		// radio("link:mouseout").subscribe(hoverOut);

		 
		 
	} // End of events initilization
	
	
	var jump = function(idCurrent, idTarget){
	
			
	
			var currentNode = nodes[idCurrent],
				nextNode = nodes[idTarget];
			
			console.log('ok');
			zoomer.translate([nextNode.pos.x, nextNode.pos.y]);
	
		}
	
	var hover = function() {
		//TODO
	}
	
	var hoverOut = function() {
		//TODO
	}
	
	return events;
});