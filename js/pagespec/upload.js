function makeUploadStep(spec_id) 
{
    return {
        run: function() {
            // Make form and iframe for posting result
            //TODO create this on DOM ready instead
            //NOTE!!!! unique_id is a Scoped var from execute-all
            var form = UploadInput.getForm(Scripts.scriptPrefix + "../runs/" + String(unique_id) + "/");
            
            UploadInput.prepare(form);
            form.submit();
            UploadInput.inputs = []; // clear the inputs just sent
        }
    };
}

// move this to a class file and implement at-include for scopes
function UploadInput(name,value,template) {
	this.name = name; this.value = value; 
	this.template = this[template || "hidden"];
}
UploadInput.prototype.text = '<input name="{name}" value="{value}" type="text" readonly>';
UploadInput.prototype.checkbox = '<input name="{name}" value="{value}" type="checkbox" checkbox="checked" disabled>';
UploadInput.prototype.textarea = '<textarea name="{name}" readonly>{value}</textarea>';
UploadInput.prototype.submit = '<input name="{name}" value="{value}" type="submit" readonly>';
UploadInput.prototype.hidden = '<input name="{name}" value="{value}" type="hidden">';

UploadInput.prototype.toString = function() { 
    return this.template.replace("{name}",this.name).replace("{value}",this.value); 
};

UploadInput.getForm = function(action)
{
	if (this.form == undefined) {
		this.form = document.createElement("FORM");
		this.form.target = "__submitter__";
		this.form.action = action;
		this.form.method = "POST";
		this.form.style.cssText = "display:none;";
		document.body.appendChild(this.form);
		var results_frame = SlaveFrame("__submitter__","submitter",{ src: "javascript:void(0);", parent:this.form });
	}
	
	return this.form;
};

// var regex = /
function sentence2name(sentence) {
    //TODO character translation table or html-name-encoding
    return sentence.replace(/\s/g,'_');
}

UploadInput.inputs = [];

UploadInput.push = function(name,value,template) {
    this.inputs.push( new this(name,value,template) );
};

UploadInput.pushOutcome = function(step,outcome,value,template) {
    var name = sentence2name(step.spec_id);
    if (step.example_name) {
        name += "__"+sentence2name(step.example_name);
    }
    if (step.expectation) {
        name += "__"+sentence2name(step.expectation);
    }
    name += "__"+sentence2name(outcome);

    this.inputs.push( new this(name,encodeURIComponent(value),template) ); //TODO hmm, don't think this should be encoded, for post already does that
};

UploadInput.pushStepException = function(step,ex,template) {
    // conditional_debugger;
    this.pushOutcome(step,"exception",ex,template || "textarea");
};

UploadInput.pushPassed = function(step) {
    this.pushOutcome(step,"passed","","text");
};

UploadInput.pushEnded = function(step) {
    this.pushOutcome(step,"ended","","text");
};

UploadInput.pushSpecEnded = function(step) {
    this.pushOutcome({
        spec_id: (typeof step == "string")? step : step.spec_id
    },"ended","ended","text");
};

UploadInput.pushStepStamps = function(step,stamps) {
    var sl = [];
    for(var s in stamps) {
        sl.push('"' + s + '": '+stamps[s]);
    }
    var stamps_json = "{" + sl.join(",") + "}";
    this.pushOutcome(step,"stamps",stamps_json,"hidden");    
};


UploadInput.prepare = function(form) {
    var inner = XSRF_INPUT_MARKUP;
    
    for(var i=0,e; e = this.inputs[i]; ++i) {
        if (form[e.name]) form[e.name].value = e.value;
        else inner += String(e);
    } 
    var span = document.createElement("span");
    span.innerHTML = inner;
    form.appendChild(span);
};

