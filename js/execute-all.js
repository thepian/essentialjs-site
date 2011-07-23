@scope "named" {
    var PAGESPEC_ID = "pagespec-status"; 
    var SEND_PREFIX = "pagespec:"; // message from iframe to page
    var RECEIVE_PREFIX = "pagestatus:"; // message from page to iframe
    var MESSAGE_ROOT = window.location.protocol + "//" + window.location.host; // postMessage origin

    @insert path "pagecore/builtin.js";
    @insert path "pagecore/options.js";
    @insert path "pagecore/scripts.js";
    @insert path "pagecore/formatting.js";
    @insert path "pagecore/mark.js";
    @insert path "pagespec/events.js";
    @insert path "pagespec/slaves.js";
    @insert path "pagespec/upload.js";
    @insert path "pagespec/api.js";
    @insert path "pagespec/spec.js";

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
        
        for(var i=0,name,func; name = parts[i]; i += 2){
            func = parts[i+1];
            
            /* 
            TODO support attributes
            - loaded : example run on page loaded
            */
            var example = {
                "spec_id": spec.id,
                "spec_constr": current_constr,
                "spec_caption": current_caption,
                "spec": spec,

                "title": name || "unspecified",
                "name": name,
                "run": func
            };
            examples.push(example);
            outstanding.push(example);

            example.last = true;
        }
    }
    
    // Make form and iframe for posting result
    UploadInput.form = document.createElement("FORM");
    var results_frame = SlaveFrame("__result__","progress",{ src: "javascript:void(0);" });
    

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
