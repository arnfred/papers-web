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

		// Updates the abstract if needed
		setAbstract(node)

		// Set current index in clickwrap (stupid html javascript content 
		// swapping)
		$("#clickwrap").attr("index",index);

		// If node is selected, change image to Remove
		setClickBoxImage(index);

		// Set download link
		node.each(function (d) { $("#download a").attr("href", d.pdf).attr("target", "_blank"); });
			
		// Change position of and fade in
		pos = $(node[0][0]).position();
		$("#clickwrap")
			.stop(true, true)
			.css("left",pos.left + 5 + "px")
			.css("top", pos.top + 6 + "px")
			.fadeIn().delay(3000).fadeOut();

		// Get a list of connected nodes
		

		// Fade out all notes that aren't connected
		vis.selectAll("line.link.current")
			.filter(function (d) { return (d.source.index == index || d.target.index == index); })
			.classed("selected", true);

	}

	function setClickBoxImage(index) {
		// Get node
		var node = getNodeFromIndex(index);

		// Check if node is selected
		if (!node.classed("selected")) {
			$("#select img").attr("src","img/icons/calendar.png").css("padding-top",0);	
			$("#select a").attr("title","Add to Schedule");
		}
		else {
			$("#select img").attr("src","img/icons/remove.png").css("padding-top","2px");	
			$("#select a").attr("title","Remove from Schedule");
		}
	}


	function setupClickBox() {

		// Make sure box doesn't dissappear before the mouse leaves
		$("#clickwrap").hover(function () { $(this).stop(true,true); }, function () { $(this).stop(true,true).delay(500).fadeOut(); })

		// Set up select
		$("#select").click(function () { 
			// Get index
			var index = $(this).parent().parent().attr("index");

			// Select or deselect paper
			selectToggle(index); 

			// Change image
			setClickBoxImage(index);
		});

	}


})
