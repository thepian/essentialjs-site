function makeUploadStep(spec_id) {
    
    return {
        run: function() {
            // Make form and iframe for posting result
            //TODO create this on DOM ready instead
            if (UploadInput.form == undefined) {
                UploadInput.form = document.createElement("FORM");
                var results_frame = SlaveFrame("__submitter__","submitter",{ src: "javascript:void(0);" });
                UploadInput.form.target = "__submitter__";
                UploadInput.form.action = "../runs/" + String(unique_id) + "/";
                UploadInput.form.method = "POST";
                UploadInput.form.cssStyle = "display:none;";

            }
            UploadInput.prepare(UploadInput.form);
            UploadInput.form.submit();
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

// var regex = /
function sentence2name(sentence) {
    //TODO character translation table or html-name-encoding
    return sentence.replace(/\s/g,'_');
}

UploadInput.inputs = [];

UploadInput.push = function(name,value,template) {
    var input = new this(name,value,template);
    this.inputs.push(input);
};

UploadInput.pushExample = function(spec,example,value,template) {
    var name = sentence2name(spec)+"__"+sentence2name(example);
    this.push(name,encodeURIComponent(value),template);
};

/*
spec - Sentence
example - Sentence
subject - number
*/
UploadInput.pushSubject = function(spec,example,subject,value) {
    var name = sentence2name(spec)+"__"+sentence2name(example)+"__"+sentence2name(subject);
    this.push(name,encodeURIComponent(value));
};

UploadInput.pushException = function(step,ex,template) {
    // conditional_debugger;
    if (step.spec_id) {
        if (step.example_name) this.pushExample(step.spec_id, step.example_name, ex,template || "textarea");
        //TODO subject and spec
    }
};

UploadInput.pushPassed = function(script_name) {
    this.push(script_name,"passed","text");
};

UploadInput.pushEnded = function(script_name) {
    this.push(script_name,"ended","text");
}


UploadInput.prepare = function(form) {
    var inner = '';
    
    for(var i=0,e; e = this.inputs[i]; ++i) {
        if (form[e.name]) form[e.name].value = e.value;
        else inner += String(e);
    } 
    var span = document.createElement("span");
    span.innerHTML = inner;
    form.appendChild(span);
};

