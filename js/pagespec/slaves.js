/*
Slave iframe running off the pagespec window. While this is a constructor
it should be called directly. Frames referenced will be created if they do not already
exist.
SlaveFrame instances are attached to iframe tags as tag.slave

id = identifier of slave window / iframe

type = results/status/message/page/popup
*/
function SlaveFrame(id,type,config) {
    if (id == undefined) {
        // instantiation
    } else {
        // fetcher
        if (SlaveFrame[type][id] == undefined) {
            var slave = SlaveFrame[type][id] = new SlaveFrame();
            return slave.init(id,type,config);
        } else {
            return this[type+"Get"](id);
        }
    }
}

SlaveFrame.MESSAGE_ROOT = MESSAGE_ROOT;

/* slaveframe type status */
SlaveFrame.status = {};

/* slaveframe type page */
SlaveFrame.page = {};

/* slaveframe type results */
SlaveFrame.results = {};

/* slaveframe type progress */
SlaveFrame.submitter = {};

/* @private */
SlaveFrame.nextLeft = 450;

SlaveFrame.prototype.init = function(id, type, config) {
    this.id = id;
    this.type = type;
    this.config = config;
    var frame = this[type+"Create"](this);
	mark("core","added iframe "+id);
	// specPage.pushMessage('setOptions("'+scriptOptions+'","'+window.location.search+window.location.hash+'");');
	if (window.postMessage) this.enableHtml5(frame);
	else this.enableHtml4(frame);
	
	return frame;
};

SlaveFrame.prototype.statusCreate = function(slave) {
	var frame = window.document.createElement("IFRAME");
	for(var name in SlaveFrame.frameMixin) {
		if (SlaveFrame.frameMixin[name] !== undefined) frame[name] = SlaveFrame.frameMixin[name];
	}
	slave.width = 200;
	slave.height = 50;
	frame.setInitialAttributes(slave);
	frame.className = "suitestatus";
	document.body.appendChild(frame);
	return frame;
};

SlaveFrame.prototype.pageCreate = function(slave) {
	var frame = window.document.createElement("IFRAME");
	for(var name in SlaveFrame.frameMixin) {
		if (SlaveFrame.frameMixin[name] !== undefined) frame[name] = SlaveFrame.frameMixin[name];
	}
	slave.width = 800;
	slave.height = 600;
	frame.setInitialAttributes(slave);
	frame.className = "suitepage";
	frame.style.left = SlaveFrame.nextLeft + "px";
	SlaveFrame.nextLeft += parseInt(frame.width) + 50;
	var insideWall = Sizzle("#wall .inside");
	var wall = insideWall.length? insideWall[0] : null;
	(wall || document.body).appendChild(frame);
	return frame;
};    

SlaveFrame.prototype.resultsCreate = function(slave) {
	var frame = window.document.createElement("IFRAME");
	for(var name in SlaveFrame.frameMixin) {
		if (SlaveFrame.frameMixin[name] !== undefined) frame[name] = SlaveFrame.frameMixin[name];
	}
	slave.width = 800;
	slave.height = 600;
	frame.setInitialAttributes(slave);
	frame.className = "suiteresults";
	frame.style.left = SlaveFrame.nextLeft + "px";
	SlaveFrame.nextLeft += parseInt(frame.width) + 50;
	var insideWall = Sizzle("#wall .inside");
	var wall = insideWall.length? insideWall[0] : null;
	(wall || document.body).appendChild(frame);
	return frame;
};    

SlaveFrame.prototype.submitterCreate = function(slave) {
	var frame = window.document.createElement("IFRAME");
	for(var name in SlaveFrame.frameMixin) {
		if (SlaveFrame.frameMixin[name] !== undefined) frame[name] = SlaveFrame.frameMixin[name];
	}
	slave.width = 1;
	slave.height = 1
	frame.setInitialAttributes(slave);
	frame.className = "specsubmitter";

    var insideWall = [];
	var wall = insideWall.length? insideWall[0] : null;
	(wall || document.body).appendChild(frame);
	return frame;
};

SlaveFrame.prototype.statusGet = function(id) {
    return document.getElementById(id);
};    

SlaveFrame.prototype.pageGet = function(id) {
    return document.getElementById(id);
};    

////// Window level messaging ///////

SlaveFrame.prototype.enableHtml4 = function() {
    this.messages = [];
    this.tryPopMessage = this.tryPopMessageHtml4;
    this.pushMessage = this.pushMessageHtml4;
    if (!SlaveFrame.enabledHtml4) SlaveFrame._enableHtml4();
};

SlaveFrame._enableHtml4 = function() {
    mark("html5", "spec page: html4 messaging");
    this._enabledHtml4 = true;
};

SlaveFrame.window2frame = {}; //TODO clean this up on exit

SlaveFrame.prototype.enableHtml5 = function(frame) {
    this.tryPopMessage = this.tryPopMessageHtml5;
    this.pushMessage = this.pushMessageHtml5;
    SlaveFrame.window2frame[frame.contentWindow || frame.window] = frame;//TODO support popup
    if (!SlaveFrame.enabledHtml5) SlaveFrame._enableHtml5();
};
    
SlaveFrame._enableHtml5 = function() {
    mark("html5", "spec page: html5 messaging");
    this._enabledHtml5 = true;

    window.addEventListener("message", receiveMessage, false);
    
    var receivedMessage = false;
    
    function receiveMessage(event) {
        if (event.origin == SlaveFrame.MESSAGE_ROOT) {
            var frame = SlaveFrame.window2frame[event.source];
            debugger;
            if (frame) {
                frame.slave.handleMessage(frame,event.data);
            } else if (event.source == top) {
                SlaveFrame.handleMessageFromTop(event.data);
            }
        }
        else { 
            log("rejected message",event.origin,SlaveFrame.MESSAGE_ROOT,event.data); 
            } // ,event.source
        if (!receivedMessage) {
            mark("html5","received message "+event.origin);
            receivedMessage = true;
        }
    }
};

SlaveFrame.handleMessageFromTop = function(msg) {
	//log("status command",msg);
	eval(msg);
};

SlaveFrame.prototype.handleMessage = function(frame,msg) {
	//log("status command",msg);
	eval(msg);
};

SlaveFrame.prototype._trySendMessage = function(frame) {
	if (frame.name) return;
	if (this.messages.length == 0) return;
	var msg = this.messages.shift();
	frame.name = this.SEND_PREFIX + msg;
	//TODO first time: mark("sending", ">> "+TO_IFRAME_MESSAGE + msg);
};

SlaveFrame.prototype.pushMessage = function() {
    
};

SlaveFrame.prototype.pushMessageHtml4 = function(frame,msg){
	this.messages.push(msg);
	this._trySendMessage();
},

SlaveFrame.prototype.pushMessageHtml5 = function(frame,msg) {
    (frame.contentWindow || frame.window).postMessage(msg,SlaveFrame.MESSAGE_ROOT);
};


/**
 * Mixed in to the runner iframe to provide functions for updating the size.
 */
SlaveFrame.frameMixin = {
	title : "PageSpec Results",
    // id : PAGESPEC_ID,
	//name : PAGESPEC_ID, overwrites contentWindow.name
	//width : (Browser.Webkit || Browser.Trident)? "100%" : undefined,
    // 'className' : "suitepage",
	height : 0,
	border : 0,
	frameborder : 0,
	frameBorder : 0,
	allowtransparency: "true",
	scrolling : "no",
	state: { manipulateHost: true },
	
	setInitialAttributes: function(slave) {
        // this.className = "suitepage";
	    this.id = slave.id;
	    this.src = slave.config.src;
	    this.slave = slave;
	    
	    var width = slave.width || 800;
	    var height = slave.height || 600;
	    this.width = width;
	    this.height = height;
	    this.style.width = width+"px";
	    this.style.height = height+"px";
	},
	
	showFrame: function() {
	    
        this.offsetParent.scrollLeft = this.offsetLeft - 5;
	},
	
	/**
	 @param autototals hover|true|false
	*/
	showTotals : function(autototals) {
		var body = top.document.body;
		var cs = body.currentStyle || top.getComputedStyle(body,"");
		if (autototals == "hover") this.state.manipulateHost = false;
		var manipulateHost = this.state.manipulateHost;
		if (manipulateHost) {
			if (cs.position == "static") { 
				body.style.position = "relative";
				body.style.margin = "0px";
			}
			body.style.paddingTop = PAGESPEC_HEIGHT+" 0px 0px 0px";
			// onWindowResize();// let clientHeight adjust
		}
		this.height = parseFloat(PAGESPEC_HEIGHT);
		this.style.height = PAGESPEC_HEIGHT;
		this.style.top = "0px";
		this.border = "0";
	},
	hideTotals : function() {
		this.height = "0";
		this.style.height = "0px";
		this.style.marginTop = "0px";
		// onWindowResize();
	},
	
	// default response to window resize 
	trackWindow: function(width,height) {
		width -= 16;
		this.width = width;
		this.style.width = width + "px"; 
	},
	
	showNewHeight : function(height,padding) {
		window.setTimeout(function(){ 
			specIframe.height = height;
			specIframe.style.height = height + "px";
			top.document.body.style.paddingTop = (padding || parseInt(PAGESPEC_HEIGHT)) + "px";
		},0);
	},
	
	showTopUsingMargin : function(height) {
		window.setTimeout(function(){ 
			specIframe.height = height;
			specIframe.style.height = height + "px";
			specIframe.style.marginTop = "-" + height + "px";
			top.document.body.style.marginTop = height + "px"; 
		},0);
	}
};

//////// TODO TODO special iframe for switching messages back ///// Use suite for message page. no script loading

SlaveFrame.prototype.tryPopMessage = function() {
    return null;
};

/* Try to pop a message using the window.name protocol */
SlaveFrame.prototype.tryPopMessageHtml4 = function() { 
	//log(statusWindow.name.substring(0, TO_IFRAME_MESSAGE.length));
	
	if (this.messagingWindow.name &&
		this.messagingWindow.name.substring(0, this.RECEIVE_PREFIX.length) == this.RECEIVE_PREFIX) {
		var m = this.messagingWindow.name.substring(this.RECEIVE_PREFIX.length);
		this.messagingWindow.name = "";
		this._trySendMessage();
		if (m) this.handleMessage(m);
		return
	}
	this._trySendMessage();
};

/* window.name isn't used when HTML5 messaging is available */
SlaveFrame.prototype.tryPopMessageHtml5 = function() {
    // no popping for html 5
};
