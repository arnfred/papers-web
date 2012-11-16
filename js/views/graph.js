define(["radio"], function(radio) {


	//////////////////////////////////////////////
	//											//
	//               Interface					//
	//											//
	//////////////////////////////////////////////
	var graph = {}



	//////////////////////////////////////////////
	//											//
	//            Events handling				//
	//											//
	//////////////////////////////////////////////
	
	// Event initialization 
	graph.events = function () {
			
		// On node select, make sure the node is selected in the the graph
		radio("node:select").subscribe(select);

		// // On node deselect, make sure the node is selected in the the graph
		radio("node:deselect").subscribe(deselect);

		// On node mouseover
		radio("node:mouseover").subscribe(hover);

		// On node mouseout
		radio("node:mouseout").subscribe(hoverOut);

		// On node click, we want to try a new interface: focus on the node	
		radio("node:click").subscribe(graph.setFocus);

		// On node click, we want to try a new interface: focus on the node	
		radio("node:setfocus").subscribe(graph.setFocus);

		// On search highlight result
		//radio("search:add").subscribe(searchAdd);

		// Remove search highlight from past results
		//radio("search:remove").subscribe(searchRemove);
	}



	//////////////////////////////////////////////	
	//											//
	// 		PRIVATE FUNCTION FOR EVENTS:		//
	// 											//
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


	// Highlights a node as a search result
	var searchAdd = function(node) {

		// Get the domNode
		var domNode = node.domNode;

		console.debug(node)

		// Add search class to affected node
		domNode.classed("search",true);
	}


	// Removes highlight from a node that is no longer a search result
	var searchRemove = function(node) {

		// Get the domNode
		var domNode = node.domNode;

		// Add search class to affected node
		domNode.classed("search",false);
	}


	//////////////////////////////////////////////
	//											//
	//            Return Interface				//
	//											//
	//////////////////////////////////////////////

	graph.events();
	return graph;

});
