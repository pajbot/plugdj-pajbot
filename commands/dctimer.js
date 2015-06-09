exports.names = ['dctime', 'dctimer'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.cd_all = 0;
exports.cd_user = 0;
exports.cd_manager = 0;
exports.min_role = PERMISSIONS.MANAGER;
exports.handler = function (data) {
    var input = data.message.split(' ');
    var command = _.first(input);
    var params = _.rest(input);
    if (params.length < 1) {
        modMessage(data, 'Current DC timer length: ' + sec_to_str(settings['dctimer']) + '.');
    } else {
        var new_length = parseFloat(params);
        if (!isNaN(new_length)) {
            set_setting('dctimer', Math.floor(new_length * 60), data);
            modMessage(data, 'DC timer length set to ' + sec_to_str(settings['dctimer']) + '.');
        }
    }
};
