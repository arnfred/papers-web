define(["jquery"], function($) {

	//////////////////////////////////////////////
	//											//
	//               Interface					//
	//											//
	//////////////////////////////////////////////
	var menu = {};


	//////////////////////////////////////////////
	//											//
	//                Events					//
	//											//
	//////////////////////////////////////////////
	

	menu.events = function () {

		/**
		 * Broadcast
		 */



		/**
		 * Subscribe
		 */

		// On nodeclick, make sure the current node is selected in the graph
		radio("menu:click").subscribe(show);

	}

	/**
	 * When a user clicks on an element in the list, this is the 
	 * function called
	 */
	var show = function(menuitem) {

		// Remove current class from former current menu item
		$(".currentListItem").removeClass("currentListItem");

		// Get box
		box = $("#" + menuitem.attr("class"))
		boxmm = box.add(".move");

		// set current class on currently active link
		menuitem.addClass("currentInfo");

		// If this box is already visible, hide it and remove class
		if (box.is(":visible")) {
			boxmm.slideUp();
			menuitem.removeClass("currentInfo");
		}

		// If some box is already visible, replace it with new one
		else if ($(".desc").is(":visible")) {
			$(".desc:visible").hide();
			box.show();
		}

		// Else slide it down
		else boxmm.slideDown();
	}

});
