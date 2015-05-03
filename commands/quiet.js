exports.names = ['.quiet', '.shutup'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.cd_all = 0;
exports.cd_user = 0;
exports.cd_manager = 0;
exports.handler = function (data) {
    if (data.from.role > 2 || data.from.username == 'PAJLADA' || data.from.username == 'Jeanny') {
        config.quietMode = true;
        bot.sendChat('/me Quiet mode enabled.');
    }
};
