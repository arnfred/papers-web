//define(["graph", "sidebar", "infobox"], function(graph, sidebar, 
//infobox) {
define(["model", "graph2", "infobox", "overlay", "search"], function(model, graph, infobox, overlay, search) {


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
