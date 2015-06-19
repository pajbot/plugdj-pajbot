exports.names = ['debug'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = true;
exports.cd_all = 10;
exports.cd_user = 30;
exports.cd_manager = 5;
exports.min_role = PERMISSIONS.MANAGER;
exports.handler = function (data) {
    var waitlist = bot.getWaitList();
    var room_length = waitlist.length;
    var str_array = [];
    var stuff = {
        'Room length': room_length,
    };
    _.each(stuff, function(value, key) {
        str_array.push(key + ': ' + value);
    });
    modMessage(data, str_array.join(', '));
    logger.info('[WL]', waitlist.join(', '));
};
