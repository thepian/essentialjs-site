@insert path "pagecore/builtin.js";
@insert path "pagecore/options.js";
@insert path "pagecore/scripts.js";
@insert path "pagespec/events.js";
@insert path "pagespec/slaves.js";
@insert path "pagespec/upload.js";

var pagespec = {
    startTime: new Date(),
    outstanding: [],
    delayted: [],
    
    // Specifications and their completion status as defined by one or more @describe
    specs: [],
    
    // Expectations filed when running specifications
    expectations: []
};

// var form = document.forms[0];

// make unique identifier ?
var unique_id = new Date().getTime(); //TODO combine with local ip
// form.action = String(unique_id); // unique url

/* Run a list of all specs making up a query */
pagespec.run = function(specs)
{
    for(var i=0,e; e = specs[i]; ++i) {
        var spec = new Spec(e.id,e.run);
        this.specs.push(spec)
        this.current_spec = spec;

        try {
            spec.run(this);
            spec.markCompleted();
        }
        catch(ex) {
            spec.markException(ex);
        }
    }
    this.current_spec = null;
};

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

pagespec.expect = function(getVal,expression,clauses) {
    var exp = new Expectation(this.current_constr, this.current_caption, this.example_name, getVal,expression,clauses);
    this.expectations.push(exp);
    
    exp.testNow();
    // TODO determine temporal and try if NOW
    
}

@insert path "pagespec/spec.js";
