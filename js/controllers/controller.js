define(["models/nodes", "views/views"], function (nodes, views) {


	//////////////////////////////////////////////
	//											//
	//               Interface					//
	//											//
	//////////////////////////////////////////////
	var controller = {};


	//////////////////////////////////////////////
	//											//
	//              Initialize					//
	//											//
	//////////////////////////////////////////////

	// Add to controller and views
	controller.model = nodes;
	controller.views = views;

	// Add selected and current node(s) from last session
	controller.model.broadcastSelected();


	// Return the controller
	return controller;

});
