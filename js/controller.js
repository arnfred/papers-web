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

	// Initialize the views
	views.init(model)


	// Return the controller
	return controller;

});
