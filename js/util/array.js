define(function () {
	'use strict';

	// Add ECMA262-5 method binding if not supported natively
	//
	if (!('bind' in Function.prototype)) {
		Function.prototype.bind= function(owner) {
			var that= this;
			if (arguments.length<=1) {
				return function() {
					return that.apply(owner, arguments);
				};
			} else {
				var args= Array.prototype.slice.call(arguments, 1);
				return function() {
					return that.apply(owner, arguments.length===0? args : args.concat(Array.prototype.slice.call(arguments)));
				};
			}
		};
	}

	// Add ECMA262-5 string trim if not supported natively
	//
	if (!('trim' in String.prototype)) {
		String.prototype.trim= function() {
			return this.replace(/^\s+/, '').replace(/\s+$/, '');
		};
	}

	// Add ECMA262-5 Array methods if not supported natively
	//
	if (!('indexOf' in Array.prototype)) {
		Array.prototype.indexOf= function(find, i /*opt*/) {
			if (i===undefined) i= 0;
			if (i<0) i+= this.length;
			if (i<0) i= 0;
			for (var n= this.length; i<n; i++)
				if (i in this && this[i]===find)
					return i;
			return -1;
		};
	}
	if (!('lastIndexOf' in Array.prototype)) {
		Array.prototype.lastIndexOf= function(find, i /*opt*/) {
			if (i===undefined) i= this.length-1;
			if (i<0) i+= this.length;
			if (i>this.length-1) i= this.length-1;
			for (i++; i-->0;) /* i++ because from-argument is sadly inclusive */
				if (i in this && this[i]===find)
					return i;
			return -1;
		};
	}
	if (!('forEach' in Array.prototype)) {
		Array.prototype.forEach= function(action, that /*opt*/) {
			for (var i= 0, n= this.length; i<n; i++)
				if (i in this)
					action.call(that, this[i], i, this);
		};
	}
	if (!('map' in Array.prototype)) {
		Array.prototype.map= function(mapper, that /*opt*/) {
			var other= new Array(this.length);
			for (var i= 0, n= this.length; i<n; i++)
				if (i in this)
					other[i]= mapper.call(that, this[i], i, this);
			return other;
		};
	}
	if (!('filter' in Array.prototype)) {
		Array.prototype.filter= function(filter, that /*opt*/) {
			var other= [], v;
			for (var i=0, n= this.length; i<n; i++)
				if (i in this && filter.call(that, v= this[i], i, this))
					other.push(v);
			return other;
		};
	}
	if (!('reduce' in Array.prototype)) {
		Array.prototype.reduce= function(reducer, firstElem /*opt*/) {

			// Initialize return value
			var r = firstElem;
			var i = 0;

			if (firstElem == undefined) {
				if (this.length == 0) throw new Error("TypeError: Reduce of empty array with no initial value");
				r = this[0];
				i = 1;
			}
			
			for (var n= this.length; i<n; i++) {
				r = reducer(r, this[i]);
			}

			return r;
		};
	}
	if (!('every' in Array.prototype)) {
		Array.prototype.every= function(tester, that /*opt*/) {
			for (var i= 0, n= this.length; i<n; i++)
				if (i in this && !tester.call(that, this[i], i, this))
					return false;
			return true;
		};
	}
	if (!('some' in Array.prototype)) {
		Array.prototype.some= function(tester, that /*opt*/) {
			for (var i= 0, n= this.length; i<n; i++)
				if (i in this && tester.call(that, this[i], i, this))
					return true;
			return false;
		};
	}
	if (!('unique' in Array.prototype)) {
		Array.prototype.unique= function() {
			return this.reduce(function(e1,e2) { return (e1.indexOf(e2) == -1) ? e1.concat([e2]) : e1; },[])
		};
	}

	return Array;
})
