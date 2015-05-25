exports.names = ['eta'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.cd_all = 2;
exports.cd_user = 30;
exports.cd_manager = 2;
exports.min_role = PERMISSIONS.NONE;
exports.handler = function (data) {
    var params = _.rest(data.message.split(' '), 1);
    var user;
    if (params.length < 1 || data.from.role < ROOM_ROLE.BOUNCER) {
        user = data.from;
    } else {
        var username_uf = params.join(' ').trim();
        var username = username_uf.replace('@', '');
        console.log(username);
        var _user = _.findWhere(bot.getUsers(), {username: username});
        if (_user) {
            user = _user;
        } else {
            modMessage(data, username + ' is not here :dansgame:');
            return;
        }
    }

    var pos = bot.getWaitListPosition(user.id);
    if (pos < 0) {
        if (user.id == data.from.id) {
            modMessage(data, 'You\'re not in the waitlist :dansgame:.');
        } else {
            modMessage(data, user.username + 'is not in the waitlist :dansgame:.');
        }
    } else {
        var time_remaining = bot.getTimeRemaining();
        var time = ((pos - 1) * 4 * 60 + time_remaining);
        if (user.id == data.from.id) {
            modMessage(data, 'You will reach the booth in approximately ' + sec_to_str(time) + '.');
        } else {
            modMessage(data, user.username + ' will reach the booth in approximately ' + sec_to_str(time) + '.');
        }
    }
};
