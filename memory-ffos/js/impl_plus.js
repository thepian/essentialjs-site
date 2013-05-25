
function PlusState() {
    this.dimension = "x";
    this.is = {
  		drag: false,
  		clicked: false,
  		toclick: true,
  		mouseup: false
    };
    this.px = {
        xStart: 0, yStart: 0,
        
        xMax: 1000, yMax: 1000,
        xStep: 1, yStep: 1
    };
}

PlusState.prototype.plan = function(direction,min,max,step,xRange,yRange)
{
    this.direction = direction;
    step = Math.min(step, max - min);
    
    switch(direction) {
        case "horz":
        case "horizontal":
            this.dimension = "x";
            this.px.xMax = xRange;
            this.px.yMax = 0;
            this.px.xStep = xRange / (max - min) / step;
            this.px.yStep = 0;
            break;
        case "vert":
        case "vertical":
            this.dimension = "y";
            this.px.xMax = 0;
            this.px.yMax = yRange;
            this.px.xStep = 0;
            this.px.yStep = yRange / (max - min) / step;
            break;
    }
};

PlusState.prototype.markStart = function(clone,event)
{
    PlusState.dragStart = clone;
    
    this.is.drag = true;
    this.px.xStart = event.clientX;
    this.px.yStart = event.clientY;
    this.px.xOffset = clone.offsetLeft;
    this.px.yOffset = clone.offsetTop;
};

PlusState.prototype.adjustOffset = function(clone,event)
{
    if (!this.is.drag) return;

    var styleName = {
        x : "left",
        y : "top"
    }[this.dimension];
    
    var xy = {
        x : "clientX",
        y : "clientY"
    }[this.dimension];
    
    var px = this.px[this.dimension + "Offset"] + (event[xy] - this.px[this.dimension + "Start"]);
    px = this.px[this.dimension + "Step"] * Math.round(px / this.px[this.dimension + "Step"]);
    px = Math.round(px + .5);
    px = Math.min(px, this.px[this.dimension + "Max"]);
    px = Math.max(px,0);
    clone.style[styleName] = px + "px";
};

PlusState.prototype.markStop = function(clone,event)
{
    PlusState.dragStart = null;
    
    this.is.drag = false;
    // this.px.xStart = event.clientX;
    // this.px.yStart = event.clientY;
    // this.px.xOffset = clone.offsetLeft;
    // this.px.yOffset = clone.offsetTop;
};


HTMLImplementation.prototype.startDrag = function(clone,event)
{
    if (clone.plus == undefined || clone.plus.is.drag) return;

    var min = this.parent.getMin(clone.parentNode);
    var max = this.parent.getMax(clone.parentNode);
    var step = this.parent.getStep(clone.parentNode);
    var dir = clone.getAttribute("direction");
    
    //TODO review padding/border
    var xRange = clone.parentNode.offsetWidth - clone.offsetWidth;
    var yRange = clone.parentNode.offsetHeight - clone.offsetHeight;
    
    clone.plus.plan(dir,min,max,step,xRange,yRange);
    clone.plus.markStart(clone,event);
};

HTMLImplementation.prototype.makeUniqueSlider = function(el,defaultImpl,policy)
{
    var wrap = HTMLImplementation.getUnique(el,defaultImpl,policy);
    wrap.makeUnique = this.makeUniqueSlider;
    if (el.tagName.toLowerCase() == "button") {
        wrap.decorate = this.decorateSliderButton;
        wrap.getContent = this.getSliderButtonFormatted;
        wrap.setContent = this.setSliderButtonFormatted;
    }
    return wrap;
};

HTMLImplementation.prototype.decorateSliderButton = function(clone)
{
    var dir = clone.getAttribute("direction");
    clone.plus = new PlusState();
};

HTMLImplementation.prototype.getSliderButtonFormatted = function(clone)
{
    var min = this.parent.getMin(clone.parentNode);
    var max = this.parent.getMax(clone.parentNode);
    var value = clone.offsetLeft / clone.parentNode.offsetWidth;
    
    return ((max - min) * value) + min;
};

HTMLImplementation.prototype.setSliderButtonFormatted = function(clone,value)
{
    var min = this.parent.getMin(clone.parentNode);
    var max = this.parent.getMax(clone.parentNode);
    value = parseFloat(value);
    if (isNaN(value)) value = min;
    
    var buttonWidth = 100 * clone.offsetWidth / clone.parentNode.offsetWidth;
    //TODO subtract padding & border
    var maxPercent = 100 - buttonWidth;
    var offset = maxPercent * (value - min) / (max - min);
    offset = Math.min(offset,maxPercent);
    offset = Math.max(offset,0);
    //TODO step increments
	clone.style.left = offset + "%";
};


HTMLImplementation.prototype.SLIDER_EVENTS = {
    "mousemove": function(event) {
        if (PlusState.dragStart) {
            PlusState.dragStart.plus.adjustOffset(PlusState.dragStart,event);
        }
    },
    "mouseup": function(event) {
        if (PlusState.dragStart) {
            var t = PlusState.dragStart;
            PlusState.dragStart.plus.markStop(PlusState.dragStart,event);
            var newValue = t.implementation.getSliderButtonFormatted(t);
            this.value = newValue;
            var implementation = HTMLImplementation.get(t);
            implementation.sendEvent(t,"change");
        }
    },
    "mousedown": function(event) {
        var t = event.srcElement || event.target;
        if (event.button == 0 || event.button == 1) {
            t.implementation.startDrag(t,event);
        }
    },
    //TODO esc/drag out to cancel
    "touchstart": function(event) {
        var t = event.target;
        t.implementation.startDrag(t,event);
        console.log("touchstart");
        
    },
    "touchmove": function(event) {
        if (PlusState.dragStart) {
            PlusState.dragStart.plus.adjustOffset(PlusState.dragStart,event);
        }
        console.log("touchmove");
        
    },
    "touchend": function(event) {
        if (PlusState.dragStart) {
            var t = PlusState.dragStart;
            PlusState.dragStart.plus.markStop(PlusState.dragStart,event);
            var newValue = t.implementation.getSliderButtonFormatted(t);
            this.value = newValue;
            var implementation = HTMLImplementation.get(t);
            implementation.sendEvent(t,"change");
        }
        console.log("touchend");
        
    }
};

HTMLImplementation.prototype.decorateSlider = function(clone)
{
    this.addEventListeners(clone,this.SLIDER_EVENTS);
};


// <slider>
HTMLImplementation.MODS.slider = {
    decorate:  HTMLImplementation.prototype.decorateSlider,
    makeUnique: HTMLImplementation.prototype.makeUniqueSlider
};
