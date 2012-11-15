//////////////////////////////////////////////
//											//
//           Events of the nodes			//
//											//
//////////////////////////////////////////////


define(["lib/d3", "radio", "util/array", 'util/screen'], function(d3, radio, arrrr, screen) {
	
	
	// GLOBAL VARIABLES: 

	var nodes = null,
	    zoomer = null, // Global variable of the nodes
		canvas = null, // Global variable of the nodes
	    events = {};
	    
	    
    // Function that subscribe node event the 
	events.init = function (_nodes, _canvas, _zoomer) {
		
		
		// Stupid initializer for nodes:
		nodes = _nodes;
		zoomer = _zoomer;
		canvas = _canvas;
		
		/**
		 * Subscribe
		 */

		 /*

		 Event for the nodes:

		 - focused:

		 - scheduled:

		 - matched:

		 - clicked:

		 - mouseover:

		 - mouseout:

		 */

		// On node click, call either the select or the deselect event	
		// radio("node:click").subscribe(selectToggle);

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
		 radio("node:click").subscribe(setFocus);
		 
		 
		 // On node click, we want to try a new interface: focus on the node	
		 radio("node:setfocus").subscribe(setFocus);

		 
	} // End of events initilization

		
		
			// Select a particular node
			var scheduled = function(node) {
				var lastNode	= d3.select("circle.current");
				var lastEdges	= d3.selectAll("line.current");
				var domNode	= node.domNode;
		
				// Add paper to list of selected and make current item current
				// TODO: make sure we have an event in sidebar.js for addlistitem
				//addListItem(id);
		
				// TODO: set sidebar node as current
				// Add which element is current in the list
				// $("li.current").removeClass("current");
				// $("li[rel=" + id + "]").addClass("current").click(function() { 
					//window.open(domNode.property("__data__").pdf); });
		
				// Update the new current node to selected
				node.classed("selected", true);
		
				// Find all edges belonging to current node and update them
				node.links.forEach(function(link){
					if(link.domlink != null) link.domlink.classed("selected", true);
					
					//link.domlink.on('click', function() { radio("link:click").broadcast(id, link.target); });
					//d
					
					
				});
			}
		
		
			// Deselect a particular node
			var unschedule = function(node) {
		
				//var lastEdges	= d3.selectAll("line.current");
		
				// Remove it from list
				// TODO: make sure node is dropped from list too
				// dropListItem(id);
		
				// Deselect it
				node.domNode.classed("selected", false);
		
				// Go through all selected edges and deselect all that aren't connect to another selected node
				node.links.forEach(function(link){
					link.domlink.classed("selected", false);
				});
			}
		
		
			// What happens when we hover over a node
			var hoverOut = function(node) {
				// Get node
				var domNode = node.domNode;

		
				// Make node red
				domNode.classed("current", false);
		
		
				// Find all edges belinging to current node and update them
				node.links.forEach(function(link){
					if(link.domlink) link.domlink.classed("current", false);
				});
			}
		
		
			// Sets the node as the current node NON PERSISTANT
			var hover = function(node) {
		
				// Get node
				var domNode = node.domNode;

		
				// Make node red
				domNode.classed("current", true);
		
		
				// Find all edges belinging to current node and update them
				node.links.forEach(function(link){
					if(link.domlink) link.domlink.classed("current", true);
				});
			}
		
			// General variable to know who is under focus
			var selected_node_id = null;
			
			// What happends when we select a node
			var select = function(node) {
				// Get node
				var domNode = node.domNode;
				
				// deselected the privous node:
				if(selected_node_id) deselect(selected_node_id);
				 
				// Register this node as selected:
				selected_node_id = node;
		
				// Make node red
				domNode.classed("selected", true);
		
				// Find all edges belonging to old current node and update them
				
		
				// Find all edges belinging to current node and update them
				node.links.forEach(function(link){
					if(link.domlink) {
						var e = d3.event;
						radio("link:selected").broadcast(link, e)
					}
					
					
					//link.domlink.classed("selected", true);
				});
			
			
			
			}
			
			// What happends when we deselect a node
			var deselect = function(node) {
				// Get node
				var domNode = node.domNode;
		
				// Make node red
				domNode.classed("selected", false);
		
				// Find all edges belonging to old current node and update them
				
		
				// Find all edges belinging to current node and update them
				node.links.forEach(function(link){
					if(link.domlink) {
						var e = d3.event;
						radio("link:deselect").broadcast(link, e)
					}
					
					//link.domlink.classed("selected", false);
				});
			
			
			
						}
			
			// Focus on a particular node
			// 
			var setFocus = function(node) {
					
					
					// Dimension
					var w = screen.width(),
						h = screen.height();
						
					
					
					//console.log(nextNode.pos.x+ " " + nextNode.pos.y);
					
					// What is the scale?
					var factor = zoomer.pos.s;
					// Compute the translation coeff
					var transx = factor * node.pos.x - w/2, transy = factor * node.pos.y - h/2;
					
					zoomer.translate([-transx, -transy]);
					zoomer.scale(factor);
					canvas.transition().attr('transform', "translate(-"+transx+", -"+transy+") scale("+factor+")");
					

			}
	
		// Function to focus on the node, that is to zoom around the node
		/*
		 * Yannik idea's: Finally I'm not using this feature anymore
		 * When we click on the node, now the we just set the node
		 * under permanent selection so that we do not loose info
		 * about that node. See focusNode2...
		 */
		
		var focusNode = function(node){
	
			var canvas = d3.select('g');
	
	
			//find the bounds of our square
			var minx = 100000, miny = 100000, maxx = 0, maxy = 0;
	
			node.links.forEach(function(link){
	
				var neighbors = nodes[link.target];
	
				// Find min
				if(neighbors.pos.x < node.pos.x && minx > neighbors.pos.x) minx = neighbors.pos.x;
				if(neighbors.pos.y < node.pos.y && minx > neighbors.pos.y) miny = neighbors.pos.y;
	
				//Find max
				if(neighbors.pos.x > node.pos.x && maxx < neighbors.pos.x) maxx = neighbors.pos.x;
				if(neighbors.pos.y > node.pos.y && maxx < neighbors.pos.y) maxy = neighbors.pos.y;
	
			});
			var w = screen.width(), h = screen.height();
			factor = 0.6*w/Math.abs(maxx-minx);
			if(factor < 1) factor = 1;
			var transx = factor * node.pos.x - w/2, transy = factor * node.pos.y - h/2; 
	
			// ATTENTION! Need to be change to go along the zoom feature. 
			canvas.transition().attr('transform', "translate(0, 0) scale(1, 1)");
			canvas.transition().attr('transform', "translate(-"+transx+", -"+transy+") scale(" +factor+", "+factor+")").delay(500);
	
		}
		
		
		
		
	
	return events;
});
