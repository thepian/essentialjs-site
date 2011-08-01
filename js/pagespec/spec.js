function Spec(id,run) {
    this.id = id;
    this.run = run;
}

Spec.prototype.markCompleted = function() {
    this.spec_constr = pagespec.current_constr;
    this.spec_caption = pagespec.current_caption;
    this.completed = true;
};

Spec.prototype.markException = function(ex) {
    this.spec_constr = pagespec.current_constr;
    this.spec_caption = pagespec.current_caption;
    this.exception = ex;
    this.completed = true;
};

Spec.prototype.getCaption = function() {
    return this.spec_caption;
};

/*
    Example instances are used in pagespec.examples, and as a step in pagespec.outstanding
*/
function Example(name,func,spec) {
    
    this.expectation_number = 0; // Used by expectations to give sequence

    /* 
    TODO support attributes
    - loaded : example run on page loaded
    */
    this.spec_id = spec.id;
    this.spec_constr = spec.constr;
    this.spec_caption = spec.caption;
    this.spec = spec;

    this.title = name || "unspecified",
    this.name = name;
    this.example_name = name;
    this.run = func;

}

Example.prototype.post_exception = function(ex) {
    
    UploadInput.pushStepException(this,ex);
};

// Called after each example step
Example.prototype.post_success = function() {
    
    if (this.last) UploadInput.pushSpecEnded(this);
};



function Expectation(current_step, getVal,expression,clauses)
{

    // step values
    this.spec_id = current_step.spec_id;
    this.example_name = current_step.name;
    this.expectation = String(current_step.expectation_number++);

    this.spec = current_step.current_spec;
    this.spec_constr = current_step.spec_constr;
    this.spec_caption = current_step.spec_caption;
    
    this.getVal = getVal;
    this.example_expression = expression;
    this.clauses = clauses;
}

Expectation.prototype.testNow = function()
{
    try {
        var val = this.getVal();
    }
    catch(ex) {
        this.failed = this.example_expression + " threw exception " + String(ex);
        return;
    }
    for(var i=0,clause; op = this.clauses[i]; i += 3) {
        var clause = this.clauses[i+1], expr = this.clauses[i+2];
        var should = pagespec.should[op];
        
        // UploadInput.pushSubject = function(pagespec.current_step.spec_id,pagespec.current_step.name,expression,value)

        if (should) {
            // TODO catch exceptions 
            var expected = clause? clause() : null;
            if (! should(val,expected)) {
                this.failed = this.example_expression + " should " + op + " " + expr + ", it was "+val+"(a "+typeof(val)+")";
                UploadInput.pushOutcome(this,"failed",this.failed);
            }
        }
    }
    this.completed = true;
};
