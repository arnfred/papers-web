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

	// Initialize the views and model
	views.init(model)

	// Add selected and current node(s) from last session
	model.broadcastSelected();


	// Return the controller
	return controller;

});
