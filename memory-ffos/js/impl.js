!function() {

var essential = Resolver("essential"), StatefulResolver = essential("StatefulResolver");

var ROLE = {
	//TODO optional tweak role function

	form: { role:"form" },
	iframe: {},
	object: {},
	a: { role:"link" },
	img: { role:"img" },

	label: { role:"note" },
	input: {
		role: "textbox",
		//TODO tweak: tweakInputRole(role,el,parent)
		type: {
			// text: number: date: time: url: email:
			// image: file: tel: search: password: hidden:
			range:"slider", checkbox:"checkbox", radio:"radio",
			button:"button", submit:"button", reset:"button"
		}
	},
	select: { role: "listbox" },
	button: { role:"button" },
	textarea: { role:"textbox" },
	fieldset: { role:"group" },
	progress: { role:"progressbar" },

	"default": {
		role:"default"
	}
};

var ACCESSOR = {
	"default": { init:defaultInit },

	form:{ init:defaultInit },
	dialog: { init:defaultInit },
	alertdialog: { init:defaultInit },

	group:{ init:statefulInit },
	progressbar:{ init:statefulInitValue },
	listbox:{ init:statefulInitValue },
	slider:{ init:statefulInitValue },
	checkbox:{ init:statefulInitChecked },
	radio:{ init:statefulInitRadio },
	link:{ init:statefulInit },
	button:{ init:statefulInit },
	img:{ init:defaultInit },
	note:{ init:defaultInit },
	textbox:{ init:statefulInitValue }
};

function defaultInit(role,root,node) {

}

function statefulInit(role,root,node) {

	var stateful = StatefulResolver(node,true);
	stateful.set("state.disabled",node.disabled);
	stateful.set("state.hidden",node.hidden);
	stateful.set("state.readOnly",node.readOnly);
	//TODO read state readOnly,hidden,disabled

}

function statefulInitValue(role,root,node) {
	statefulInit.call(this,role,root,node);
	// set initial value of named elements
	var name = node.name || node.getAttribute("name") || node.getAttribute("data-name"); // named elements
	if (name && root.stateful) {
		//var rootStateful = StatefulResolver(node,true);
		root.stateful.set(["model",name],node.value);
	}
}
function statefulInitChecked(role,root,node) {
	statefulInit.call(this,role,root,node);
	// set initial value of named elements
	var name = node.name || node.getAttribute("name") || node.getAttribute("data-name"); // named elements
	if (name && root.stateful) {
		//var rootStateful = StatefulResolver(node,true);
		root.stateful.set(["model",name],node.checked);
	}
}
function statefulInitRadio(role,root,node) {
	statefulInit.call(this,role,root,node);
	// set initial value of named elements
	var name = node.name || node.getAttribute("name") || node.getAttribute("data-name"); // named elements
	if (name && root.stateful) {
		//var rootStateful = StatefulResolver(node,true);
		if (node.checked) root.stateful.set(["model",name],node.value);
	}
}

/*
	ACCESSOR
	1) if stateful, by stateful("role")
	1) by role
	2) by implied role (tag,type)
*/
function effectiveRole(el) {
	var role;
	if (el.stateful) {
		role = el.stateful("impl.role","undefined");
		if (role) return role;
	}

	// explicit role attribute
	role = el.getAttribute("role");
	if (role) return role;

	// implicit
	var tag = el.tagName || el.nodeName || "default";
	var desc = ROLE[tag.toLowerCase()] || ROLE["default"];
	role = desc.role;

	if (desc.type&&el.type) {
		role = desc.type[el.type] || role;
	}
	if (desc.tweak) role = desc.tweak(role,el);

	return role;
}
essential.set("effectiveRole",effectiveRole);


function roleAccessor(role) {
	return ACCESSOR[role] || ACCESSOR["default"];
}
essential.set("roleAccessor",roleAccessor);

}();