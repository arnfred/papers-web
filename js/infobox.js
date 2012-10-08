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


	// Export the controller
	return infobox;
}
