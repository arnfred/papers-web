define(["data/position", "util/merge"], function(position, merge) {


	//////////////////////////////////////////////
	//											//
	//               Interface					//
	//											//
	//////////////////////////////////////////////

	var nodeFactory = {};



	//////////////////////////////////////////////
	//											//
	//                Events					//
	//											//
	//////////////////////////////////////////////
	
	// There are no events in node for a very good reason: If an event is
	// called it will trigger functions for every single node created. This is
	// most likely not what we want, so think about what you are doing before
	// adding an event here. Instead put an event in the nodes model and handle
	// it there



	//////////////////////////////////////////////
	//											//
	//              Initialize					//
	//											//
	//////////////////////////////////////////////
	
	nodeFactory.new = function(data, index) {

		var n =	{
					// Properties
					domNode:	null,
					links:		new Array(),
					pos:		position[index],
					index:		index,

					// Methods
					// isScheduled:	isScheduledFun,
					getAbstract:	getAbstractFun,
					getDate:		getDateFun,
					addLink:		addLinkFun
				}

		return merge(n,data);
	}


	//////////////////////////////////////////////
	//											//
	//                Functions					//
	//											//
	//////////////////////////////////////////////
	
	// A function to add a link to a node
	var addLinkFun = function(link, order) {

		var l = {
			source:		(order == "reversed") ? link.target : link.source,
			target:		(order == "reversed") ? link.source : link.target,
			value:		link.value,
			domLink:	null,
		}

		// Add the link to the node
		this.links.push(l);
	}

	// Fetch an abstract per ajax
	var getAbstractFun = function(callback) {
		// If we have an abstract already, call the callback
		if (this.abstract != undefined) callback(this.abstract)

		// If not, then fetch abstract from server
		else {
			$.get("ajax.php", { task: "abstract", id: this.id }, function (data) { 
				this.abstract = data;
				if (callback != undefined) callback(data);
			});
		}
	}


	// Get date from node
	var getDateFun = function() {
		var date		= new Date(parseInt(this.date) + (new Date()).getTimezoneOffset()*60000)
		return date;
	}



	// Return the nodeFactory
	return nodeFactory;
})
