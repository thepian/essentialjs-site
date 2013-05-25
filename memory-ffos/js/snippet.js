/*
 * @require "core/enhance.js"
 */

/**
 *
 * @param {HTMLElement|string} source String or Element used as the source for the template
 * @param options.repo Object that will serve sub snippets through a get(name) method
 */
function HTMLSnippet(source,options)
{
	this.options = options || {};
	this.defaultContext = "context";
	var sourceElement = source;
	if (source.childNodes == undefined) {
		sourceElement = document.createElement("DIV");
		// Calling on prototype for browsers that haven't resolved the prototype yet
		sourceElement.innerHTML = this._transformString(source.toString());
	}

	// Strip whitespace before/after main content
	var bStrip = this.options.stripBlanks === undefined || this.options.stripBlanks === true;
	var eFirst = sourceElement.firstChild;
	var eLast = sourceElement.lastChild;
	if (eFirst != eLast && bStrip) {
		if (eFirst.nodeType == 3 && /^\s*$/.test(eFirst.nodeValue)) {
			sourceElement.removeChild(eFirst);
		}
		if (eLast.nodeType == 3 && /^\s*$/.test(eLast.nodeValue)) {
			sourceElement.removeChild(eLast);
		}
	}


	this.stream = HTMLImplementation.describeStream(sourceElement,this);
    for(var i=0,impl; impl = this.stream[i]; ++i) {
        // var entry = new StateEntry();
        // if (typeof impl == "object") {
        //         // impl.context = impl.describeContext(stack,contextName);
        //     impl.describeAttributes(impl.original,this.DECORATORS);
        // }
    }
}

function HTMLSnippetRepo(sources,sourceAttribute)
{
    if (sources) {
        this.addSources(sources,sourceAttribute || "name");
    }
}

HTMLSnippetRepo.prototype.addSources = function(sources,sourceAttribute) 
{
    for(var i=0,s; s = sources[i]; ++i) {
        var name = s.getAttribute(sourceAttribute);
        if (name != null) {
            if (name.indexOf(":") == -1) name = ":" + name; // normally the name should start with "form:" or similar

            var options = {repo:this, sources:sources};
            this[name] = new HTMLSnippet(s,options);
        }
    }
};

HTMLSnippetRepo.prototype.get = function(name,options) 
{
    if (name.indexOf(":") == -1) name = ":" + name; // normally the name should start with "form:" or similar
    if (this[name] == undefined) {
        debugger;
    }
    return this[name];
};

/**
 * Enhance specified elements with specified snippets
 *
 * @param targets Array of elements to enhance
 * @param targetAttribute Name of the attribute referencing source
 * @param sources Array of elements to use as snippet sources
 * @param sourceAttribute Name of the attribute identifying a snippet
 */
HTMLSnippet.enhanceElements = function(targets,targetAttribute,sources,sourceAttribute,originMaker)
{
    var repo = new HTMLSnippetRepo(sources,sourceAttribute);
    for(var i=0,t; t = targets[i]; ++i) {
        var name = t.getAttribute(targetAttribute);
        t.innerHTML = "";
        var options = {};
        var snippet = repo.get(name,options);
        var origin = { handlers: {}, instance: {}};
        if (originMaker) origin = originMaker();
        var implementation = HTMLImplementation.ensure(t);
        t.state = snippet.newState(origin);
        implementation.renderStream(t,snippet.stream,t.state);
		t.state.block.reflect = false;
		t.state.triggerQueuedReflections();
        // t.state.block.reflect = true;
    }

};

//TODO forgetElements call forgetStream(stream,this)

HTMLSnippet.prototype.DECORATORS = {};

// run with implementation = this
HTMLSnippet.prototype.DECORATORS['data-implementation'] = function(name,attribute)
{
    return function(state,clone) {};
};
HTMLSnippet.prototype.DECORATORS['data-implementation'].attribute = true;
HTMLSnippet.prototype.DECORATORS['data-implementation'].simple = true;
HTMLSnippet.prototype.DECORATORS['data-implementation'].implementation = true;


// run with implementation = this
HTMLSnippet.prototype.DECORATORS['implementation'] = function(name,attribute)
{
    return function(state,clone) {};
};
HTMLSnippet.prototype.DECORATORS['implementation'].attribute = true;
HTMLSnippet.prototype.DECORATORS['implementation'].simple = true;
HTMLSnippet.prototype.DECORATORS['implementation'].implementation = true;


// run with implementation = this
HTMLSnippet.prototype.DECORATORS['impl'] = function(name,attribute)
{
    return function(state,clone) {};
};
HTMLSnippet.prototype.DECORATORS['impl'].attribute = true;
HTMLSnippet.prototype.DECORATORS['impl'].simple = true;
HTMLSnippet.prototype.DECORATORS['impl'].implementation = true;


// run with implementation = this
HTMLSnippet.prototype.DECORATORS['data-context'] = function(name,attribute)
{
    return function(state,clone) {
        
    };
};
HTMLSnippet.prototype.DECORATORS['data-context'].attribute = true;
HTMLSnippet.prototype.DECORATORS['data-context'].simple = true;
HTMLSnippet.prototype.DECORATORS['data-context'].context = true;


// run with implementation = this
HTMLSnippet.prototype.DECORATORS['data-constant'] = function(name,attribute)
{
    return function(state,clone) {
        
    };
};
HTMLSnippet.prototype.DECORATORS['data-constant'].attribute = true;
HTMLSnippet.prototype.DECORATORS['data-constant'].simple = true;


// run with implementation = this
HTMLSnippet.prototype.DECORATORS['data-action'] = function(name,attribute)
{
    return function(state,clone) {
        
    };
};
HTMLSnippet.prototype.DECORATORS['data-action'].attribute = true;
HTMLSnippet.prototype.DECORATORS['data-action'].simple = true;


// run with implementation = this
HTMLSnippet.prototype.DECORATORS['data-lookup'] = function(name,attribute)
{
    return function(state,clone) {
        
    };
};
HTMLSnippet.prototype.DECORATORS['data-lookup'].attribute = true;
HTMLSnippet.prototype.DECORATORS['data-lookup'].simple = true;


/**
 * @private
 * Tags that support command attribute
 */
HTMLSnippet.COMMAND_TAGS = {
	"input":true,
	"INPUT":true,
	"a":true, "A":true,
	"button":true,
	"BUTTON":true,
	"span":true, "SPAN":true,
	"var":true, "VAR":true,
	"div":true,
	"DIV":true
};

/**
 * @private
 * Handlers supported for data-action attribute
 */
HTMLSnippet.DATA_ACTIONS = {
	"preset":true,
	"increase":true,
	"decrease":true,
	"toggle":true
};

/** @private */
HTMLSnippet.COMMAND_LISTENERS = {};

HTMLSnippet.COMMAND_LISTENERS.click = function(e) {
	// specific to control
	var state = this.state;
	state.fireTrigger({
	    full: state.context +"."+ this.implementation.attributes["command"].value,
	    context: state.context, name: this.implementation.attributes["command"].value
	}, "command");
}; 

// run with implementation = this
HTMLSnippet.prototype.DECORATORS['command'] = function(name,attribute)
{
	if (this.toClone.tagName.toLowerCase() == "button") {
		this.toClone.setAttribute("type","button"); // ignore default of "submit"
	}

    return function(state,clone) {
        //TODO clone.state.ensureControlTriggers(clone,eForm,attribute.value);
		clone.implementation.addEventListeners(clone,HTMLSnippet.COMMAND_LISTENERS,false);
    };
};
HTMLSnippet.prototype.DECORATORS['command'].attribute = true;
HTMLSnippet.prototype.DECORATORS['command'].simple = true;


/** @private */
HTMLSnippet.DATA_CONTENT_LISTENERS = {};

/** @private */
HTMLSnippet.DATA_CONTENT_LISTENERS.change = function(oEvent)
{
    //TODO split/join handlers. divides input value among multiple entries. combines multiple entries to single value.
    var entry = this.state.contexts[this.state.context][this.implementation.attributes["data-content"].names[0]];
	if (!entry.editing) {
		this.state.fireTrigger(entry,"changebegin",entry.value,oEvent); //TODO parameters
		this.state.fireTrigger(entry,"editbegin",entry.value,"single")
	}
	entry.editing = false;

	//TODO formchange for other controls
	var vValue = this.implementation.getContent(this);
	this.state.fireTrigger(entry,"change",vValue);
	this.state.set(entry.context,entry.name,vValue,"editdone");
};

HTMLSnippet.DATA_CONTENT_LISTENERS.keypress = function(oEvent)
{
    var entry = this.state.contexts[this.state.context][this.implementation.attributes["data-content"].names[0]];
	if (!entry.editing) {
		this.state.fireTrigger(entry,"changebegin",entry.value); //TODO parameters
		this.state.fireTrigger(entry,"editbegin",entry.value,"single");
		entry.editing = true;
	}
	//TODO fire forminput
	var vValue = this.implementation.getContent(this);
	this.state.fireTrigger(entry,"input",vValue,oEvent); //TODO parameters
};

HTMLSnippet.DATA_CONTENT_LISTENERS.input = function(oEvent)
{
    // debugger;
    // console.log("input event: "+(this.valueAsNumber || this.value));
};

/** @private */
HTMLSnippet.FIX_INPUT_SPIN_LISTENERS = {};

HTMLSnippet.FIX_INPUT_SPIN_LISTENERS.change = HTMLSnippet.DATA_CONTENT_LISTENERS.change;

HTMLSnippet.FIX_INPUT_SPIN_LISTENERS.keypress = HTMLSnippet.DATA_CONTENT_LISTENERS.keypress;

HTMLSnippet.FIX_INPUT_SPIN_LISTENERS.click = function(oEvent)
{
    var that = this;
    setTimeout(function(){
        
        var entry = that.state.contexts[that.state.context][that.implementation.attributes["data-content"].names[0]];
    	if (!entry.editing) {
    		that.state.fireTrigger(entry,"changebegin",entry.value); //TODO parameters
    		that.state.fireTrigger(entry,"editbegin",entry.value,"single");
    		entry.editing = true;
    	}
    	var value = that.implementation.getFormatted(that);
        if (entry.hasChanged(value)) {

        	//TODO fire forminput
        	that.state.fireTrigger(entry,"input",value,oEvent); //TODO parameters
        	that.state.fireTrigger(entry,"change",value);
        	that.state.set(entry.context,entry.name,value,"editdone");
            // console.log("click event: "+(that.valueAsNumber || that.value));
        }
    },0);
};
HTMLSnippet.FIX_INPUT_SPIN_LISTENERS.blur = function(event)
{
    // console.log("blur event: "+(this.valueAsNumber || this.value));
}

/** @private */
HTMLSnippet.TOGGLES_LISTENERS = {};

// /** @private */
// HTMLSnippet.TOGGLES_LISTENERS.click = function(oEvent) {
//     // alert("click");
// };

/** @private */
HTMLSnippet.TOGGLES_LISTENERS.change = function(oEvent)
{
    var entry = this.state.contexts[this.state.context][this.implementation.attributes["data-content"].names[0]];
	if (!entry.editing) {
		this.state.fireTrigger(entry,"changebegin",entry.value,oEvent); //TODO parameters
		this.state.fireTrigger(entry,"editbegin",entry.value,"single")
	}
	entry.editing = false;
	
	//TODO formchange for other controls
	var vValue = this.implementation.getToggleValue(this);
	//TODO apply reverse mapping
	this.state.fireTrigger(entry,"change",vValue);
	this.state.set(entry.context,entry.name,vValue,"editdone");
};

//TODO space toggles


// run with implementation = this
HTMLSnippet.prototype.DECORATORS['data-content'] = function(name,attribute)
{
    // TODO radio button data-constant if checked otherwise none
	attribute.defaults.push(this.getContent(this.original));
	attribute.defaults.push(
		this.parseConstantString(this.original.getAttribute("data-content-default")));

    return function(state,clone) {
		if (this.updateFields) {
			// getAllFieldNames from FormView
			state.addReflection(this.context, attribute, {
				implementation: this,
				form: clone.form,
				element: clone,
				target: "fields",
				source: "all"
			});
		} else {
			state.addReflection(this.context, attribute, {
				implementation: this,
				form: clone.form,
				element: clone,
				target: "content",
				source: "value"
			});
		}
		
		// caplin.dom.HTMLForm._addToElements(mElements,mConcrete,eClone);

		clone.state.ensureTriggers(this.context,attribute.names,"editbegin");
		clone.state.ensureTriggers(this.context,attribute.names,"editdone");
		if (this.handleOnChange) {
			if (clone.state.triggers.editbegin || clone.state.triggers.changebegin) {
//				clone.onfocus = onFocus;
			}
		    if (this.toggles) {
    			this.addEventListeners(clone,HTMLSnippet.TOGGLES_LISTENERS,false);
    		} else if (this.fixInputSpin) {
    		    // needed for Safari
    			this.addEventListeners(clone,HTMLSnippet.FIX_INPUT_SPIN_LISTENERS,false);
		    } else {
    			this.addEventListeners(clone,HTMLSnippet.DATA_CONTENT_LISTENERS,false);
		    }
		}
    };
};
HTMLSnippet.prototype.DECORATORS['data-content'].attribute = true;
HTMLSnippet.prototype.DECORATORS['data-content'].refs = true;


// run with implementation = this
HTMLSnippet.prototype.DECORATORS['data-min'] = function(name,attribute)
{
    var minDefault = this.original.getAttribute("data-min-default");
    if (minDefault != null) {
    	attribute.defaults.push(this.parseConstantString(minDefault));
    }
	attribute.defaults.push(this.getContent(this.original));

    return function(state,clone) {
		state.addReflection(this.context, attribute, {
			implementation: this,
			form: clone.form,
			element: clone,
			target: "min",
			source: "value"
		});
		
		// caplin.dom.HTMLForm._addToElements(mElements,mConcrete,eClone);
    };
};
HTMLSnippet.prototype.DECORATORS['data-min'].attribute = true;
HTMLSnippet.prototype.DECORATORS['data-min'].refs = true;


// run with implementation = this
HTMLSnippet.prototype.DECORATORS['data-max'] = function(name,attribute)
{
    var maxDefault = this.original.getAttribute("data-max-default");
    if (maxDefault != null) {
    	attribute.defaults.push(this.parseConstantString(maxDefault));
    }
	attribute.defaults.push(this.getContent(this.original));

    return function(state,clone) {
		state.addReflection(this.context, attribute, {
			implementation: this,
			form: clone.form,
			element: clone,
			target: "max",
			source: "value"
		});
		
		// caplin.dom.HTMLForm._addToElements(mElements,mConcrete,eClone);
    };
};
HTMLSnippet.prototype.DECORATORS['data-max'].attribute = true;
HTMLSnippet.prototype.DECORATORS['data-max'].refs = true;


/** @private */
HTMLSnippet.DATA_ACTION_LISTENERS = {};

/** @private */
HTMLSnippet.DATA_ACTION_LISTENERS.click = function(oEvent)
{
    var attribute = this.implementation.attributes["data-target"] || this.implementation.attributes["data-content"];
    var entry = this.state.contexts[this.state.context][attribute.names[0]];
	if (entry && !entry.editing) {
		this.state.fireTrigger(entry,"changebegin",entry.value); //TODO parameters
		this.state.fireTrigger(entry,"editbegin",entry.value,"single");
		entry.editing = true;
	}
	if (entry) {
		entry.editing = false;
	}
	
	var sDataConstant = this.getAttribute("data-constant");
    var vDataConstant = sDataConstant == null? null : this.implementation.parseConstantString(sDataConstant);
	var sAction = this.getAttribute("data-action");

	this.state.block.set = true;
	if (entry && entry.name) {
		if (sDataConstant != null && sAction != "toggle") { // attribute is defined
			var vValue = typeof vDataConstant == "function"? vDataConstant() : vDataConstant;
		} else {
			
			//TODO move to FormData and improve "preset" default
			var defaults = {
				preset: entry.attribute || entry.html,
				toggle: entry.value,
				increase: 1,
				decrease: 1
			};
			var vValue = defaults[sAction] !== undefined? defaults[sAction] : entry.html;
		}
		this.state.fireTrigger(entry,sAction,vValue,"single");
		this.state.fireTrigger(entry,"change",vValue,oEvent);
	} else {
	    // type="reset" button
		this.state.fireTriggerForAll(null,sAction, "default","all"); 
	}
	this.state.block.set = false;
};

if (navigator.userAgent.indexOf("Trident/") > -1) {
	HTMLSnippet.DATA_ACTION_LISTENERS.dblclick =
	HTMLSnippet.DATA_ACTION_LISTENERS.click;
}




/** @private */
HTMLSnippet.DATA_LOOKUP_LISTENERS = {};

/** @private */
HTMLSnippet.DATA_LOOKUP_LISTENERS.mouseup = function(oEvent)
{
    var attribute = this.implementation.attributes["data-target"] || this.implementation.attributes["data-content"];
    var entry = this.state.contexts[this.state.context][attribute.names[0]];

	if (!entry.editing) {
		entry.editing = true;
		this.state.fireTrigger(entry,"changebegin",oEvent); //TODO parameters
		this.state.fireTrigger(entry,"editbegin",entry.value,"single");
	}
	
};

///** @private */
//caplin.dom.HTMLForm.DATA_LOOKUP_LISTENERS.mousedown = function(oEvent)
//{
//	caplin.core.Logger.log(caplin.core.LogLevel.INFO, "mouse down lookup");
//};	

///** @private */
//caplin.dom.HTMLForm.DATA_LOOKUP_LISTENERS.mouseup = function(oEvent)
//{
//	caplin.core.Logger.log(caplin.core.LogLevel.INFO, "mouse up lookup");
//};	

/** @private */
HTMLSnippet.DATA_LOOKUP_LISTENERS.change = function(oEvent)
{
    var attribute = this.implementation.attributes["data-target"] || this.implementation.attributes["data-content"];
    var entry = this.state.contexts[this.state.context][attribute.names[0]];
	if (!entry.editing) {
		this.state.fireTrigger(entry,"changebegin",entry.value,oEvent); //TODO parameters
		this.state.fireTrigger(entry,"editbegin",entry.value,"single");
	}
	entry.editing = false;
	
	var sDataConstant = this.getAttribute("data-constant");
    var vDataConstant = sDataConstant == null? null : this.implementation.parseConstantString(sDataConstant);
	var sLookup = this.getAttribute("data-lookup");

	this.state.block.set = true;
	
	entry.editing = false;
	
	//TODO formchange for other controls
	var vValue = this.implementation.getContent(this);
	this.state.fireTrigger(entry,"changebegin",vValue,oEvent); //TODO parameters
	this.state.set(entry.context,entry.name,vValue,"editdone");
	
	this.state.block.set = false;
};

//TODO listen to arrows in firefox to trap changes
//TODO perhaps setting size attribute on the select element will fix FF
// http://bytes.com/topic/javascript/answers/158340-change-event-select-firefox-doesnt-fire-when-using-cursor-keys


// run with implementation = this
HTMLSnippet.prototype.DECORATORS['data-target'] = function(name,attribute)
{
	attribute.defaults.push(this.getContent(this.original));
	attribute.defaults.push(
		this.parseConstantString(this.original.getAttribute("data-target-default")));

    // var sDataDepends = this.getAttribute("data-depends") || (sLookup + "-lookup");
    // var mDataDepends = DataState.makeNames(pStack,sDataDepends);
    // DataState.register(mExtras,mDataDepends);
    var actionAttribute = this.attributes["data-action"];
    var lookupAttribute = this.attributes["data-lookup"];

    return function(state,clone) {

		//TODO use names from data-name/name attribute
		clone.state.ensureTriggers(this.context,attribute.names,"editbegin");
		clone.state.ensureTriggers(this.context,attribute.names,"editdone");
		//TODO params

		if (lookupAttribute) {
		    clone.state.ensureTrigger({
		        context: this.context,
		        name: lookupAttribute.value,
		        full: this.context+"."+lookupAttribute.value
		    },"lookup");
    		if (this.handleOnChange !== false) {
    			if (clone.state.triggers.editbegin || clone.state.triggers.changebegin) {
    //				clone.onfocus = onFocus;
    			}
    			this.addEventListeners(clone,HTMLSnippet.DATA_LOOKUP_LISTENERS,false);
    		}
		} else if (actionAttribute) {
		    state.ensureTrigger(state.ensureEntry(this.context,attribute.names[0]), actionAttribute.value);
    		if (this.handleOnChange !== false) {
    			if (clone.state.triggers.editbegin || clone.state.triggers.changebegin) {
    //				clone.onfocus = onFocus;
    			}
    			this.addEventListeners(clone,HTMLSnippet.DATA_ACTION_LISTENERS,false);
    		}
		}

        // if (sDataDepends) {
        //  eForm.data.addReflection(this.context, mDataDepends, {
        //      implementation: eClone.implementation,
        //      form: eForm,
        //      element: eClone,
        //      params: [sLookup+"_lookup","change"],
        //      target: "options",
        //      source: "trigger"
        //  });
        // }
		
		//TODO setKey / setInternal value

    };
};
HTMLSnippet.prototype.DECORATORS['data-target'].attribute = true;
HTMLSnippet.prototype.DECORATORS['data-target'].refs = true;


// run with implementation = this
HTMLSnippet.prototype.DECORATORS['data-disabled'] = function(name,attribute)
{
	attribute.defaults.push(!this.getEnabled(this.original));
	attribute.defaults.push(
		this.parseConstantString(this.original.getAttribute("data-disabled-default")));

    return function(state,clone) {
		//TODO use names fro data-name/name attribute
		state.addReflection(this.context, attribute, {
			implementation: clone.implementation,
			form: clone.form,
			element: clone,
			target: "disabled",
			source: "value"
		});
        // caplin.dom.HTMLForm._addToElements(mElements,mConcrete,eClone);
    };
};
HTMLSnippet.prototype.DECORATORS['data-disabled'].attribute = true;
HTMLSnippet.prototype.DECORATORS['data-disabled'].refs = true;


// run with implementation = this
HTMLSnippet.prototype.DECORATORS['data-enabled'] = function(name,attribute)
{
	attribute.defaults.push(this.getEnabled(this.original));
	attribute.defaults.push(
		this.parseConstantString(this.original.getAttribute("data-enabled-default")));

    return function(state,clone) {
		//TODO use names fro data-name/name attribute
		state.addReflection(this.context, attribute, {
			implementation: clone.implementation,
			form: clone.form,
			element: clone,
			target: "enabled",
			source: "value"
		});
        // caplin.dom.HTMLForm._addToElements(mElements,mConcrete,eClone);
    };
};
HTMLSnippet.prototype.DECORATORS['data-enabled'].attribute = true;
HTMLSnippet.prototype.DECORATORS['data-enabled'].refs = true;


// run with implementation = this
HTMLSnippet.prototype.DECORATORS['data-readonly'] = function(name,attribute)
{
	attribute.defaults.push(this.getReadOnly(this.original));
	attribute.defaults.push(
		this.parseConstantString(this.original.getAttribute("data-readonly-default")));

    return function(state,clone) {
		//TODO use names fro data-name/name attribute
		state.addReflection(this.context, attribute, {
			implementation: clone.implementation,
			form: clone.form,
			element: clone,
			target: "readonly",
			source: "value"
		});
        // caplin.dom.HTMLForm._addToElements(mElements,mConcrete,eClone);
    };
};
HTMLSnippet.prototype.DECORATORS['data-readonly'].attribute = true;
HTMLSnippet.prototype.DECORATORS['data-readonly'].refs = true;


// run with implementation = this
HTMLSnippet.prototype.DECORATORS['data-class'] = function(name,attribute)
{
	attribute.defaults.push(this.getClass(this.original));
	attribute.defaults.push(
		this.parseConstantString(this.original.getAttribute("data-class-default")));

    return function(state,clone) {
		//TODO use names fro data-name/name attribute
		state.addReflection(this.context, attribute, {
			implementation: clone.implementation,
			form: clone.form,
			element: clone,
			target: "class",
			source: "setset"
		});
        // caplin.dom.HTMLForm._addToElements(mElements,mConcrete,eClone);
    };
};
HTMLSnippet.prototype.DECORATORS['data-class'].attribute = true;
HTMLSnippet.prototype.DECORATORS['data-class'].refs = true;


// run with implementation = this
HTMLSnippet.prototype.DECORATORS['data-style-display'] = function(name,attribute)
{
	attribute.defaults.push(this.getStyle(this.original,"style.display"));
	attribute.defaults.push(
		this.parseConstantString(this.original.getAttribute("data-style-display-default")));

    return function(state,clone) {
		//TODO use names fro data-name/name attribute
		state.addReflection(this.context, attribute, {
			implementation: clone.implementation,
			form: clone.form,
			element: clone,
			target: "style.display",
			source: "value"
		});
        // caplin.dom.HTMLForm._addToElements(mElements,mConcrete,eClone);
    };
};
HTMLSnippet.prototype.DECORATORS['data-style-display'].attribute = true;
HTMLSnippet.prototype.DECORATORS['data-style-display'].refs = true;


// run with implementation = this
HTMLSnippet.prototype.DECORATORS['data-style-nodisplay'] = function(name,attribute)
{
	attribute.defaults.push(this.getStyle(this.original,"style.nodisplay"));
	attribute.defaults.push(
		this.parseConstantString(this.original.getAttribute("data-style-nodisplay-default")));

    return function(state,clone) {
		//TODO use names fro data-name/name attribute
		state.addReflection(this.context, attribute, {
			implementation: clone.implementation,
			form: clone.form,
			element: clone,
			target: "style.nodisplay",
			source: "value"
		});
        // caplin.dom.HTMLForm._addToElements(mElements,mConcrete,eClone);
    };
};
HTMLSnippet.prototype.DECORATORS['data-style-nodisplay'].attribute = true;
HTMLSnippet.prototype.DECORATORS['data-style-nodisplay'].refs = true;


// run with implementation = this
HTMLSnippet.prototype.DECORATORS['data-style-visible'] = function(name,attribute)
{
	attribute.defaults.push(this.getStyle(this.original,"style.visible"));
	attribute.defaults.push(
		this.parseConstantString(this.original.getAttribute("data-style-visible-default")));

    return function(state,clone) {
		//TODO use names fro data-name/name attribute
		state.addReflection(this.context, attribute, {
			implementation: clone.implementation,
			form: clone.form,
			element: clone,
			target: "style.visible",
			source: "value"
		});
        // caplin.dom.HTMLForm._addToElements(mElements,mConcrete,eClone);
    };
};
HTMLSnippet.prototype.DECORATORS['data-style-visible'].attribute = true;
HTMLSnippet.prototype.DECORATORS['data-style-visible'].refs = true;


// run with implementation = this
HTMLSnippet.prototype.DECORATORS['data-style-hidden'] = function(name,attribute)
{
	attribute.defaults.push(this.getStyle(this.original,"style.hidden"));
	attribute.defaults.push(
		this.parseConstantString(this.original.getAttribute("data-style-hidden-default")));

    return function(state,clone) {
		//TODO use names fro data-name/name attribute
		state.addReflection(this.context, attribute, {
			implementation: clone.implementation,
			form: clone.form,
			element: clone,
			target: "style.hidden",
			source: "value"
		});
        // caplin.dom.HTMLForm._addToElements(mElements,mConcrete,eClone);
    };
};
HTMLSnippet.prototype.DECORATORS['data-style-hidden'].attribute = true;
HTMLSnippet.prototype.DECORATORS['data-style-hidden'].refs = true;


// run with implementation = this
HTMLSnippet.prototype.DECORATORS['data-style-collapse'] = function(name,attribute)
{
	attribute.defaults.push(this.getStyle(this.original,"style.collapse"));
	attribute.defaults.push(
		this.parseConstantString(this.original.getAttribute("data-style-collapse-default")));

    return function(state,clone) {
		//TODO use names fro data-name/name attribute
		state.addReflection(this.context, attribute, {
			implementation: clone.implementation,
			form: clone.form,
			element: clone,
			target: "style.collapse",
			source: "value"
		});
        // caplin.dom.HTMLForm._addToElements(mElements,mConcrete,eClone);
    };
};
HTMLSnippet.prototype.DECORATORS['data-style-collapse'].attribute = true;
HTMLSnippet.prototype.DECORATORS['data-style-collapse'].refs = true;


HTMLSnippet.prototype._transformString = function(snippet)
{
	if (navigator.userAgent.indexOf("; MSIE \d*\.\d*;") > -1) {
		snippet = snippet.replace(/\<br\/\>/,"<br>");
		for(var n in this.TAGS) {
			var rSingleTags = new RegExp( '\\<\\s*' + n + '([^/\\>]*)' + '/\\>' );
			snippet = snippet.replace(rSingleTags, '<dfn tag="'+n+'"'+'$1></dfn>');
			var rEndTags = new RegExp( '\\</\\s*' + n + '([^/\\>]*)' + '\\>' );
			snippet = snippet.replace(rEndTags, '</dfn$1>');
			var rSwitcher = new RegExp("\\<\\s*" + n + '([^/\\>]*)' + "(/?)\\>");
 			snippet = snippet.replace(rSwitcher,'<dfn tag="'+n+'"'+ "$1$2>");
		}
	}
	else {
		for(var n in this.TAGS) {
			var rSingleTags = new RegExp( '\\<\\s*' + n + '([^/\\>]*)' + '/\\>' );
			snippet = snippet.replace(rSingleTags, '<'+n+'$1></'+n+'>');
		}
	}

	return snippet;
};

HTMLSnippet.prototype.newState = function(origin)
{
    var state = new DataState(origin);
	state.ensureTrigger(null,"implementation","init");
	state.ensureTrigger(null,"implementation","destroy");
	state.applyStream(this.stream);

    return state;
};