(function() {
    
var SCRIPT_ID = "pagespec_script";    
var CORE_SCRIPT_NAME = "pagespec.js";
@include("pagecore/options.js");
@include("pagecore/core.js");
@include("pagespec/scripts.js");

pagecore.translateScriptTypes["text/pagespec"] = true;

var spec_script = document.getElementById(SCRIPT_ID);
if (!spec_script) {
    // first time loading script
    scanScriptTags();
    // submit scripts for translation
    var translateScript = makeTranslateScript();
    if (translateScript) translateScript.appendHead();
    // ask server for tasks
    //TODO
    
    // find script
    // find embedded tasks
    //TODO append scripts for translated.js
    // if any appended force task processing on load
    pagecore.coreScript.setAttribute(SCRIPT_ID);
} else {
    spec_script = new ScriptTag(spec_script);
}
            
var REFRESH = 60 * 1000;
spec_script.refreshAfter(REFRESH);  // Ensure polling refresh
    
})();