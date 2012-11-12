define(["models/nodes", "models/graph2", "views/infobox", "views/sidebar", "views/selectBox", "views/menu", "views/search", "controllers/search"], 
	function(model, graph, infobox, sidebar, selectbox, menu, search) {


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
