exports.names = ['duel', 'accept', 'deny'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.cd_all = 1;
exports.cd_user = 5;
exports.cd_manager = 0;

duel_request = false;
duel_last_run_users = {};
var request_time = 25; // How long the person has to accept the duel request in seconds
var last_duel = 0;
var duel_cd = 60 * 2; // How often a duel can be run
var duel_request_user_cd = 45; // How often a person can request a duel

exports.handler = function (data) {
    var input = data.message.split(' ');
    var command = _.first(input).substr(1);
    var params = _.rest(input);
    var cur_time = Date.now() / 1000;
    var time_diff = cur_time - last_duel;

    if (duel_cd >= time_diff) {
        /* A duel was run recently */
        console.info('A duel was run recently bro, sry!');
        console.info(duel_cd);
        console.info(time_diff);
        console.info(last_duel);
        return false;
    }

    console.info(command);

    switch (command) {
        case 'duel':

            get_user_by_param(params, function(err, user, db_user) {
                if (user) {
                    var time_diff_user = cur_time;
                    if (data.from.id in duel_last_run_users) {
                        time_diff_user -= duel_last_run_users[data.from.id];
                    }

                    if (duel_request_user_cd >= time_diff_user) {
                        console.info(data.from.username + ' has already requested a duel in the last ' + duel_request_user_cd + ' seconds, aborting.');
                        return {cd: 1, cd_user: 10};
                    }

                    var current_position = bot.getWaitListPosition(data.from.id);
                    var duelee_position = bot.getWaitListPosition(user.id);
                    var room_length = real_waitlist_length();
                    var min_position = room_length - 5;
                    if (current_position === -1 || duelee_position === -1) {
                        console.info('You must be in the waitlist to duel someone!.');
                        modMessage(data, 'You and ' + user.username + ' must be in the waitlist to duel.');
                        /* You must be in the waitlist to duel someone. */
                        return {cd: 2, cd_user: 10};
                    } else if (current_position === 0 || duelee_position === 0) {
                        modMessage(data, 'You or ' + user.username + ' can\'t be playing your songs while dueling.');
                        /* You must be in the waitlist to duel someone. */
                        return {cd: 2, cd_user: 10};
                    } else {
                        if (current_position > min_position || duelee_position > min_position) {
                            console.info('Both participants must be above position ' + min_position + ' to duel eachother.');
                            modMessage(data, 'Both participants must be above position ' + min_position + ' to duel eachother.');
                            return {cd: 2, cd_user: 10};
                        }
                    }

                    if (user.id === data.from.id) {
                        console.info('You can\'t duel yourself...');
                        /* wtf are you doing dueling yourself man */
                        return false;
                    }

                    if (duel_request) {
                        console.info('There\'s already a duel request active.');
                        return false;
                    }

                    duel_last_run_users[data.from.id] = cur_time;

                    /* This person does not have any duel requests atm */
                    duel_request = {
                        target: user,
                        requestor: data.from,
                        running: false,
                        timeout: setTimeout(function() {
                            modMessage(data, user.username + ' did not answer your duel request.');
                            duel_request = false;
                        }, request_time * 1000)
                    };

                    chatMessage('/me @' + user.username + ', (' + duelee_position + ') you have been challenged to a duel by ' + data.from.username + ', (' + current_position + ') respond with .accept or .deny');
                }
            });
            break;

        case 'deny':
            if (duel_request && duel_request.target.id === data.from.id && duel_request.running === false) {
                modMessage(data, 'You denied the duel request from @' + duel_request.requestor.username + '.');
                clearTimeout(duel_request.timeout);
                duel_request = false;
            } else {
                console.info('There is no duel request for you active.');
            }
            break;

        case 'accept':
            if (duel_request && duel_request.target.id === data.from.id && duel_request.running === false) {
                duel_request.running = true;
                clearTimeout(duel_request.timeout);
                var req = duel_request;

                modMessage(data, 'You accepted the duel request from @' + req.requestor.username + '... Picking a winner...');
                last_duel = cur_time;
                setTimeout(function() {
                    if (duel_request === false) {
                        chatMessage('/me The dueling pit is now open again.');
                    }
                }, duel_cd * 1000);
                setTimeout(function() {
                    var users = [];

                    users[0] = req.requestor;
                    users[1] = req.target;

                    var winner_id = Crypto_rand.randInt(0, 1);

                    var winner  = users[winner_id];
                    var loser = users[winner_id === 0 ? 1 : 0];

                    var winner_pos = bot.getWaitListPosition(winner.id);
                    var loser_pos = bot.getWaitListPosition(loser.id);

                    var room_length = real_waitlist_length();
                    var min_position = room_length - 5;

                    duel_request = false;
                    if (winner_pos === -1 || loser_pos === -1) {
                        chatMessage('/me :dansgame: 1');
                        return;
                    } else if (winner_pos === 0 || loser_pos === 0) {
                        chatMessage('/me :dansgame: 2');
                        return;
                    } else {
                        if (winner_pos > min_position || loser_pos > min_position) {
                            chatMessage('/me :dansgame:');
                            return;
                        }
                    }

                    console.info('winner pos: ' + winner_pos);
                    console.info('loser pos: ' + loser_pos);
                    console.info('[DUEL]', winner.username + ' won duel.');
                    console.info('[DUEL]', loser.username + ' lost duel.');

                    /* If the winner is further in the waitlist than the loser, or if the loser is not in the waitlist, or if the loser is currently playing */
                    if (winner_pos > 0 && (winner_pos-5 < loser_pos || loser_pos === -1 || loser_pos === 0)) {
                        chatMessage('/me @' + winner.username + ' won the duel versus @' + loser.username + ' :pogchamp: He gets moved 5 positions up!');

                        /* HANDLE WINNER */
                        var new_pos = _.max([winner_pos-5, 1]);
                        console.info('new_pos: ' + new_pos);
                        move_user(winner.id, new_pos);

                        /* HANDLE LOSER */
                        if (loser_pos === 0) {
                            bot.moderateForceSkip();
                        } else {
                            move_user(loser.id, -1);
                        }

                    } else {
                        chatMessage('/me @' + winner.username + ' won the duel versus @' + loser.username + ' :pogchamp: He wins ' + loser.username + '\'s position (' + loser_pos + ')!');

                        /* HANDLE WINNER */
                        var new_pos = _.max([loser_pos, 1]);
                        console.info('new_pos: ' + new_pos);
                        move_user(winner.id, new_pos);

                        /* HANDLE LOSER */
                        if (loser_pos === 0) {
                            bot.moderateForceSkip();
                        } else {
                            move_user(loser.id, -1);
                        }
                    }
                }, 2500);
            } else {
                console.info('There is no duel request active for you.');
            }
            break;
    }
};
