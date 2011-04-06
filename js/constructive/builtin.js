// Fix very old releases of IE6 to properly support the undefined keyword
window["undefined"] = window.undefined;

// Patch definitions form standard DOM constants if missing. IE6/7 needs them.
if (typeof Node == "undefined") {
	window.Node = {
		ELEMENT_NODE: 1,
		TEXT_NODE:2,
		DOCUMENT_NODE:9,
		COMMENT_NODE:8,
		DOCUMENT_FRAGMENT_NODE:11,
		ATTRIBUTE_NODE:2
	};
};


 /**
  * Array support function
  * http://hexmen.com/blog/2006/12/push-and-pop/ 
  */
 Array.prototype.__push = function() {
    var n = this.length >>> 0;
    for (var i = 0; i < arguments.length; i++) {
        this[n] = arguments[i];
        n = n + 1 >>> 0;
    }
    this.length = n;
    return n;
};

/**
 * Array support function
 * http://hexmen.com/blog/2006/12/push-and-pop/ 
 */
Array.prototype.__pop = function() {
    var n = this.length >>> 0, value;
    if (n) {
        value = this[--n];
        delete this[n];
    }
    this.length = n;
    return value;
};

/**
 * http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:indexOf
 * @param {Object} elt
 * @param {Object}  from
 * @return zero based index, or -1 if not found
 */
Array.prototype.__indexOf = function(elt /*, from*/) {
    var len = this.length;

    var from = Number(arguments[1]) || 0;
    from = (from < 0)? Math.ceil(from) : Math.floor(from);
    if (from < 0)
      from += len;

    for (; from < len; from++) {
      if (from in this &&
          this[from] === elt)
        return from;
    }
    return -1;
};

/**
 * http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:lastIndexOf
 * @param {Object} elt
 * @param {Object}  [from]
 * @return zero based index, or -1 if not found
 */
Array.prototype.__lastIndexOf = function(elt /*, from*/)
{
    var len = this.length;

    var from = Number(arguments[1]);
    if (isNaN(from))    {
      from = len - 1;
    }
    else
    {
      from = (from < 0)? Math.ceil(from) : Math.floor(from);
      if (from < 0)
        from += len;
      else if (from >= len)
        from = len - 1;
    }

    for (; from > -1; from--) {
      if (from in this &&
          this[from] === elt)
        return from;
    }
    return -1;
};

/* add support where needed */
if (!Array.prototype.push) Array.prototype.push = Array.prototype.__push;
if (!Array.prototype.pop) Array.prototype.pop = Array.prototype.__pop;
if (!Array.prototype.indexOf) Array.prototype.indexOf = Array.prototype.__indexOf;
if (!Array.prototype.lastIndexOf) Array.prototype.lastIndexOf = Array.prototype.__lastIndexOf;


