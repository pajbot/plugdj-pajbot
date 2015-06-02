exports.names = ['say'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.cd_all = 0;
exports.cd_user = 0;
exports.cd_manager = 0;
exports.min_role = PERMISSIONS.COHOST;
exports.handler = function (data) {
    var rest = _.rest(data.message.split(' '), 1).join(' ');
    chatMessage(rest);
};
