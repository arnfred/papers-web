define(["model", "util/merge", "util/array"], function(model, merge, arr) {


	//////////////////////////////////////////////
	//											//
	//               Interface					//
	//											//
	//////////////////////////////////////////////
	var filter = {};




	//////////////////////////////////////////////
	//											//
	//             Public Functions				//
	//											//
	//////////////////////////////////////////////
	filter.new = function() {

		// These are the functions available for a new filter
		var f = {	keyword		: keyword,
					interval	: interval,
					location	: location,
					//compose		: compose,
					nodes		: nodes,
					_options	: {},
					_nodes		: null
			}

		return f;
	}
	
	
	//////////////////////////////////////////////
	//											//
	//           Private Functions				//
	//											//
	//////////////////////////////////////////////
	
	/**
	 * Returns a new filter that filters for word
	 *
	 * arg words	: String, 			A string of words that are searched for
	 * arg context	: List[String], 	Where in the paper the word should be looked for
	 **/
	var keyword = function(w, c) {

		// Returns the current options from the filter
		var old_kws = this._options.keywords;
		if (old_kws == undefined) old_kws = [];

		// Add our new word and context to the list of keywords
		var kws = old_kws.concat([{ word: w, context: c }]);

		// Construct a new filter
		var new_f = {	_options	: { keywords : kws } };

		// Merge the old and new filter and return
		return merge(this, new_f)


	}


	/**
	 * Returns a new filter that filters for a time interval
	 *
	 * arg from	: DateTime, 	The start date and time
	 * arg to	: DateTime, 	The end date and time
	 **/
	var interval = function(from, to) {

		// Construct a new filter
		var new_f = {	_options	: { date_from : from, 
										date_to : to } };

		// Merge the old and new filter and return
		return merge(this, new_f)
	}


	/**
	 * Returns a new filter that filters for a time interval
	 *
	 * arg loc	: String, 	The location of the presentation
	 **/
	var location = function(loc) {

		// Construct a new filter
		var new_f = {	_options	: { location : loc } };

		// Merge the old and new filter and return
		return merge(this, new_f)
	}


	/**
	 * Returns a new filter that filters for a time interval
	 *
	 * arg loc	: String, 	The location of the presentation
	 **/
	var nodes = function() {

		// Keep this as the right object and not the window
		var that = this;

		// Check if we've done this already
		if (that._nodes == null) {

			// Get nodes from model
			var ns = model.nodes;

			// Construct filter
			var f = function(n) {

				// Check if there are some search keywords that appear in some contexts
				var kw_p = that._options.keywords.some(function (k) {
					// Get context and word
					var c = k.context;
					var s = k.word;

					// Check if word is within context
					// TODO: levenshtein etc
					return ((n[c]).indexOf(s) != -1);
				});

				// Check that the node has specified location
				var loc = that._options.location;
				var loc_p = (loc == undefined || loc == n.location);

				// Check that the node is winthin the to and from date
				// TODO


				return ([loc_p, kw_p]).every(function (e) { return (e == true); });
			}

			// Now map nodes using filter
			that._nodes = ns.filter(f);
		}

		return that._nodes;
	}


	// Return the filter factory
	return filter;
})
