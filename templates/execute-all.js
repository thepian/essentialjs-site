var {{ exec_name }} = (function() {
    {{ core_api }}

    function run() {
        for(var i=0,e; e = run.all[i]; ++i) {
            try {
                e.run(pagespec);
            }
            catch(ex) {
                alert(ex);
            }
        }
    };
    run.all = [{% for entry in all_list %} { "id": "{{ entry["id"] }}", "run": {{ entry["run"] }} },{% end %}null];
    run.all.length -= 1;
    return run;
})();