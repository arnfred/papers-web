define(["model", "util/merge", "util/array", "util/levenshtein"], function(model, merge, arr, levenshtein) {


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
					_nodes		: null,
					_options	: {
						levenshtein	: 1,
						keywords	: [],
						location	: ""
					}
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
		var scope = this;

		// Check if we've done this already
		if (this._nodes == null) {

			// Get nodes from model
			var ns = model.nodes;

			// Construct filter
			var f = function(n) { return searchFilter(n,scope); }

			// Now map nodes using filter
			this._nodes = ns.filter(f);
		}

		return this._nodes;
	}



	// The filtering function for searching
	var searchFilter = function(node, scope) {

		// Check if there are some search keywords that appear in some contexts
		var kw_p	= scope._options.keywords.some(function (k) {
			// Get context and word
			var c	= (node[k.context]).toLowerCase();
			var s	= k.word.toLowerCase();

			// Now check if s is in c
			return filterKeyword(s, c, scope);
		});

		// Check that the node has specified location
		var loc		= scope._options.location;
		var loc_p	= (loc == "" || loc == node.location);

		// Check that the node is winthin the to and from date
		var inter	= scope._options.interval;
		var date	= new Date(parseInt(node.date) + (new Date()).getTimezoneOffset()*60000)
		var date_p	= (inter == undefined) || (inter.from < date && inter.to > date);

		//return (loc_p && kw_p && date_p);
		console.debug(kw_p);
		return (loc_p && kw_p);

	}


	// Check if any words in string are within levenshtein distance d of any
	// word in the context
	var filterKeyword = function(string, context, scope) {

		// Get max levenshtein distance
		var dist = scope._options.levenshtein; // default is set to 1

		// Ssplit string into terms
		var terms = string.split(" ");

		// Split context into terms
		var c = context.split(" ");

		// Check if context contains any terms
		var match = terms.every(function(t) { return (c.indexOf(t) != -1); }); 

		// If there was a match or if the distance is 0 return the result of the match
		if (match == true || dist == 0) return match;

		// Else check if there is a fuzzy match
		var fuzzy = terms.every(function(t) {

			// Return true if the smallest distance is less or equal to dist 
			var term_dist = c.map(function (w) { return levenshtein(w,t); });
			var min_dist = Math.min.apply(null,term_dist);
			return (min_dist <= dist);
		});

		// Return the result of our fuzzy match
		return fuzzy;
	}


	// Return the filter factory
	return filter;
})
