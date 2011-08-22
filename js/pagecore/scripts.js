/**
Basic Script tag that may refer to a collection of specifications
- can be constructed from a map
*/
function ScriptTag(tag) {
	this.src = tag.src || "";
	this.type = tag.type || "";
	if (tag.getAttribute) {
    	this.language = tag.getAttribute("language");
    	this.title = tag.getAttribute("title");
    	this.rel = tag.getAttribute("rel");
    	this.defer = tag.getAttribute("defer");
    	this.delay = tag.getAttribute("delay");
    	this.async = tag.getAttribute("async");
    	this.disabled = tag.getAttribute("disabled");
	}
	this.text = tag.text || tag.textContent || ScriptTag.BLANK_TEXT;
	this.tag = tag;
}
ScriptTag.BLANK_TEXT = "\x0a  ";

ScriptTag._attributes = ['src','language','type','title','rel','defer', 'delay', 'async', 'disabled'];

ScriptTag.translateScriptTypes = {};

ScriptTag.prototype.attributesString = function() {
    var attrs = [];
    for(var i=0,a; a = ScriptTag._attributes[i]; ++i ) {
        if (this[a]) attrs.push(a + '="' + this[a] + '"');
    }
    return attrs.join(' ');
};

ScriptTag.prototype.applyAttributes = function() {
    for(var i=0,a; a = ScriptTag._attributes[i]; ++i ) {
        if (this[a]) this.tag.setAttribute(a, attrs.push("a" + '="' + this[a] + '"'));
    }
};

ScriptTag.prototype.getAttribute = function(name) {
    return this.tag.getAttribute(name);
};

ScriptTag.prototype.setAttribute = function(name,value) {
    return this.tag.setAttribute(name,value);
};

ScriptTag.prototype.isPagespecTag = function() {
    return (this.src.indexOf(CORE_SCRIPT_NAME) > -1);
};

ScriptTag.prototype.getPrefix = function() {
    var index = this.src.indexOf(CORE_SCRIPT_NAME);
    return this.src.slice(0,index);    
};

ScriptTag.prototype.hasSpecs = function() {
    return ScriptTag.translateScriptTypes[this.type];
};

ScriptTag.prototype.hasExamples = function() {
	return /describe\(/.test(this.text);
};

ScriptTag.prototype.appendHead = function() {
    if (document.body) {
        var head = document.getElementByTagName("head");
        if (head == null) {
            document.documentElement.appendChild(head = document.createElement("HEAD"));
        }
        this.tag = document.createElement("SCRIPT");
        this.applyAttributes();
        head.appendChild(this.tag);
    } else {
        document.write('<script '+this.attributesString()+'><\/script>');
    }
};

ScriptTag.prototype.refreshAfter = function(ms) {
    var tag = this.tag;
    tag.polling = setTimeout(poll,ms);

    function poll() {
        tag.polling = null;

        // refresh script
        var parts = tag.src.split("?");
        var r = /\bpoll=(\d+)\b/;
        if (parts.length==2 && r.test(parts[1])) {
            var count = parts[1].match(r)[1];
            parts[1] = parts[1].replace(r,"poll="+(parseInt(count)+1));
            tag.src = parts.join("?");
        } else {
            tag.src = parts[0] + "?" + (parts.length == 2? parts[1] + "&poll=1" : "poll=1");
        }
    }
};

ScriptTag.prototype.getText = function() {
    if (this.src) {
        // TODO xhr
    } else return this.text;
};

ScriptTag.prototype.loadText = function(func,instance) {
	var request = new XMLHttpRequest();
	request.open('GET', this.src, true);
	request.onreadystatechange = function (evt) {
	  if (request.readyState == 4) {
		 if(request.status == 200)
		   console.log(request.responseText)
		 else
		   console.log('Error', request.statusText);
	  }
	};
	request.send(null);
};

ScriptTag.prototype.loadTextFrame = function(func,instance) 
{
	var scriptTag = this;
	
	var frame = document.createElement("iframe");
	frame.src = this.src;
	frame.type = "text/plain";
	frame.onload = function() {
		var d = this.contentDocument || this.document;
		var text = d? d.body.innerText : this.innerText;
		func.call(instance,scriptTag,scriptTag.src,text);
	};
	document.body.appendChild(frame);

	/*
	var embed = document.createElement("embed");
	embed.src = this.src;
	embed.type = "text/plain";
	embed.onload = function() {
		func.call(instance,this,this.src,this.innerText);
	};
	document.body.appendChild(embed);
	*/
};

function scanScriptTags() {
    function makeTranslateScript() {
        var translate = [];
        for(var i=0,s; s = results.otherScripts[i]; ++i) 
            if (s.hasSpecs()){
                translate.push("t"+i+"=" + s.getText());
            }
        if (translate.length) {
            var translateScript = results.translateScript = new ScriptTag({
                src: results.scriptPrefix + "translated.js?" + translate.join("&"),
                type: "text/javascript"
            });
            return translateScript;
        }
        return null;
    }
    
    function forEachSpecScript(func,instance) {
    	for(var i=0,s; s = this.otherScripts[i]; ++i) {
    		if (s.hasSpecs()) func.call(instance,s);
    	}
    } 
    
    function loadSpecScripts(func,instance) {
    	for(var i=0,s; s = this.otherScripts[i]; ++i) {
    		if (s.hasSpecs()) s.loadTextFrame(func,instance);
    	}
    }

	function getRelativeUrl(rel) {
		var base_bits = this.coreScript.src.split("/");
		base_bits.pop(); // remove filename
		
		var rel_bits = rel.split("/");
		while(rel_bits[0] == "..") {
			rel_bits.shift();
			base_bits.pop();
		}

		return base_bits.concat(rel_bits).join("/");
	}
	
    var results = {
        /** url base for the script */
        scriptPrefix: "",
        
        /** main script that loaded pagecore */
        coreScript: null,
        
        /** the other scripts in the page at load time */
        otherScripts: [],
        
        /** which mime type script tags to translate */
        translateScriptTypes: ScriptTag.translateScriptTypes,
        
        forEachSpecScript: forEachSpecScript,
        loadSpecScripts: loadSpecScripts,
        getRelativeUrl: getRelativeUrl,
        
        options: new UrlOptions(),
        pageOptions: new UrlOptions(),
        scriptOptions: new UrlOptions(),

        makeTranslateScript: makeTranslateScript
    };        

	var scripts = document.getElementsByTagName("SCRIPT"); 
	for(var i=0, script;script = scripts[i];++i) {
	    var tag = new ScriptTag(script);
	    if (tag.isPagespecTag()) {
	        results.coreScript = tag;
		    results.scriptPrefix = tag.getPrefix();
			results.options.setLocation(tag.src);
			results.scriptOptions.setLocation(tag.src);
	    } else {
    	    results.otherScripts.push(tag); 
	    }
	}
    
    return results;
};

