define(["data/graph", "radio", "session", "util/array", "util/cookie"], function(json, radio, session, arrrr, cookie) {

	//////////////////////////////////////////////
	//											//
	//               Interface					//
	//											//
	//////////////////////////////////////////////
	var model = {};



	//////////////////////////////////////////////
	//											//
	//                Events					//
	//											//
	//////////////////////////////////////////////

	model.events = function() {

		/**
		 * Subscribe
		 */

		// On node select, make sure the node is selected in the model
		radio("node:select").subscribe(select);

		// On node deselect, make sure the node is selected in the model
		radio("node:deselect").subscribe(deselect);
	};

	//////////////////////////////////////////////
	//											//
	//              Initialize					//
	//											//
	//////////////////////////////////////////////
	
	model.init = function() {
		// Load nodes
		model.nodes = json.nodes;

		// Load links
		model.links = json.links;

		// Arrange nodes in a map by id
		model.nodeMap = makeNodeMap(model.nodes);

		// Load session
		model.selected = session.loadSelected();
		model.current = session.loadCurrent();

	}



	//////////////////////////////////////////////
	//											//
	//            Public Functions				//
	//											//
	//////////////////////////////////////////////

	// Return list of selected nodes (model.selected only contains the 
	// indices, so this function is convenient for when we need to know 
	// more
	model.getSelected = function() {
		var sel = model.selected.map(function(i) { return model.nodeMap[i]; });
		return sel;
	}

	model.broadcastSelected = function() {
		// Broadcast session
		model.selected.forEach(function(e) { return radio("node:select").broadcast(e); });
		radio("node:current").broadcast(model.current);
	}




	//////////////////////////////////////////////
	//											//
	//           Private Functions				//
	//											//
	//////////////////////////////////////////////

	// Adds a new node to the list of selected nodes, but only if it 
	// isn't already in the list
	var select = function(index) {
		// Get a map of all the selected nodes
		var selMap = model.getSelected()
		// Check if index doesn't already exist
		if (selMap[index] != undefined) {
			// Add new item
			model.selected.push(index)
			// Save changes
			session.saveSelected(model.selected);
		}
	}

	// Removes the index from the list of selected nodes
	var deselect = function(index) {
		model.selected = model.selected.filter(function(i) { return (i != index); });
	}

	var makeNodeMap = function(nodes) {
		var map = new Object;
		nodes.forEach(function(n) { map[n.id] = n; });
		return map;
	}




	// subscribe to events and initialize
	model.init();
	model.events();

	// Return object
	return model;

});
