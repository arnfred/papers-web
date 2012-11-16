define(["jquery", "radio", "util/datepicker"], function ($, radio) {

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
		var data = {};

		// Update all values
		data.keywords = $("input[name=keywords]").val();
		data.location = $("select[name=location]").val();

		// Update dates (some stuff needs to be done here
		data.to = Date.parse($("input[name=to]").val());
		if (isNaN(data.to)) data.to = undefined;
		else data.to = new Date(data.to);
		data.from = Date.parse($("input[name=from]").val());
		if (isNaN(data.from)) data.from = undefined;
		else data.from = new Date(data.from);

		// Get stuff from select boxes
		data.context = $("select[name='context[]']").val();
		if (!data.context) data.context = [];

		// Now clear the form
		clear();

		// Now broadcast
		radio("filter:add").broadcast(data);
	}


	// Clear the form
	var clear = function() {
		// Clean all input
		$("#filterForm input").val("");

		// Clear selects (how?)
		// I'll figure that out
	}


	// Add a filter to the list
	var publish = function(filter, index) {
		// clone filter template
		var f = $("#filterItemTemplate").clone()

		// Add info
		var info = makeInfo(filter);
		f.children("p.filterItem").append(info);

		// Add id
		f.attr("id","filter" + index);

		// Make clickable
		f.click(function() { radio("filter:selectOnly").broadcast(index); });

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
		var context		= (filter.context.length > 0)	? " in " + filter.context.join(", ") : ""; 
		var present		= (filter.location || (filter.from && filter.to)) ? " with presentation" : "";
		var location	= (filter.location)	? " at " + filter.location : "";
		var time		= (filter.from && filter.to) ? " between " + filter.from + " and " + filter.to : "";

		return "Find articles" + keywords + context + present + location + time;
	}

	// Run events
	search.events();
	
	return search;

});
