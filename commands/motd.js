exports.names = ['.motd', '.motdi', '.motdinterval', '!motd', '!motdi', '!motdinterval'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = true;
exports.cd_all = 10;
exports.cd_user = 15;
exports.cd_manager = 1;
exports.min_role = PERMISSIONS.NONE; // XXX: Different sections need different permissions.
exports.handler = function (data) {
    var input = data.message.toLowerCase().split(' ');
    var command = _.first(input);

    switch (command) {
        case '.motd':
        case '!motd':
            if (data.from.role > 1) {
                setting_handle('motd', data);
            } else {
                chatMessage('/me MotD: ' + settings['motd']);
            }
            break;

        case '.motdi':
        case '.motdinterval':
        case '!motdi':
        case '!motdinterval':
            if (data.from.role > 1) {
                setting_handle('motd_interval', data);
            }
            break;
    }
};
