// Adapted from http://mbostock.github.com/d3/ex/force.js



//////////////////////////////////////////////
//											//
//               Variables					//
//											//
//////////////////////////////////////////////

	// Dimensions
var w = getWidth() - 250;
    h = getHeight() + 300,

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
	nodeSizeBig	= 11;
	



//////////////////////////////////////////////
//											//
//                 Graph					//
//											//
//////////////////////////////////////////////


var vis = d3.select("#graph").append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .append('g')
    .attr('id', 'viewport');

// Enable scrolling
$('svg').svgPan('viewPort');

// Import data to graph
d3.json(data, function(json) {
  var force = d3.layout.force()
      .charge(-90)
      .linkDistance(70)
	  .friction(0.5)
	  .theta(0.4)
      .nodes(json.nodes)
      .links(json.links)
      .size([w, h])
	  .linkStrength( function(d, i) { return Math.log(d.value)/10; })
      .start(0.1);

  // Import links
  var link = vis.selectAll("line.link")
      .data(json.links)
      .enter().append("line")
      .attr("class", "link")
      .style("stroke-width", function(d) { return Math.log(d.value/10); })
      .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

  // Import Nodes
  var node = vis.selectAll("circle.node")
      .data(json.nodes)
      .enter().append("circle")
      .attr("class", "node")
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; })
      .attr("r", nodeSize)
  	  .on("mouseover.node", nodeHover)
	  .on("mouseout.node", nodeHoverOut)
	  .call(function() { setTimeout(function () { stopGraph(force) }, 20000); });
      //.call(force.drag);

  // Add alt-text when hovering over a node
  // node.append("title")
  //     .text(function(d) { return d.title + " (" + d.authors + ")"; });

  // Add nodes to hidden selectbox
  selectInit(json.nodes);

  node.on("click.node", nodeClick);

  force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  });
});


//////////////////////////////////////////////
//											//
//               Functions					//
//											//
//////////////////////////////////////////////

function stopGraph(f) { f.stop(); }

// Make search box work
d3.select(".searchField").on("click", function () { 
	var field = d3.select(".search")

	// Search for term
	var t = field.property("value")
	searchPaper(t.toLowerCase(), t); 
	// Clear search box
	field.property("value", "");
}); 


// Returns a node if you have the index of the node
function getNodeFromIndex(index) {
	return d3.select(d3.selectAll("circle.node")[0][index]);
}

// Returns the data of a node if you have the index of the node
function getDataFromIndex(index) {
	var data;
	// this is ugly as hell
	getNodeFromIndex(index).attr("", function(d) { data = d; });
	return data;
}

function selectToggle(index) {
	// Get node
	var currentNode	= getNodeFromIndex(index);

	// check if node is selected
	if (currentNode.classed("selected")) return deselect(index);
	else return select(index);


}


// Select a particular node
function select(index) {
	var lastNode	= d3.select("circle.current");
	var lastEdges	= d3.selectAll("line.current");
	var currentNode	= getNodeFromIndex(index);

	// Add paper to list of selected and make current item current
	addListItem(index);

	// Add which element is current
	$("li.current").removeClass("current");
	$("li[rel=" + index + "]").addClass("current");

	// Change the prior current node and edges back
	lastEdges.classed("current", false);
	lastNode.classed("current", false);

	// Update the new current node
	currentNode.classed("current", true);
	currentNode.classed("selected", true);

	// Find all edges belinging to current node and update them
	vis.selectAll("line.link")
		.filter(function (d) { return (d.source.index == index || d.target.index == index); })
		.classed("selected", true);

	// Save selected to a cookie
	saveSelected();
}


// Deselect a particular node
function deselect(index) {
	var lastEdges	= d3.selectAll("line.current");
	var currentNode	= getNodeFromIndex(index);

	// Remove it from list
	dropListItem(index);

	// Deselect it
	if (currentNode.classed("current")) lastEdges.classed("current", false);
	currentNode.classed("current", false);
	currentNode.classed("selected", false);

	// Save the rest of the selected nodes to a cookie
	saveSelected();
}

function imFeelingLucky() {

	// Get all nodes
	var nodes = vis.selectAll("circle.node");

	// Get random index
	index = Math.ceil(Math.random()*nodes[0].length)

	// Select this node
	select(index);

	// Return false for mouseevent
	return false;
}

// What happens when we hover over a node
function nodeHoverOut(d) {
	// Get index and node
	var index = d.index;
	var node = getNodeFromIndex(index);

	// Fade out description
	$("#info").stop(true, true).delay(3000).fadeOut();

	//// Make node not red
	//node.classed("current", false);
	//
	//// Find all edges belonging to current node and update them
	//vis.selectAll("line.link")
	//	.filter(function (d) { return (d.source.index == index || d.target.index == index); })
	//	.classed("current", false);
}

// What happens when we hover over a node
function nodeHover(d) {

	// Get index and node
	var index = d.index;
	var node = getNodeFromIndex(index);

	// Get description
	d3.select("#info").text(d.authors + ": " + d.title);
	$("#info").stop(true,true).fadeIn("fast");

	// Make previous node not red
	last_cur = d3.selectAll(".current");
	last_ind = last_cur.property("__data__");
	last_cur.classed("current",false);

	// Find all edges belonging to old current node and update them
	vis.selectAll("line.link")
		.filter(function (d) { return (d.source.index == last_ind || d.target.index == last_ind); })
		.classed("current", false);

	// Make node red
	node.classed("current", true);

	// Find all edges belinging to current node and update them
	vis.selectAll("line.link")
		.filter(function (d) { return (d.source.index == index || d.target.index == index); })
		.classed("current", true);
}



function searchPaper(term) {

	var nodes = vis.selectAll("circle.node");

	// remove all edges
	nodes.classed("search", false);

	// Add edges for nodes matching the search
	nodes.filter(function (d) { return searchFilter(term, d); }).classed("search", true);
}

// Preliminary search
function searchFilter(term, d) {
	return ((d.title.toLowerCase().indexOf(term) > -1) || (d.authors.toLowerCase().indexOf(term) > -1));
}

