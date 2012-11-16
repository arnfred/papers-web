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
		radio("node:select").subscribe(select);
		
		// On link selected, color it	
		radio("node:unselect").subscribe(unselect);
		
		 
	} // End of events initilization
	
	
	var select = function(node) {
	
		// Find all edges belonging to old current node and update them
				
		
		// Find all edges belinging to current node and update them
		node.links.forEach(function(link){
			if(link.domlink) {
				var e = d3.event;
				
				var linknode = link.domlink;
				//console.log(clicked_node)
				linknode.classed('clikable', true);
			
				showClickable(node, link)

			}
			
			
			//link.domlink.classed("selected", true);
		});
		
			
	}
	
	// Show a little clikable dom object to go from one node to second. 
	var showClickable = function(source, link) {
	
		
		 // Compute the direction offset:
		 
		 // Get the vector:
		 var rx  = parseFloat(link.target.pos.x) - parseFloat(source.pos.x), ry  = parseFloat(link.target.pos.y) - parseFloat(source.pos.y);
		 		 
		 
		 
		 // Normalize it:
		 rxn = rx / Math.sqrt(rx*rx+ry*ry);
		 ryn = ry / Math.sqrt(rx*rx+ry*ry);
		 
		 //console.log(rxn*rxn+ryn*ryn);
		 
		 // Find the angle:
		 a = 180*Math.atan2(ryn, rxn)/Math.PI+90;
		 
		 //console.log(a);
		 
		 randomfact =  10+20*Math.random();
		 
		 var posx  = parseFloat(source.pos.x) + randomfact*rxn-2, posy  = parseFloat(source.pos.y) + randomfact*ryn-2;
		 
		 // Correction of the mean of the point:
		 posy = posy+2;
		 
		 posx = posx+2;
		 
		 link.clickable = canvas.insert('svg:polygon', "line:first-child")
		 						.attr('points', '-33.001,24.991 0,18.687 33,24.991 -0.309,-24.991') //57.042,22.06 0,-5.159 -57.042,22.06 -57.042,5.159 0,-22.06 57.042,5.159
		 						//.attr('height', 4)
		 						//.attr('width', 4)
		 						.attr('fill', '#FF0000')
		 						.classed('handle', true)
		 						.attr('transform', "translate("+posx+", "+posy+") scale("+0.1+") rotate("+a+")" );
		 						//.attr('y', );
		
		
		link.clickable.on('click', function () { 
				
				radio('node:unselect').broadcast(source);

				
				radio('node:setfocus').broadcast(link.target);
				radio('node:select').broadcast(link.target); 
				
		} );
	
	}
	// remove all the clickable item of the old node.
	var unselect = function(node) {
		node.links.forEach(function(link){
			//if(link.domlink) {
				var e = d3.event;
				link.clickable.remove();
				link.domlink.classed('clikable', false);
			//}
		});
	}
		
	var hover = function() {
		//TODO
	}
	
	var hoverOut = function() {
		//TODO
	}
	
	return events;
});
