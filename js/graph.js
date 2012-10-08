// TODO: Make this independent of session
define(["d3", "util/screen", "radio", "session"], function(d3, screen, radio, session, model) {

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
		graph.node.on("click.node", function (data) { radio("node:click").broadcast(data.index) });

		// Broadcast when the mouse enters a node
		graph.node.on("mouseover.node", function (data) { radio("node:mouseover").broadcast(data.index) });

		// Broadcast when the mouse exits a node
		graph.node.on("mouseout.node", function (data) { radio("node:mouseout").broadcast(data.index) });


		/**
		 * Subscribe
		 */

		// On node click, call either the select or the deselect event	
		radio("node:click").subscribe(selectToggle);

		// On node select, make sure the node is selected in the the graph
		radio("node:select").subscribe(select);

		// On node deselect, make sure the node is selected in the the graph
		radio("node:deselect").subscribe(deselect);

		// On node mouseover
		radio("node:mouseover").subscribe(hover);

		// On node mouseout
		radio("node:mouseout").subscribe(hoverOut);
	}



	//////////////////////////////////////////////
	//											//
	//               Variables					//
	//											//
	//////////////////////////////////////////////

		// Dimensions
	var w = screen.width() - 250,
		h = screen.height() + 300,

		// Colors
		fill 		= d3.rgb(0,50,180),
		match 		= d3.rgb(20,150,20),
		current 	= d3.rgb(180,50,80),
		selected 	= d3.rgb(248, 128, 23),
		edge 		= d3.rgb(153,153,153),
		currentEdge = d3.rgb(255,0,0),

		// Data
		testdata	= "js/data_test.json",
		data		= "js/data.json",

		// SVG stats
		nodeSize	= 6.4,
		nodeSizeBig	= 11,
		edgeSize	= 0.1,
		edgeSizeCur	= 0.2,
		edgeSizeBig	= 0.3;



	//////////////////////////////////////////////
	//											//
	//               Graph Init 				//
	//											//
	//////////////////////////////////////////////

	graph.init = function (nodes, links) {

		// Adapted from http://mbostock.github.com/d3/ex/force.js
		var vis = d3.select("#graph").append("svg")
			.attr("width", "100%")
			.attr("height", "100%")
			.append('g')
			.attr('id', 'viewport');

			// TODO: enable scrolling somewhere else
		// Enable scrolling
		//$('svg').svgPan('viewPort');

		// Import data to graph
		graph.force = d3.layout.force()
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
			.attr("class", "node")
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
		});

		// Initialize events
		graph.events();
	}




	//////////////////////////////////////////////
	//											//
	//            Public Functions				//
	//											//
	//////////////////////////////////////////////


	// Stops the graph animation
	graph.stop = function() { graph.force.stop(); }



	// Function that corresponds to the "surprise me" button
	// TODO: change function call in appropriate file
	graph.selectRandom = function() {

		// Get all nodes
		var nodes = d3.selectAll("circle.node");

		// Get random index
		index = Math.ceil(Math.random()*nodes[0].length)

		// Select this node
		select(index);

		// Return false for mouseevent
		return false;
	}


	
	/**
	 * Searches the graph for a particular title or author
	 */
	graph.search = function(term) {

		var nodes = d3.selectAll("circle.node");

		// remove all edges
		nodes.classed("search", false);

		// Add edges for nodes matching the search
		nodes.filter(function (d) { return searchFilter(term, d); }).classed("search", true);
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


	// Returns a node if you have the index of the node
	var getNodeFromIndex = function(index) {
		return d3.selectAll("circle.node").filter(function (d) { return (d.index == index); });
	}


	// Returns the data of a node if you have the index of the node
	var getDataFromIndex = function(index) {
		return getNodeFromIndex(index).property("__data__");
	}


	// Toggles a node on and off
	var selectToggle = function(index) {

		// Get node
		var currentNode	= getNodeFromIndex(index);

		// check if node is selected
		if (currentNode.classed("selected")) radio("node:deselect").broadcast(index);
		else radio("node:select").broadcast(index);

		return currentNode.classed("selected");
	}


	// Select a particular node
	var select = function(index) {
		var lastNode	= d3.select("circle.current");
		var lastEdges	= d3.selectAll("line.current");
		var currentNode	= getNodeFromIndex(index);

		// Add paper to list of selected and make current item current
		// TODO: make sure we have an event in sidebar.js for addlistitem
		//addListItem(index);
		setCurrent(index);

		// TODO: set sidebar node as current
		// Add which element is current in the list
		// $("li.current").removeClass("current");
		// $("li[rel=" + index + "]").addClass("current").click(function() { 
			//window.open(currentNode.property("__data__").pdf); });

		// Update the new current node to selected
		currentNode.classed("selected", true);

		// Find all edges belinging to current node and update them
		d3.selectAll("line.link.current")
			.filter(function (d) { return (d.source.index == index || d.target.index == index); })
			.classed("selected", true);

		// Save selected to a cookie
		session.save();
	}


	// Deselect a particular node
	var deselect = function(index) {

		//var lastEdges	= d3.selectAll("line.current");
		var currentNode = getNodeFromIndex(index);

		// Remove it from list
		// TODO: make sure node is dropped from list too
		// dropListItem(index);

		// Deselect it
		//if (currentNode.classed("current")) lastEdges.classed("current", false);
		//currentNode.classed("current", false);
		currentNode.classed("selected", false);

		// Go through all selected edges and deselect all that aren't connect to another selected node
		d3.selectAll("line.link.selected")
			.filter(function (d) { return ((d.source.index == index && !getNodeFromIndex(d.target.index).classed("selected")) 
										|| (d.target.index == index && !getNodeFromIndex(d.source.index).classed("selected"))); })
			.classed("selected", false);

		// Save the rest of the selected nodes to a cookie
		// TODO: make sure updated nodes are saved
		//saveSelected();
	}


	// What happens when we hover over a node
	var hoverOut = function(index) {
		var node = getNodeFromIndex(index);

		// TODO fade out infobox
		// Fade out description
		//$("#info").stop(true, true).delay(3000).fadeOut();
	}


	// What happens when we hover over a node
	var hover = function(index) {

		var node = getNodeFromIndex(index);

		// TODO: add text to the infobox
		// Get description
	//	d3.select("#info").text(d.authors + ": " + d.title);
	//	$("#info").stop(true,true).fadeIn("fast");

		// Set node as current
		setCurrent(index);
	}


	// Sets the node as the current node
	var setCurrent = function(index) {

		// Get node
		var node = getNodeFromIndex(index);

		// Make previous node not red
		d3.selectAll("circle.current").classed("current", false);

		// Make node red
		node.classed("current", true);

		// Find all edges belonging to old current node and update them
		d3.selectAll("line.link")
			.style("stroke-width", function (d) { return strokeWidth(d, edgeSize); })
			.classed("current", false);

		// Find all edges belinging to current node and update them
		d3.selectAll("line.link")
			.filter(function (d) { return (d.source.index == index || d.target.index == index); })
			.style("stroke-width", function (d) { return strokeWidth(d, edgeSizeBig); })
			.classed("current", true);
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

