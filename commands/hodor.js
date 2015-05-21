exports.names = ['.hodor', '!hodor'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.cd_all = 15;
exports.cd_user = 30;
exports.cd_manager = 10;
exports.remove_command = false;
exports.handler = function (data) {
    chatMessage('Hodor!');
};
