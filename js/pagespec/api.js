var pagespec = {
    startTime: new Date(),
    outstanding: [],        // Outstanding steps to execute
    current_step: null,     // Step currently being executed
    delayed: [],
    
    specs: [],
    
    // Examples and their completion status as defined by one or more it clauses in @describe
    examples: [],
    
    // Expectations filed when running specifications
    expectations: []
};

// var form = document.forms[0];

// make unique identifier ?
var unique_id = new Date().getTime(); //TODO combine with local ip
// form.action = String(unique_id); // unique url

pagespec.should = {
    "==": function(a,b) { return a == b; },
    "===": function(a,b) { return a === b; },
    "<=": function(a,b) { return a <= b; },
    ">=": function(a,b) { return a >= b; },
    "!=": function(a,b) { return a != b; },
    "!==": function(a,b) { return a !== b; },
    "<": function(a,b) { return a < b; },
    ">": function(a,b) { return a > b; },

    "!": function(a) { return !a; }
};

function __expect__(getVal,expression,clauses) {
    var exp = new Expectation(pagespec.current_step, getVal,expression,clauses);
    pagespec.expectations.push(exp);
    
    exp.testNow();
    // TODO determine temporal and try if NOW
    
}



var loaded = false;
var loadedStep = null;
function whenLoaded() {
    loaded = true;
    if (loadedStep) loadedStep();
    // else queueNext();
    
}

function nextStep() {
    var step = pagespec.outstanding.shift();
    if (step) {
        pagespec.current_step = step;
        try {
            step.run();
            if (step.last) UploadInput.pushEnded(step.spec_id);
        } catch(ex) {
            UploadInput.pushException(ex);
        }
        pagespec.current_step = null;
    }
    queueNext();
}

function queueNext() {
    if (pagespec.outstanding.length && pagespec.outstanding[0]) {
        var delay = pagespec.outstanding[0].delay || "";
        if (delay == "loaded") {
            if (loaded) {
                nextStep(); // do loaded steps immediately if page is loaded
            } else {
                loadedStep = nextStep;
            }
        } else {
            var delayMs = parseInt(delay) || 0;
            //TODO h,m,s,ms,us
            setTimeout(nextStep,delayMs);
        }
    } else {
        UploadInput.prepare();
        UploadInput.form.submit();
    }
}
