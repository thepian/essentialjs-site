var {{ exec_name }} = (function() {
    function __run__() {
        {{ core_api }}
        
        pagespec.run(__run__.all)
    };
    __run__.all = [{% for entry in all_list %} { "id": "{{ entry["id"] }}", "run": {{ entry["run"] }} },{% end %}null];
    __run__.all.length -= 1;
    return __run__;
})();