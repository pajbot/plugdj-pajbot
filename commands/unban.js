exports.names = ['.unban', '!unban'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.cd_all = 5;
exports.cd_user = 10;
exports.cd_manager = 0;
exports.min_role = PERMISSIONS.MANAGER;
exports.handler = function (data) {
    var params = _.rest(data.message.split(' '), 1);
    if (params.length < 1) {
        chatMessage('/me Usage: .unban username');
        return;
    }

    username = params.join(' ').trim()
    usernameFormatted = S(username).chompLeft('@').s;

    User.find({where: {username: usernameFormatted}}).on('success', function (row) {
        if (row === null) {
            modMessage(data, usernameFormatted.replace(/@/g, '') + ' was not found.');
        } else {
            bot.moderateUnbanUser(row.id, function() {
                chatMessage('/me [@'+data.from.username+'] Unbanned ' + row.username + '.');
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
};
