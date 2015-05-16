exports.names = ['.ping', '.uptime', '!ping', '!uptime'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = true;
exports.cd_all = 10;
exports.cd_user = 30;
exports.cd_manager = 5;
exports.handler = function (data) {
    bot.sendChat('/me Pong! (bot started ' + moment.utc(uptime.getTime()).fromNow() + ')');
};
