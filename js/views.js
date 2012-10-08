//define(["graph", "sidebar", "infobox"], function(graph, sidebar, 
//infobox) {
define(["graph"], function(graph) {


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
	views.init = function (model) {

		// Initialize graph
		graph.init(model.nodes, model.links);

		// Initialize sidebar
		//sidebar.init(model.selected)
	}


	// Return views
	return views;
});
