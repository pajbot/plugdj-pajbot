exports.names = ['.motd', '.motdi', '.motdinterval', '.motdfreq', '.motdfrequency'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = true;
exports.cd_all = 10;
exports.cd_user = 15;
exports.cd_manager = 1;
exports.handler = function (data) {
    if (!('motd' in settings) || !('motd_interval' in settings)) {
        return;
    }

    var input = data.message.toLowerCase().split(' ');
    var command = _.first(input);

    switch (command) {
        case '.motd':
            if (data.from.role > 1) {
                setting_handle('motd', data);
            } else {
                bot.sendChat('/me MotD: ' + settings['motd']);
            }
            break;

        case '.motdi':
        case '.motdinterval':
        case '.motdfreq':
        case '.motdfrequency':
            if (data.from.role > 1) {
                setting_handle('motd_interval', data);
            }
            break;
    }
};
