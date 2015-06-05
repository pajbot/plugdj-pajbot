exports.names = ['russianjoin', 'russianleave', 'rjoin', 'rleave'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.cd_all = 0;
exports.cd_user = 0;
exports.cd_manager = 0;
var roulette_time = 10; // in seconds
exports.handler = function (data) {
    if (bot.running_russian_roulette === true) {
        var input = data.message.toLowerCase().split(' ');
        var command = _.first(input);

        switch (command) {
            case '.russianjoin':
            case '!russianjoin':
            case '.rjoin':
            case '!rjoin':
                {
                    var position = bot.getWaitListPosition(data.from.id);
                    if (position != -1 && bot.russian_roulette_users.indexOf(data.from.username) == -1) {
                        chatMessage('/me ' + data.from.username + ' joined the russian roulette! (.rleave if you regret it.)', 2);
                        bot.russian_roulette_users.push(data.from.username);
                    }
                }
                break;

            case '.russianleave':
            case '!russianleave':
            case '.rleave':
            case '!rleave':
                {
                    var i = bot.russian_roulette_users.indexOf(data.from.username);
                    if (i !== -1) {
                        bot.russian_roulette_users.splice(i, 1);
                        chatMessage('/me ' + data.from.username + ' has left the russian roulette.', 2);
                    }
                }
                break;
        }
    }
};
