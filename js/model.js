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

		// Broadcast session
		model.selected.map(function(e) { return radio("node:select").broadcast(e); });
		radio("node:isCurrent").broadcast(model.current);
	}



	//////////////////////////////////////////////
	//											//
	//            Public Functions				//
	//											//
	//////////////////////////////////////////////

	// Initialize selected and current paper
	model.getSelected = function() {
		var sel = model.selected.map(function(i) { return model.nodeMap[i.id]; });
		return sel;
	}



	//////////////////////////////////////////////
	//											//
	//           Private Functions				//
	//											//
	//////////////////////////////////////////////

	var select = function(index) {
		// Add new item
		model.selected.push(index)
		// Save changes
		session.saveSelected(model.selected);
	}

	var deselect = function(index) {
		model.selected = model.selected.filter(function(i) { return (i != index); });
	}

	var makeNodeMap = function(nodes) {
		var map = new Object;
		nodes.forEach(function(n) { map[n.id] = n; });
	}

		// Add node to selected

	// Returns a list of selected with data
	// TODO
	// model.getSelected = function() {
	// }


	// subscribe to events
	model.init();
	model.events();

	// Return object
	return model;

});
