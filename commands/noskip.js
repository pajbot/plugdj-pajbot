exports.names = ['.noskip', '!noskip'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = true;
exports.cd_all = 1;
exports.cd_user = 2;
exports.cd_manager = 0;
exports.handler = function (data) {
    if (data.from.role > 1) {
        chatMessage('/me Don\'t ask for skips, or you\'ll get muted :smorc:');
    }
};
