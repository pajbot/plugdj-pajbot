exports.names = ['muted'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.cd_all = 0;
exports.cd_user = 2;
exports.cd_manager = 0;
exports.min_role = PERMISSIONS.BOUNCER;
exports.handler = function (data) {
    parse_command_params(data.message, CPARAM.USERNAME, CPARAM.INT).then(function(cdata) {
        logger.info(cdata);
        var mute_duration = 15;
        var valid_durations = [15, 30, 45];
        if (cdata.params[1] !== undefined && cdata.params[1] && valid_durations.indexOf(cdata.params[1]) !== -1) {
            mute_duration = cdata.params[1];
        }
        
        var at_user = '';
        
        if (cdata.params[0] !== undefined && cdata.params[0].user) {
            at_user = '@' + cdata.params[0].user.username + ' ';
        }
        
        chatMessage('/me ' + at_user + 'Do not ask for skips. You have been muted for ' + mute_duration + ' minutes.');
    });
};
