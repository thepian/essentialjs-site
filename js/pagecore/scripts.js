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
	}
	this.text = tag.text || tag.textContent || ScriptTag.BLANK_TEXT;
	this.tag = tag;
}
ScriptTag.BLANK_TEXT = "\x0a  ";

ScriptTag._attributes = ['src','language','type','title','rel','defer', 'delay', 'async'];

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
    return pagecore.translateScriptTypes[this.type];
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

function scanScriptTags() {
    function makeTranslateScript() {
        var translate = [];
        for(var i=0,s; s = pagecore.otherScripts[i]; ++i) 
            if (s.hasSpecs()){
                translate.push("t"+i+"=" + s.getText());
            }
        if (translate.length) {
            var translateScript = pagecore.translateScript = new ScriptTag({
                src: pagecore.scriptPrefix + "translated.js?" + translate.join("&"),
                type: "text/javascript"
            });
            return translateScript;
        }
        return null;
    }

    var results = {
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

