//////////////////////////////////////////////
//											//
//            Events of the nodes			//
//											//
//////////////////////////////////////////////


define(["lib/d3", "radio", "util/array"], function(d3, radio, arrrr) {
	
	
	// GLOBAL VARIABLES: 

	var nodes = null, // Global variable of the nodes
	    events = {};
	    
	    
    // Function that subscribe node event the 
	events.init = function (_nodes) {
		
		
		// Stupid initializer for nodes:
		nodes = _nodes;

		/**
		 * Subscribe
		 */

		 /*

		 State of the nodes:

		 - clicked:

		 - registered:

		 - selected:

		 - focused:

		 - mouseover:

		 - mouseout:

		 */

		// On node click, call either the select or the deselect event	
		 radio("node:click").subscribe(selectToggle);

		// On node select, make sure the node is selected in the the graph
		 radio("node:select").subscribe(select);
		// 
		// // On node deselect, make sure the node is selected in the the graph
		 radio("node:deselect").subscribe(deselect);
		// 
		 // On node mouseover
		 radio("node:mouseover").subscribe(hover);

		 // On node mouseout
		 radio("node:mouseout").subscribe(hoverOut);


		 // On node click, we want to try a new interface: focus on the node	
		 radio("node:click").subscribe(focusNode2);
		 
		 
	} // End of events initilization

		
		
		// Toggles a node on and off
			var selectToggle = function(id) {
		
				// Get node
				var currentNode	= nodes[id].domNode;
		
				// check if node is selected
				if (currentNode.classed("selected")) radio("node:deselect").broadcast(id);
				else radio("node:select").broadcast(id);
		
				return currentNode.classed("selected");
			}
		
		
			// Select a particular node
			var select = function(id) {
				var lastNode	= d3.select("circle.current");
				var lastEdges	= d3.selectAll("line.current");
				var currentNode	= nodes[id].domNode;
		
				// Add paper to list of selected and make current item current
				// TODO: make sure we have an event in sidebar.js for addlistitem
				//addListItem(id);
		
				// TODO: set sidebar node as current
				// Add which element is current in the list
				// $("li.current").removeClass("current");
				// $("li[rel=" + id + "]").addClass("current").click(function() { 
					//window.open(currentNode.property("__data__").pdf); });
		
				// Update the new current node to selected
				currentNode.classed("selected", true);
		
				// Find all edges belinging to current node and update them
				nodes[id].links.forEach(function(link){
					if(link.domlink != null) link.domlink.classed("selected", true);
					
					//link.domlink.on('click', function() { radio("link:click").broadcast(id, link.target); });
					
					
				});
			}
		
		
			// Deselect a particular node
			var deselect = function(id) {
		
				//var lastEdges	= d3.selectAll("line.current");
				var currentNode = nodes[id];
		
				// Remove it from list
				// TODO: make sure node is dropped from list too
				// dropListItem(id);
		
				// Deselect it
				currentNode.domNode.classed("selected", false);
		
				// Go through all selected edges and deselect all that aren't connect to another selected node
				currentNode.links.forEach(function(link){
					link.domlink.classed("selected", false);
				});
			}
		
		
			// What happens when we hover over a node
			var hoverOut = function(id) {
				// Nothing here
			}
		
		
			// What happens when we hover over a node
			var hover = function(id) {
		
				// Set node as current
				setCurrent(id);
			}
		
		
			// Sets the node as the current node
			var setCurrent = function(id) {
		
				// Get node
				var node = nodes[id].domNode;

				// Make previous node not red
				d3.selectAll("circle.current").classed("current", false);
		
				// Make node red
				node.classed("current", true);
		
				// Find all edges belonging to old current node and update them
				d3.selectAll("line.link.current")
					//.style("stroke-width", function (d) { return strokeWidth(d, edgeSize); })
					.classed("current", false);
		
				// Find all edges belinging to current node and update them
				nodes[id].links.forEach(function(link){
					if(link.domlink) link.domlink.classed("current", true);
				});
			}
	
		// Function to focus on the node, that is to zoom around the node
		/*
		 * Yannik idea's: Finally I'm not using this feature anymore
		 * When we click on the node, now the we just set the node
		 * under permanent selection so that we do not loose info
		 * about that node. See focusNode2...
		 */
		
		var focusNode = function(id){
	
			var canvas = d3.select('g');
	
			var currentNode = nodes[id];
	
	
			//find the bounds of our square
			var minx = 100000, miny = 100000, maxx = 0, maxy = 0;
	
			currentNode.links.forEach(function(link){
	
				var neighbors = nodes[link.target];
	
				// Find min
				if(neighbors.pos.x < currentNode.pos.x && minx > neighbors.pos.x) minx = neighbors.pos.x;
				if(neighbors.pos.y < currentNode.pos.y && minx > neighbors.pos.y) miny = neighbors.pos.y;
	
				//Find max
				if(neighbors.pos.x > currentNode.pos.x && maxx < neighbors.pos.x) maxx = neighbors.pos.x;
				if(neighbors.pos.y > currentNode.pos.y && maxx < neighbors.pos.y) maxy = neighbors.pos.y;
	
			});
			var w = screen.width(), h = screen.height();
			factor = 0.6*w/Math.abs(maxx-minx);
			if(factor < 1) factor = 1;
			var transx = factor * currentNode.pos.x - w/2, transy = factor * currentNode.pos.y - h/2; 
	
			// ATTENTION! Need to be change to go along the zoom feature. 
			canvas.transition().attr('transform', "translate(0, 0) scale(1, 1)");
			canvas.transition().attr('transform', "translate(-"+transx+", -"+transy+") scale(" +factor+", "+factor+")").delay(500);
	
		}
		
		
		var focusNode2 = function(id){
		
				var canvas = d3.select('g');
		
				var currentNode = nodes[id];
		
		
				
		
		}
	
	return events;
});
