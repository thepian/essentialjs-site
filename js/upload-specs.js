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
    @insert path raw "pagespec/events.js";
    @insert path raw "pagespec/slaves.js";
    @insert path raw "pagespec/upload.js";

}