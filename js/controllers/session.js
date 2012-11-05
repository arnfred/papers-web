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
	

	// Save scheduled ids
	session.saveScheduled = function(scheduled) {
		var string = scheduled.join(",");
		cookie("scheduled", string, session.options);

		// Test to see if it was saved
		return cookie;
	}


	// Save focused
	session.saveFocused = function(focused) {
		
		cookie("focused", cur, { expires: 365 });

		// If there is no focused, delete focused cookie
		if (cur == undefined) cookie("focused", null);
	}


	// Load scheduled papers
	session.loadScheduled = function() {
		// get strings
		var txt = cookie("scheduled");
		var ids = txt ? txt.split(",") : [];

		// Parse scheduled and filter the NaN
		var scheduled = ids.map(function(e) { return parseInt(e); })
						  .filter(function(e) { return !isNaN(e); }); 

		return scheduled;
	}

	// Load focused paper
	session.loadFocused = function() {
		var cur = cookie("focused")
		return (cur == null) ? null : parseInt(cur);
	}

	
	return session;
})
