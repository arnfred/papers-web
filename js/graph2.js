/* 
 *	This module is in charge to take the nodes and to draw
 *	the graph. It is also concerned by taking care of what
 *	happen when node are selected, and when. (DOM interaction)
 *
 */




define(["d3", "util/screen", "radio", "util/levenshtein", "position"], function(d3, screen, radio, levenshtein, position) {

	//////////////////////////////////////////////
	//											//
	//               Interface					//
	//											//
	//////////////////////////////////////////////
	var graph = {}



	//////////////////////////////////////////////
	//											//
	//                Events					//
	//											//
	//////////////////////////////////////////////

	graph.events = function () {

		/**
		 * Broadcast
		 */

		// Broadcast when a node is clicked
		graph.nodes.forEach(function(node){
			node.domNode.on("click", function(d,i) { 
			var e = d3.event; radio("node:click").broadcast(node.id, e) 
		});
		});

		// Broadcast when the mouse enters a node
		graph.nodes.forEach(function(node){
			node.domNode.on("mouseover", function(d, i) { 
			var e = d3.event;
			radio("node:mouseover").broadcast(node.id, e);
			radio("node:current").broadcast(node.id, e);
		});
});
		// Broadcast when the mouse exits a node
		graph.nodes.forEach(function(node){
			node.domNode.on("mouseout", function(d, i) { 
			var e = d3.event;
			radio("node:mouseout").broadcast(node.id, e) 
		});
});

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

		 // On search
		 radio("search:do").subscribe(search);


		 // On node click, we want to try a new interface: focus on the node	
		 radio("node:click").subscribe(focusNode);
	}



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
	//               Graph Init 				//
	//											//
	//////////////////////////////////////////////

	graph.init = function (nodes) {

		// Our canvas.
		// g is just an window that can move...


		var vis = d3.select("#graph").append("svg")
			.attr("width", "100%")
			.attr("height", "100%")
			.attr("pointer-events", "all")
			.append('svg:g')
			.attr('id', 'viewport')
			  .call(d3.behavior.zoom().on("zoom", function() {
			  		console.log("here", d3.event.translate, d3.event.scale);
			  		vis.attr("transform",
			  			 "translate(" + d3.event.translate + ")"
			  				+ " scale(" + d3.event.scale + ")");
			  })
			  .append('svg:g');

			// TODO: enable scrolling somewhere else
		// Enable scrolling


		graph.force = null;
		graph.nodes = nodes;
		//console.log(nodes.length)
		var j = 0, space = Math.sqrt((w * h)/(nodes.length)), nbTotLine = Math.floor(w/space)-1; 
		graph.nodes.forEach(function(el, i){

			if( (i/nbTotLine) >= (j+1)) j++;

			//graph.nodes[i].pos = {x: ( i % nbTotLine)*space + 50 + (10*Math.random()-5), y: j*space + 50 + (10*Math.random()-5)};
			graph.nodes[i].pos = position[i];


		});
		graph.nodes.forEach(function(el, j){
				el.links.forEach(function(link, i){
				if(link.domlink == null ){
					//console.log(link.target);
					link.domlink = vis.append('svg:line')
									  .attr('x1', el.pos.x)
									  .attr('y1', el.pos.y)
									  .attr('x2', graph.nodes[link.target].pos.x)
									  .attr('y2', graph.nodes[link.target].pos.y)
									  .attr('source', el.id)
									  .attr('target', graph.nodes[link.target].id)
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

		//console.log(nodes.length);
		graph.link = null;
		// Import data to graph
		/* graph.force = d3.layout.force()
			.charge(-90)
			.linkDistance(70)
			.friction(0.5)
			.theta(0.4)
			.nodes(nodes)
			.links(links.slice(1))
			.size([w, h])
			.linkStrength( function(d, i) { return Math.log(d.value)/10; })
			.start(0.1);

		// Import links
		graph.link = vis.selectAll("line.link")
			.data(links)
			.enter().append("line")
			.attr("class", "link")
			.style("stroke-width", function (d) { return strokeWidth(d, edgeSize); })
			.attr("x1", function(d) { return d.source.x; })
			.attr("y1", function(d) { return d.source.y; })
			.attr("x2", function(d) { return d.target.x; })
			.attr("y2", function(d) { return d.target.y; });

		// Import Nodes
		graph.node = vis.selectAll("circle.node")
			.data(nodes)
			.enter().append("circle")
			.attr("class", function(d) { return "node " + d.id; })
			.attr("cx", function(d) { return d.x; })
			.attr("cy", function(d) { return d.y; })
			.attr("r", nodeSize)
			.call(function() { setTimeout(function () { graph.stop() }, 20000); });
			//.call(force.drag);

		// Add alt-text when hovering over a node
		// node.append("title")
		//     .text(function(d) { return d.title + " (" + d.authors + ")"; });

		// TODO: move this somewhere else
		// Add nodes to hidden selectbox
		//selectInit(graph.nodes);
		//This function is renamed to addNodes

		graph.force.on("tick", function() {
			graph.link.attr("x1", function(d) { return d.source.x; })
					  .attr("y1", function(d) { return d.source.y; })
					  .attr("x2", function(d) { return d.target.x; })
					  .attr("y2", function(d) { return d.target.y; });

			graph.node.attr("cx", function(d) { return d.x; })
					  .attr("cy", function(d) { return d.y; });
		}); */

		// Initialize events
		graph.events();
		//console.log("ok");
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


	// Toggles a node on and off
	var selectToggle = function(id) {

		// Get node
		var currentNode	= graph.getNodeFromId(id);

		// check if node is selected
		if (currentNode.classed("selected")) radio("node:deselect").broadcast(id);
		else radio("node:select").broadcast(id);

		return currentNode.classed("selected");
	}


	// Select a particular node
	var select = function(id) {
		var lastNode	= d3.select("circle.current");
		var lastEdges	= d3.selectAll("line.current");
		var currentNode	= graph.getNodeFromId(id);

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
		graph.nodes[id].links.forEach(function(link){
			if(link.domlink != null) link.domlink.classed("selected", true);
		});
	}


	// Deselect a particular node
	var deselect = function(id) {

		//var lastEdges	= d3.selectAll("line.current");
		var currentNode = graph.getNodeFromId(id);

		// Remove it from list
		// TODO: make sure node is dropped from list too
		// dropListItem(id);

		// Deselect it
		currentNode.classed("selected", false);

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
		var node = graph.getNodeFromId(id);

		// Make previous node not red
		d3.selectAll("circle.current").classed("current", false);

		// Make node red
		node.classed("current", true);

		// Find all edges belonging to old current node and update them
		d3.selectAll("line.link.current")
			//.style("stroke-width", function (d) { return strokeWidth(d, edgeSize); })
			.classed("current", false);

		// Find all edges belinging to current node and update them
		graph.nodes[id].links.forEach(function(link){
			if(link.domlink) link.domlink.classed("current", true);
		});
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


	// Function to focus on the node, that is to zoom around the node

	var focusNode = function(id){

		var canvas = d3.select('g');

		var currentNode = graph.nodes[id];


		//find the bounds of our square
		var minx = 100000, miny = 100000, maxx = 0, maxy = 0;

		currentNode.links.forEach(function(link){

			var neighbors = graph.nodes[link.target];

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


		canvas.transition().attr('transform', "translate(0, 0) scale(1, 1)");
		canvas.transition().attr('transform', "translate(-"+transx+", -"+transy+") scale(" +factor+", "+factor+")").delay(500);

	}


	//////////////////////////////////////////////
	//											//
	//            Return Interface				//
	//											//
	//////////////////////////////////////////////

	return graph;
})

