define(["jquery", "graph"], function ($, graph) {

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

	// Broadcast the on searchfield click event
	$(".searchField").click(function () { radio("search:click").broadcast(); });

	// TODO: broadcast onkeypress for search field
	// Broadcast the on searchfield keypress event
	// $(".searchField").click(function () { 
		//radio("search:click").broadcast(); });
	
	
	// On node click, call either the select or the deselect event	
	radio("search:click").subscribe(search.click);



	//////////////////////////////////////////////
	//											//
	//            Public Functions				//
	//											//
	//////////////////////////////////////////////
	
	// Make search box focus on click
	search.click = function () {
		var field = d3.select(".search")

		// Search for term
		var t = field.property("value")
		graph.search(t.toLowerCase()); 
		// Clear search box
		field.property("value", "");
	}); 
	
	// Search on keypress
	search.keyPress = function(e) {

		var delay = (function(){
			var timer = 0;
			return function(callback, ms){
				clearTimeout (timer);
				timer = setTimeout(callback, ms);
			};
		})();

		// Get field and term
		field 	= $("#searchField");
		term	= field.val();

		// If enter, deselect field
		if (e.which == 13) field.blur();

		// Check that there is something in the search box
		if (term.length == "") term = "Blablabla";

		// Search for current term 
		delay( function(){ searchPaper(term); }, 200 );
	}
})
