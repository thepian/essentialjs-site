/*
*/
!function() {

var essential = Resolver("essential"),
	pageResolver = Resolver("page"),
	MutableEvent = essential("MutableEvent"),
	fireAction = essential("fireAction"),
	addEventListeners = essential("addEventListeners"),
	XMLHttpRequest = essential("XMLHttpRequest"),
	StatefulResolver = essential("StatefulResolver"),
	DocumentRoles = essential("DocumentRoles");

if (! /PhantomJS\//.test(navigator.userAgent)) {
	Resolver("page").set("map.class.notstate.connected","disconnected");
}

function updateConnected() {
	var url = "http://api.learnrighthere.com";
	//var url = "http://localhost:3000";
	var xhr = XMLHttpRequest();
	xhr.open("OPTIONS",url,true);
	xhr.onreadystatechange = function(ready) {
	    if (xhr.readyState == 4 /* complete */) {
	        if (xhr.status == 200 || xhr.status == 304) {
	        	pageResolver.set("state.connected",true);
		        setTimeout(updateConnected,30000);
	        }
	        else {
	        	pageResolver.set("state.connected",false);
		        setTimeout(updateConnected,10000);
	        }
	    }
	};
	xhr.send("");
}
setTimeout(updateConnected,100);

function form_blur() {
	for(var i=0,e; (e=this.elements[i]); ++i) { e.blur(); }
}
function form_focus() {
	for(var i=0,e; (e=this.elements[i]); ++i) {
		var autofocus = e.getAttribute("autofocus"); // null/"" if undefined
		if (!autofocus) continue;
		e.focus();
		break; 
	}
}

function form_onsubmit(ev) {
	var frm = this;
	setTimeout(function(){
		frm.submit(ev);
	},0);
	return false;
}

function form_do_submit(ev) {
	var formEl = ev.actionElement, method = formEl.method;
	var enctype = this.getAttribute("enctype");

	var actionVariant = ev.actionElement.actionVariant;
	actionVariant.uri = URI(this.action);
	if (actionVariant.uri.protocol() == "client+http") actionVariant.uri.protocol("http");
	if (actionVariant.uri.protocol() == "client+https") actionVariant.uri.protocol("https");
	if (actionVariant.host) actionVariant.uri.host(actionVariant.host);

	switch(enctype) {
		case "application/json":
		case "text/json":
			// http://enable-cors.org/
			var xhr = new XMLHttpRequest();
			xhr.open(method,actionVariant.uri.toString(),true);
			//xhr.setRequestHeader("Access-Control-Request-Method", "POST");
			//xhr.setRequestHeader("Access-Control-Request-Headers", "x-requested-with");
			xhr.setRequestHeader("Content-Type",enctype + "; charset=utf-8");
			xhr.onreadystatechange = function(ready) {
			    if (xhr.readyState == 4 /* complete */) {
			        if (xhr.status == 200 || xhr.status == 304) {
						if (actionVariant.onsuccess) actionVariant.onsuccess(ready);
			        }
			        else {
						if (actionVariant.onerror) actionVariant.onerror(ready);
			        }
			    }
    		};
			//debugger;
			var data = this.stateful("model"); //TODO
			var string = JSON.stringify(data);
			xhr.send(string);
			ev.preventDefault();
			break;

		case "text/plain":
		case "application/x-www-form-urlencoded":
		case "multipart/form-data":
			//TODO target = util iframe
			break;

		default:
			break;
	}

}

function form_submit(ev) {
	if (document.activeElement) { document.activeElement.blur(); }
	this.blur();

	if (ev && ev.success) {
		// host, origin, target
	}
	dialog_submit.call(this,ev);
}

function dialog_submit(clicked) {
	if (clicked == undefined) { clicked = MutableEvent().withDefaultSubmit(this); }

	if (clicked.commandElement) {
		fireAction(clicked);
	} 
	//else {
		//TODO default submit when no submit button or event
	//}
}

function form_input_change(ev) {
	ev = MutableEvent(ev);

	switch(ev.target.type) {
		// shouldn't get: button submit reset
		case "checkbox":
			this.stateful.set(["model",ev.target.name],ev.target.checked);
			break;
		case "radio":
		// email number date datetime datetime-local time week tel url
		//  month file image month range search 
		default:
			// hidden text password
			this.stateful.set(["model",ev.target.name],ev.target.value);
			break;
	}
}

function dialog_button_click(ev) {
	ev = MutableEvent(ev).withActionInfo();

	if (ev.commandElement) {
		if (ev.stateful && ev.stateful("state.disabled")) return; // disable
		if (ev.ariaDisabled) return; //TODO fold into stateful

		this.submit(ev); //TODO action context
		ev.stopPropagation();

		//TODO not the best place to do submit
		if (!ev.defaultPrevented && ev.commandElement.type == "submit") form_do_submit.call(this,ev);
	}
	if (ev.defaultPrevented) return false;
}

var effectiveRole = essential("effectiveRole"), roleAccessor = essential("roleAccessor");

DocumentRoles.makeClientForm = function(el) {

	// f.method=null; f.action=null;
	el.onsubmit = form_onsubmit;
	el.__builtinSubmit = el.submit;
	el.submit = form_submit;
	el.__builtinBlur = el.blur;
	el.blur = form_blur;
	el.__builtinFocus = el.focus;
	el.focus = form_focus;

	// Strategy determines if element should be stateful and the effective role
	var strategyRole = el.stateful("strategy.role","undefined") || effectiveRole;
	for(var i=0,node; node = el.elements[i]; ++i) {
		if (node.accessor == undefined) {
			var role = strategyRole(node);
			var accessor = roleAccessor(role);
			accessor.init(role,el,node)
			node.accessor = accessor;
			//TODO add cleaner for accessor
		}

		if (node.tagName == "BUTTON" && node.getAttribute("role") == null) {
			node.setAttribute("role","button"); //TODO effective role
		}
	}

	//TODO catch IE submit buttons

	addEventListeners(el, {
		"change": form_input_change,
		"click": dialog_button_click
	},false);

	//TODO enhance/stateful buttons

	// applyDefaultRole(el.getElementsByTagName("BUTTON"));
	// applyDefaultRole(el.getElementsByTagName("A"));
	//TODO input
}


	function applyDefaultRole(elements) {
		for(var i=0,el; (el = elements[i]); ++i) {
			var stateful = StatefulResolver(el,true);
			stateful.set("state.disabled",el.disabled);
			stateful.set("state.hidden",el.hidden);
			stateful.set("state.readOnly",el.readOnly);
			//TODO read state readOnly,hidden,disabled

			switch(el.tagName) {
				case "button":
				case "BUTTON":
					el.setAttribute("role","button");
					break;
				case "a":
				case "A":
					el.setAttribute("role","link");
					break;
				// menuitem
			}
		} 
	}



function enhance_form(el,role,config) {
	var clientType = (el.action.substring(0,12) == "client+http:") || (el.action.substring(0,13) == "client+https:");

	if (clientType) {
		DocumentRoles.makeClientForm(el);
	}



	return {};
}
DocumentRoles.presets.declare("handlers.enhance.form", enhance_form);

function layout_form(el,layout,instance) {

}
DocumentRoles.presets.declare("handlers.layout.form", layout_form);

function discard_form(el,role,instance) {

}
DocumentRoles.presets.declare("handlers.discard.form", discard_form);

}();


