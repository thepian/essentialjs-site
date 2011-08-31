@scope "named" {
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
    @insert path raw "pagespec/events.js";
    @insert path raw "pagespec/slaves.js";
    @insert path raw "pagespec/upload.js";
    @insert path raw "pagespec/api.js";
    @insert path raw "pagespec/spec.js";

    // Populate outstanding steps
    var specs = [], examples = [], outstanding = [];
    for(var i=0,arg; arg = arguments[i]; ++i) {
        var parts = arg.describe(__expect__);
        var current_caption = parts.pop();
        var current_constr = parts.pop();
        
        var spec = {
            "id": arg.id,
            "constr": current_constr,
            "caption": current_caption
        };
        specs.push(spec);
        
        for(var j=0,name,func; name = parts[j]; j += 2){
            func = parts[j+1];
            
            var example = new Example(name,func,spec);
            examples.push(example);
            outstanding.push(example);
        }

        example.last = true;
        
		//TODO create this on DOM ready instead
		//NOTE!!!! unique_id is a Scoped var from execute-all
        var uploadStep = makeUploadStep(spec.id, Scripts.scriptPrefix + "../runs/" + String(unique_id) + "/");
        outstanding.push(uploadStep);
    }

    //TODO consider loading it on DOM ready
    var Scripts = scanScriptTags();
    

    /* Can be registered as an onload listener or onclick for a manual button */
    function __run__() {
        queueNext();
    };
    
    __run__.specs = pagespec.specs = specs;
    __run__.examples = pagespec.examples = examples;
    pagespec.outstanding = outstanding;
    __run__.addOnLoad = function() {
        if (window.addEventListener) window.addEventListener("load",whenLoaded,false);
        else if (window.attachEvent) window.attachEvent("onload",whenLoaded);
        else window.onload = __run__;
    };
    __run__.script_name = @insert:script_name;
    
    return __run__;
}
