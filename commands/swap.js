exports.names = ['swap'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = true;
exports.cd_all = 5;
exports.cd_user = 10;
exports.cd_manager = 0;
exports.min_role = PERMISSIONS.BOUNCER_PLUS;
exports.handler = function (data) {
    var input = data.message.split(' ');
    var params = _.rest(input).join(' ');
    if (input.length >= 3) {
        logger.info(params);
        var first_pos = params.indexOf('@');
        var last_pos = params.lastIndexOf('@');

        if (first_pos !== -1 && first_pos !== last_pos && last_pos !== params.length) {
            var username_1 = params.substr(first_pos + 1, last_pos - first_pos - 2);
            var username_2 = params.substr(last_pos + 1);

            var users = bot.getUsers();
            var user_1 = _.findWhere(users, {username: username_1});
            var user_2 = _.findWhere(users, {username: username_2});
            if (user_1 !== undefined && user_2 !== undefined) {
                var position_1 = bot.getWaitListPosition(user_1.id);
                var position_2 = bot.getWaitListPosition(user_2.id);

                logger.info(position_1);
                logger.info(position_2);

                if (position_1 !== -1 || position_2 !== -1) {
                    chatMessage('/me [@' + data.from.username + '] Swapping ' + username_1 + ' with ' + username_2 + '.');

                    logger.info(user_1.id + ' to position ' + position_2);
                    logger.info(user_2.id + ' to position ' + position_1);

                    if (position_2 === -1) {
                        move_user(user_2.id, position_1);
                        setTimeout(function() {
                            move_user(user_1.id, position_2);
                        }, 500);
                    } else {
                        move_user(user_1.id, position_2);
                        setTimeout(function() {
                            move_user(user_2.id, position_1);
                        }, 500);
                    }
                }
            }
        } else {
            modMessage(data, 'Usage: .swap @USER1 @USER2');
        }
    }
}
