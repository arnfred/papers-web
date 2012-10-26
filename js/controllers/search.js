define(["jquery", "util/delay", "radio"], function ($, delay, radio) {

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
		/**
		 * Broadcast
		 */

		// Broadcast the on searchfield click event
		$("#searchField").click(function (e) { radio("search:click").broadcast(e); });

		// Broadcast the on searchfield keyPress event
		$("#searchField").keyup(function (e) { radio("search:keypress").broadcast($(".search").attr("value"), e); });


		/**
		 * Subscribe
		 */

		// On search click, call either the select or the deselect event	
		radio("search:click").subscribe(click);

		// On search keypress, do a few things
		radio("search:keypress").subscribe(keyPress);
		
	}



	//////////////////////////////////////////////
	//											//
	//            Private Functions				//
	//											//
	//////////////////////////////////////////////


	// Make search box focus on click
	var click = function () {
		// Clear search box
		$(".search").attr("value","");
	}


	// Search on keypress
	var keyPress = function(term, e) {

		// If enter, deselect field
		if (e.which == 13) $(".search").blur();

		// Search for current term, but delay the search for 200 ms
		delay( function(){ radio("search:do").broadcast(term); }, 200 );
	}


	//////////////////////////////////////////////
	//											//
	//          Prepare and Return				//
	//											//
	//////////////////////////////////////////////


	search.events()
	return search;
})
