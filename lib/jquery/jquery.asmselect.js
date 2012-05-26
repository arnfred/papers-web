/*
 * Alternate Select Multiple (asmSelect) 1.0.4a beta - jQuery Plugin
 * http://www.ryancramer.com/projects/asmselect/
 * 
 * Copyright (c) 2009 by Ryan Cramer - http://www.ryancramer.com
 * 
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 */
asmOptions = {

	listType: 'ol',								// Ordered list 'ol', or unordered list 'ul'
	sortable: false, 							// Should the list be sortable?
	highlight: false,							// Use the highlight feature? 
	animate: false,								// Animate the the adding/removing of items in the list?
	addItemTarget: 'bottom',					// Where to place new selected items in list: top or bottom
	hideWhenAdded: false,						// Hide the option when added to the list? works only in FF
	debugMode: false,							// Debug mode keeps original select visible 

	removeLabel: 'remove',						// Text used in the "remove" link
	highlightAddedLabel: 'Added: ',				// Text that precedes highlight of added item
	highlightRemovedLabel: 'Removed: ',			// Text that precedes highlight of removed item

	containerClass: 'asmContainer',				// Class for container that wraps this widget
	selectClass: 'asmSelect',					// Class for the newly created <select>
	optionDisabledClass: 'asmOptionDisabled',	// Class for items that are already selected / disabled
	listClass: 'asmList',						// Class for the list ($asmOl)
	listSortableClass: 'asmListSortable',		// Another class given to the list when it is sortable
	listItemClass: 'asmListItem',				// Class for the <li> list items
	listItemLabelClass: 'asmListItemLabel',		// Class for the label text that appears in list items
	removeClass: 'asmListItemRemove',			// Class given to the "remove" link
	highlightClass: 'asmHighlight'				// Class given to the highlight <span>

};

(function($) {

	$.fn.asmSelect = function(customoptions) {


		$.extend(asmOptions, customoptions); 

		return this.each(function(index) {

			$asmOriginal = $(this); 					// the original select multiple
			$asmContainer = null; 							// a container that is wrapped around our widget
			$asmSelect = null; 								// the new select we have created
			$asmOl = null; 									// the list that we are manipulating
			asmBuildingSelect = false; 				// is the new select being constructed right now?
			asmIEClick = false;						// in IE, has a click event occurred? ignore if not
			asmIgnoreOriginalChangeEvent = false;		// originalChangeEvent bypassed when this is true
			asmIndex = index;


			init();
		});
	};

})(jQuery); 

function init() {

	// initialize the alternate select multiple

	// this loop ensures uniqueness, in case of existing asmSelects placed by ajax (1.0.3)
	while($("#" + asmOptions.containerClass + asmIndex).size() > 0) asmIndex++; 

	$asmSelect = $("<select></select>")
	.addClass(asmOptions.selectClass)
	.attr('name', asmOptions.selectClass + asmIndex)
	.attr('id', asmOptions.selectClass + asmIndex); 

	$asmSelectRemoved = $("<select></select>"); 

	$asmOl = $("<" + asmOptions.listType + "></" + asmOptions.listType + ">")
	.addClass(asmOptions.listClass)
	.attr('id', asmOptions.listClass + asmIndex); 

	$asmContainer = $("<div></div>")
	.addClass(asmOptions.containerClass) 
	.attr('id', asmOptions.containerClass + asmIndex); 

	buildSelect();

	$asmSelect.change(selectChangeEvent)
	.click(selectClickEvent); 

	$asmOriginal.change(originalChangeEvent)
	.wrap($asmContainer).before($asmSelect).before($asmOl);

	if(asmOptions.sortable) makeSortable();

	if($.browser.msie && $.browser.version < 8) $asmOl.css('display', 'inline-block'); // Thanks Matthew Hutton
}

function makeSortable() {

	// make any items in the selected list sortable
	// requires jQuery UI sortables, draggables, droppables

	$asmOl.sortable({
		items: 'li.' + asmOptions.listItemClass,
		handle: '.' + asmOptions.listItemLabelClass,
		axis: 'y',
		update: function(e, data) {

			var updatedOptionId;

			$(this).children("li").each(function(n) {

				$option = $('#' + $(this).attr('rel')); 

				if($(this).is(".ui-sortable-helper")) {
					updatedOptionId = $option.attr('id'); 
					return;
				}

				$asmOriginal.append($option); 
			}); 

			saveSelected();

			if(updatedOptionId) triggerOriginalChange(updatedOptionId, 'sort'); 
		}

	}).addClass(asmOptions.listSortableClass); 
}

function selectChangeEvent(e) {

	// an item has been selected on the regular select we created
	// check to make sure it's not an IE screwup, and add it to the list

	if($.browser.msie && $.browser.version < 7 && !asmIEClick) return;
	var id = $(this).children("option:selected").slice(0,1).attr('rel'); 
	addListItem(id); 	
	asmIEClick = false; 
	triggerOriginalChange(id, 'add'); // for use by user-defined callbacks
}

function selectClickEvent() {

	// IE6 lets you scroll around in a select without it being pulled down
	// making sure a click preceded the change() event reduces the chance
	// if unintended items being added. there may be a better solution?

	asmIEClick = true; 
}

function originalChangeEvent(e) {

	// select or option change event manually triggered
	// on the original <select multiple>, so rebuild ours

	if(asmIgnoreOriginalChangeEvent) {
		asmIgnoreOriginalChangeEvent = false; 
		return; 
	}

	$asmSelect.empty();
	$asmOl.empty();
	buildSelect();

	// opera has an issue where it needs a force redraw, otherwise
	// the items won't appear until something else forces a redraw
	if($.browser.opera) $asmOl.hide().fadeIn("fast");
}

function buildSelect() {

	// build or rebuild the new select that the user
	// will select items from

	asmBuildingSelect = true; 

	// add a first option to be the home option / default selectLabel
	$asmSelect.prepend("<option>" + $asmOriginal.attr('title') + "</option>"); 

	$asmOriginal.children("option").each(function(n) {

		var $t = $(this); 
		var id; 

		if(!$t.attr('id')) $t.attr('id', 'asm' + asmIndex + 'option' + n); 
		id = $t.attr('id'); 

		if($t.is(":selected")) {
			addListItem(id); 
			addSelectOption(id, true); 						
		} else {
			addSelectOption(id); 
		}
	});

	if(!asmOptions.debugMode) $asmOriginal.hide(); // IE6 requires this on every buildSelect()
	selectFirstItem();
	asmBuildingSelect = false; 
}

function addSelectOption(optionId, disabled) {

	// add an <option> to the <select>
	// used only by buildSelect()

	if(disabled == undefined) var disabled = false; 

	var $O = $('#' + optionId); 
	var $option = $("<option>" + $O.text() + "</option>")
	.val($O.val())
	.attr('rel', optionId);

	if(disabled) disableSelectOption($option); 

	$asmSelect.append($option); 
}

function selectFirstItem() {

	// select the firm item from the regular select that we created

	$asmSelect.children(":eq(0)").attr("selected", true); 
}

function disableSelectOption($option) {

	// make an option disabled, indicating that it's already been selected
	// because safari is the only browser that makes disabled items look 'disabled'
	// we apply a class that reproduces the disabled look in other browsers

	$option.addClass(asmOptions.optionDisabledClass)
	.attr("selected", false)
	.attr("disabled", true);

	if(asmOptions.hideWhenAdded) $option.hide();
	if($.browser.msie) $asmSelect.hide().show(); // this forces IE to update display
}

function enableSelectOption($option) {

	// given an already disabled select option, enable it

	$option.removeClass(asmOptions.optionDisabledClass)
	.attr("disabled", false);

	if(asmOptions.hideWhenAdded) $option.show();
	if($.browser.msie) $asmSelect.hide().show(); // this forces IE to update display
}

function addListItem(optionId) {

	// add a new item to the html list

	var $O = $('#' + optionId); 

	if(!$O) return; // this is the first item, selectLabel

	var $removeLink = $("<a></a>")
	.attr("href", "#")
	.addClass(asmOptions.removeClass)
	.prepend("<img src=\"img/icons/remove.png\" />")
	.click(function() { 
		deselect(optionId);
		dropListItem($(this).parent('li').attr('rel')); 
		return false; 
	}); 

	var $contractLink = $("<a></a>")
	.attr("href", "#")
	.addClass("asmListItemExpand")
	.addClass("contractArrow")
	.prepend("<img src=\"img/icons/contract.png\" />")
	.hide()
	.click(function() { 
		contract(optionId);
		return false; 
	}); 

	var $expandLink = $("<a></a>")
	.attr("href", "#")
	.addClass("asmListItemExpand")
	.addClass("expandArrow")
	.prepend("<img src=\"img/icons/expand.png\" />")
	.click(function() { 
		expand(optionId);
		return false; 
	}); 

	var icon = "<img src=\"img/icons/paper.png\" />";

	var $itemLabel = $("<span></span>")
	.addClass(asmOptions.listItemLabelClass)
	.prepend($("<p></p>").html($O.html()))
	.prepend(icon);


	var $item = $("<li></li>")
	.attr('rel', optionId)
	.addClass(asmOptions.listItemClass)
	.append($itemLabel)
	.append($contractLink)
	//.append($expandLink)
	.append($removeLink)
	.hover(function() { 
		var node = getNodeFromIndex($(this).attr("rel")); 
		node.each(nodeHover); 
		setAbstract(node)
	})
	//.click(function () { nodeClick(getDataFromIndex($(this).attr("rel")), false); })
	.hide();

	if(!asmBuildingSelect) {
		if($O.is(":selected")) return; // already have it
		$O.attr('selected', true); 
	}

	if(asmOptions.addItemTarget == 'top' && !asmBuildingSelect) {
		$asmOl.prepend($item); 
		if(asmOptions.sortable) $asmOriginal.prepend($O); 
	} else {
		$asmOl.append($item); 
		if(asmOptions.sortable) $asmOriginal.append($O); 
	}

	addListItemShow($item); 

	// Show header
	$(".info").show();

	disableSelectOption($("[rel=" + optionId + "]", $asmSelect));

	if(!asmBuildingSelect) {
		setHighlight($item, asmOptions.highlightAddedLabel); 
		selectFirstItem();
		if(asmOptions.sortable) $asmOl.sortable("refresh"); 	
	}

}

function addListItemShow($item) {

	// reveal the currently hidden item with optional animation
	// used only by addListItem()

	if(asmOptions.animate && !asmBuildingSelect) {
		$item.animate({
			opacity: "show",
			height: "show"
		}, 100, "swing", function() { 
			$item.animate({
				height: "+=2px"
			}, 50, "swing", function() {
				$item.animate({
					height: "-=2px"
				}, 25, "swing"); 
			}); 
		}); 
	} else {
		$item.show();
	}
}

function dropListItem(optionId, highlightItem) {

	// remove an item from the html list

	if(highlightItem == undefined) var highlightItem = true; 
	var $O = $('#' + optionId); 

	$O.attr('selected', false); 
	$item = $asmOl.children("li[rel=" + optionId + "]");

	dropListItemHide($item); 
	enableSelectOption($("[rel=" + optionId + "]", asmOptions.removeWhenAdded ? $asmSelectRemoved : $asmSelect));

	if(highlightItem) setHighlight($item, asmOptions.highlightRemovedLabel); 

	triggerOriginalChange(optionId, 'drop'); 

	// hide header
	if ($("select").children(":selected").length == 1) { $(".info").hide(); }

}

function dropListItemHide($item) {

	// remove the currently visible item with optional animation
	// used only by dropListItem()

	if(asmOptions.animate && !asmBuildingSelect) {

		$prevItem = $item.prev("li");

		$item.animate({
			opacity: "hide",
			height: "hide"
		}, 100, "linear", function() {
			$prevItem.animate({
				height: "-=2px"
			}, 50, "swing", function() {
				$prevItem.animate({
					height: "+=2px"
				}, 100, "swing"); 
			}); 
			$item.remove(); 
		}); 

	} else {
		$item.remove(); 
	}
}

function setHighlight($item, label) {

	// set the contents of the highlight area that appears
	// directly after the <select> single
	// fade it in quickly, then fade it out

	if(!asmOptions.highlight) return; 

	$asmSelect.next("#" + asmOptions.highlightClass + asmIndex).remove();

	var $highlight = $("<span></span>")
	.hide()
	.addClass(asmOptions.highlightClass)
	.attr('id', asmOptions.highlightClass + asmIndex)
	.html(label + $item.children("." + asmOptions.listItemLabelClass).slice(0,1).text()); 

	$asmSelect.after($highlight); 

	$highlight.fadeIn("fast", function() {
	setTimeout(function() { $highlight.fadeOut("slow"); }, 50); 
}); 
}

function triggerOriginalChange(optionId, type) {

	// trigger a change event on the original select multiple
	// so that other scripts can pick them up

	asmIgnoreOriginalChangeEvent = true; 
	$option = $("#" + optionId); 

	$asmOriginal.trigger('change', [{
		'option': $option,
		'value': $option.val(),
		'id': optionId,
		'item': $asmOl.children("[rel=" + optionId + "]"),
		'type': type
	}]); 
}
