var pagecore = {
    /** url base for the script */
    scriptPrefix: "",
    
    /** main script that loaded pagecore */
    coreScript: null,
    
    /** the other scripts in the page at load time */
    otherScripts: [],
    
    /** which mime type script tags to translate */
    translateScriptTypes: {},
    
	options: new UrlOptions(),
	pageOptions: new UrlOptions(),
    scriptOptions: new UrlOptions(),
    
    domReadyListeners: [],
    
	onDomReady: function() {
	    for(var i=0; i<pagecore.domReadyListeners.length; ++i) pagecore.domReadyListeners[i].domReady();
	},
	
	onUnload: function() {
	    for(var i=0; i<this.domReadyListeners.length; ++i) if (pagecore.domReadyListeners[i].cleanup) pagecore.domReadyListeners[i].cleanup();
	},
	
	isTrident: navigator.appName == "Microsoft Internet Explorer",
	isWebkit: navigator.userAgent.indexOf('AppleWebKit/') > -1,
	isGecko: navigator.userAgent.indexOf('Gecko/') > -1 && navigator.userAgent.indexOf('KHTML/') == -1,
	isPresto: navigator.appName == "Opera",
	
	
    'stamp' : (new Date().getTime()),
    'version' : 0.1
};

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

/**
 * Copy properties of source object to a new object. If source isn't a
 * function or object, a blank object is returned.
 * @param {Object} src Source object.
 * @param {Object} dest Optional destination map.
 * @return new object with properties of src
 */
 function shallowClone(src,dest) {
	var ret = dest || {};
	var t = typeof src;
	if (t == "object" || t == "function") for(var n in src) if (src.hasOwnProperty(n)) ret[n] = src[n];
	return ret;
}

/**
 * Add pagecore.onDomReady to be called when the page DOM is ready.
 * 
 * <p>based on: http://www.thefutureoftheweb.com/blog/adddomloadevent</p>
 * 
 * @internal
 */
function addReadyListener()
{
	function ie_readystatechange_handler() { 
		return function() {
            if (this.readyState == "complete") {
                pagecore.onDomReady; // call the onready handler
            }
		};
	};

	function webkit_ready_timer_handler() {
	  	return function() {
            if (/loaded|complete/.test(document.readyState)) {
			  	var scheduler = core.scheduler; 
                if (scheduler.webKitReadyTimer) {
		            clearInterval(scheduler.webKitReadyTimer);
        		    scheduler.webKitReadyTimer = null;			  	
				}
                pagecore.onDomReady(); // call the onready handler
            }
		};
  	};
	  
    // for Mozilla/Opera9
    if (document.addEventListener) {
          document.addEventListener("DOMContentLoaded", pagecore.onDomReady, false);
		  return;
      }
      
    // for Internet Explorer (TODO: review IE8)
	if (BrowserDetect.browser == "Explorer") {
        document.write("<scr"+"ipt id=__ie_onload defer src=//0><\/scr"+"ipt>");
        var script = document.getElementById("__ie_onload");
        script.onreadystatechange = ie_readystatechange_handler();
        return;
	}
      
    // for Safari (check every 20 ms)
    if (BrowserDetect.browser == "Safari") {
        this.webKitReadyTimer = setInterval(webkit_ready_timer_handler(),20);
		return;
    }
      
    // for other browsers and odd IE support
	if (window.attachEvent) {
		window.attachEvent("onload",pagecore.onDomReady);
	}
	else window.onload = pagecore.onDomReady;
};
	
//addReadyListener();
