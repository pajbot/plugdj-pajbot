exports.names = ['roulette'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.cd_all = 0;
exports.cd_user = 0;
exports.cd_manager = 0;
exports.min_role = PERMISSIONS.MANAGER;
var roulette_duration = 60; // in seconds
var roulette_timer = false;
exports.handler = function (data) {
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
            if (rest.length > 0 && data.from.role > 2) {
                /* Only managers can create custom length roulettes. */
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
                    console.info(bot.roulette_users);
                    var winner_index = Crypto_rand.randInt(0, bot.roulette_users.length-1);
                    var winner = bot.roulette_users[winner_index];
                    var position = Crypto_rand.randInt(1, real_waitlist_length());
                    chatMessage('A winner has been picked (' + bot.roulette_users.length + ' participants)! @' + winner + ' to position ' + position + '.');

                    var users = bot.getUsers();
                    var user = _.findWhere(users, {username: winner});
                    if (user !== undefined) {
                        var current_position = bot.getWaitListPosition(user.id);
                        console.info('[ROULETTE]', data.from.username + ' roulette ended with ' + bot.roulette_users.length + ' participants. @' + winner + ' from ' + current_position + ' to position ' + position + '.');
                        if (current_position == position) {
                            chatMessage('nice value, from ' + current_position + ' to ' + position + ' :trumpw:');
                        }

                        move_user(user.id, position);
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
};
