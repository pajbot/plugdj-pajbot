exports.names = ['.tp', '.tastyplug', '!tp', '!tastyplug'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.cd_all = 15;
exports.cd_user = 30;
exports.cd_manager = 10;
exports.handler = function (data) {
    chatMessage('/me https://fungustime.pw/tastyplug/');
};
