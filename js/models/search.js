define(["filter", "radio", "models/nodeList"], function (filter, radio, nodeList) {

	//////////////////////////////////////////////
	//											//
	//               Interface					//
	//											//
	//////////////////////////////////////////////
	var search = {};


	//////////////////////////////////////////////
	//											//
	//                Events					//
	//											//
	//////////////////////////////////////////////

	search.events = function() {

		// Listen for adding a new filter
		radio("filter:add").subscribe(add);

		// Listen for selecting only one filter
		radio("filter:selectOnly").subscribe(selectOnly);

		// Selecting a filter
		radio("filter:select").subscribe(select);

		// Deselecting a filter
		radio("filter:deselect").subscribe(deselect);

		// Remove a filter (Is this really necessary?)
		// radio("filter:remove").subscribe(remove);

		// Do an action on a filter (is this really necessary?)
		// radio("filter:action").subscribe(action);
	}

	//////////////////////////////////////////////
	//											//
	//               Properties					//
	//											//
	//////////////////////////////////////////////

	// The indices of the currently selected filters
	search.currentIndices = [];

	// List of all filters currently added
	search.filters = [];

	// List of all data instances (in the same order as the filters
	search.data = [];

	// The currently active filter
	search.current = filter.new();

	// The currently active results
	search.results = [];


	//////////////////////////////////////////////
	//											//
	//            Private Functions				//
	//											//
	//////////////////////////////////////////////
	
	// Adds a new filter
	var add = function(data) {

		// Create new filter and fill in the appropriate details
		var f = filter.new();

		// for each keyword/context combination, add to filter
		data.context.forEach(function(c) { 
			f = f.keyword(data.keywords, c);
		});

		// Add location and time
		f = f.location(data.location).interval(data.from, data.to);

		// Add filter to list of filters and data to list of data
		var index = search.filters.push(f) - 1;
		search.data[index] = data;

		// Set currentIndices to the index we just pushed
		search.currentIndices.push(index);

		// Update current filter
		search.current = createCurrent();

		// Draw the update
		radio("filter:publish").broadcast(data, index)
		// TODO
	}


	// Selects a filter and deselects all currently selected filters
	var selectOnly = function(index) {

		// Deselect all currently selected filters
		search.currentIndices.forEach(function(i) {
			radio("filter:deselect").broadcast(i);
		});

		// Select the one filter we want
		radio("filter:select").broadcast(index);
	}


	// Selects another filter (doesn't deselect the old filters)
	var select = function(index) {
		
		// Add index to currentIndices
		search.currentIndices.push(index)

		// Create current filter
		search.current = createCurrent();

		// Update graph
		updateResults();
	}


	// Deselects another filter (doesn't deselect the old filters)
	var deselect = function(index) {
		
		// Add index to currentIndices
		search.currentIndices.filter(function(i) { return (i != index); });

		// Create current filter
		search.current = createCurrent();
	}


	// Creates a filter which is a combination of the selected filters
	var createCurrent = function() {

		var c = filter.none();
		search.currentIndices.forEach(function (i) {
			c = c.or(search.filters[i]);
		});


		return c;
	}


	// Updates the graph with the search results
	var updateResults = function() {

		// Get the old nodes
		var oldNodes = search.results;

		// Get the nodes we are searching for
		search.results = current.nodes(nodeList.nodes);

		// For each of the old nodes, demark it
		oldNodes.forEach(function(n) { radio("search:remove").broadcast(node); });

		// For each of the new nodes, mark it
		search.results.forEach(function(n) { radio("search:add").broadcast(node); });
	}


	// Set events
	search.events();

	return search;
})
