define(["models/nodeList", "models/search", "views/views"], function (nodeList, views) {


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
	controller.model = nodeList;
	controller.views = views;

	// Add selected and current node(s) from last session
	controller.model.broadcastScheduled();


	// Return the controller
	return controller;

});
