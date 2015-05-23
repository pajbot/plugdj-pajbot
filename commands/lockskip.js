exports.names = ['.lockskip', '!lockskip'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.cd_all = 3;
exports.cd_user = 3;
exports.cd_manager = 3;
exports.handler = function (data) {
    if (data.from.role > 1) {
        var media = bot.getMedia();
        var dj = bot.getDJ();

        logger.info('[LOCKSKIP] ' + data.from.username + ' lockskipped ' + dj.username);

        var userData = {
            type: 'lockskip',
            details: 'Skipped by ' + data.from.username,
            user_id: dj.id,
            mod_user_id: data.from.id
        };
        Karma.create(userData);

        modMessage(data, 'Lockskipped the current song.');
        bot.changeDJCycle(false);
        setTimeout(function() {
            bot.changeDJCycle(true, function() {
                bot.moderateForceSkip(function() {
                    setTimeout(function() {
                        bot.changeDJCycle(false);
                        move_user(dj.id, settings['lockskippos']);
                    }, 500);
                });
            });
        }, 250);
    }
};
