var {{ exec_name }} = (function() {
    var r = function() {
        debugger;
        for(var i=0; e = r.all[i]; ++i) {
            try {
                e.run();
            }
            catch(ex) {
                alert(ex);
            }
        }
    };
    r.all = [{% for entry in all_list %} { "id": "{{ entry["id"] }}", "run": {{ entry["run"] }} },{% end %}null];
    r.all.length -= 1;
    return r;
})();