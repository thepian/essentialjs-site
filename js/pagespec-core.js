var pagespec = {
    startTime: new Date(),
    outstanding: [],
    delayted: [],
    
    // Specifications and their completion status as defined by one or more @describe
    specs: [],
    
    // Expectations filed when running specifications
    expectations: []
};

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
}

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

function Spec(id,run) {
    this.id = id;
    this.run = run;
}

Spec.prototype.markCompleted = function() {
    this.spec_constr = pagespec.current_constr;
    this.spec_caption = current_caption;
    this.completed = true;
};

Spec.prototype.markException = function(ex) {
    this.spec_constr = pagespec.current_constr;
    this.spec_caption = current_caption;
    this.exception = ex;
    this.completed = true;
};

Spec.prototype.getCaption = function() {
    return this.spec_caption;
};

function Expectation(spec_constr,spec_caption,example_name, getVal,expression,clauses)
{
    this.spec = pagespec.current_spec;
    
    this.spec_constr = spec_constr;
    this.spec_caption = spec_caption;
    this.example_name = example_name;
    this.getVal = getVal;
    this.example_expression = expression;
    this.clauses = clauses;
}

Expectation.prototype.testNow = function()
{
    var val = this.getVal();
    for(var i=0,clause; op = this.clauses[i]; i += 3) {
        var clause = this.clauses[i+1], expr = this.clauses[i+2];
        var should = pagespec.should[op];
        if (should) {
            // var expected = clause? clause() : null;
    //         if (! should(val,expected)) {
    //             this.failed = this.example_expression + " should " + op + " " + expr;
    //         }
        }
    }
    this.completed = true;
};