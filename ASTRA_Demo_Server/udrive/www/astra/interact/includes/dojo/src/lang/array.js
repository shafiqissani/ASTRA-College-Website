dojo.provide("dojo.lang.array");

dojo.require("dojo.lang.common");

// FIXME: Is this worthless since you can do: if(name in obj)
// is this the right place for this?

dojo.lang.mixin(dojo.lang, {
	has: function(/*Object*/obj, /*String*/name){
		try{
			return typeof obj[name] != "undefined";
		}catch(e){ return false; }
	},

	isEmpty: function(/*Object*/obj){
		// summary:
		//		can be used to determine if the passed object is "empty". In
		//		the case of array-like objects, the length, property is
		//		examined, but for other types of objects iteration is used to
		//		examine the iterable "surface area" to determine if any
		//		non-prototypal properties have been assigned. This iteration is
		//		prototype-extension safe.
		if(dojo.lang.isObject(obj)){
			var tmp = {};
			var count = 0;
			for(var x in obj){
				if(obj[x] && (!tmp[x])){
					count++;
					break;
				} 
			}
			return count == 0; // boolean
		}else if(dojo.lang.isArrayLike(obj) || dojo.lang.isString(obj)){
			return obj.length == 0; // boolean
		}
	},

	map: function(/*Array*/arr, /*Object|Function*/obj, /*Function?*/unary_func){
		// http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:map
		var isString = dojo.lang.isString(arr);
		if(isString){
			// arr: String
			arr = arr.split("");
		}
		if(dojo.lang.isFunction(obj)&&(!unary_func)){
			unary_func = obj;
			obj = dj_global;
		}else if(dojo.lang.isFunction(obj) && unary_func){
			// ff 1.5 compat
			var tmpObj = obj;
			obj = unary_func;
			unary_func = tmpObj;
		}
		if(Array.map){
			var outArr = Array.map(arr, unary_func, obj);
		}else{
			var outArr = [];
			for(var i=0;i<arr.length;++i){
				outArr.push(unary_func.call(obj, arr[i]));
			}
		}
		if(isString) {
			return outArr.join(""); // String
		} else {
			return outArr; // Array
		}
	},

	reduce: function(/*Array*/arr, initialValue, /*Object|null*/obj, /*Function*/binary_func){
		var reducedValue = initialValue;
		var ob = obj ? obj : dj_global;
		dojo.lang.map(arr, 
			function(val){
				reducedValue = binary_func.call(ob, reducedValue, val);
			}
		);
		return reducedValue;
	},

	forEach: function(/*Array*/anArray, /*Function*/callback, /*Object?*/thisObject){
		// http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:forEach
		if(dojo.lang.isString(anArray)){
			// anArray: String
			anArray = anArray.split(""); 
		}
		if(Array.forEach){
			Array.forEach(anArray, callback, thisObject);
		}else{
			// FIXME: there are several ways of handilng thisObject. Is dj_global always the default context?
			if(!thisObject){
				thisObject=dj_global;
			}
			for(var i=0,l=anArray.length; i<l; i++){ 
				callback.call(thisObject, anArray[i], i, anArray);
			}
		}
	},

	_everyOrSome: function(/*Boolean*/every, /*Array*/arr, /*Function*/callback, /*Object?*/thisObject){
		if(dojo.lang.isString(arr)){ 
			//arr: String
			arr = arr.split(""); 
		}
		if(Array.every){
			return Array[ every ? "every" : "some" ](arr, callback, thisObject);
		}else{
			if(!thisObject){
				thisObject = dj_global;
			}
			for(var i=0,l=arr.length; i<l; i++){
				var result = callback.call(thisObject, arr[i], i, arr);
				if(every && !result){
					return false; // Boolean
				}else if((!every)&&(result)){
					return true; // Boolean
				}
			}
			return Boolean(every); // Boolean
		}
	},

	every: function(/*Array*/arr, /*Function*/callback, /*Object?*/thisObject){
		return this._everyOrSome(true, arr, callback, thisObject); // Boolean
	},

	some: function(/*Array*/arr, /*Function*/callback, /*Object?*/thisObject){
		return this._everyOrSome(false, arr, callback, thisObject); // Boolean
	},

	filter: function(/*Array*/arr, /*Function*/callback, /*Object?*/thisObject){
		var isString = dojo.lang.isString(arr);
		if(isString){ /*arr: String*/arr = arr.split(""); }
		var outArr;
		if(Array.filter){
			outArr = Array.filter(arr, callback, thisObject);
		} else {
			if(!thisObject){
				if(arguments.length >= 3){ dojo.raise("thisObject doesn't exist!"); }
				thisObject = dj_global;
			}

			outArr = [];
			for(var i = 0; i < arr.length; i++){
				if(callback.call(thisObject, arr[i], i, arr)){
					outArr.push(arr[i]);
				}
			}
		}
		if(isString){
			return outArr.join(""); // String
		} else {
			return outArr; // Array
		}
	},

	unnest: function(/* ... */){
		// summary:
		//	Creates a 1-D array out of all the arguments passed,
		//	unravelling any array-like objects in the process
		//
		// usage:
		//	unnest(1, 2, 3) ==> [1, 2, 3]
		//	unnest(1, [2, [3], [[[4]]]]) ==> [1, 2, 3, 4]

		var out = [];
		for(var i = 0; i < arguments.length; i++){
			if(dojo.lang.isArrayLike(arguments[i])){
				var add = dojo.lang.unnest.apply(this, arguments[i]);
				out = out.concat(add);
			}else{
				out.push(arguments[i]);
			}
		}
		return out; // Array
	},

	toArray: function(/*Object*/arrayLike, /*Number*/startOffset){
		// summary:
		//	Converts an array-like object (i.e. arguments, DOMCollection)
		//	to an array
		var array = [];
		for(var i = startOffset||0; i < arrayLike.length; i++){
			array.push(arrayLike[i]);
		}
		return array; // Array
	}
});
