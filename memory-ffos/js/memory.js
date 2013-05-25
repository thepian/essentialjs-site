!function() {

var StatefulResolver = Resolver("essential::StatefulResolver::"),
	EnhancedDescriptor = Resolver("essential::EnhancedDescriptor::"),
	sizingElements = Resolver("essential::sizingElements::"),
	ApplicationConfig = Resolver("essential::ApplicationConfig::"),
	Layouter = Resolver("essential::Layouter::"),
	Laidout = Resolver("essential::Laidout::"),
	DialogAction = Resolver("essential::DialogAction::");

if (! /PhantomJS\//.test(navigator.userAgent)) {
    Resolver("page").set("map.class.state.online","online");
    Resolver("page").set("map.class.notstate.online","offline");
    Resolver("page").set("map.class.notstate.connected","disconnected");
}



Layouter.variant("scatterbox",Generator(function(key,el,config) {
	this.el = el;
},Layouter,{prototype:{

	"sizingElement": function(el,parent,child,role,conf) {
		if (parent == el) return true;
	},

	// called for prepared children
	"calcSizing": function(el,sizing) {
		if (sizing.deg == null) {
			sizing.deg = Math.floor(Math.random() * 8 - 4) * 3;
			sizing.collapsedLeft = Math.floor(Math.random() * 18 - 9) * 3;
			sizing.collapsedTop = Math.floor(Math.random() * 18 - 9) * 3;
		}
	},

	"_collapsedLayout": function(el,layout,laidouts) {

		var left = el.offsetWidth/2, top = el.offsetHeight/2;
		for(var i=0, c; c = laidouts[i]; ++i) {
			var sizing = c.stateful("sizing");

			c.style.left = (left+sizing.collapsedLeft) + "px";
			c.style.top = (top+sizing.collapsedTop) + "px";

			c.style.webkitTransform = "rotate("+sizing.deg+"deg)";
			c.style.mozTransform = "rotate("+sizing.deg+"deg)";
		}
	},

	"_expandedLayout": function(el,layout,laidouts) {

		var width = el.offsetWidth, left = 0, top = 0, height = 0;
		for(var i=0, c; c = laidouts[i]; ++i) {
			var sizing = c.stateful("sizing");

			if (left + c.offsetWidth > width ) {
				top += height;
				height = 0, left = 0;				
			}

			height = Math.max(height, c.offsetHeight);
			c.style.left = left + "px";
			c.style.top = top + "px";
			left += c.offsetWidth;


			c.style.webkitTransform = "rotate("+sizing.deg+"deg)";
			c.style.mozTransform = "rotate("+sizing.deg+"deg)";
		}
	},

	"layout": function(el,layout,laidouts) {
		//TODO layout.width layout.height ?
		var expanded = el.stateful("state.expanded")
		if (expanded) this._expandedLayout(el,layout,laidouts);
		else this._collapsedLayout(el,layout,laidouts);

	}
}}));

var vocabulary = {

};



var audioContext = new (window.AudioContext || window.webkitAudioContext || window.mozAudioContext)();

var cheers;
var req = new XMLHttpRequest();
// req.open('GET','audio/Cheers.m4a');
req.open('GET','audio/Cheers.mp3');
req.responseType = 'arraybuffer';
req.addEventListener('load',function(ev){

var req = ev.target;
cheers = audioContext.createBuffer(req.response,false);

},false);
req.send();


Resolver().declare('app.Application',Generator(function() {

	this.ul = document.getElementsByTagName("UL")[0];
},{prototype:{

}}));


var playing;

function playSound(buffer) {
	if (playing) playing.noteOff(0);

	var src = audioContext.createBufferSource();
	src.buffer = buffer;
	src.connect(audioContext.destination);
	if (src.start) src.start(0);
	else src.noteOn(0);
	playing = src;
}

DialogAction.variant("controls",Generator(function() {

	this.ul = document.getElementsByTagName("UL")[0];
}, DialogAction, { prototype:{

	"start": function(el,ev) {
		// playSound(cheers);
	},
	"play game": function(el,ev) {
		var instance = EnhancedDescriptor(el).instance;
		this.ul.stateful.toggle("state.expanded");

	},
	"stop": function(el,ev) {
		// playSound(cheers);
	}

}}));


DialogAction.variant("player",Generator(function() {

}, DialogAction, { prototype:{

	"flip": function(el,ev) {
		var stateful = StatefulResolver(ev.commandElement.parentNode.parentNode.parentNode,true);
		stateful.declare("map.class.state.flipped","flipped");
		stateful.declare("map.class.notstate.flipped","not-flipped");
		stateful.toggle("state.flipped");
	},

	"B": function(el,ev) {
		playSound(cheers);
	},
	"C": function(el,ev) {
		playSound(cheers);
	},
	"D": function(el,ev) {
		playSound(cheers);
	},
	"E": function(el,ev) {
		playSound(cheers);
	}

}}));

}();