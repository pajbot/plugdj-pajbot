exports.names = ['muted'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.cd_all = 0;
exports.cd_user = 2;
exports.cd_manager = 0;
exports.min_role = PERMISSIONS.BOUNCER;
exports.handler = function (data) {
    var params = _.rest(data.message.split(' '), 1);
    var username = '';
    if (params.length < 1) {
        var username_uf = params.join(' ').trim();
        username = username_uf.replace('@', '');
    } else {
        username_uf = params.join(' ').trim();
        username = username_uf.replace('@', '');
        var user = _.findWhere(bot.getUsers(), {username: username});
        if (user) {
            username = '@' + user.username;
        }
    }
    chatMessage('/me ' + username + ' Do not ask for skips. You have been muted for 15 minutes.');
};
