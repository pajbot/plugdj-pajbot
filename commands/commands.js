exports.names = ['.commands'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = false;
exports.cd_all = 15;
exports.cd_user = 30;
exports.cd_manager = 10;
exports.handler = function (data) {
    if (data.from.role > 2 || data.from.username == 'PAJLADA') {
        bot.sendChat('Commands: ' + _.compact(_.map(commands, function (command) {
            if (command.enabled && !command.hidden && _.first(command.names) != '.commands') {
                return _.first(command.names);
            }
        })).join(', '));
    }
};
