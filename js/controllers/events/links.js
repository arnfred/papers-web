//////////////////////////////////////////////
//											//
//            Events of the links			//
//											//
//////////////////////////////////////////////


define(["lib/d3", "radio", "util/array"], function(d3, radio, arrrr) {
	
	
	// GLOBAL VARIABLES: 

	var nodes = null, // Global variable of the nodes
		canvas = null,
	    events = {};

	    
    // Function that subscribe node event the 
	events.init = function (_nodes, _canvas) {
		
		
		// Stupid initializer for nodes:
		nodes = _nodes;
		canvas = _canvas;
		/**
		 * Subscribe
		 */

		// On link click, we jump to the next link	
		//radio("node:click").subscribe(makeLinkclickable);

		// 
		 // On node mouseover
		 //radio("link:mouseover").subscribe(hover);

		 // On node mouseout
		 //radio("link:mouseout").subscribe(hoverOut);

		// On link selected, color it	
		radio("link:selected").subscribe(selected);
		
		// On link selected, color it	
		radio("link:unselected").subscribe(unselected);
		
		 
	} // End of events initilization
	
	
	var selected = function(link) {
	
		// TODO: remove all previous listener
		
		var linknode = link.domlink;
		//console.log(clicked_node)
		linknode.classed('clikable', true);
			//console.log(link.domlink);
			
			/*	We cannot make a line clickable
			 *	because it is covered by other line in the DOM
			 *	and there is no way to make close line not overlap...
			 */
		 
		 // Compute the direction offset:
		 
		 // Get the vector:
		 var rx  = parseFloat(nodes[link.target].pos.x) - parseFloat(nodes[link.source].pos.x), ry  = parseFloat(nodes[link.target].pos.y) - parseFloat(nodes[link.source].pos.y);
		 		 
		 
		 
		 // Normalize it:
		 rxn = rx / Math.sqrt(rx*rx+ry*ry);
		 ryn = ry / Math.sqrt(rx*rx+ry*ry);
		 
		 //console.log(rxn*rxn+ryn*ryn);
		 
		 // Find the angle:
		 a = 180*Math.atan2(ryn, rxn)/Math.PI+90;
		 
		 //console.log(a);
		 
		 randomfact =  10+20*Math.random();
		 
		 var posx  = parseFloat(nodes[link.source].pos.x) + randomfact*rxn-2, posy  = parseFloat(nodes[link.source].pos.y) + randomfact*ryn-2;
		 
		 // Correction of the mean of the point:
		 posy = posy+2;
		 
		 posx = posx+2;
		 
		 link.clickable = canvas.insert('svg:polygon', "line:first-child")
		 						.attr('points', '57.042,22.06 0,-5.159 -57.042,22.06 -57.042,5.159 0,-22.06 57.042,5.159')
		 						//.attr('height', 4)
		 						//.attr('width', 4)
		 						.attr('fill', '#FF0000')
		 						.classed('handle', true)
		 						.attr('transform', "translate("+posx+", "+posy+") scale("+0.1+") rotate("+a+")" );
		 						//.attr('y', );
		
		link.clickable.on('click', function () { 
				
				radio('node:unselect').broadcast(link.source);
				
				radio('node:setfocus').broadcast(link.target);
				radio('node:select').broadcast(link.target); 
				
				} );


			
	}
	var unselected = function(link) {
		
		link.clickable.remove();
		link.domlink.classed('clikable', false);
	
	}
		
	var hover = function() {
		//TODO
	}
	
	var hoverOut = function() {
		//TODO
	}
	
	return events;
});
