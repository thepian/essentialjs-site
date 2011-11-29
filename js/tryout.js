(function(){
	
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

function TryoutEnhancer() {
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
    
}
TryoutEnhancer.discarded = function(instance) {
}
Generator(TryoutEnhancer).restrict({ singleton:true, lifecycle:"page" });

})();
