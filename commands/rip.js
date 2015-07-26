exports.names = ['rip'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.cd_all = 5;
exports.cd_user = 60;
exports.cd_manager = 0;
exports.min_role = PERMISSIONS.NONE;
exports.handler = function (data) {
    var current_position = bot.getWaitListPosition(data.from.id);

    if (current_position === -1) {
        return false;
    }

    modMessage(data, 'Spinning the cylinder at position ' + current_position + '...');

    setTimeout(function () {
        current_position = bot.getWaitListPosition(data.from.id);
        if (Crypto_rand.randInt(1, 6) === 6) {
            chatMessage('/me *BANG* You\'re dead @' + data.from.username + '! :tfw:');
            if (current_position === 0) {
                bot.moderateForceSkip();
            } else {
                move_user(data.from.id, -1);
            }
        } else {
            chatMessage('/me *click* You survived this time @' + data.from.username + '...');
        }
    }, 2500);
};
