define(["lib/d3", "radio", "util/array", "models/nodeList", "models/graph"], function(d3, radio, arrrr, nodeList, graph) {
	
	
	// GLOBAL VARIABLES: 
	
	//////////////////////////////////////////////
	//											//
	//               Interface					//
	//											//
	//////////////////////////////////////////////
	var links = {}


	//////////////////////////////////////////////
	//											//
	//               Links Init 				//
	//											//
	//////////////////////////////////////////////

    // Function that subscribe node event the 
	links.init = function () {
		
		
		/**
		 * Subscribe
		 */

		// On link selected, add little clickable	
		radio("node:select").subscribe(select);
		
		// On link unselected, remove every thing
		radio("node:deselect").subscribe(deselect);
		
		 
	}
	


	//////////////////////////////////////////////
	//											//
	//            Private Functions				//
	//											//
	//////////////////////////////////////////////
	

	//////////////////////////////////////////////
	//											//
	//           Private Functions				//
	//											//
	//////////////////////////////////////////////

	var select = function(node) {
	
		// Find all edges belinging to current node and update them
		node.links.forEach(function(link){
			if(link.domlink) {
				var e = d3.event;
				
				var linknode = link.domlink;
				
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
		 
		 // Find the angle:
		 a = 180*Math.atan2(ryn, rxn)/Math.PI+90;
		 
		 dst = Math.sqrt(rx*rx+ry*ry);
		 randomfact =  10+ Math.sqrt(dst) + 10*Math.random();
		 
		 var posx  = parseFloat(source.pos.x) + randomfact*rxn-2, posy  = parseFloat(source.pos.y) + randomfact*ryn-2;
		 
		 // Correction of the mean of the point:
		 posy = posy+2;
		 
		 posx = posx+2;
		 
		 link.clickable = graph.canvas.insert('svg:polygon')
		 						.attr('points', '-33.001,24.991 0,18.687 33,24.991 -0.309,-24.991') //57.042,22.06 0,-5.159 -57.042,22.06 -57.042,5.159 0,-22.06 57.042,5.159
		 						//.attr('height', 4)
		 						//.attr('width', 4)
		 						.attr('fill', '#FF0000')
		 						.classed('handle', true)
		 						.attr('transform', "translate("+posx+", "+posy+") scale("+0.1+") rotate("+a+")" );
		 						//.attr('y', );
		
		
		link.clickable.on('click', function () { 
				
				var e = d3.event;
				radio('node:deselect').broadcast(source, e);
				
				
				radio('node:select').broadcast(link.target, e);
				radio('node:setfocus').broadcast(link.target, e);
				
		} );
	}


	// remove all the clickable item of the old node.
	var deselect = function(node) {
		node.links.forEach(function(link){
			//if(link.domlink) {
				var e = d3.event;
				link.clickable.remove();
				link.domlink.classed('clickable', false);
			//}
		});
	}
		
	var hover = function() {
		//TODO
	}
	
	var hoverOut = function() {
		//TODO
	}



	//////////////////////////////////////////////
	//											//
	//            Return Interface				//
	//											//
	//////////////////////////////////////////////

	links.init();
	return links;
});
