define(["filter"], function (filter) {

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


	//////////////////////////////////////////////
	//											//
	//            Private Functions				//
	//											//
	//////////////////////////////////////////////
	
	// Adds a new filter
	var add = function(data) {
		// I expect the data to be of the following format:
		// { id		  : number // Some integer
		//   keywords : "keyword1 keyword2",
		//   context  : [context1, context2, ...],
		//   location : "some room", // Can be left blank
		//   time     : { to : dateString, from : dateString }
		// }

		// Create new filter and fill in the appropriate details
		var f = filter.new();

		// for each keyword/context combination, add to filter
		data.context.forEach(function(c) { 
			var otherContext = filter.new().keyword(data.keywords, c);
			f = f.or(otherContext);
		}

		// Add location and time
		f = f.location(data.location).interval(data.time.from, data.time.to);

		// Add filter to list of filters and data to list of data
		var index = search.filters.push(f);
		search.data[index] = data;

		// Set currentIndices to the index we just pushed
		search.currentIndices.push(index);

		// Update current filer
		createCurrent();

		// Draw the update somehow
		// TODO
	}


	// Selects another filter (doesn't deselect the old filters)
	var select = function(index) {
		
		// Add index to currentIndices
		search.currentIndices.push(index)

		// Create current filter
		search.current = createCurrent();
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

		var c = filter.new();
		search.curentIndices.forEach(function (i) {
			c = c.or(search.filters[i]);
		});

		return c;
	}


	return search;
})
