define(["jquery"], function ($) {

	// Define the infobox JS controller
	var ib = {};

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


	// Export the controller
	return ib;
}
