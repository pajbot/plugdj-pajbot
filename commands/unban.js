exports.names = ['.unban', '!unban'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.cd_all = 5;
exports.cd_user = 10;
exports.cd_manager = 0;
exports.handler = function (data) {
    if (data.from.role > 2 || data.from.username == 'PAJLADA' || data.from.username == 'RosenMVP') {
        var params = _.rest(data.message.split(' '), 1);
        if (params.length < 1) {
            bot.sendChat('/me Usage: .unban username');
            return;
        }

        username = params.join(' ').trim()
        usernameFormatted = S(username).chompLeft('@').s;

        User.find({where: {username: usernameFormatted}}).on('success', function (row) {
            if (row === null) {
                bot.sendChat('/me No user named ' + usernameFormatted + ' was not found.');
            } else {
                bot.moderateUnbanUser(row.id, function() {
                    bot.sendChat('/me [@'+data.from.username+'] Unbanned ' + row.username + '.');
                    logger.info('[UNBAN] ' + row.username + ' was unbanned by ' + data.from.username);
                    var userData = {
                        type: 'unban',
                        details: 'Unbanned by ' + data.from.username,
                        user_id: row.id,
                        mod_user_id: data.from.id
                    };
                    Karma.create(userData);
                });
            }
        });
    }
};
