exports.names = ['.autoskip'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.cd_all = 0;
exports.cd_user = 0;
exports.cd_manager = 0;
exports.handler = function (data) {
    if (data.from.role > 2 || data.from.username == 'PAJLADA') {
        var params = _.rest(data.message.split(' '), 1);
        var username = '';
        if (params.length < 1) {
            config.autoSkip = !config.autoSkip;
            bot.sendChat('/me [@'+data.from.username+'] Autoskip is now ' + (config.autoSkip ? 'enabled' : 'disabled') + '.');
        } else {
            var msg = params.join(' ');
            if (msg == 'on' || msg == '1') {
                if (config.autoSkip) {
                    bot.sendChat('/me [@'+data.from.username+'] Autoskip is already enabled.');
                } else {
                    config.autoSkip = true;
                    bot.sendChat('/me [@'+data.from.username+'] Autoskip is now ' + (config.autoSkip ? 'enabled' : 'disabled') + '.');
                }
            } else if (msg == 'off' || msg == '0') {
                if (config.autoSkip) {
                    config.autoSkip = false;
                    bot.sendChat('/me [@'+data.from.username+'] Autoskip is now ' + (config.autoSkip ? 'enabled' : 'disabled') + '.');
                } else {
                    bot.sendChat('/me [@'+data.from.username+'] Autoskip is already disabled.');
                }
            } else {
                config.autoSkip = !config.autoSkip;
                bot.sendChat('/me [@'+data.from.username+'] Autoskip is now ' + (config.autoSkip ? 'enabled' : 'disabled') + '.');
            }
        }
    }
};
