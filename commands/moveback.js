exports.names = ['moveback'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = true;
exports.cd_all = 30;
exports.cd_user = 5400;
exports.cd_manager = 0;
exports.min_role = PERMISSIONS.NONE;
exports.handler = function (data) {
    var position = bot.getWaitListPosition(data.from.id);
    if (position !== -1 && position !== 0 && position !== 50) {
        move_user(data.from.id, 50);
        chatMessage('/me Moving ' + data.from.username + ' back to 50.');
    } else {
        modMessage(data, 'You need to be in the waitlist to use .moveback.');
        return {cd_all: 5, cd_user: 20};
    }
};
