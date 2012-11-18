define(function () {

	var config = new Array();

	// Radius for the node:
	config['radius'] = 4;
	config['radius_selected'] = 6;
	
	// Width of a edge:
	config['edgeSize'] = 0.5;
	config['edgeSize_hover'] = 2;
	
	
	// Zoom parameters:
	config['zoomMin'] = 0.1;
	config['zoomMax'] = 5;
	config['nbIncrement'] = 40;
	
	
	return config; 

});