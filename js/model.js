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
		 * Broadcast
		 */

		// Broadcasts select or deselect based on the id
		var toggleSelect = function(id) {
			if (model.isSelected(id)) radio("node:deselect").broadcast(id);
			else radio("node:select").broadcast(id);
		}


		/**
		 * Subscribe
		 */

		// On node select, make sure the node is selected in the model
		radio("node:select").subscribe(select);

		// On node deselect, make sure the node is selected in the model
		radio("node:deselect").subscribe(deselect);

		// On node current, make sure the node is marked as current in 
		// the model
		radio("node:current").subscribe(setCurrent);

		// When some code calls toggleSelect, we check if the node is 
		// selected or not and call the proper event back
		radio("node:toggleSelect").subscribe(toggleSelect);
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

		// Activate events
		model.events();
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
		var sel = new Object;
		model.selected.forEach(function(i) { sel[i] = model.nodeMap[i]; });
		return sel;
	}


	// Returns true if the id is selected and false if it isn't
	model.isSelected = function(id) {
		return (model.selected.indexOf(id) != -1);
	}


	// Broadcasts the selected nodes and the current nodes. This should 
	// only be called in the initialization of the page, but I've put it 
	// apart from init() since it relies on the graph being generated
	model.broadcastSelected = function() {
		// Broadcast session
		model.selected.forEach(function(e) { return radio("node:select").broadcast(e); });
		radio("node:current").broadcast(model.current);
	}


	// Finally this function is not a hack anymore. Returns the data 
	// based on an id of a node. Look in graph.js for it's companion 
	// 'getNodeFromId'
	model.getDataFromId = function(id) {
		return model.nodeMap[id];
	}


	// Fetches an abstract with an ajax call and adds it to a node if 
	// necessary before returning it
	model.getAbstract = function(id, callback) {

		var n = model.nodeMap[id];

		// If we have an abstract already, call the callback
		if (n.abstract != undefined) callback(n.abstract)

		// If not, then fetch abstract from server
		else {
			$.get("ajax.php", { task: "abstract", id: n.id }, function (data) { 
				n.abstract = data;
				if (callback != undefined) callback(data);
			});
		}
	}
	




	//////////////////////////////////////////////
	//											//
	//           Private Functions				//
	//											//
	//////////////////////////////////////////////

	// Adds a new node to the list of selected nodes, but only if it 
	// isn't already in the list
	var select = function(id) {
		// Get a map of all the selected nodes
		var selMap = model.getSelected();
		// Check if id doesn't already exist
		if (selMap[id] == undefined) {
			// Add new item
			model.selected.push(id)
			// Save changes
			session.saveSelected(model.selected);
		}
	}

	// Removes the id from the list of selected nodes
	var deselect = function(id) {
		model.selected = model.selected.filter(function(i) { return (i != id); });
		session.saveSelected(model.selected);
	}

	var setCurrent = function(id) {
		model.current = id;
	}

	var makeNodeMap = function(nodes) {
		var map = new Object;
		nodes.forEach(function(n) { map[n.id] = n; });
		return map;
	}




	// Initialize. The init is down here to keep the initialization on 
	// top of the function definitions. The events has to happen after 
	// the initialization
	model.init();

	// Return object
	return model;
});
