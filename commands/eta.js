exports.names = ['.eta'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.cd_all = 2;
exports.cd_user = 600;
exports.cd_manager = 5;
exports.handler = function (data) {
    var pos = bot.getWaitListPosition(data.from.id);
    if (pos < 0) {
        bot.sendChat('/me @'+data.from.username+' you\'re not in the waitlist :dansgame:.');
    } else {
        var time_remaining = bot.getTimeRemaining();
        var time = ((pos + 1) * 4 * 60 + time_remaining);
        bot.sendChat('/me @'+data.from.username+' you will reach the booth in approximately ' + sec_to_str(time));
    }
};
