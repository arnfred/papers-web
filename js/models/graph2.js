/* 
 *	This module is in charge to take the nodes and to draw
 *	the graph. It is also concerned by taking care of what
 *	happen when node are selected, and when. (DOM interaction)
 *
 */

define(["lib/d3", "util/screen", "radio", "util/levenshtein", "controllers/events/nodes", "controllers/events/links"], function(d3, screen, radio, levenshtein, events, eventsLinks) {

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
		h = screen.height(),

		// Colors
		fill 		= d3.rgb(0,50,180),
		match 		= d3.rgb(20,150,20),
		current 	= d3.rgb(180,50,80),
		selected 	= d3.rgb(248, 128, 23),
		edge 		= d3.rgb(153,153,153),
		currentEdge = d3.rgb(255,0,0);


	
	//////////////////////////////////////////////
	//											//
	//               Graph Zoom 				//
	//											//
	//////////////////////////////////////////////
	
	graph.zoom = d3.behavior.zoom();
	
	// Track the position:
	graph.zoom.pos = {};
	graph.zoom.pos.x = 0;
	graph.zoom.pos.y = 0;
	graph.zoom.pos.s = 0;

	//////////////////////////////////////////////
	//											//
	//               Graph Init 				//
	//											//
	//////////////////////////////////////////////

	graph.init = function (nodes) {

		// Our canvas.
		// g is just an window that can move...
		
		var vis = d3.select("#graph").append("svg")
			.attr("width", "100%")
			.attr("height", "100%")
			// Enable zoom feature:
			.call(	graph.zoom)
			// Add paning g:
			.append('svg:g') 
			.attr("pointer-events", "all")
			.attr('id', 'viewport');
		
		
		// TODO: enable scrolling somewhere else
		graph.zoom.on("zoom", function() {
				//console.log("here", d3.event.translate, d3.event.scale);
				
				var e = d3.event;
				var transform = e.translate;
				var scale = e.scale;
				
				 vis.attr("transform",
				 	 "translate(" + transform + ")"
				 		+ " scale(" + scale + ")");
				 
				 graph.zoom.pos.x = transform[0];
				 graph.zoom.pos.y = transform[1];
				 graph.zoom.pos.s = scale;
		});
		
		//graph.zoom.translate([-200, -200]);
		graph.force = null;
		graph.nodes = nodes;
		
		
		// Initialize the DOM UI: 
		graph.nodes.forEach(function(el, j){
				el.links.forEach(function(link, i){
				if(link.domlink == null ){
					//console.log(link.target);
					link.domlink = vis.append('svg:line')
									  .attr('x1', el.pos.x)
									  .attr('y1', el.pos.y)
									  .attr('x2', graph.nodes[link.target].pos.x)
									  .attr('y2', graph.nodes[link.target].pos.y)
									  //.attr('source', el.id)
									  //.attr('target', graph.nodes[link.target].id)
									  .classed('link', true);

				}
			});	
		});

		graph.nodes.forEach(function(el){
			el.domNode = vis.append('svg:circle')
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
				radio("node:click").broadcast(node.id, e) 
			});
		});

		// Broadcast when the mouse enters a node
		nodes.forEach(function(node){
			node.domNode.on("mouseover", function(d, i) { 
				var e = d3.event;
				radio("node:mouseover").broadcast(node.id, e);
				//radio("node:current").broadcast(node.id, e);
			});
		});
		
		// Broadcast when the mouse exits a node
		nodes.forEach(function(node){
				node.domNode.on("mouseout", function(d, i) { 
				var e = d3.event;
				radio("node:mouseout").broadcast(node.id, e) 
			});
		});						


		// Initialize events
		// That is subscribe everything. 
		events.init(nodes);
		
		eventsLinks.init(nodes, graph.zoom, vis);
		
		// Other stuff to do:
		// On search
		radio("search:do").subscribe(search);
		
	}

	
	

	//////////////////////////////////////////////
	//											//
	//            Public Functions				//
	//											//
	//////////////////////////////////////////////




	// Function that corresponds to the "surprise me" button
	// TODO: change function call in appropriate file
	// TODO: I don't think this function works because of the
	// TODO: Change to broadcast event
	graph.selectRandom = function() {

		// Get all nodes
		var nodes = d3.selectAll("circle.node");

		// Get random index
		var index = Math.ceil(Math.random()*nodes[0].length)
		var node = nodes[0][index];


		// Select this node
		select(node.id);

		// Return false for mouseevent
		return false;
	}

	graph.getNodeFromId = function(id) {
		return graph.nodes[id].domNode;
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




	/**
	 * Searches the graph for a particular title or author
	 */
	var search = function(term) {

		if (term == "") term = "qqqqqqqqqqqqqqqq"; // Something that isn't there

		var nodes = d3.selectAll("circle");

		// remove all edges
		nodes.classed("search", false);

		// Add edges for nodes matching the search
		var nodefound = graph.nodes.filter(function (d) { return searchFilter(term, d); });
		nodefound.forEach(function(n){n.domNode.classed("search", true)});
	}


	// Preliminary search
	var searchFilter = function(term, d) {
		var t = term.toLowerCase();
		var title = d.title.toLowerCase();
		var authors = d.authors.replace(',','').toLowerCase();

		// Return if term is part of either title or authors
		if ((title.indexOf(t) > -1) || (authors.indexOf(t) > -1)) return true

		// Return if term has levenshtein distance 1 or less to any word or name
		else {
			var distAuthors = authors.split(' ').map(function (w) { return levenshtein(w,t); })
			var distTitle = title.split(' ').map(function (w) { return levenshtein(w,t); })
			var minDistAuthors = Math.min.apply(null,distAuthors);
			var minDistTitle = Math.min.apply(null,distTitle);
			return (Math.min(minDistAuthors,minDistTitle) <= 1)
		}
	}


	


	//////////////////////////////////////////////
	//											//
	//            Return Interface				//
	//											//
	//////////////////////////////////////////////

	return graph;
})

