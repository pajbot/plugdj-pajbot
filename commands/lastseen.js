exports.names = ['lastseen', 'seen'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.cd_all = 5;
exports.cd_user = 10;
exports.cd_manager = 5;
exports.min_role = PERMISSIONS.RDJ;
exports.handler = function (data) {
    var params = _.rest(data.message.split(' '), 1);
    if (params.length < 1) {
        modMessage(data, 'Usage: .lastseen username');
        return;
    }

    logger.info('"' + get_param_username(data.message) + '"');

    username = params.join(' ');
    logger.info('"' + username + '"');
    logger.info(params);
    logger.info(S(username));
    logger.info(S(username).chompLeft('@'));
    logger.info(S(username).chompLeft('@').s);
    usernameFormatted = S(username).chompLeft('@').s;

    user = _.findWhere(bot.getUsers(), {username: usernameFormatted});
    if (user) {
        modMessage(data, usernameFormatted + ' is in the room!');
    } else {
        User.find({where: {username: usernameFormatted}}).on('success', function (row) {
            if (row === null) {
                modMessage(data, usernameFormatted.replace(/@/g, '') + ' was not found.');
            } else {
                modMessage(data, row.username + ' was last seen ' + timeSince(row.last_seen) + '.');
            }
        });
    }
};
