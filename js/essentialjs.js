(function(){
    
if (/ no-horizontal-scroll/.test(document.documentElement.className)) {
    $(window).bind("scroll",function(event){
        // console.log(document.documentElement.scrollTop+" "+document.documentElement.scrollLeft);
        document.documentElement.scrollLeft = 0; // no horizontal scroll
    });
}

})();