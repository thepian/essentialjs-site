/** @private */
HTMLImplementation._.PIXEL = /^\d+(px)?$/i;

/**
 * @private
 * Precalculated pixel values
 * TODO calculate them, just in case they change
 */
HTMLImplementation._.CSS_PRECALCULATED_SIZES = {
	'medium':"2px"	// IE medium border
};

/** @private */
HTMLImplementation._.CSS_PROPERTY_TYPES = {
	'border-width':'size',
	'border-left-width':'size',
	'border-right-width':'size',
	'border-bottom-width':'top',
	'border-top-width':'top',
	'borderWidth':'size',
	'borderLeftWidth':'size',
	'borderRightWidth':'size',
	'borderBottomWidth':'top',
	'borderTopWidth':'top',

	// background-position
	// border, border-left, border-right, border-top, border-bottom

	'padding': 'size',
	'padding-left': 'size',
	'padding-right': 'size',
	'padding-top': 'top',
	'padding-bottom': 'top',
	'paddingLeft': 'size',
	'paddingRight': 'size',
	'paddingTop': 'top',
	'paddingBottom': 'top',

	'margin': 'size',
	'margin-left': 'size',
	'margin-right': 'size',
	'margin-top': 'top',
	'margin-bottom': 'top',
	'marginLeft': 'size',
	'marginRight': 'size',
	'marginTop': 'top',
	'marginBottom': 'top',
	
	'font-size': 'size',
	'fontSize': 'size',
	'line-height': 'top', //TODO relative to font size
	'lineHeight': 'top', //TODO relative to font size
	'text-indent': 'size',
	'textIndent': 'size',
	
	'width': 'size',
	'height': 'top',
	'max-width': 'size',
	'max-height': 'top',
	'min-width': 'size',
	'min-height': 'top',
	'maxWidth': 'size',
	'maxHeight': 'top',
	'minWidth': 'size',
	'minHeight': 'top',
	'left':'size',
	'right':'size',
	'top': 'top',
	'bottom': 'top'
};

/** @private */
HTMLImplementation._.CSS_PROPERTY_FROM_JS = {
	'backgroundColor':'background-color',
	'backgroundImage':'background-image',
	'backgroundPosition':'background-position',
	'backgroundRepeat':'background-repeat',

	'borderWidth':'border-width',
	'borderLeft':'border-left',
	'borderRight':'border-right',
	'borderTop':'border-top',
	'borderBottom':'border-bottom',
	'borderLeftWidth':'border-left-width',
	'borderRightWidth':'border-right-width',
	'borderBottomWidth':'border-bottom-width',
	'borderTopWidth':'border-top-width',

	'paddingLeft': 'padding-left',
	'paddingRight': 'padding-right',
	'paddingTop': 'padding-top',
	'paddingBottom': 'padding-bottom',

	'marginLeft': 'margin-left',
	'marginRight': 'margin-right',
	'marginTop': 'margin-top',
	'marginBottom': 'margin-bottom',
	
	'fontSize': 'font-size',
	'lineHeight': 'line-height',
	'textIndent': 'text-indent'
	
};

/** @private */
caplin.dom.Utility.prototype.JS_PROPERTY_FROM_CSS = {
	'background-color':'backgroundColor',
	'background-image':'backgroundImage',
	'background-position':'backgroundPosition',
	'background-repeat':'backgroundRepeat',

	'border-width':'borderWidth',
	'border-left':'borderLeft',
	'border-right':'borderRight',
	'border-top':'borderTop',
	'border-bottom':'borderBottom',
	'border-left-width':'borderLeftWidth',
	'border-right-width':'borderRightWidth',
	'border-bottom-width':'borderBottomWidth',
	'border-top-width':'borderTopWidth',

	'padding-left':'paddingLeft',
	'padding-right':'paddingRight',
	'padding-top':'paddingTop',
	'padding-bottom':'paddingBottom',

	'margin-left':'marginLeft',
	'margin-right':'marginRight',
	'margin-top':'marginTop',
	'margin-bottom':'marginBottom',
	
	'font-size':'fontSize',
	'line-height':'lineHeight',
	'text-indent':'textIndent'
	
};
