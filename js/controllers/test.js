define("test",["util/dimensions"], function(dims) {
	var a = function () { console.log("this works. With is " + dims.getWidth()); }
	return a;
})
