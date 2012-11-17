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

		// When a filter is selected
		radio("filter:select").subscribe(select);

		// When a filter is deselected
		radio("filter:deselect").subscribe(deselect);
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
		resetToDefault();

		// Now broadcast
		radio("filter:add").broadcast(data);
	}


	// Clear the form
	var resetToDefault = function() {

		// Get stats from model
		var minDate = searchModel.getMinDate();
		var maxDate = searchModel.getMaxDate();
		var rooms = searchModel.getRooms();

		// Set default dates and times
		$("input[name=from]").val(minDate.format("yyyy/mm/dd"));
		$("input[name=to]").val(maxDate.format("yyyy/mm/dd"));
		$("input[name=fromtime]").val("00:00");
		$("input[name=totime]").val("23:59");

		// Set default room value
		$("select[name=room]").val("");

		// Clean keywords
		$("input[name=keywords]").val("");

	}


	// Add a filter to the list
	var publish = function(filter, index) {
		// clone filter template
		var f = $("#filterItemTemplate").clone()

		// Add info
		var info = makeInfo(filter);
		f.find("p.filterItem").append(info);

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


	// Select a filter: Add the current class to the filter panel so it changes
	// color
	var select = function(index) {
		// get panel
		var f = $("#filter" + index);

		// Add class
		f.addClass("current");
	}


	// Deselect a filter: Remove the current class from the filter panel so it
	// changes color
	var deselect = function(index) {
		// get panel
		var f = $("#filter" + index);

		// Remove class
		f.removeClass("current");
	}


	// Create the string used to describe a filter
	var makeInfo = function(filter) {

		var keywords	= "";
        var context		= "";
        var present		= "";
        var location	= "";
        var time		= "";

		// Keywords
		if (filter.keywords) {
			keywords = " containing <span class=\"boldText\">" + filter.keywords + "</span>";
		}

		// Context
		if (filter.context.length > 0) {
			if (filter.context.length > 1) {
				var last = filter.context[filter.context.length - 1];
				filter.context.pop();
				context = " in <span class=\"italicText\">" + filter.context.join(", ") + "</span> and <span class=\"italicText\">" + last + "</span>";
			}

			else context = filter.context[0];
		}

		if (filter.location || (filter.from && filter.to)) {
	   		present = " with presentation";
		}

		// Interval
		if (filter.location) {
			location = " at <span class=\"italicText\">" + filter.location + "</span>";
		}

		// Location
		if (filter.from && filter.to) {
			time		= " between <span class=\"italicText\">" + filter.from.format("mmmm dS (HH:MM)") + "</span> and <span class=\"italicText\">" + filter.to.format("mmmm dS (HH:MM)") + "</span>";
		}

		return "Articles" + keywords + context + location + time;
	}


	// Initialize the form
	var initForm = function(data) {

		// Set default values to fields
		resetToDefault();

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
