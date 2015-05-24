exports.names = ['.cycle', '!cycle'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.cd_all = 0;
exports.cd_user = 0;
exports.cd_manager = 0;
exports.min_role = PERMISSIONS.MANAGER;
exports.handler = function (data) {
    var input = data.message.split(' ');
    var command = _.first(input);
    var params = _.rest(input).join(' ').toLowerCase().trim();
    switch (params) {
        case 'on':
        case '1':
            bot.changeDJCycle(true);
            modMessage(data, 'Enabling DJ cycle.');
            break;

        case 'off':
        case '0':
            bot.changeDJCycle(false);
            modMessage(data, 'Disabling DJ cycle.');
            break;

        default:
            modMessage(data, 'usage: .cycle (on|off)');
            break;
    }
};
