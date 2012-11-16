/* 
 *	This module is in charge to take the nodes and to draw
 *	the graph. It is also concerned by taking care of what
 *	happen when node are selected, and when. (DOM interaction)
 *
 */

define(["lib/d3", "util/screen", "radio", "util/levenshtein", "controllers/events/links", "models/zoom", "models/nodeList"], function(d3, screen, radio, levenshtein, eventsLinks, zoom, nodeList) {

	//////////////////////////////////////////////
	//											//
	//               Interface					//
	//											//
	//////////////////////////////////////////////
	var graph = {}



	//////////////////////////////////////////////
	//											//
	//               Variables					//
	//											//
	//////////////////////////////////////////////

		// Dimensions
	var w = screen.width(),
		h = screen.height();

	graph.zoom = zoom;


	//////////////////////////////////////////////
	//											//
	//               Graph Init 				//
	//											//
	//////////////////////////////////////////////

	graph.init = function () {
		
		// Our canvas.
		graph.canvas = d3.select("#graph").append("svg")
			.attr("width", "100%")
			.attr("height", "100%")
			// Enable zoom feature:
			.call(	graph.zoom )
			// Add paning g:
			.append('svg:g') 
			.attr("pointer-events", "all")
			.attr('id', 'viewport');
		
		
		//enable scrolling on the canvas:
		graph.zoom.init(graph.canvas);
		
		
		
		// For later Use, switch to force layout:
		graph.force = null;
		
		var nodes = nodeList.getNodes();
		
		
		// Initialize the DOM UI: 
		nodes.forEach(function(el, j){
				el.links.forEach(function(link, i){
				if(link.domlink == null ){
					//console.log(link.target);
					link.domlink = graph.canvas.append('svg:line')
									  .attr('x1', el.pos.x)
									  .attr('y1', el.pos.y)
									  .attr('x2', nodes[link.target].pos.x)
									  .attr('y2', nodes[link.target].pos.y)
									  //.attr('source', el.id)
									  //.attr('target', graph.nodes[link.target].id)
									  .classed('link', true);

				}
			});	
		});

		nodes.forEach(function(el){
			el.domNode = graph.canvas.append('svg:circle')
										.attr('cx', el.pos.x)
										.attr('cy', el.pos.y)
										.attr('r', 4);
		});
		
		
		/*
		 * We register all the event for the DOM
		 * We could not have done earlier since
		 * we initilize the DOM in the graph2.js 
		 */
		 
		 
		// Broadcast when a node is clicked
		nodes.forEach(function(node){
			node.domNode.on("click", function(d,i) { 
				var e = d3.event; 
				radio("node:click").broadcast(node, e) 
				radio("node:select").broadcast(node, e) 
			});
		});


		// Broadcast when the mouse enters a node
		nodes.forEach(function(node){
			node.domNode.on("mouseover", function(d, i) { 
				var e = d3.event;
				radio("node:mouseover").broadcast(node, e);
				//radio("node:current").broadcast(node.id, e);
			});
		});

		
		// Broadcast when the mouse exits a node
		nodes.forEach(function(node){
				node.domNode.on("mouseout", function(d, i) { 
				var e = d3.event;
				radio("node:mouseout").broadcast(node, e) 
			});
		});						


		// Initialize events:
		eventsInit();
		eventsLinks.init(nodes, graph.canvas);
		
		// Other stuff to do:
		// On search
		radio("search:do").subscribe(searchHighlight);
		
	}

	
	

	//////////////////////////////////////////////
	//											//
	//            Public Functions				//
	//											//
	//////////////////////////////////////////////

	// Focus on a particular node
	// 
	graph.setFocus = function(node) {
			
			
		// Dimension
		var w = screen.width(),
			h = screen.height();
						
		// What is the scale?
		var factor = graph.zoom.pos.s;
		// Compute the translation coeff
		var transx = factor * node.pos.x - w/2, transy = factor * node.pos.y - h/2;
			
			
		zoom.transitionTo(factor, [-transx, -transy] );

	}




	//////////////////////////////////////////////
	//											//
	//           Private Functions				//
	//											//
	//////////////////////////////////////////////


	// Calculates the stroke width
	var strokeWidth = function(d, weight) { 
		if (weight == undefined) weight = 0.1;
		return Math.log(d.value*weight); 
	}


	// Highlights search results
	var searchHighlight = function(node) {
		// Do stuff
	}
	
	
	//////////////////////////////////////////////
	//											//
	//            Events handling				//
	//											//
	//////////////////////////////////////////////
	
	
	
	// Event initialization 
	var eventsInit = function () {
			
			
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
		 radio("node:click").subscribe(graph.setFocus);
		 
		 
		 // On node click, we want to try a new interface: focus on the node	
		 radio("node:setfocus").subscribe(graph.setFocus);
	
			 
	} // End of events initilization


	//////////////////////////////////////////////	
	// PRIVATE FUNCTION FOR EVENTS:				//
	//////////////////////////////////////////////
	
	
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
	
	
			

	//////////////////////////////////////////////
	//											//
	//            Return Interface				//
	//											//
	//////////////////////////////////////////////

	return graph;
})

