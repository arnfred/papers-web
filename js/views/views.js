define(["models/nodeList", "models/graph2", "views/infobox", "views/sidebar", "views/selectBox", "views/menu", "views/search", "controllers/search"], 
	function(nodeList, graph, infobox, sidebar, selectbox, menu, search) {


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
	graph.init(nodeList.nodes);


	// Initialize sidebar
	//sidebar.init(model.selected)


	// Return views
	return views;
});
