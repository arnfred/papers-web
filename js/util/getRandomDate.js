/**
 * Returns random date between 1970 and now
 */
define("getRandomDate", [], function () {
	var d = function(from, to) {
		if (!from) {
			from = new Date(1900, 0, 1).getTime();
		} else {
			from = from.getTime();
		}
		if (!to) {
			to = new Date(2012, 11, 31).getTime();
		} else {
			to = to.getTime();
		}
		return new Date(from + Math.random() * (to - from));
	}

	return d;
}
