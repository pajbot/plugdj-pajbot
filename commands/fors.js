exports.names = ['fors'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.cd_all = 15;
exports.cd_user = 15;
exports.cd_manager = 15;
exports.min_role = PERMISSIONS.MANAGER;
var forsen_userid = 3692275;
exports.handler = function (data) {
    var user = _.findWhere(bot.getUsers(), {id: forsen_userid});
    if (user) {
        chatMessage('@djs @staff FORSEN IS IN THE ROOM, CHECK YOUR PLAYLISTS AND READ THE RULES');
    } else {
        chatMessage('@djs @staff FORSEN IS ON HIS WAY, CHECK YOUR PLAYLISTS AND READ THE RULES');
    }
};
