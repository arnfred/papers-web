define(["util/merge", "util/array", "util/levenshtein", "util/curry"], 
	function(merge, arr, levenshtein, curry) {

	/**
	 * Filters produce a filter with the following properties:
	 * - Every filter is immutable
	 * - f.or(g) == g.or(f)
	 * - f.and(g) == g.and(f)
	 *
	 * The filters implement many useful functions for filtering through the
	 * nodes. You can see them by browsing the file
	 *
	 **/

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
					nodes		: nodesfun,
					and			: andFilter,
					or			: orFilter,
					not			: not,
					_nodes		: undefined,
					_filter		: t,
					_options	: {
						levenshtein	: 1,
					}
			}

		return f;
	}


	// Filter that matches none
	filter.none = function() {

		return merge(filter.new(), { _filter: function (node) { return false; } });
	}


	// Filter that matches all
	filter.all = filter.new
	
	
	//////////////////////////////////////////////
	//											//
	//           Private Functions				//
	//											//
	//////////////////////////////////////////////
	

	// Merges two filter objects
	var andFilter = function(g) {
		var f = this;
		var new_f = merge(this, { _nodes : undefined });
		return and(new_f,g._filter);
	}


	// Merges two filter objects
	var orFilter = function(g) {
		var f = this;
		var new_f = merge(this, { _nodes : undefined });
		return or(new_f,g._filter);
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
	 * Returns a new filter which is the negative of this
	 *
	 **/
	var not = function() {

		var f		= this;

		// Create a filter that returns true if this turns false
		var g		= function(node) { return !f._filter(node); };

		// Create object containing the new filter
		var new_f	= { _filter	: g, _nodes : undefined };

		// Merge new and old filter and return
		return merge(this, new_f);
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
		if (from == undefined || to == undefined) return this; // throw new Error("Missing date in filter interval");

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
			var loc_p	= (loc == undefined || loc == node.room);
			return loc_p;
		}

		// Return the logical and combination of the past node and the new filter
		return and(this, g);
	}


	/**
	 * Returns the nodes matching the filter
	 **/
	var nodesfun = function(nodes) {

		// Check if we have any nodes to filter
		if (nodes == undefined && this._nodes == undefined) throw new Error("No nodes supplied to filter");

		// Check if we have any preset nodes
		if (this._nodes == undefined) this._nodes = nodes;

		// We filter the nodes
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
