/* 
 *	This module is in charge to take the nodes and to draw
 *	the graph. It is also concerned by taking care of what
 *	happen when node are selected, and when. (DOM interaction)
 *	
 * TODO: Change every event to pass id and not the complete node object!
 */

define(["lib/d3", "util/screen", "radio", "util/levenshtein", "models/zoom", "models/nodeList", "params"], function(d3, screen, radio, levenshtein, zoom, nodeList, config) {

	//////////////////////////////////////////////
	//											//
	//               Interface					//
	//											//
	//////////////////////////////////////////////
	var graph = {}



	//////////////////////////////////////////////
	//											//
	//               Variables					//
	//											//
	//////////////////////////////////////////////

		// Dimensions
	var w = screen.width(),
		h = screen.height();

	graph.zoom = zoom;


	//////////////////////////////////////////////
	//											//
	//               Graph Init 				//
	//											//
	//////////////////////////////////////////////

	graph.init = function () {
		
		// Our canvas.
		graph.canvas = d3.select("#graph").append("svg")
			.attr("width", "100%")
			.attr("height", "100%")
			// Enable zoom feature:
			.call(	graph.zoom )
			// Add paning g:
			.append('svg:g') 
			.attr("pointer-events", "all")
			.attr('id', 'viewport');
		
		
		//enable scrolling on the canvas:
		graph.zoom.init(graph.canvas);
		
		
		
		// For later Use, switch to force layout:
		graph.force = null;
		
		var nodes = nodeList.getNodes();
		
		
		// Initialize the DOM UI: 
		nodes.forEach(function(el, j){
				el.links.forEach(function(link, i){
				if(link.domLink == null ){
					//console.log(link.target);
						
					link.domLink = graph.canvas.append('svg:line')
									  .attr('x1', el.pos.x)
									  .attr('y1', el.pos.y)
									  .attr('x2', link.target.pos.x)
									  .attr('y2', link.target.pos.y)
									  //.attr('source', el.id)
									  //.attr('target', graph.link.target.id)
									  .style("stroke-width", graph.strokeWidth(link, config["edgeSize"]))
									  .classed('link', true);

				}
			});	
		});

		nodes.forEach(function(el){
			el.domNode = graph.canvas.append('svg:circle')
										.attr('cx', el.pos.x)
										.attr('cy', el.pos.y)
										.attr('r', config['radius']);
		});
		
		
		/*
		 * We register all the event for the DOM
		 * We could not have done earlier since
		 * we initilize the DOM in the graph2.js 
		 */
		 
		 
		// Broadcast when a node is clicked
		nodes.forEach(function(node){
			node.domNode.on("click", function(d,i) { 
				var e = d3.event; 
				radio("node:click").broadcast(node, e);
				radio("node:select").broadcast(node, e);
			});
		});


		// Broadcast when the mouse enters a node
		nodes.forEach(function(node){
			node.domNode.on("mouseover", function(d, i) { 
				var e = d3.event;
				radio("node:mouseover").broadcast(node, e);
				//radio("node:current").broadcast(node.id, e);
			});
		});

		
		// Broadcast when the mouse exits a node
		nodes.forEach(function(node){
				node.domNode.on("mouseout", function(d, i) { 
				var e = d3.event;
				radio("node:mouseout").broadcast(node, e) 
			});
		});						

	}

	
	//////////////////////////////////////////////
	//											//
	//           Public Functions				//
	//											//
	//////////////////////////////////////////////
	
	graph.strokeWidth = function(d, weight) { 
		if (weight == undefined) weight = 0.1;
		return Math.sqrt(d.value/100) * weight; 
	}


	//////////////////////////////////////////////
	//											//
	//           Private Functions				//
	//											//
	//////////////////////////////////////////////


	


	// Highlights search results
	var searchHighlight = function(node) {
		// Do stuff
	}
	
	
	
	
			

	//////////////////////////////////////////////
	//											//
	//            Return Interface				//
	//											//
	//////////////////////////////////////////////

	graph.init();
	return graph;
})

