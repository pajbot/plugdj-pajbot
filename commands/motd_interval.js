exports.names = ['.motdi', '.motdinterval', '.motdfreq', '.motdfrequency'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = true;
exports.cd_all = 0;
exports.cd_user = 5;
exports.cd_manager = 0;
var roulette_time = 10; // in seconds
exports.handler = function (data) {
    if (!('motd_interval' in settings)) {
        return;
    }
    if (data.from.role > 1) {
        var input = data.message.toLowerCase().split(' ');
        var command = _.first(input);
        var params = _.rest(input);

        if (input.length > 1) {
            var new_interval = parseInt(params.join(' '));
            settings['motd'] = params.join(' ');

            sequelize.query('UPDATE `settings` SET `value`=? WHERE `id`=\'motd_interval\'',
                    { replacements: [settings['motd_interval']] });

            bot.sendChat('/me MotD interval changed to: ' + settings['motd_interval']);
        } else {
            bot.sendChat('/me MotD interval: ' + settings['motd_interval']);
        }
    }
};
