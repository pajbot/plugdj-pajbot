exports.names = ['.move', '.mv'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = true;
exports.cd_all = 5;
exports.cd_user = 10;
exports.cd_manager = 0;
exports.handler = function (data) {
    if (data.from.role > 2 || data.from.username == 'RosenMVP' || data.from.username == 'PAJLADA') {
        var input = data.message.split(' ');
        if (input.length >= 3) {
            var username = _.rest(input, 1);
            username = _.initial(username, 1).join(' ').trim();
            var usernameFormatted = S(username).chompLeft('@').s;
            var position = parseInt(_.last(input, 1));
            users = bot.getUsers();
            var user = _.findWhere(users, {username: usernameFormatted});
            if (user !== undefined) {
                var currentPosition = bot.getWaitListPosition(user.id);
                if (currentPosition === -1) {
                    bot.moderateAddDJ(user.id, function () {
                        if (position <= bot.getWaitList().length) {
                            bot.moderateMoveDJ(user.id, position);
                        }
                    });
                } else if (currentPosition > 0 && currentPosition !== position) {
                    bot.moderateMoveDJ(user.id, position);
                }
                bot.sendChat('/me [@' + data.from.username + '] Moving ' + usernameFormatted + ' to position ' + position + '.');
            }
        }
    }
}
