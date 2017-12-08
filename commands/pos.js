exports.names = ['pos', 'position'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.cd_all = 2;
exports.cd_user = 30;
exports.cd_manager = 2;
exports.min_role = PERMISSIONS.RDJ;
exports.handler = function (data) {
    var params = _.rest(data.message.split(' '), 1);
    var user;
    if (params.length < 1) {
        user = data.from;
    } else {
        var username_uf = params.join(' ').trim();
        var username = username_uf.replace(/@/g, '');
        console.log(username);
        var _user = _.findWhere(bot.getUsers(), {username: username});
        if (_user) {
            user = _user;
        } else {
            modMessage(data, 'Invalid user specified.');
            return;
        }
    }

    var pos = bot.getWaitListPosition(user.id);
    console.info('[POS]', 'User position: ' + pos);
    if (pos < 0) {
        if (user.id == data.from.id) {
            modMessage(data, 'You\'re not in the waitlist.');
        } else {
            modMessage(data, user.username + ' is not in the waitlist.');
        }
    } else if (pos == 0) {
        if (user.id == data.from.id) {
            modMessage(data, 'You\'re currently playing your song!');
        } else {
            modMessage(data, user.username + ' is currently playing his song!');
        }
    } else {
        if (user.id == data.from.id) {
            modMessage(data, 'You\'re at position ' + pos + ' in the waitlist.');
        } else {
            modMessage(data, user.username + ' is at position ' + pos + ' in the waitlist.');
        }
    }
};
