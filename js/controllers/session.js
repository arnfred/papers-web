define(["jquery", "util/cookie", "util/array", "radio"], function($, cookie, arrr, radio) {

	//////////////////////////////////////////////
	//											//
	//               Interface					//
	//											//
	//////////////////////////////////////////////
	var session = {}

	// Initialize cookie options
	session.options = { expires: 365, path: '/' };


	//////////////////////////////////////////////
	//											//
	//            Public Functions				//
	//											//
	//////////////////////////////////////////////
	

	// Save selected ids
	session.saveSelected = function(selected) {
		var string = selected.join(",");
		cookie("selected", string, session.options);

		// Test to see if it was saved
		return cookie;
	}

	// Save current
	session.saveCurrent = function(current) {
		
		cookie("current", cur, { expires: 365 });

		// If there is no current, delete current cookie
		if (cur == undefined) cookie("current", null);
	}




	// Load selected papers
	session.loadSelected = function() {
		// get strings
		var txt = cookie("selected");
		var ids = txt ? txt.split(",") : [];

		// Parse selected and filter the NaN
		var selected = ids.map(function(e) { return parseInt(e); })
						  .filter(function(e) { return !isNaN(e); }); 

		return selected;
	}

	// Load current paper
	session.loadCurrent = function() {
		var cur = cookie("current")
		return (cur == null) ? null : parseInt(cur);
	}

	
	// Load selected and current papers
	session.load = function() {
		// get strings
		var txt = cookie("selected");
		var cur = cookie("current")
		var ids = txt ? txt.split(",") : [];

		// For each id, load it to the list
		for (i = 0; i < ids.length; i++) {
			// TODO: this is not the right way to do it. Instead we 
			// should have the nodes loaded to a model from which we 
			// initialize them
			if (!isNaN(parseInt(ids[i]))) radio("node:selected").broadcast(parseInt(ids[i]));
		}

		if (cur != null) radio("node:selected").broadcast(parseInt(cur));
	}

	return session;
})
