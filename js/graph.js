define(["d3", "util/screen"], function(d3dss, screen) {

	//////////////////////////////////////////////
	//											//
	//               Interface					//
	//											//
	//////////////////////////////////////////////
	var g = {}
	

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


	// Adapted from http://mbostock.github.com/d3/ex/force.js
	g.vis = d3.select("#graph").append("svg")
		.attr("width", "100%")
		.attr("height", "100%")
		.append('g')
		.attr('id', 'viewport');

		// TODO: enable scrolling somewhere else
	// Enable scrolling
	//$('svg').svgPan('viewPort');

	// Import data to graph
	d3.json(data, function(graph) {
	  var force = d3.layout.force()
		  .charge(-90)
		  .linkDistance(70)
		  .friction(0.5)
		  .theta(0.4)
		  .nodes(graph.nodes)
		  .links(graph.links.slice(1))
		  .size([w, h])
		  .linkStrength( function(d, i) { return Math.log(d.value)/10; })
		  .start(0.1);

	  // Import links
	  var link = g.vis.selectAll("line.link")
		  .data(graph.links)
		  .enter().append("line")
		  .attr("class", "link")
		  .style("stroke-width", function (d) { return strokeWidth(d, edgeSize); })
		  .attr("x1", function(d) { return d.source.x; })
		  .attr("y1", function(d) { return d.source.y; })
		  .attr("x2", function(d) { return d.target.x; })
		  .attr("y2", function(d) { return d.target.y; });

	  // Import Nodes
	  var node = g.vis.selectAll("circle.node")
		  .data(graph.nodes)
		  .enter().append("circle")
		  .attr("class", "node")
		  .attr("cx", function(d) { return d.x; })
		  .attr("cy", function(d) { return d.y; })
		  .attr("r", nodeSize)
		  .on("mouseover.node", g.nodeHover)
		  .on("mouseout.node", g.nodeHoverOut)
		  .call(function() { setTimeout(function () { g.stopGraph(force) }, 20000); });
		  //.call(force.drag);

	  // Add alt-text when hovering over a node
	  // node.append("title")
	  //     .text(function(d) { return d.title + " (" + d.authors + ")"; });

	  // TODO: move this somewhere else
	  // Add nodes to hidden selectbox
	  //selectInit(graph.nodes);

	  // TODO: Move this to events
	  // node.on("click.node", g.nodeClick);

	  force.on("tick", function() {
		link.attr("x1", function(d) { return d.source.x; })
			.attr("y1", function(d) { return d.source.y; })
			.attr("x2", function(d) { return d.target.x; })
			.attr("y2", function(d) { return d.target.y; });

		node.attr("cx", function(d) { return d.x; })
			.attr("cy", function(d) { return d.y; });
	  });
	});


	// Make search box work
	d3.select(".searchField").on("click", function () { 
		var field = d3.select(".search")

		// Search for term
		var t = field.property("value")
		g.searchPaper(t.toLowerCase(), t); 
		// Clear search box
		field.property("value", "");
	}); 


	//////////////////////////////////////////////
	//											//
	//            Public Functions				//
	//											//
	//////////////////////////////////////////////


	// Stops the graph animation
	g.stopGraph = function(f) { f.stop(); }

	// Select a particular node
	g.select = function(index) {
		var lastNode	= d3.select("circle.current");
		var lastEdges	= d3.selectAll("line.current");
		var currentNode	= getNodeFromIndex(index);

		// Add paper to list of selected and make current item current
		addListItem(index);
		g.setCurrent(index);

		// TODO: set sidebar node as current
		// Add which element is current in the list
		// $("li.current").removeClass("current");
		// $("li[rel=" + index + "]").addClass("current").click(function() { 
			//window.open(currentNode.property("__data__").pdf); });

		// Update the new current node to selected
		currentNode.classed("selected", true);

		// Find all edges belinging to current node and update them
		g.vis.selectAll("line.link.current")
			.filter(function (d) { return (d.source.index == index || d.target.index == index); })
			.classed("selected", true);

		// Save selected to a cookie
		saveSelected();
	}

	// Deselect a particular node
	g.deselect = function(index) {
		//var lastEdges	= d3.selectAll("line.current");
		var currentNode = getNodeFromIndex(index);

		// Remove it from list
		dropListItem(index);

		// Deselect it
		//if (currentNode.classed("current")) lastEdges.classed("current", false);
		//currentNode.classed("current", false);
		currentNode.classed("selected", false);

		// Go through all selected edges and deselect all that aren't connect to another selected node
		g.vis.selectAll("line.link.selected")
			.filter(function (d) { return ((d.source.index == index && !getNodeFromIndex(d.target.index).classed("selected")) 
										|| (d.target.index == index && !getNodeFromIndex(d.source.index).classed("selected"))); })
			.classed("selected", false);

		// Save the rest of the selected nodes to a cookie
		saveSelected();
	}


	// Function that corresponds to the "surprise me" button
	g.imFeelingLucky = function() {

		// Get all nodes
		var nodes = g.vis.selectAll("circle.node");

		// Get random index
		index = Math.ceil(Math.random()*nodes[0].length)

		// Select this node
		select(index);

		// Return false for mouseevent
		return false;
	}


	// What happens when we hover over a node
	g.nodeHoverOut = function(d) {
		// Get index and node
		var index = d.index;
		var node = getNodeFromIndex(index);

		// TODO fade out infobox
		// Fade out description
		//$("#info").stop(true, true).delay(3000).fadeOut();
	}


	// Sets the node as the current node
	g.setCurrent = function(index) {

		// Gode node
		var node = getNodeFromIndex(index);

		// Make previous node not red
		d3.selectAll("node.current").classed("current", false);

		// Make node red
		node.classed("current", true);

		// Find all edges belonging to old current node and update them
		g.vis.selectAll("line.link")
			.style("stroke-width", function (d) { return strokeWidth(d, edgeSize); })
			.classed("current", false);

		// Find all edges belinging to current node and update them
		g.vis.selectAll("line.link")
			.filter(function (d) { return (d.source.index == index || d.target.index == index); })
			.style("stroke-width", function (d) { return strokeWidth(d, edgeSizeBig); })
			.classed("current", true);
	}


	// What happens when we hover over a node
	g.nodeHover = function(d) {

		// Get index and node
		var index = d.index;
		var node = getNodeFromIndex(index);

		// TODO: add text to the infobox
		// Get description
	//	d3.select("#info").text(d.authors + ": " + d.title);
	//	$("#info").stop(true,true).fadeIn("fast");

		// Set node as current
		g.setCurrent(index);
	}

	
	g.searchPaper = function(term) {

		var nodes = g.vis.selectAll("circle.node");

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
	function strokeWidth(d, weight) { 
		if (weight == undefined) weight = 0.1;
		return Math.log(d.value*weight); 
	}




	// Returns a node if you have the index of the node
	function getNodeFromIndex(index) {
		return d3.selectAll("circle.node").filter(function (d) { return (d.index == index); });
	}

	// Returns the data of a node if you have the index of the node
	function getDataFromIndex(index) {
		return getNodeFromIndex(index).property("__data__");
	}

	// Toggles a node on and off
	function selectToggle(index) {
		// Get node
		var currentNode	= getNodeFromIndex(index);

		// check if node is selected
		if (currentNode.classed("selected")) return g.deselect(index);
		else return select(index);
	}



	// Preliminary search
	function searchFilter(term, d) {
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
	
	return g;
})

