function UrlOptions(types,defaults) {
    this.types = types || {};
    this.defaults = defaults || {};
    // this.runnername = 'pagespec-results.html';    
}

//TODO what to do with hash

UrlOptions.reserved = {
    'hash': true,
    'defaults': true,
    'types': true
};

UrlOptions.prototype.toString = function() {
	var params = [];
	for(var n in this) {
	    if (UrlOptions.reserved[n] || !this.hasOwnProperty(n)) continue;
		var v = this[n];
		if (v !== this.defaults[n] && typeof v != "function" && typeof v != "undefined") params.push(n + "=" + encodeURIComponent(v));
	}

	return "?" + params.join("&") + ( this.hash? ("#"+this.hash.replace(/#/,"")):"");
};

UrlOptions.prototype.setLocation = function(location) {
    if (typeof(location) === "string" || location instanceof String) {
        var s2 = location.split("#");
        var s1 = s2[0].split("?");
        this.setSearch(s1[1]? "?"+s1[1] : "");
        this.setHash(s2[1]? "#"+s2[1] : "");
    } else if (typeof location == "object"){
        this.setSearch(location.search);
        this.setHash(location.hash);
    }
};

UrlOptions.prototype.setSearch = function(search) {
    for(var k in this.defaults) if (this[k] === undefined) this[k] = this.defaults[k];
    if (search) {
    	var pairs = search.slice(1).split("&");
    	for(var i = 0; i < pairs.length; i++) {
    		var tokens = pairs[i].split('=');
    		var name = tokens[0];
    		var normaliser = this[this.types[name] + "Normalise"];
    		var value = normaliser? normaliser.call(this,decodeURIComponent(tokens[1])) : this.normalise(decodeURIComponent(tokens[1]));
    		this[name] = value;
    	}
    }
};

UrlOptions.prototype.setHash = function(hash) {
    for(var k in this.defaults) if (this[k] === undefined) this[k] = this.defaults[k];
    if (hash) {
        if (hash.indexOf("=")>-1 || hash.indexOf("&")>-1) {
        	var pairs = hash.slice(1).split("&");
        	for(var i = 0; i < pairs.length; i++) {
        		var tokens = pairs[i].split('=');
        		var name = tokens[0];
        		var defaultValue = this.defaults[name];
        		var normaliser = this[this.types[name] + "Normalise"];
        		var value = normaliser? normaliser.call(this,decodeURIComponent(tokens[1]),defaultValue) : this.normalise(decodeURIComponent(tokens[1]),defaultValue);
        		this[name] = value;
        	}
        } else {
            this.hash = hash;
        }
    }
};

/**
 * Takes two sets of un-encoded value maps and merges them into a single
 * map which will return the equivalent of <pre>location.search + location.hash</pre>
 *
 * @param {Map} oldOptions Old options from the exiting page running
 * @param {Map} newOptions New options that extends/overrides existing
 * @return A map with resulting options and a toString that produces the URI search & hash parts
 */
UrlOptions.prototype.clone = function(extra) {
	var res = shallowClone(oldOptions);
	return shallowClone(extra,res);
};

UrlOptions.prototype.normalise = function(value,defaultValue) {
	if (value == "false") value = false;
	if (value == "0") value = 0;
	
    return value;
};

UrlOptions.prototype.booleanNormalise = function(value,defaultValue) {
    return (value === false || value == "false" || value == "0" || value === 0 || value == "none" || value == "no")? false : true;
};

UrlOptions.prototype.stringNormalise = function(value,defaultValue) {
    return value;
};

UrlOptions.prototype.numberNormalise = function(value,defaultValue) {
    if (value === false || value == "false" || value == "none" || value == "no") return 0;
    return parseFloat(value);
};

UrlOptions.prototype.true_or_nameNormalise = function(value,defaultValue) {
    return (value === true || value == "true" || value == "1" || value === 1 || value == "all" || value == "yes")? true : value;
};

