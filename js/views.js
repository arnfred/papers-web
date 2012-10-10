//define(["graph", "sidebar", "infobox"], function(graph, sidebar, 
//infobox) {
	define(["model", "graph", "infobox", "overlay", "search", "sidebar"], 
	function(model, graph, infobox, overlay, search, sidebar) {


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
	graph.init(model.nodes, model.links);


	// Initialize sidebar
	//sidebar.init(model.selected)


	// Return views
	return views;
});
