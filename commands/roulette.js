exports.names = ['.roulette'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.cd_all = 0;
exports.cd_user = 0;
exports.cd_manager = 0;
var roulette_duration = 60; // in seconds
var roulette_timer = false;
exports.handler = function (data) {
    if (data.from.role > 2 || data.from.username == 'PAJLADA') {
        var rest = _.rest(data.message.split(' '), 1).join(' ').trim().toLowerCase();

        console.error('"' + rest + '"');
        if (rest === 'stop') {
            if (bot.running_roulette === true) {
                bot.sendChat('/me The roulette has been cancelled. :sadness:');
                clearTimeout(roulette_timer);
                roulette_timer = false;
                bot.running_roulette = false;
            }
        } else {
            if (bot.running_roulette !== true) {
                bot.sendChat('/me [@' + data.from.username + ']The roulette is now open! Type .join to participate!');
                bot.running_roulette = true;
                bot.roulette_users = [];

                roulette_timer = setTimeout(function () {
                    bot.running_roulette = false;
                    if (bot.roulette_users.length > 0) {
                        var winner_index = _.random(0, bot.roulette_users.length-1);
                        var winner = bot.roulette_users[winner_index];
                        var position = _.random(1, bot.getWaitList().length);
                        bot.sendChat('A winner has been picked! @' + winner + ' to position ' + position + '.');
                    } else {
                        bot.sendChat('/me No one joined the roulette, what the fuck guys. :dansgame:');
                    }
                }, roulette_duration * 1000);
            } else {
                bot.sendChat('/me [@' + data.from.username + '] The roulette is already running.');
            }
        }
    }
};
