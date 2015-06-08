exports.names = ['swap', 'sw'];
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
    parse_command_params(data.message, CPARAM.USERNAME, CPARAM.USERNAME).then(function(pdata) {
        var user_1 = pdata.params[0].user;
        var user_2 = pdata.params[1].user;

        if (user_1 && user_2) {
            var position_1 = bot.getWaitListPosition(user_1.id);
            var position_2 = bot.getWaitListPosition(user_2.id);

            logger.info(position_1);
            logger.info(position_2);

            if (position_1 !== -1 || position_2 !== -1) {
                chatMessage('/me [@' + data.from.username + '] Swapping ' + user_1.username + ' with ' + user_2.username + '.');

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
        } else {
            modMessage(data, 'Invalid users specified.');
        }
    });
}
