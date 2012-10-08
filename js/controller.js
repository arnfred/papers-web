define(["model", "views"], function (model, views) {


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
	controller.model = model;
	controller.views = views;

	// Add selected and current node(s) from last session
	model.broadcastSelected();


	// Return the controller
	return controller;

});
