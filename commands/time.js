exports.names = ['.time', '.utc', '!time', '.utc'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.cd_all = 10;
exports.cd_user = 30;
exports.cd_manager = 5;
exports.handler = function (data) {
    chatMessage('Current time: ' + moment.utc().format('HH:mm:ss') + ' UTC');
};
