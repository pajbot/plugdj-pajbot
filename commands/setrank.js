exports.names = ['.setrank', '.setrole'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.cd_all = 5;
exports.cd_user = 10;
exports.cd_manager = 0;
exports.handler = function (data) {
    if (data.from.role > 2 || data.from.username == 'PAJLADA' || data.from.username == 'RosenMVP') {
        var input = data.message.split(' ');
        var command = _.first(input);
        var params = _.rest(input);
        var username = '';
        var rank = 0;

        if (params.length >= 2) {
            username = _.initial(params).join(' ').trim();
            rank = parseInt(_.last(params).toUpperCase());
        } else {
            bot.sendChat('/me Usage: .setrank username (0|1|2)');
            return;
        }


        if (rank >= 0 && rank <= 2) {
            var usernameFormatted = S(username).chompLeft('@').s;

            User.find({where: {username: usernameFormatted}}).on('success', function (row) {
                if (row === null) {
                    bot.sendChat('/me No user named ' + usernameFormatted + ' was not found.');
                } else {
                    bot.moderateSetRole(row.id, rank, function() {
                        modMessage(data, row.username + ' was set to rank ' + rank);
                        logger.info('[SETRANK] ' + row.username + ' was set to rank ' + rank + ' by ' + data.from.username);
                    });
                }
            });

            users = bot.getUsers();
            var user = _.findWhere(users, {username: usernameFormatted});
        } else {
            bot.sendChat('/me Usage: .setrank username (0|1|2)');
            return;
        }
    }
};
