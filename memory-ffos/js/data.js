/**
 * Used to track common-state and element-state.
 * Common state is the overall state of the snippet or top element, whereas 
 * Element state is from the perspective of the individual element.
 * A StateEntry instance is maintained for each variable referenced by the markup
 * or controller code. Entries are shared between common and element states within the same top element.
 *
 * For common state init with { handlers:.. , instance: .. }
 */
function DataState(origin)
{
    origin = origin || {};
    
	this.contexts = origin.contexts || {};
	this.entries = origin.entries || {};
    this.handlers = origin.handlers || {};
    this.instance = origin.instance || {};
	this.mappings = origin.mappings || {};

	this.block = origin.block || {};	// map of blocked method notifications (so far only set is supported)

    // top/snippet should have triggers which are available on the element states
    // whereas each element have their own triggers to maintain
	this.triggers = {}; // local triggers
	this.snippetTriggers = origin.snippetTriggers || this.triggers;
	for(var i=0,n; n=this.TRIGGER_NAMES[i]; ++i) {
	    this[n+"Triggers"] = origin[n+"Triggers"] || {};
	}
}

/** @private */
DataState.prototype.forget = function()
{
	// Clear all data triggers
	for(var n in this.entries) {
		if (this.entries[n]) {
			var mTriggers = this.entries[n].triggers;
			for(var t in mTriggers) delete mTriggers[t];
		}
	}
	// Clear data/related/command triggers
	for(var i=0,n; n=this.TRIGGER_NAMES[i]; ++i) {
	    var triggers = this[n+"Triggers"];
    	for(var n in triggers) delete this.triggers[n];
	}
	// Clear form triggers
	for(var n in this.triggers) delete this.triggers[n];
};

/**
 * Create a DataState specific to the element cloned from the implementation
 */
DataState.prototype.getElementState = function(impl)
{
    // element specific: context, attributes & triggers
    state = new DataState(this);
    state.context = impl.context;
    state.attributes = {};
    return state;
};

/**
 * Ensure that all entries referenced by the stream are made
 */
DataState.prototype.applyStream = function(stream)
{
    var block_set = this.block.set, block_reflect = this.block.reflect;
	this.block.set = true;
	this.block.reflect = true;

    for(var i=0,impl; impl = stream[i]; ++i) {
        if (typeof impl == "object") {
            this.ensureContext(impl.context);
            for(var n in impl.attributes) {
                var attribute = impl.attributes[n];
                if (attribute.is_refs) {
                    for(var j=0,name; name = attribute.names[j]; ++j) {
                        var entry = this.ensureEntry(impl.context,name);
                        entry.applyDefaults(attribute.defaults);
                    }
                }
                this.ensureAttributeMappings(impl.context,attribute);
            }
        }
    }
    
    // TODO mark mappings
    
    this.firePresetTriggers();
    this.block.set = block_set;
    this.block.reflect = block_reflect;
};

DataState.prototype.ensureContext = function(context)
{
    if (this.contexts[context] == undefined) {
        this.contexts[context] = { __all__ : {} };
    }
};

DataState.prototype.ensureEntry = function(context,name)
{
    var entry = this.contexts[context][name];
    if (entry == undefined) {
        entry = this.contexts[context][name] = new StateEntry(context,name);
        this.entries[entry.full] = entry;
        
        this.ensureTrigger(entry,"preset");
        this.ensureTrigger(entry,"set");
    }
    return entry;
};

DataState.prototype.ensureAttributeMappings = function(context,attribute)
{
    var parts = attribute.parts || [];
    for(var i=0,p; p = parts[i]; ++i) {
        if (p.mapping) {
            var entry = { context: context, name: p.mapping, full:context+"."+p.mapping };
            this.ensureTrigger(entry,"mapping");
            this.ensureTrigger(entry,"unmapping");
        }
    }
};


DataState.prototype.firePresetTriggers = function()
{
    for(var name in this.entries) {
        var entry = this.entries[name];
        if (!entry.preset) {
            this.fireTrigger(entry,"preset", entry.defaults,"init");
            entry.preset = true;
            entry.queued = true; 
        }
    }
};

/** @private */
DataState.prototype.TRIGGER_NAMES = [];

/** @private */
DataState.prototype.HANDLERS = {
	"preset": "state", "increase":"state", "decrease":"state", "toggle":"state", 
	"set": "state", "editbegin": "state", "editdone": "state",
    //TODO split/join handlers. divides input value among multiple entries. combines multiple entries to single value.
	
	"command": "command", // command rather than data-name 
	"lookup": "related", 
	"mapping": "related", "unmapping": "related",

	"implementation": "life",
	
	//TODO bound for every clone point, queueing for forget sequence
	"change": "element", "changebegin": "element", "formchange": "element",
	"input": "element", "forminput": "element"
};

(function(){
for(var n in DataState.prototype.HANDLERS) {
    var category = DataState.prototype.HANDLERS[n];
    switch(category) {
        case "state":
        case "command":
        case "related":
            DataState.prototype.TRIGGER_NAMES.push(n);
            break;
        case "life":
        case "element":
    }
}    
})();

/** @private */
DataState.prototype.DEFAULT_HANDLERS = {
    "nop" : function() {},
    
	"preset": function(context,sName,oInstance) {
		return function(values,sStage) {
			this.set(context,sName,values[0] === undefined? null : values[0]);
		};
	},
	"mapping": function(context,sName,sMapping,oInstance) {
		function notMapping(vValue) { 
			return !vValue; 
		}
		
		function nopMapping(vValue) {
			return vValue;
		}
		
		return sMapping == "not"? notMapping : nopMapping; 
	},
	"lookup": function(context,sName,sLookup,oInstance) {
		return function(sStage) {
			return [];
		};
	},
	"set": null
};

DataState.prototype.ensureTrigger = function(entry,name,related)
{
    var fDefaultHandler = this.DEFAULT_HANDLERS[name] || this.DEFAULT_HANDLERS.nop;
    var fHandler = this.handlers[name] || fDefaultHandler; 

    var triggers;
    var params;
    var element = entry? entry.element : null;
    var trigger_name;
	switch(this.HANDLERS[name]) {
	    case "life":
            //(handler_instance, stage)
            params = [this.instance, related];
            triggers = this.snippetTriggers;
            trigger_name = related? related+"_"+name : name;
            break;
        case "element":
            // (handler_instance, element)
            params = [this.instance,element];
            triggers = this.triggers; // element specific DataState
            trigger_name = name;
            break;
        case "command":
            // submit/reset/default/cancel - snippet vs others - element
            params = [entry.context,entry.name,this.instance,element];
            triggers = this[name+"Triggers"];
            trigger_name = entry.context+"."+(related || entry.name);
            break;
        case "state":
            // (context, name, handler_instance, state)
            params = [entry.context,entry.name,this.instance,this];
            triggers = this[name+"Triggers"];
            trigger_name = entry.context+"."+entry.name;
            break;
        case "related":
            // (context, related, handler, instance, state)
            params = [entry.context, (related || entry.name), this.instance, this];
            triggers = this[name+"Triggers"];
            trigger_name = entry.context+"."+(related || entry.name);
            break;
    }   
    
	if (triggers[trigger_name] == undefined) {
		triggers[trigger_name] = fHandler.apply(this,params);
		if (triggers[trigger_name] == undefined && fDefaultHandler) {
			triggers[trigger_name] = fDefaultHandler.apply(this,params);
		}
	}
	return triggers[trigger_name];
};


DataState.prototype.ensureTriggers = function(context, refs, name, related)
{
    for(var i=0,r; r = refs[i]; ++i) {
        var entry = this.ensureEntry(context, r);
        this.ensureTrigger(entry,name,related);
    }
};

//TODO change to (entry,name,related,v1,v2,v3) ?
/**
 * @param entry DataEntry for state types. For command and related, name = command/related
 */
DataState.prototype.fireTrigger = function(entry,name,v1,v2,v3)
{
    var triggers;
    var trigger_name = name;
	switch(this.HANDLERS[name]) {
	    case "life":
            triggers = this.snippetTriggers;
            trigger_name = related? related+"_"+name : name;
            return;
        case "element":
            triggers = this.triggers; // element specific DataState
            break;
        case "command":
            // submit/reset/default/cancel - snippet vs others - element
            triggers = this[name+"Triggers"];
            trigger_name = entry.context+"."+entry.name;
            break;
        case "state":
            triggers = this[name+"Triggers"];
            trigger_name = entry.context+"."+entry.name;
            break;
        case "related":
            triggers = this[name+"Triggers"];
            trigger_name = entry.context+"."+entry.name;
            break;
    }   
	if (triggers[trigger_name]) return triggers[trigger_name].call(this,v1,v2,v3);
};

DataState.prototype.fireTriggerForAll = function(context,name,v1,v2,v3)
{
    var entries = context? this.contexts[context] : this.entries;
    for(var n in entries) {
        this.fireTrigger(entries[n],name,v1,v2,v3);
    }
};


function StateEntry(context,name)
{
    this.name = name;
    this.context = context;
    this.full = context + "." + name;
    
    this.value = null;
	
	this.defaults = [];
	
	this.preset = false;    // value has been preset
	this.queued = false;    // reflection queued
	this.reflections = [];
}

StateEntry.prototype.applyDefaults = function(defaults)
{
    for(var i=0,d; d = defaults[i] || i < defaults.length; ++i) if (d != undefined) this.defaults.push(d);
};

StateEntry.prototype.hasChanged = function(newValue)
{
    if (newValue != this.value) return true;
    return false; //TODO override for inputs with data-content
};


/**
 * 
 * @param {String} context Context name
 * @param {Map} attribute Attribute with names and mappings
 * @param {Map} mReflection { implementation, element, target, source } 
 */
DataState.prototype.addReflection = function(context,attribute, mReflection) 
{
	//TODO var pDepends = eClone.data.entries[mNames.full].depends = mNames.depends;

	for(var i=0,n; n = attribute.names[i]; ++i) {
		var mReflection2 = { part: attribute.parts[i], names: attribute.names, parts: attribute.parts };
		for(var m in mReflection) mReflection2[m] = mReflection[m];
		this.contexts[context][n].reflections.push(mReflection2);
	}
};

/**
 * Mark a set of names as queued. Specify a names map or a context and single name.
 * 
 * @param {Map} attribute Description of attribute
 */
DataState.prototype.markChanged = function(context,attribute)
{
	if (typeof attribute == "string") {
		this.contexts[context][attribute].queued = true;
	} else {
		for(var i=0,n; n = attribute.names[i]; ++i) {
			this.contexts[context][n].queued = true;
		}
	}	
};

/**
 * Fired when a data entry has been changed. The change is reflected in the various
 * controls that use the entry, and in lookups that depend on it.
 *  
 * @param {Map} mEntry
 */
DataState.prototype._triggerReflection = function(mEntry)
{
	function mapIt(value,mEntry,oPart,oForm) {
	    var vValue = value;
		if (oPart && oPart.mapping) {
			vValue = this.fireTrigger({
			    "context":mEntry.context,
			    "name": oPart.mapping,
			    "full": mEntry.context + "." + oPart.mapping,
			},"mapping",vValue);
			var t = typeof vValue;
			if (t == "object") {
				vValue = vValue.formatted;//TODO caplin.dom.HTMLMessage.translateCode(vValue.code,vValue.formatted,vValue);
			} else if (t == "undefined") {
			    vValue = value;
			}
		}
		return vValue;
	}
	
 	for(var i=0,r; r = mEntry.reflections[i]; ++i) {
		var vValue;
		switch(r.source) {
			//TODO "string" force it to string
			case "setset":
				var vValue = {};
				for(var i2=0,pPart;pPart = r.parts[i2]; ++i2) {
					var sName = pPart[2];
					var mEntry2 = this.contexts[mEntry.context][sName];
					if (typeof mEntry2.value == "string") {
						var pValue = mEntry2.value.split(" ");
						for(var i3=0,m; m = pValue[i3]; ++i3) {
							var sValue = mapIt.call(this,m,mEntry2,pPart,r.form);
							vValue[sValue] = true;
						}
					} else {
						var sValue = mapIt.call(this,mEntry2.value,mEntry2,pPart,r.form);
						if (sValue !== undefined) {
							// there was a mapping for it (even if it's null)
							if (typeof sValue != "string" && sValue != null) {
								sValue = sValue.toString();
							}
							vValue[sValue] = true;
						}
					}
				}
				r.implementation.reflect(r.element,r.target,vValue);
				break;
			case "all": 
				vValue = mEntry.all; 
				r.implementation.reflect(r.element,r.target,vValue);
				break;
			case "trigger":
				var state = r.element? r.element.state : this;
				//TODO review support for all types
    			var pValues = state.fireTrigger.apply(state,r.params);
    			r.implementation.reflect(r.element,r.target,pValues);
				break;
			default:
				vValue = mapIt.call(this,mEntry.value,mEntry,r.part,r.form);
				r.implementation.reflect(r.element,r.target,vValue);
				break;
		};
	}
	mEntry.queued = false;
};

DataState.prototype.triggerQueuedReflections = function()
{
	for(var sFullName in this.entries) {
		var mEntry = this.entries[sFullName];
		if (mEntry.queued) {
			this._triggerReflection(mEntry);
		}
	}
};
 
/* *********************** *
 *  Instantiated Presentation Values
 * *********************** */

/** 
 * @private 
 * ("context","name",value)
 * or
 * ("context",{ map }[,key list])
 * 
 * @param {String} context
 * @param {Object} mValues
 * @param {Object} pFields
 * @param {String} sNotify Notification method name (set or editdone)
 * @param {HTMLElement} eSource Source element which will not be updated as it should already be up-to-date or refresh itself
 */
DataState.prototype.set = function(context,mValues,pFields,sNotify,eSource)
{
    //TODO if entry.editing the force editdone
	var eForm = null;//TODO
	
	sNotify = sNotify || "set";
	if (this.contexts[context] == undefined) {
		this.contexts[context] = {};
	} 
	
	//TODO skip changes to same value
	if (typeof mValues == "string") {
		var sName = mValues;	//arguments[1];
		var vValue = pFields;	//arguments[2];
		var sFullName = context+"."+sName;
		var mEntry = this.contexts[context][sName];
		if (mEntry == undefined) {
			var mEntry = this.ensureEntry(context,sName);
			//TODO preset
		}
		this.contexts[context].__all__[sName] =
		mEntry.value = vValue;
		if (!this.block[sNotify]) this.fireTrigger(mEntry,sNotify,vValue);
		
		mEntry.queued = true;
		
		var mToSet = {};
		mToSet[sName] = vValue;
	} else {
		var mToSet = mValues;
		if (pFields) {
			mToSet = {};
			for(var i=0,f; f=pFields[i]; ++i) {
				if (mValues[f] !== undefined) mToSet[f] = mValues[f];
			}
		}
		for(var sName in mToSet) {
			var sFullName = context+"."+sName;
			var mEntry = this.contexts[context][sName];
			if (mEntry == undefined) {
				this._setEntry(sFullName,context,sName,{});
			}
			this.contexts[context].__all__[sName] =
			mEntry.value = mValues[sName];
			if (sNotify && !this.block[sNotify]) this.fireTrigger(mEntry,sNotify,mValues[sName]);
			
			mEntry.queued = true;
			//TODO optimise to only call one renderer once
			//TODO delay render updateFields calls ?
		} 
	}
	if (!this.block.reflect) this.triggerQueuedReflections();
};

