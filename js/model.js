define(["data/graph", "radio", "session"], function (json, radio, session) {

	//////////////////////////////////////////////
	//											//
	//               Interface					//
	//											//
	//////////////////////////////////////////////
	var model = {};



	//////////////////////////////////////////////
	//											//
	//              Initialize					//
	//											//
	//////////////////////////////////////////////
	
	// Load nodes
	model.nodes = json.nodes;

	// Load links
	model.links = json.links;

	// Load session
	//model.selected = session.load



	//////////////////////////////////////////////
	//											//
	//            Public Functions				//
	//											//
	//////////////////////////////////////////////

	// Returns a list of selected with data
	// TODO
	// model.getSelected = function() {
	// }


	// Return object
	return model;

});
