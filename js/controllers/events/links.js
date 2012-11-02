//////////////////////////////////////////////
//											//
//            Events of the links			//
//											//
//////////////////////////////////////////////


define(["lib/d3", "radio", "util/array", "util/screen"], function(d3, radio, arrrr, screen) {
	
	
	// GLOBAL VARIABLES: 

	var nodes = null, // Global variable of the nodes
		zoomer = null,
	    events = {};
	
	// Dimension
	var w = screen.width(),
		h = screen.height();
	    
    // Function that subscribe node event the 
	events.init = function (_nodes, _zoomer, _canvas) {
		
		
		// Stupid initializer for nodes:
		nodes = _nodes;
		zoomer = _zoomer;
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
			 var posx  = (nodes[link.source].pos.x+10);
			 var posy  = (nodes[link.source].pos.y+10);
			 link.clickable = canvas.insert('rect', "line:first-child")
			 						.attr('height', 5)
			 						.attr('width', 5)
			 						.attr('x', posx )
			 						.attr('y', posy);
			
			link.clickable.on('click', function () { jump(0, link.target) } );


			
	}
	var unselected = function(link) {
		
		link.clickable.remove();
		link.domlink.classed('clikable', false);
	
	}
	
	var jump = function(idCurrent, idTarget){
	
			
	
			var currentNode = nodes[idCurrent],
				nextNode = nodes[idTarget];
			
			console.log(nextNode.pos.x+ " " + nextNode.pos.y);
			
			// What is the scale?
			var factor = zoomer.pos.s;
			// Compute the translation coeff
			var transx = factor * nextNode.pos.x - w/2, transy = factor * nextNode.pos.y - h/2;
			
			zoomer.translate([transx, transy]);
			zoomer.scale(factor);
			canvas.transition().attr('transform', "translate(-"+transx+", -"+transy+") scale("+factor+")");
	
		}
	
	var hover = function() {
		//TODO
	}
	
	var hoverOut = function() {
		//TODO
	}
	
	return events;
});