exports.names = ['.snf', '.snufu', '!snf', '!snufu'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.cd_all = 10;
exports.cd_user = 15;
exports.cd_manager = 5;
exports.handler = function (data) {
    if (data.from.role > 2 || data.from.username == 'PAJLADA' || data.from.username == '-DARKSBANE') {
        bot.sendChat('/me http://i.imgur.com/tRzgqn7.png');
    }
};
