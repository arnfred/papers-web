define(["model", "util/merge", "util/array", "util/levenshtein", "util/curry"], 
	function(model, merge, arr, levenshtein, curry) {


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
					_nodes		: model.nodes,
					_filters	: [],
					_options	: {
						levenshtein	: 1,
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
	var keyword = function(terms, context) {

		// Get context
		var scope = this;

		var f		= function(node) { return filterKeyword(terms, context, scope, node); }
		var filters = this._filters.concat([f]);

		// Create new object containing the new filter
		var new_f = {	_filters	: filters };

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

		// Get context
		var scope = this;

		var f		= function(node) {
			// Check that the node is winthin the to and from date
			var inter	= scope._options.interval;
			var date	= model.getDate(node.id);
			var date_p	= (inter == undefined) || (inter.from < date && inter.to > date);
			return date_p;
		}

		// Add filter to list
		var filters = this._filters.concat([f]);

		// Create new object containing the new filter
		var new_f = {	_filters	: filters };

		// Merge the old and new filter and return
		return merge(this, new_f)
	}


	/**
	 * Returns a new filter that filters for a time interval
	 *
	 * arg loc	: String, 	The location of the presentation
	 **/
	var location = function(loc) {

		// Get context
		var scope = this;

		var f		= function(node) {
			// Check that the node has specified location
			var loc		= scope._options.location;
			var loc_p	= (loc == "" || loc == node.location);
			return loc_p;
		}

	}


	/**
	 * Returns the nodes matching the filter
	 **/
	var nodes = function() {

		// Get context
		var scope = this;

		// We filter the nodes with each filter that we have
		this._filters.forEach(function (f) { scope._nodes = scope._nodes.filter(f); });

		return this._nodes;
	}
		

	// Check if any words in string are within levenshtein distance d of any
	// word in the context
	var filterKeyword = function(terms, context, scope, node) {

		// Get max levenshtein distance and search term etc
		var dist		= scope._options.levenshtein; // default is set to 1
		var haystack	= (node[context]).toLowerCase().split(" ");
		var needles		= terms.toLowerCase().split(" ");

		// Figure out the length of the longest term
		var needle_lengths = needles.map(function (t) { return t.length; });
		var max_needle_length = Math.max.apply(null,needle_lengths);

		// Check if context contains any terms
		var match = needles.every(function(t) { return (haystack.indexOf(t) != -1); }); 

		// If there was no match and there are more than twice the number of
		// letters than the levenshtein distance, then try to do a fuzzy match
		if (match == false && max_needle_length > dist*2) {

			// Else check if there is a fuzzy match
			match = needles.every(function(n) {
				var min_dist = compareStrings(n, haystack);
				return (min_dist <= dist);
			});
		}

		// Return the matches
		return match;
	}


	// Calculates the levenshtein distance between a term and an array of
	// strings and returns the minimum of those distances
	var compareStrings = function(term, strings) {

		// For each term, get the levenshtein distance to the string
		var term_dist = strings.map(function (s) { 

			// Penalty for the first letter being different
			var penalty = (s[0] == term[0]) ? 0 : 2;
			var distance = levenshtein(s.substr(1),term.substr(1)); 
			return penalty + distance;
		});

		var min_dist = Math.min.apply(null,term_dist);
		return min_dist;
	}


	// Return the filter factory
	return filter;
})
