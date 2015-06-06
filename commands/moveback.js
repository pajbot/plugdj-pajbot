exports.names = ['moveback'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = true;
exports.cd_all = 20;
exports.cd_user = 3600;
exports.cd_manager = 0;
exports.min_role = PERMISSIONS.NONE;
exports.handler = function (data) {
    var position = bot.getWaitListPosition(data.from.id);
    if (position !== -1 && position !== 0) {
        move_user(data.from.id, 50);
        chatMessage('/me Moving ' + data.from.username + ' back to 50.');
    }
};
