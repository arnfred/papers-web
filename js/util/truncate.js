define(function () {
   
	/**
	 * Function which truncates a string to a certain length, cutting a full words
	 */
	var truncate = function(str, limit) {
		if (str.length < Math.max(limit,4)) return str
		else return str.substr(0,limit - 6).split(' ').slice(0,-1).join(' ').concat(" (...)")
	}

	return truncate;
});

