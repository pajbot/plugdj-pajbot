exports.names = ['time', 'utc'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.cd_all = 10;
exports.cd_user = 30;
exports.cd_manager = 5;
exports.handler = function (data) {
    modMessage(data, 'Current time: ' + moment.utc().format('HH:mm:ss') + ' UTC');
};
