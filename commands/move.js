exports.names = ['.move', '.mv', '!move', '!mv'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = true;
exports.cd_all = 5;
exports.cd_user = 10;
exports.cd_manager = 0;
exports.min_role = PERMISSIONS.BOUNCER_PLUS;
exports.handler = function (data) {
    var input = data.message.split(' ');
    if (input.length >= 3) {
        var username = _.rest(input, 1);
        username = _.initial(username, 1).join(' ').trim();
        var usernameFormatted = S(username).chompLeft('@').s;
        var position = parseInt(_.last(input, 1));
        users = bot.getUsers();
        var user = _.findWhere(users, {username: usernameFormatted});
        if (user !== undefined) {
            move_user(user.id, position);
            chatMessage('/me [@' + data.from.username + '] Moving ' + usernameFormatted + ' to position ' + position + '.');
        }
    }
}
