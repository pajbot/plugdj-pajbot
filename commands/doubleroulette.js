exports.names = ['doubleroulette', 'droulette'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.cd_all = 0;
exports.cd_user = 0;
exports.cd_manager = 0;
exports.min_role = PERMISSIONS.MANAGER;
var roulette_duration = 60; // in seconds
exports.handler = function (data) {
    var rest = _.rest(data.message.split(' '), 1).join(' ').trim().toLowerCase();

    var roulette_length = roulette_duration;
    if (rest.length > 0 && data.from.role > 2) {
        /* Only managers can create custom length roulettes. */
        var roulette_length_arg = parseInt(rest);
        if (!isNaN(roulette_length_arg) && roulette_length_arg > 0) {
            roulette_length = roulette_length_arg;
        }
    }

    chatMessage('.roulette ' + roulette_length);
    chatMessage('.russianroulette ' + roulette_length);
};
