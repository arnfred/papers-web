define(["data/graph", "radio", "controllers/session", "util/array", "util/cookie", "data/position", "models/nodeFactory"], 
	   function(json, radio, session, arrrr, cookie, position, nodeFactory) {

/* TRAILHEAD MODEL
 * ---------------------------------------------------
 *	
 *	this file contain the model for the nodes
 *	
 *	
 *	---------------------------------------------------
 *	each node has the following information:
 *	
 *	id: the unique ID of the node
 *	links: the adjacents links
 *	domNode: the object displayed in the DOM
 *	pos: position of the node in the graph
 *		 TODO: The position is found with force layout
 *
 *	---------------------------------------------------
 *	And the link has the following informations:
 *	
 *	target: the node at the other end
 *	value: the link weight computed by our algorithm
 *		   curently we do not use it.
 *	domLink: a ref the object displayed in the DOM.
 *	---------------------------------------------------
 *
 *
 *	A node can be:
 *	
 * 	selected: we click on it and then we can do some
 *			  some action on it
 *
 *	scheduled: we have added it to our schedule.
 *
 *	Focused: The cursor was last over this node
 */


	//////////////////////////////////////////////
	//											//
	//               Interface					//
	//											//
	//////////////////////////////////////////////
	var nodes = {};



	//////////////////////////////////////////////
	//											//
	//                Events					//
	//											//
	//////////////////////////////////////////////

	nodes.events = function() {

		/**
		 * Broadcast
		 */

		// Broadcasts select or deselect based on the id
		var toggleScheduled = function(id) {
			if (nodes.isScheduled(id)) radio("node:unscheduled").broadcast(id);
			else radio("node:scheduled").broadcast(id);
		}


		/**
		 * Subscribe
		 */

		// On node select, make sure the node is selected in the nodes
		radio("node:select").subscribe(select);

		// On node scheduled, we add it to the list of scheduled nodes
		// And change its color. 
		radio("node:scheduled").subscribe(scheduled);
		
		// On node unscheduled, we drop it from the scheduled list
		// and reset the UI.
		radio("node:unscheduled").subscribe(unscheduled);

		// On node focused, make sure the node is marked as focused in 
		// the nodes
		radio("node:focused").subscribe(setFocused);

		// When some code calls toggleSelect, we check if the node is 
		// selected or not and call the proper event back
		radio("node:toggleScheduled").subscribe(toggleScheduled);
	};

	//////////////////////////////////////////////
	//											//
	//              Initialize					//
	//											//
	//////////////////////////////////////////////
	
	nodes.init = function() {
		
		// The init function load the model of nodes
		// It creates for each node an object with containing
		// all the related information
		
		// Load nodes
		nodes.node = json.nodes.map(nodeFactory.new);
		
		// nodes.node = new Array();

		// json.nodes.forEach( function(el, i) {
		// 	
		// 	el.id = i;
		// 	el.links = new Array();
		// 	el.domNode = null;
		// 	el.pos = position[i];
		// 	nodes.node[i] = el;
		// 	
		// });
		
		
		// Load links
		json.links.forEach( function(link, i) {
				// TODO: verify it is not already in!
				nodes.node[link.source].addLink(link,"normal");
				nodes.node[link.target].addLink(link,"reversed");
				// nodes.node[link.source].links.push({source: link.source, target: link.target, value: link.value, domlink: null});
				// nodes.node[link.target].links.push({source: link.target, target: link.source, value: link.value, domlink: null}); 
		});
		

		// Load session
		// Load the node that are already scheduled
		//nodes.scheduled = session.loadSelected();
		nodes.scheduled = session.loadScheduled();
		
		/*  TODO: This loading should be done in 
		 *	the future by looking session
		 * 	in the DB with Play
		 */
		nodes.focused = session.loadFocused();
		
		// TODO: save it in session and load it here.
		nodes.selected = null;

	}



	//////////////////////////////////////////////
	//											//
	//            Public Functions				//
	//											//
	//////////////////////////////////////////////


	// Return list of selected nodes (nodes.selected only contains the 
	// indices, so this function is convenient for when we need to know 
	// more
	nodes.getScheduled = function() {
		var sel = new Object;
		nodes.scheduled.forEach(function(i) { sel[i] = nodes.node[i]; });
		return sel;
	}


	// Returns true if the id is selected and false if it isn't
	nodes.isScheduled = function(id) {
		return (nodes.scheduled.indexOf(id) != -1);
	}


	// Broadcasts the selected nodes and the focused nodes. This should 
	// only be called in the initialization of the page, but I've put it 
	// apart from init() since it relies on the graph being generated
	nodes.broadcastScheduled = function() {
		// Broadcast session
		nodes.scheduled.forEach(function(e) { return radio("node:scheduled").broadcast(e); });
		//radio("node:focused").broadcast(nodes.focused);
	}


	// Finally this function is not a hack anymore. Returns the data 
	// based on an id of a node. Look in graph.js for it's companion 
	// 'getNodeFromId'
	nodes.getDataFromId = function(id) {
		return nodes.node[id];
	}


	// Get random node
	nodes.getRandom = function() {
		return Math.ceil(Math.random()*nodes.node.length)
	}


	// Fetches an abstract with an ajax call and adds it to a node if 
	// necessary before returning it
	nodes.getAbstract = function(id, callback) {

		var n = nodes.node[id];

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
	var scheduled = function(id) {
		// Get a map of all the selected nodes
		var selMap = nodes.getScheduled();
		// Check if id doesn't already exist
		if (selMap[id] == undefined) {
			// Add new item
			nodes.scheduled.push(id)
			// Save changes
			session.saveScheduled(nodes.scheduled);
		}
	}

	// Removes the id from the list of selected nodes
	var unscheduled = function(id) {
		nodes.scheduled = nodes.scheduled.filter(function(i) { return (i != id); });
		session.saveScheduled(nodes.scheduled);
	}

	
	// Load the last focused node
	var setFocused = function(id) {
		nodes.focused = id;
	}


	// Select a node (when it is clicked)
	var select = function(id) {
		nodes.selected = id;
	}


	// Initialize. The init is down here to keep the initialization on 
	// top of the function definitions. The events has to happen after 
	// the initialization
	nodes.init();
	nodes.events();

	// Return object
	return nodes;
});
