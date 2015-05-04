exports.names = ['.motd'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = true;
exports.cd_all = 10;
exports.cd_user = 15;
exports.cd_manager = 0;
var roulette_time = 10; // in seconds
exports.handler = function (data) {
    if (!('motd' in settings)) {
        return;
    }

    var input = data.message.toLowerCase().split(' ');
    var command = _.first(input);
    var params = _.rest(input);

    if (input.length > 1) {
        settings['motd'] = params.join(' ');

        sequelize.query('UPDATE `settings` SET `value`=? WHERE `id`=\'motd\'',
                        { replacements: [settings['motd']] });

        bot.sendChat('/me MotD changed to: ' + settings['motd']);
    } else {
        bot.sendChat('/me MotD: ' + settings['motd']);
    }
};
