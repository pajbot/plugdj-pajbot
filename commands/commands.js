exports.names = ['.commands', '!commands'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = false;
exports.cd_all = 15;
exports.cd_user = 30;
exports.cd_manager = 10;
exports.handler = function (data) {
    chatMessage('/me Commands: http://git.io/vTObv');
};
