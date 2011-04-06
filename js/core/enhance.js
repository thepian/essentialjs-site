/**
 * Decorate an array to support recent JavaScript APIs
 * 
 * @param {Array} pArray To Enhance
 * @return the array
 */
function EnhancedArray(array)
{
	function forEach(fun /*, thisp*/)
	{
		var len = this.length >>> 0;
		if (typeof fun != "function")
		  throw new TypeError();
		
		var thisp = arguments[1];
		for (var i = 0; i < len; i++)
		{
		  if (i in this)
		    fun.call(thisp, this[i], i, this);
		}
	};

	if (!Array.prototype.array){
		array.forEach = forEach; 
	}
	return array;
};
