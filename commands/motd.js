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
    var params = _.rest(input);

    switch (command) {
        case '.motd':
            if (input.length > 1 && data.from.role > 1) {
                settings['motd'] = params.join(' ');

                sequelize.query('UPDATE `settings` SET `value`=? WHERE `id`=\'motd\'',
                        { replacements: [settings['motd']] });

                bot.sendChat('/me [@'+data.from.username+'] MotD changed to: ' + settings['motd']);
            } else {
                bot.sendChat('/me MotD: ' + settings['motd']);
            }
            break;

        case '.motdi':
        case '.motdinterval':
        case '.motdfreq':
        case '.motdfrequency':
            if (data.from.role > 1) {
                var input = data.message.toLowerCase().split(' ');
                var command = _.first(input);
                var params = _.rest(input);

                if (input.length > 1) {
                    var new_interval = parseInt(params.join(' '));
                    settings['motd_interval'] = new_interval;

                    sequelize.query('UPDATE `settings` SET `value`=? WHERE `id`=\'motd_interval\'',
                            { replacements: [settings['motd_interval']] });

                    if (new_interval === 0) {
                        bot.sendChat('/me [@'+data.from.username+'] MotD interval changed to: 0 (disabled)');
                    } else {
                        bot.sendChat('/me [@'+data.from.username+'] MotD interval changed to: ' + settings['motd_interval']);
                    }
                } else {
                    bot.sendChat('/me MotD interval: ' + settings['motd_interval']);
                }
            }
            break;
    }
};
