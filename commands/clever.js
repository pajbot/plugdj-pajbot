exports.names = ['.clever'];
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
            config.cleverbot = !config.cleverbot;
            bot.sendChat('/me [@'+data.from.username+'] Cleverbot is now ' + (config.cleverbot ? 'enabled' : 'disabled') + '.');
        } else {
            var msg = params.join(' ');
            if (msg == 'on' || msg == '1') {
                if (config.cleverbot) {
                    bot.sendChat('/me [@'+data.from.username+'] Cleverbot is already enabled.');
                } else {
                    config.cleverbot = true;
                    bot.sendChat('/me [@'+data.from.username+'] Cleverbot is now ' + (config.cleverbot ? 'enabled' : 'disabled') + '.');
                }
            } else if (msg == 'off' || msg == '0') {
                if (config.cleverbot) {
                    config.cleverbot = false;
                    bot.sendChat('/me [@'+data.from.username+'] Cleverbot is now ' + (config.cleverbot ? 'enabled' : 'disabled') + '.');
                } else {
                    bot.sendChat('/me [@'+data.from.username+'] Cleverbot is already disabled.');
                }
            } else {
                config.cleverbot = !config.cleverbot;
                bot.sendChat('/me [@'+data.from.username+'] Cleverbot is now ' + (config.cleverbot ? 'enabled' : 'disabled') + '.');
            }
        }
    }

};
