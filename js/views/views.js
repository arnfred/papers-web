define(["models/nodes", "models/graph2", "views/infobox", "views/sidebar", "models/overlay", "controllers/search"], 
	function(model, graph, infobox, overlay, search) {


	//////////////////////////////////////////////
	//											//
	//               Interface					//
	//											//
	//////////////////////////////////////////////
	var views = {};



	//////////////////////////////////////////////
	//											//
	//              Initialize					//
	//											//
	//////////////////////////////////////////////

	// Initialize graph
	graph.init(model.node);


	// Initialize sidebar
	//sidebar.init(model.selected)


	// Return views
	return views;
});
