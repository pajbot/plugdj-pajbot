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
            chatMessage('/me [@' + data.from.username + '] Swapping ' + user_1.username + ' with ' + user_2.username + '.');
            swap_users(user_1, user_2);
        } else {
            modMessage(data, 'Invalid users specified.');
        }
    });
}
