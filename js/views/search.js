define(["jquery", "radio"], function ($, radio) {

	// Init
	var search = {};

	// Events
	search.events = function() {

		// Broadcast the click on add
		$("#addFilter").click(function(e) { radio("filter:getData").broadcast(e); });

		// When a filter is published to the filter list
		radio("filter:publish").subscribe(publish);

		// When a filter is removed
		radio("filter:remove").subscribe(remove);

		// When a filter is edited
		radio("filter:edit").subscribe(edit);

		// When the add button is clicked
		radio("filter:getData").subscribe(getData)
	}


	// Private functions


	// Collects data from the form, clears it and broadcasts add
	var getData = function() {
		var f = {};

		// Update all inputs
		f.keywords = $("input[name=keywords]").val();
		f.location = $("input[name=location]").val();

		// Update dates (some stuff needs to be done here
		f.to = $("input[name=to]").val();
		f.from = $("input[name=from]").val();

		// Get stuff from select boxes (how?)

		// Now clear the form
		clear();

		// Now broadcast
		radio("filter:add").broadcast(f);

		console.log(f)
	}


	// Clear the form
	var clear = function() {
		// Clean all input
		$("form[name=filters] input").val("");

		// Clear selects (how?)
		// I'll figure that out
	}


	// Add a filter to the list
	var publish = function(filter, index) {
		// clone filter template
		var f = $("#filterItemTemplate").clone()

		// Add info
		var info = makeInfo(filter);
		f.children("p").append(info);

		// Add id
		f.attr("id","filter" + index);

		// now add text and add it
		$("#filterList").append(f)
	}


	// remove a filter
	var remove = function(index) {
		// Get the filter
		var f = $("#filter" + index);

		// Now remove
		f.remove();
	}


	// Edit a filter
	var edit = function(filter) {
		// Update all inputs
		$("input[name=keywords]").val(filter.keywords);
		$("input[name=location]").val(filter.location);

		// Update dates (some stuff needs to be done here
		$("input[name=to]").val(filter.to);
		$("input[name=from]").val(filter.from);

		// Updates select boxes

		// How about we change the color of the edit to something else
	}


	// Create the string used to describe a filter
	var makeInfo = function(filter) {

		var keywords	= (filter.keywords)	? " containing " + filter.keywords : "";
		var context		= (filter.context)	? " in " + filter.context.join(", ") : ""; 
		var present		= (filter.location || (filter.from && filter.to)) ? " with presentation" : "";
		var location	= (filter.location)	? " at " + filter.location : "";
		var time		= (filter.from && filter.to) ? " between " + filter.from + " and " + filter.to : "";

		return "Find articles" + keywrods + context + present + loaction + time;
	}
	
	return search;

});
