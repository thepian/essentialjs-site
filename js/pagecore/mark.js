var marks = {};

/* variable number of string arguments, last argument is an optional values dict */
function mark() {
    var l = arguments.length;
	var values = arguments[arguments.length-1];
	if (typeof(values) !== "string") { --l; }
	else values = {};
	var type = arguments[0];
	if (typeof(type) == "string" || values instanceof String) {
    	if (marks[type] === undefined) marks[type] = [];
	    var lines = marks[type];
    	for(var i=1;i<l;++i) 
    		if (typeof(arguments[i]) == "string" || values instanceof String) lines.push(expandVariables(arguments[i],values));
    	if (typeof pagecore != "undefined" && pagecore.logmarks)
            console.log(lines.join("\u001e"));
	}
}

mark.marks = marks;

