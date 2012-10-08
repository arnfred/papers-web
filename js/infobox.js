define(["jquery"], function ($) {

	//////////////////////////////////////////////
	//											//
	//               Interface					//
	//											//
	//////////////////////////////////////////////
	var infobox = {};



	//////////////////////////////////////////////
	//											//
	//                Events					//
	//											//
	//////////////////////////////////////////////
	
	infobox.events = function () {

		/**
		 * Broadcast
		 */

		/**
		 * Subscribe
		 */
	}



	//////////////////////////////////////////////
	//											//
	//            Public Functions				//
	//											//
	//////////////////////////////////////////////




	//////////////////////////////////////////////
	//											//
	//           Private Functions				//
	//											//
	//////////////////////////////////////////////




	/**
	 * Code for fading out the infobox
	 */
	var fadeOut = function () {
		// Fade out description
		$("#info").stop(true, true).delay(3000).fadeOut();
	}

	/**
	 * Code for fading in the infobox
	 */
	var fadeIn = function (data) {
		// Get description
		$("#info").text(data.authors + ": " + data.title);
		$("#info").stop(true,true).fadeIn("fast");
	}


	/**
	 * Sets the abstract in the infobox
	 */
	function setAbstract(index) {
		
		// Default abstract (loader in case we are loading from the web 
		// server)
		var abstract = "<img class=\"loading\" src=\"img/ajax-loader_dark.gif\" style=\"margin:3px 0\"/><span class=\"loading-text\">Loading Abstract...</span>";

		
		
		// get time, date and room
		node.each(function (d) {

			// If the abstract isn't catched, fetch it
			if (abstr == null) {
				// Fetch Abstract
				$.get("ajax.php", { task: "abstract", id: d.id }, function (data) { 
					$("#infoAbstract").html(data); 
					node.attr("abstract",data);
				});
			}

			// Prepare other variables
			//
			var date		= new Date(parseInt(d.date) + (new Date()).getTimezoneOffset()*60000)
			var time		= date.format("HH:MM") + " on " + date.format("dddd mmm d, yyyy");
			var room		= "&nbsp;Room: " + d.room + "";
			var title		= d.title;
			var authors		= "By " + d.authors;

			var html		= "<p class=\"ii\" id=\"infoTitle\">" + title + "</p>";
			html		   += "<p class=\"ii\" id=\"infoAuthors\">" + authors + "</p>";
			html		   += "<p class=\"ii\" id=\"infoAbstract\">" + abstr + "</p>";
			html		   += "<p class=\"ii\" id=\"infoRoom\">" + room + "</p>";
			html		   += "<p class=\"ii\" id=\"infoTime\">" + time + ", </p>";
			html		   += "<br class=\"clear\"/>";


			// Append html
			$("#info").stop(true,true).fadeIn().html(html);
		})

		
	}


	// Export the controller
	return infobox;
}
