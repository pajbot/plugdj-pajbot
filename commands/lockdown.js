exports.names = ['.lockdown', '!lockdown'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.cd_all = 0;
exports.cd_user = 0;
exports.cd_manager = 0;
exports.handler = function (data) {
    if (data.from.role > 2 || data.from.username == config.superAdmin) {
        var params = _.rest(data.message.split(' '), 1);
        var username = '';
        if (params.length < 1) {
            config.lockdown = !config.lockdown;
            bot.sendChat('/me [@'+data.from.username+'] Lockdown is now ' + (config.lockdown ? 'enabled' : 'disabled') + '.');
        } else {
            var msg = params.join(' ');
            if (msg == 'on' || msg == '1') {
                if (config.lockdown) {
                    bot.sendChat('/me [@'+data.from.username+'] Lockdown is already enabled.');
                } else {
                    config.lockdown = true;
                    bot.sendChat('/me [@'+data.from.username+'] Lockdown is now ' + (config.lockdown ? 'enabled' : 'disabled') + '.');
                }
            } else if (msg == 'off' || msg == '0') {
                if (config.lockdown) {
                    config.lockdown = false;
                    bot.sendChat('/me [@'+data.from.username+'] Lockdown is now ' + (config.lockdown ? 'enabled' : 'disabled') + '.');
                } else {
                    bot.sendChat('/me [@'+data.from.username+'] Lockdown is already disabled.');
                }
            } else {
                config.lockdown = !config.lockdown;
                bot.sendChat('/me [@'+data.from.username+'] Lockdown is now ' + (config.lockdown ? 'enabled' : 'disabled') + '.');
            }
        }
    }
};
