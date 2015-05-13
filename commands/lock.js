exports.names = ['.lock'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.cd_all = 0;
exports.cd_user = 0;
exports.cd_manager = 0;
exports.handler = function (data) {
    logger.info('aaaaaaa');
    if (data.from.role > 2 || data.from.username == 'PAJLADA') {
        logger.info('locking');
        bot.moderateLockBooth(true);
    }
};
