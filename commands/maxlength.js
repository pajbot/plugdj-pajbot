exports.names = ['maxlength', 'max', 'maxlenght'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.cd_all = 0;
exports.cd_user = 0;
exports.cd_manager = 0;
exports.min_role = PERMISSIONS.BOUNCER_PLUS;
exports.handler = function (data) {
	var input = data.message.split(' ');
	var command = _.first(input);
	var params = _.rest(input);
	if (params.length < 1) {
		modMessage(data, 'Current max song length: ' + sec_to_str(settings['maxlength']) + '.');
	}
	else if (params[0].indexOf(':') != -1){
		var time_with_colon = params[0].split(':');
		var new_minutes = time_with_colon[0];
		var new_seconds = time_with_colon[1];
		
		if (!isNaN(new_minutes) && !isNaN(new_seconds)) {
			var new_length = Math.floor(new_minutes * 60) + Math.floor(new_seconds);
			if (new_length >= 300) {
				set_setting('maxlength', new_length, data);
				modMessage(data, 'Max song length set to ' + sec_to_str(settings['maxlength']) + '.');
			}
			else {
				modMessage(data, 'You can't set the max song length below 5 minutes. :omgscoots:');
			}
	} else {
		var new_length = parseFloat(params);
		if (!isNaN(new_length)) {
			if (Math.floor(new_length * 60) >= 300) {
				set_setting('maxlength', Math.floor(new_length * 60), data);
				modMessage(data, 'Max song length set to ' + sec_to_str(settings['maxlength']) + '.');
			}
			else {
				modMessage(data, 'You can't set the max song length below 5 minutes. :omgscoots:');
			}
		}
	}
};
