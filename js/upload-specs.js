@scope "simple" {
    var CORE_SCRIPT_NAME = @insert:script_name;
    var PAGESPEC_ID = "pagespec-status"; 
    var SEND_PREFIX = "pagespec:"; // message from iframe to page
    var RECEIVE_PREFIX = "pagestatus:"; // message from page to iframe
    var MESSAGE_ROOT = window.location.protocol + "//" + window.location.host; // postMessage origin
    var XSRF_INPUT_MARKUP = @insert:xsrf_input_markup;

    @insert path raw "pagecore/builtin.js";
    @insert path raw "pagecore/options.js";
    @insert path raw "pagecore/scripts.js";
    @insert path raw "pagecore/formatting.js";
    @insert path raw "pagecore/mark.js";
    @insert path raw "pagecore/XMLHttpRequest.js";
    @insert path raw "pagespec/slaves.js";
    @insert path raw "pagespec/upload.js";

	function SpecScriptUpload(base_url,url,text,tag) {
		this.base_url = base_url;
		this.url = url;
		this.text = text;
		this.tag = tag;

		var href_bits = location.href.split("/");
		href_bits.pop();
		var url_bits = this.url.split("/");		
		this.rel_url = url_bits.slice(href_bits.length).join("/");
	}

	SpecScriptUpload.prototype.uploadGetScript = function() {
		var q = "?language="+(this.tag.language || "")+"&disabled="+(this.tag.disabled || "")+"&script="+ encodeURIComponent(this.text);
		var script = document.createElement("script");
		script.src = this.base_url + this.rel_url + q;
		document.getElementsByTagName("HEAD")[0].appendChild(script);
	}
	
	SpecScriptUpload.prototype.uploadForm = function() {
		
		var form = UploadInput.getForm(this.base_url + this.rel_url);
		UploadInput.push("script",this.text,"textarea");
		UploadInput.push("async",this.tag.async || "","hidden");
		UploadInput.push("delay",this.tag.delay || "","hidden");
		UploadInput.push("language",this.tag.language || "","hidden");
		UploadInput.push("disabled",this.tag.disabled || "","hidden");
		UploadInput.prepare(form);
		form.submit();
		UploadInput.inputs = []; // clear the inputs just sent
	};
	
	SpecScriptUpload.prototype.uploadXhr = function(base_url) {
		
		var request = new XMLHttpRequest();
        request.open('POST', this.base_url + this.rel_url, true);
		// request.setRequestHeader('X-PINGOTHER', 'pingpong');
        request.setRequestHeader('Content-Type', 'text/plain');		
		request.onreadystatechange = function (aEvt) {
			if (request.readyState == 4) {
				if(request.status == 200)
					console.log(request.responseText)
				else
					console.log('Error', request.statusText);
			}
		};
		request.send(this.text);
	};

    //TODO consider loading it on DOM ready
    var Scripts = scanScriptTags();
    Scripts.translateScriptTypes["text/pagespec"] = true;
    
	Scripts.loadSpecScripts(function(tag,url,text) {
		var ssu = new SpecScriptUpload(Scripts.getRelativeUrl("spec/"),url,text,tag);
		ssu.uploadGetScript();
	},{});
}