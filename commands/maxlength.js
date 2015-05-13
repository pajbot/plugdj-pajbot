exports.names = ['.maxlength', '.max', '.setmaxlength'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.cd_all = 0;
exports.cd_user = 0;
exports.cd_manager = 0;
exports.handler = function (data) {
    if (data.from.role > 2 || data.from.username == 'PAJLADA') {
        var input = data.message.split(' ');
        var command = _.first(input);
        var params = _.rest(input);
        if (params.length < 1) {
            modMessage(data, 'Current max song length: ' + sec_to_str(settings['maxlength']) + '.');
        } else {
            var new_length = parseFloat(params);
            if (!isNaN(new_length)) {
                set_setting('maxlength', Math.floor(new_length * 60), data);
                modMessage(data, 'Max song length set to ' + sec_to_str(settings['maxlength']) + '.');
            }
        }
    }
};
