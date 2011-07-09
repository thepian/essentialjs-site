/**
* Styleswitch stylesheet switcher built on jQuery
* Under an Attribution, Share Alike License
* By Kelvin Luck ( http://www.kelvinluck.com/ )
**/

(function($)
{
	$(document).ready(function() {
		$('.styleswitch').click(function()
		{
    	    var themes = listThemes(); // stylesheets are generated late

		    var styleName = this.getAttribute("rel");
		    if (styleName) {
    			switchStylestyle(styleName);
		    }
		    else {
		        var useNext = false;
        		var c = readCookie('style');
                var firstName;
                
		        for(var n in themes) {
		            if (! firstName) firstName = n; // to fall back on when at end
		            
		            if (useNext) {
		                useNext = false;
		                styleName = n;
		            }
		            if (n == c) useNext = true; // cycle to next theme
		        }
    			switchStylestyle(styleName || firstName);
		    }
			return false;
		});
		var c = readCookie('style');
		if (c) switchStylestyle(c);
	});
	
	function listThemes() 
	{
	    var r = {};
		$('link[rel*=alternate][title]').each(function(i) 
		{
		    if (this.getAttribute('type') == "text/css") r[this.getAttribute('title')] = this;
		});
		$('style[title]').each(function(i) 
		{
		    if (this.getAttribute('type') == "text/css") r[this.getAttribute('title')] = this;
		});
	    return r;
	}

	function switchStylestyle(styleName)
	{
		$('link[rel*=alternate][title]').each(function(i) 
		{
			this.disabled = true;
			if (this.getAttribute('title') == styleName) this.disabled = false;
		});
		$('style[title]').each(function(i) 
		{
			this.disabled = true;
			if (this.getAttribute('title') == styleName) this.disabled = false;
		});
		createCookie('style', styleName, 365);
	}

// cookie functions http://www.quirksmode.org/js/cookies.html
function createCookie(name,value,days)
{
	if (days)
	{
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}
function readCookie(name)
{
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++)
	{
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}
function eraseCookie(name)
{
	createCookie(name,"",-1);
}
// /cookie functions

})(jQuery);









/*--------------------------------------------------------------------
 * Copyright (c) 2009 Vision Master Designs
 * Licensed under GPL (http://www.opensource.org/licenses/gpl-license.php)

 * JQuery Plugin : "Switch Stylesheets"
 * Author : Michael (http://www.visionmasterdesigns.com)
 * Version : 1.0
 * Description : Based on the superb stylesheet switcher plugin by By Kelvin Luck ( http://www.kelvinluck.com/ ).
                 Can create multiple groups of alternate stylesheets to change
                 
Ex :
Alternate Stylesheets :
<!-- alternate css for colors -->
<link href="green.css" type="text/css" rel="alternate stylesheet" title="green-color" />
<link href="blue.css" type="text/css" rel="alternate stylesheet" title="blue-color" />

JS Code :
<script type="text/javascript">
$(document).ready(function(){ 
    $(".changecolor").switchstylesheet( { seperator:"color"} );
});
</script>

Usage :
<a href="#" class="changecolor" title="red-color">Red</a> |
<a href="#" class="changecolor" title="green-color">Green</a> |
<a href="#" class="changecolor" title="blue-color">Blue</a>

------------------------------------------------------------------------*/
(function($) {
    
$.fn.switchstylesheet = function(options) {

    //default vals
    defaults = {
        seperator : 'alt'
    };
    
    var options = $.extend(defaults, options);  
    
    //read the style
    var c = cookie.readCookie(options.seperator);
    if (c) switchss(c);
    
    //goes thru the links to find out the ones having the selector
    $(this).click(function() {
        var rel = $(this).attr('rel'); //gets the title=?
        switchss(rel);
    });
    
    function switchss(rel) {
        //goes thru all the styles having seperator - alt
        $('link[rel*=style][title*='+options.seperator+']').each(function(i) {
            this.disabled = true;   
            if ($(this).attr('title') == title) {
                this.disabled = false;
            }
        });
        //create a cookie to store the style
        cookie.createCookie(options.seperator, rel, 365);
    }
};

//cookie functions
var cookie;

cookie = {
    createCookie: function(name,value,days) {
        if (days)
        {
            var date = new Date();
            date.setTime(date.getTime()+(days*24*60*60*1000));
            var expires = "; expires="+date.toGMTString();
        }
        else var expires = "";
        document.cookie = name+"="+value+expires+"; path=/";
    },
    
    readCookie: function(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++)
        {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }
};


})(jQuery);
