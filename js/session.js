define(["jquery", "util/cookie", "radio"], function($, cookie, radio) {

	//////////////////////////////////////////////
	//											//
	//               Interface					//
	//											//
	//////////////////////////////////////////////
	var session = {}


	//////////////////////////////////////////////
	//											//
	//            Public Functions				//
	//											//
	//////////////////////////////////////////////
	
	/**
	 * TODO:
	 * Change this module to return a list of ints to a model that takes 
	 * care of all the data in the background
	 */

	// Saves the selected papers
	session.save = function() {
		// get ids
		// TODO: make this independent of the DOM
		var ids = $("li.asmListItem").map(function () { return $(this).attr("rel"); });
		
		// get current
		var cur = $("li.current").attr("rel");

		// Save ids and current
		cookie("selected", $.makeArray(ids).reverse().join(","), { expires: 365 });
		cookie("current", cur, { expires: 365 });

		// If there is no current, delete current cookie
		if (cur == undefined) cookie("current", null);
	}


	// Load selected papers
	session.load = function() {
		// get strings
		var txt = cookie("selected");
		var cur = cookie("current")
		var ids = txt ? txt.split(",") : [];

		// For each id, load it to the list
		for (i = 0; i < ids.length; i++) {
			if (!isNaN(parseInt(ids[i]))) radio("node:selected").broadcast(parseInt(ids[i]));
		}

		if (cur != null) radio("node:selected").broadcast(parseInt(cur));
	}

	return session;
})
