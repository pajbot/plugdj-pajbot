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
    } else {
        // Attempt to set the new max song length
        var new_length_in_seconds = -1;

        if (params[0].indexOf(':') != -1) {
            var time_with_colon = params[0].split(':');
            var new_minutes = parseInt(time_with_colon[0]);
            var new_seconds = parseInt(time_with_colon[1]);

            if (!isNaN(new_minutes) && !isNaN(new_seconds)) {
                new_length_in_seconds = Math.floor(new_minutes * 60) + Math.floor(new_seconds);
            }
        } else {
            var new_minutes = parseFloat(params);
            if (!isNaN(new_minutes)) {
                new_length_in_seconds = Math.floor(new_minutes * 60);
            }
        }

        if (new_length_in_seconds <= -1) {
            return;
        }

        if (new_length_in_seconds < 300) {
            modMessage(data, 'You can\'t set the max song length below 5 minutes. :omgscoots:');
            return;
        }

        set_setting('maxlength', new_length_in_seconds, data);
        modMessage(data, 'Max song length set to ' + sec_to_str(new_length_in_seconds) + '.');
    }
};
