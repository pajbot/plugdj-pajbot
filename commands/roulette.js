exports.names = ['.roulette', '!roulette'];
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

        if (rest === 'stop') {
            if (bot.running_roulette === true) {
                modMessage(data, 'The roulette has been cancelled. :sadness:');
                clearTimeout(roulette_timer);
                roulette_timer = false;
                bot.running_roulette = false;
            }
        } else {
            if (bot.running_roulette !== true) {
                var roulette_length = roulette_duration * 1000;
                if (rest.length > 0) {
                    var roulette_length_arg = parseInt(rest);
                    if (!isNaN(roulette_length_arg) && roulette_length_arg > 0) {
                        roulette_length = roulette_length_arg * 1000;
                    }
                }
                modMessage(data, 'The roulette is now open! Type .join to participate! The roulette will finish in ' + (roulette_length/1000) + ' seconds.');
                bot.running_roulette = true;
                bot.roulette_users = [];

                roulette_timer = setTimeout(function () {
                    bot.running_roulette = false;
                    if (bot.roulette_users.length > 0) {
                        logger.info(bot.roulette_users);
                        var winner_index = _.random(0, bot.roulette_users.length-1);
                        var winner = bot.roulette_users[winner_index];
                        var position = _.random(1, bot.getWaitList().length);
                        chatMessage('A winner has been picked (' + bot.roulette_users.length + ' participants)! @' + winner + ' to position ' + position + '.');

                        var users = bot.getUsers();
                        var user = _.findWhere(users, {username: winner});
                        if (user !== undefined) {
                            move_user(user.id, position);
                            var current_position = bot.getWaitListPosition(user.id);
                            logger.info('[ROULETTE]', data.from.username + ' roulette ended with ' + bot.roulette_users.length + ' participants. @' + winner + ' from ' + current_position + ' to position ' + position + '.');
                        } else {
                            chatMessage('/me user who won roulette isn\'t even here :4head:');
                        }
                    } else {
                        chatMessage('/me No one joined the roulette, what the fuck guys. :dansgame:');
                    }
                }, roulette_length);
            } else {
                modMessage(data, 'The roulette is already running.');
            }
        }
    }
};
