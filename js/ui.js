define(["domReady!"], function () {


	// Here in the ui I initialize the graph, then I get a an array of node 
	// indeces and initialize the sidebar


	$(document).ready(function() {

		// Make search box work
		$("#searchField").keyup(function (e) { searchKeyPress(e); });

		// Make menu work
		$("#menulist li").click(function () { showInfo($(this)); return false; });

		// Make Surprise Me work
		$("#surprise").click(function () { return imFeelingLucky(); });


		// Selects all results of a particular search
		$("#selectAll").click(function () { vis.selectAll("circle.search").each( function (d,i) { select(d.index) }); });

		// Make the buttons on top of the schedule work
		setupScheduleMenu();

		// Make clickbox buttons work
		setupClickBox();

	});




	// What happens when we click on a node
	function nodeClick(data) {

		// Get index and node
		var index = data.index;
		var node = getNodeFromIndex(index);

		// Set current index in clickwrap (stupid html javascript content 
		// swapping)
		// $("#clickwrap").attr("index",index);

		// If node is selected, change image to Remove
		setClickBoxImage(index);


		// Get a list of connected nodes
		

		// Fade out all notes that aren't connected
		vis.selectAll("line.link.current")
			.filter(function (d) { return (d.source.index == index || d.target.index == index); })
			.classed("selected", true);

	}





})
