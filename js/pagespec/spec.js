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

function Expectation(current_step, getVal,expression,clauses)
{
    this.spec = current_step.current_spec;
    this.spec_constr = current_step.spec_constr;
    this.spec_caption = current_step.spec_caption;
    this.example_name = current_step.name;
    
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
        
        // UploadInput.pushSubject = function(pagespec.current_step.spec_id,pagespec.current_step.name,expression,value)

        if (should) {
            var expected = clause? clause() : null;
            if (! should(val,expected)) {
                this.failed = this.example_expression + " should " + op + " " + expr;
            }
        }
    }
    this.completed = true;
};
