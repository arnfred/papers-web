define([], function() {


	// Work around for non-destructive merge
	var merge = function(obj1, obj2) {
		var result = m({}, obj1);
		return m(result, obj2);
	}

	/*
	 * Recursively merge properties of two objects 
	 * Kindly copied from: http://stackoverflow.com/questions/171251/how-can-i-merge-properties-of-two-javascript-objects-dynamically
	 */
	var m = function(obj1, obj2) {

		// Now go 
		for (var p in obj2) {
			try {
				// Property in destination object set; update its value.
				if ( obj2[p].constructor==Object ) {
					obj1[p] = merge(obj1[p], obj2[p]);

				} else {
					obj1[p] = obj2[p];

				}

			} catch(e) {
				// Property in destination object not set; create it and set its value.
				obj1[p] = obj2[p];

			}
		}

		return obj1;
	}

	return merge;
})

