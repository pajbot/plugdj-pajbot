exports.names = ['.setrank', '.setrole', '!setrank', '!setrole'];
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
            var rank_tmp = _.last(params).toUpperCase();
            switch (rank_tmp) {
                case 'PLEB':
                    rank_tmp = '0';
                    break;
                case 'DISCPLEB':
                    rank_tmp = '1';
                    break;
                case 'NAZI':
                    rank_tmp = '2';
                    break;
            }
            rank = parseInt(rank_tmp);
        } else {
            chatMessage('/me Usage: .setrank username (Pleb|DiscPleb|Nazi)');
            return;
        }

        if (rank >= 0 && rank <= 2) {
            var usernameFormatted = S(username).chompLeft('@').s;

            User.find({where: {username: usernameFormatted}}).on('success', function (row) {
                if (row === null) {
                    chatMessage('/me No user named ' + usernameFormatted + ' was not found.');
                } else {
                    /*
                    if (data.from.username == 'Jeanny' && row.username == 'PAJLADA') {
                        return false;
                    }
                    */
                    bot.moderateSetRole(row.id, rank, function() {
                        modMessage(data, row.username + ' was set to rank ' + rank);
                        logger.info('[SETRANK] ' + row.username + ' was set to rank ' + rank + ' by ' + data.from.username);
                    });
                }
            });

            users = bot.getUsers();
            var user = _.findWhere(users, {username: usernameFormatted});
        } else {
            chatMessage('/me Usage: .setrank username (Pleb|DiscPleb|Nazi)');
            return;
        }
    }
};
