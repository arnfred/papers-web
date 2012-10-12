define(["domReady!"], function () {


	// Here in the ui I initialize the graph, then I get a an array of node 
	// indeces and initialize the sidebar


	$(document).ready(function() {

		// Make search box work
		$("#searchField").keyup(function (e) { searchKeyPress(e); });



		// Selects all results of a particular search

		// Make the buttons on top of the schedule work
		setupScheduleMenu();

		// Make clickbox buttons work
		setupClickBox();

	});








})
