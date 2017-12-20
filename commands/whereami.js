exports.names = ['whereami'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.cd_all = 10;
exports.cd_user = 30;
exports.cd_manager = 5;
exports.handler = function (data) {
    const os = require('os');
    modMessage(data, 'I am currently living in ' + os.hostname() + ' :lenny:');
};
