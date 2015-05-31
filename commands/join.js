exports.names = ['join', 'leave'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.cd_all = 0;
exports.cd_user = 0;
exports.cd_manager = 0;
var roulette_time = 10; // in seconds
exports.handler = function (data) {
    if (bot.running_roulette === true) {
        var input = data.message.toLowerCase().split(' ');
        var command = _.first(input);

        switch (command) {
            case '.join':
            case '!join':
                {
                    if (bot.roulette_users.indexOf(data.from.username) == -1) {
                        chatMessage('/me ' + data.from.username + ' joined the roulette! (.leave if you regret it.)', 2);
                        bot.roulette_users.push(data.from.username);
                    }
                }
                break;

            case '.leave':
            case '!leave':
                {
                    var i = bot.roulette_users.indexOf(data.from.username);
                    if (i !== -1) {
                        bot.roulette_users.splice(i, 1);
                        chatMessage('/me ' + data.from.username + ' has left the roulette.', 2);
                    }
                }
                break;
        }
    }
};
