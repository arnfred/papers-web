define(["util/merge", "util/array", "util/levenshtein", "util/curry"], 
	function(merge, arr, levenshtein, curry) {


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
	filter.new = function(nodes) {

		// These are the functions available for a new filter
		var f = {	keyword		: keyword,
					interval	: interval,
					location	: location,
					nodes		: nodes,
					and			: andFilter,
					or			: orFilter,
					_nodes		: nodes,
					_filter		: t,
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
	 * Returns a new filter which is a combination of this and g
	 *
	 * arg g		: filter, 			the filter we are combining with
	 **/
	// var and = function(g) {
	// 	// Create new
	// 	var filters = this._filters.concat(g._filters);

	// 	// Create new object containing the new filter
	// 	var new_f = {	_filters	: filters };

	// 	// Merge the old and new filter and return
	// 	return merge(this, new_f)
	// }
	

	// Merges two filter objects
	var andFilter = function(g) {
		var f = this;
		return and(f,g._filter);
	}


	// Merges two filter objects
	var orFilter = function(g) {
		var f = this;
		return or(f,g._filter);
	}


	// A function that always returns true
	var t = function(n) { return true; }


	/**
	 * Returns a new filter which is a logical and of this and g
	 *
	 * arg g		: filter, 			the filter we are combining with
	 **/
	var and = function(f, g) {

		// Create new filter
		var fg		= function(node) { return g(node) && f._filter(node); }

		// Create new object containing the new filter
		var new_f 	= {	_filter	: fg };

		// Merge the old and new filter and return
		return merge(f, new_f)
	}


	/**
	 * Returns a new filter which is a logical or of this and g
	 *
	 * arg g		: filter, 			the filter we are combining with
	 **/
	var or = function(f, g) {

		// Create new filter
		var fg		= function(node) { return g(node) || f._filter(node); }

		// Create new object containing the new filter
		var new_f 	= {	_filter	: fg };

		// Merge the old and new filter and return
		return merge(f, new_f)
	}

	/**
	 * Returns a new filter that filters for word
	 *
	 * arg words	: String, 			A string of words that are searched for
	 * arg context	: List[String], 	Where in the paper the word should be looked for
	 **/
	var keyword = function(terms, context) {

		// Catch scope
		var scope = this;

		// Define keyword filter
		var g = function(node) { return filterKeyword(terms, context, scope, node); }

		// Return the logical and combination of the past node and the new filter
		return and(this, g);
	}




	/**
	 * Returns a new filter that filters for a time interval
	 *
	 * arg from	: DateTime, 	The start date and time
	 * arg to	: DateTime, 	The end date and time
	 **/
	var interval = function(from, to) {

		// if from and to are undefined we fail hard
		if (from == undefined || to == undefined) throw new Error("Missing date in filter interval");

		var g		= function(node) {
			// Check that the node is winthin the to and from date
			var date	= node.getDate();
			var date_p	= (from == undefined) || (from < date && to > date);
			return date_p;
		}

		// Return the logical and combination of the past node and the new filter
		return and(this, g);
	}


	/**
	 * Returns a new filter that filters for a time interval
	 *
	 * arg loc	: String, 	The location of the presentation
	 **/
	var location = function(loc) {

		var g		= function(node) {
			// Check that the node has specified location
			var loc_p	= (loc == "" || loc == node.room);
			return loc_p;
		}

		// Return the logical and combination of the past node and the new filter
		return and(this, g);
	}


	/**
	 * Returns the nodes matching the filter
	 **/
	var nodes = function() {

		// We filter the nodes with each filter that we have
		this._nodes = this._nodes.filter(this._filter);

		return this._nodes;
	}
		

	// Check if all words in string are within levenshtein distance d of any
	// word in the context
	var filterKeyword = function(terms, context, scope, node) {

		// Get max levenshtein distance and search term etc
		var dist		= scope._options.levenshtein; // default is set to 1
		var haystack	= (node[context]).toLowerCase().split(" ");
		var needles		= terms.toLowerCase().split(" ");

		// Figure out the length of the longest term
		var needle_lengths = needles.map(function (t) { return t.length; });
		var max_needle_length = Math.max.apply(null,needle_lengths);

		// Check if context contains all terms
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
