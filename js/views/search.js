define(["jquery", "radio", "util/datepicker", "models/search"], function ($, radio, ui, searchModel) {

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
		radio("filter:getData").subscribe(getData);
	}



	//////////////////////////////////////////////
	//											//
	//            Initialize Search				//
	//											//
	//////////////////////////////////////////////

	search.init = function() {

		// Init form
		initForm();
	}

	// Private functions


	// Collects data from the form, clears it and broadcasts add
	var getData = function() {
		var data = {};

		// Update all values
		data.keywords = $("input[name=keywords]").val();
		data.location = $("select[name=room]").val();
		if (data.location == "") data.location = undefined;

		// Get time
		var timeTo = $("input[name=totime]").val().split(":");
		var timeFrom = $("input[name=fromtime]").val().split(":");

		// Update dates
		data.from = $("input[name=from]").datepicker("getDate");
		data.to = $("input[name=to]").datepicker("getDate");

		// If we have hour and minute set, then put those, else use whole day
		if (timeFrom.length > 1 && timeTo.length > 1) {
			data.from.setHours(timeFrom[0], timeFrom[1]);
			data.to.setHours(timeTo[0], timeTo[1]);
		}
		else data.to.setHours(23,59);

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
		//$("#filterForm input").val("");

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
		f.click(function() { radio("filter:select").broadcast(index); });

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


	// Initialize the form
	var initForm = function(data) {

		// Get stats from model
		var minDate = searchModel.getMinDate();
		var maxDate = searchModel.getMaxDate();
		var rooms = searchModel.getRooms();

		// Initialize the datepicker
		$(".date_picker2").datepicker({
			buttonImage: "./img/calendar_gray.png", 
			buttonImageOnly: true, 
			showOn: "button",
			dateFormat: "yy/mm/dd", 
			minDate: minDate,
			maxDate: maxDate,
			constrainInput: false
		});

		// Set default dates and times
		$("input[name=from]").val(minDate.format("yyyy/mm/dd"));
		$("input[name=to]").val(maxDate.format("yyyy/mm/dd"));
		$("input[name=fromtime]").val("00:00");
		$("input[name=totime]").val("23:59");

		// Add rooms
		var roomSelect = $("select[name=room]");
		var opt;
		rooms.forEach(function(r) {
			// Clone option
			opt = roomSelect.children("option").first().clone();
			opt.val(r).html(r);
			roomSelect.append(opt);
		});

		// Set up form handler for the filters:
		$("#context-select")
		   .multiselect({
		      noneSelectedText: 'Add some context to filter',
		      selectedList: 4
		   });
		 $('button.ui-multiselect').css('width', '100%');
	}



	//////////////////////////////////////////////
	//											//
	//            Return Interface				//
	//											//
	//////////////////////////////////////////////

	search.events();
	search.init();
	return search;

});
