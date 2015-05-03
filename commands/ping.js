exports.names = ['.ping', '.uptime'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = true;
exports.cd_all = 10;
exports.cd_user = 600;
exports.cd_manager = 0;
exports.handler = function (data) {
    if (data.from.role > 1) {
        bot.sendChat('/me Pong! (bot started ' + moment.utc(uptime.getTime()).fromNow() + ')');
    }
};
