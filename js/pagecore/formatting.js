
function expandVariables(str,values) {
	//TODO expand values into str
	return str;
}

function escapeTags(string) {
	return string.replace(/</img, '&lt;').replace(/>/img, '&gt;');
}

/**
 * config.hideMillis = false
 * config.maxLevels = 2
 * @param {Object} millis
 * @param {Object} config
 */
function formatDateDiff(millis,config) {
	config = config || {};
	var maxLevels = config.maxLevels || 2;
	var secs = Math.floor(millis / 1000)
	var minutes = Math.floor(millis / 60000);
	var hours = Math.floor(millis / 3600000);
	var days = Math.floor(hours / 24);
	var weeks = Math.floor(days / 7);

	var _millis = millis % 1000;
	var _secs = secs % 60;
	var _minutes = minutes % 60;
	var _hours = hours % 24;
	var _days = days % 7;

	var res = [];
	if (days) res.push(_days+" days");
	if (hours) res.push(_hours+" hours");
	if (minutes) res.push(_minutes+" minutes");
	if (secs) res.push(_secs+" secs");
	if (!config.hideMillis) res.push(_millis+" millis");
	if (res.length > maxLevels) res.length = maxLevels;

	return res.join(" ");
}

