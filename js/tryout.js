(function(){

function __getIEVersion() {
    var rv = -1; // Return value assumes failure.
    if (navigator.appName == 'Microsoft Internet Explorer') {
        var ua = navigator.userAgent;
        var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
        if (re.exec(ua) != null)
            rv = parseFloat(RegExp.$1);
    }
    return rv;
}

function __getOperaVersion() {
    var rv = 0; // Default value
    if (window.opera) {
        var sver = window.opera.version();
        rv = parseFloat(sver);
    }
    return rv;
}

var __userAgent = navigator.userAgent;
var __isIE =  navigator.appVersion.match(/MSIE/) != null;
var __IEVersion = __getIEVersion();
var __isIENew = __isIE && __IEVersion >= 8;
var __isIEOld = __isIE && !__isIENew;

var __isFireFox = __userAgent.match(/firefox/i) != null;
var __isFireFoxOld = __isFireFox && ((__userAgent.match(/firefox\/2./i) != null) || 
	(__userAgent.match(/firefox\/1./i) != null));
var __isFireFoxNew = __isFireFox && !__isFireFoxOld;

var __isWebKit =  navigator.appVersion.match(/WebKit/) != null;
var __isChrome =  navigator.appVersion.match(/Chrome/) != null;
var __isOpera =  window.opera != null;
var __operaVersion = __getOperaVersion();
var __isOperaOld = __isOpera && (__operaVersion < 10);

function __parseBorderWidth(width) {
    var res = 0;
    if (typeof(width) == "string" && width != null && width != "" ) {
        var p = width.indexOf("px");
        if (p >= 0) {
            res = parseInt(width.substring(0, p));
        }
        else {
     		//do not know how to calculate other values 
		//(such as 0.5em or 0.1cm) correctly now
    		//so just set the width to 1 pixel
            res = 1; 
        }
    }
    return res;
}

//returns border width for some element
function __getBorderWidth(element) {
	var res = new Object();
	res.left = 0; res.top = 0; res.right = 0; res.bottom = 0;
	if (window.getComputedStyle) {
		//for Firefox
		var elStyle = window.getComputedStyle(element, null);
		res.left = parseInt(elStyle.borderLeftWidth.slice(0, -2));  
		res.top = parseInt(elStyle.borderTopWidth.slice(0, -2));  
		res.right = parseInt(elStyle.borderRightWidth.slice(0, -2));  
		res.bottom = parseInt(elStyle.borderBottomWidth.slice(0, -2));  
	}
	else {
		//for other browsers
		res.left = __parseBorderWidth(element.style.borderLeftWidth);
		res.top = __parseBorderWidth(element.style.borderTopWidth);
		res.right = __parseBorderWidth(element.style.borderRightWidth);
		res.bottom = __parseBorderWidth(element.style.borderBottomWidth);
	}
   
	return res;
}

//returns the absolute position of some element within document
function getElementAbsolutePos(element) {
	var res = new Object();
	res.x = 0; res.y = 0;
	if (element !== null) { 
		if (element.getBoundingClientRect) {
			var viewportElement = document.documentElement;  
 	        var box = element.getBoundingClientRect();
		    var scrollLeft = viewportElement.scrollLeft;
 		    var scrollTop = viewportElement.scrollTop;

		    res.x = box.left + scrollLeft;
		    res.y = box.top + scrollTop;

		}
		else { //for old browsers
			res.x = element.offsetLeft;
			res.y = element.offsetTop;

			var parentNode = element.parentNode;
			var borderWidth = null;

			while (offsetParent != null) {
				res.x += offsetParent.offsetLeft;
				res.y += offsetParent.offsetTop;
				
				var parentTagName = 
					offsetParent.tagName.toLowerCase();	

				if ((__isIEOld && parentTagName != "table") || 
					((__isFireFoxNew || __isChrome) && 
						parentTagName == "td")) {		    
					borderWidth = kGetBorderWidth
							(offsetParent);
					res.x += borderWidth.left;
					res.y += borderWidth.top;
				}
				
				if (offsetParent != document.body && 
				offsetParent != document.documentElement) {
					res.x -= offsetParent.scrollLeft;
					res.y -= offsetParent.scrollTop;
				}


				//next lines are necessary to fix the problem 
				//with offsetParent
				if (!__isIE && !__isOperaOld || __isIENew) {
					while (offsetParent != parentNode && 
						parentNode !== null) {
						res.x -= parentNode.scrollLeft;
						res.y -= parentNode.scrollTop;
						if (__isFireFoxOld || __isWebKit) 
						{
						    borderWidth = 
						     kGetBorderWidth(parentNode);
						    res.x += borderWidth.left;
						    res.y += borderWidth.top;
						}
						parentNode = parentNode.parentNode;
					}    
				}

				parentNode = offsetParent.parentNode;
				offsetParent = offsetParent.offsetParent;
			}
		}
	}
    return res;
}


var NumberType = Resolver("essential")("Type").variant("Number");
var StringType = Resolver("essential")("Type").variant("String");
var DateType = Resolver("essential")("Type").variant("Date");
var ObjectType = Resolver("essential")("Type").variant("Object");
function Shape(options) {}
Shape.args = [
  ObjectType({name:"options",preset:true})      
];
Resolver().set("shapes.Shape", Generator(Shape));

	
function tryoutUpdate(value,name) {
	var errorQ = document.querySelector("blockquote[name="+ name +"-error]");
	errorQ.innerHTML = "";
	var codeQ = document.querySelector("blockquote[name="+ name +"-code]");
	try {
		eval(value);
		var l = [];
		var shapes = Resolver()("shapes");
		for(var n in shapes) {
			var e = shapes[n];
			if (e.toRepr) l.push(e.toRepr());
			else if (Resolver.hasGenerator(e)) l.push(Generator(e).toRepr());
		}
		codeQ.innerHTML = l.join("");
	}
	catch(ex) {
		errorQ.innerHTML = ex.message;
		codeQ.innerHTML = "";
	}
}
function tryoutChange() {
	if (this.tryoutTimer) {
		clearTimeout(this.tryoutTimer);
		this.tryoutTimer = undefined;
	}
	//console.log(this.value);
	tryoutUpdate(this.value,this.getAttribute("name"));
}
function tryoutInput() {
	if (this.tryoutTimer != undefined) clearTimeout(this.tryoutTimer);

	var that = this;
	this.tryoutTimer = setTimeout( function() { 
		that.tryoutTimer = undefined;
		tryoutUpdate(that.value,that.getAttribute("name")); 
	} , 1000);
}

var helloEl;
var helloBase;

// data-class=":hello scrolled-above-fold:popped-out"
function bodyScroll(evt) {
	var ev = evt || window.event;
	if (window.pageYOffset > helloBase.y) {
		helloEl.className = "hello popped-out";
		//console.log(window.pageYOffset);
	}
	else {
		helloEl.className = "hello";
	}
}

function TryoutEnhancer() {
	helloEl = document.getElementById("hello");
	helloBase = getElementAbsolutePos(helloEl);

    var scripts = document.getElementsByTagName("script");
    for(var i=0,s; s = scripts[i]; ++i) if (s.getAttribute("type") == "tryout/javascript") {
        var others = document.getElementsByName(s.getAttribute("name"));
        for(var j=0,o; o = others[j]; ++j) if (o.nodeName.toLowerCase() != "script"){
            if (o.value != undefined && s.firstChild) o.value = s.firstChild.nodeValue;
            if (o.addEventListener) { 
	            o.addEventListener("change",tryoutChange,false); 
	            o.addEventListener("input",tryoutInput,false); 
	        }
            else if (o.attachEvent) { 
	            o.attachEvent("onchange",tryoutChange,false); 
	            o.attachEvent("oninput",tryoutInput,false); 
	        }
	        tryoutUpdate(o.value,o.getAttribute("name"));
        }
    }
    if (window.addEventListener) {
    	window.addEventListener("scroll",bodyScroll,false);
    }
    else if (window.attachEvent) {
    	window.attachEvent("onscroll",bodyScroll);
    }
}
TryoutEnhancer.discarded = function(instance) {
}
Generator(TryoutEnhancer).restrict({ singleton:true, lifecycle:"page" });

})();
