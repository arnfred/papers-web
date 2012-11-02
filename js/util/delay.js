define(function () {

	// A delay function, to delay the execution of a function
	var delay = (function(){
		var timer = 0;
		return function(callback, ms){
			clearTimeout (timer);
			timer = setTimeout(callback, ms);
		};
	})();

	return delay;
})
