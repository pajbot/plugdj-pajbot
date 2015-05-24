exports.names = ['bely'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.cd_all = 15;
exports.cd_user = 30;
exports.cd_manager = 10;
exports.min_role = PERMISSIONS.NONE;
exports.handler = function (data) {
    chatMessage('/me http://i.imgur.com/R9MxWNo.png');
};
