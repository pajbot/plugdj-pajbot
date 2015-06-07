exports.names = ['duel', 'accept', 'deny'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.cd_all = 0;
exports.cd_user = 0;
exports.cd_manager = 0;

var duel_requests = [];
var request_time = 30; // How long the person has to accept the duel request in seconds
var last_duel = 0;
var duel_cd = 60; // A duel can only be run every 60 seconds

exports.handler = function (data) {
    var input = data.message.split(' ');
    var command = _.first(input).substr(1);
    var params = _.rest(input);
    var cur_time = Date.now() / 1000;
    var time_diff = cur_time - last_duel;

    if (duel_cd >= time_diff) {
        /* A duel was run recently */
        logger.info('A duel was run recently bro, sry!');
        logger.info(duel_cd);
        logger.info(time_diff);
        logger.info(last_duel);
        return false;
    }

    logger.info(command);

    switch (command) {
        case 'duel':

            get_user_by_param(params, function(err, user, db_user) {
                if (user) {
                    var current_position = bot.getWaitListPosition(data.from.id);
                    var duelee_position = bot.getWaitListPosition(user.id);
                    if (current_position === -1 && duelee_position === -1) {
                        logger.info('You must be in the waitlist to duel someone!.');
                        modMessage(data, 'You or ' + user.username + ' must be in the waitlist to duel.');
                        /* You must be in the waitlist to duel someone. */
                        return {cd: 2, cd_user: 10};
                    } else {
                        /*
                        if (current_position <= 0 && current_position > 40 && duelee_position === -1) {
                            logger.info('You must be above position 40 to duel someone outside the waitlist.');
                            modMessage(data, 'You must be above position 40 to duel someone outside the waitlist.');
                            return {cd: 2, cd_user: 10};
                        } else if (duelee_position <= 0 && duelee_position > 40 && current_position === -1) {
                            logger.info(user.username + ' must be above position 40 to be dueled by you when you\'re outside the waitlist.');
                            modMessage(data, user.username + ' must be above position 40 to be dueled by you when you\'re outside the waitlist.');
                            return {cd: 2, cd_user: 10};
                        }
                        */
                    }
                    if (user.id === data.from.id) {
                        logger.info('You can\'t duel yourself...');
                        /* wtf are you doing dueling yourself man */
                        return false;
                    }

                    var run = true;

                    _.each(duel_requests, function(req) {
                        if (req && req.target && req.target.id === user.id) {
                            run = false;
                            return false;
                        }
                    });

                    if (!run) {
                        logger.info('The person you are trying to duel is already in dueled by someone.');
                        return false;
                    }

                    if (duel_requests[data.from.id] === undefined) {
                        /* This person does not have any duel requests atm */
                        duel_requests[data.from.id] = {
                            target: user,
                            requestor: data.from,
                            timeout: setTimeout(function() {
                                var req = duel_requests[data.from.id];
                                modMessage(data, 'Your duel request to ' + user.username + ' has been cancelled, because the target took too long to respond.');
                                delete duel_requests[data.from.id];
                            }, request_time * 1000)
                        };

                        chatMessage('@' + user.username + ', you have been challenged to a duel by ' + data.from.username + ', type .accept or .deny');
                    }
                }
            });
            break;

        case 'deny':
            for (k in duel_requests) {
                var req = duel_requests[k];
                if (req.target.id === data.from.id) {
                    modMessage(data, 'You denied the duel request from @' + req.requestor.username + '.');
                    clearTimeout(req.timeout);
                    delete duel_requests[data.from.id];
                    break;
                }
            }
            break;

        case 'accept':
            var clear = false;
            for (k in duel_requests) {
                var req = duel_requests[k];
                if (req.target.id === data.from.id) {
                    modMessage(data, 'You accepted the duel request from @' + req.requestor.username + '... Picking a winner...');
                    last_duel = cur_time;
                    clear = true;
                    setTimeout(function() {
                        var users = [];

                        users[0] = req.requestor;
                        users[1] = req.target;

                        var winner_id = _.random(0, 1);

                        var winner  = users[winner_id];
                        var loser = users[winner_id === 0 ? 1 : 0];

                        var winner_pos = bot.getWaitListPosition(winner.id);
                        var loser_pos = bot.getWaitListPosition(loser.id);

                        logger.info('winner pos: ' + winner_pos);
                        logger.info('loser pos: ' + loser_pos);

                        /* If the winner is further in the waitlist than the loser, or if the loser is not in the waitlist, or if the loser is currently playing */
                        if (winner_pos > 0 && (winner_pos < loser_pos || loser_pos === -1 || loser_pos === 0)) {
                            chatMessage('/me @' + winner.username + ' won the duel versus @' + loser.username + ' :pogchamp: He gets moved 5 positions up!');

                            /* HANDLE WINNER */
                            var new_pos = _.max([winner_pos-5, 1]);
                            logger.info('new_pos: ' + new_pos);
                            move_user(winner.id, new_pos);

                            /* HANDLE LOSER */
                            if (loser_pos === 0) {
                                bot.moderateForceSkip();
                            } else {
                                bot.moderateRemoveDJ(loser.id);
                            }

                        } else {
                            chatMessage('/me @' + winner.username + ' won the duel versus @' + loser.username + ' :pogchamp: He wins ' + loser.username + '\'s position ( ' + loser_pos + ')!');

                            /* HANDLE WINNER */
                            var new_pos = _.max([loser_pos, 1]);
                            logger.info('new_pos: ' + new_pos);
                            move_user(winner.id, new_pos);

                            /* HANDLE LOSER */
                            if (loser_pos === 0) {
                                bot.moderateForceSkip();
                            } else {
                                bot.moderateRemoveDJ(loser.id);
                            }
                        }
                    }, 2500);
                    break;
                }
            }

            if (clear) {
                for (k in duel_requests) {
                    var req = duel_requests[k];
                    clearTimeout(req.timeout);
                }

                duel_requests = [];
            }
            break;
    }
};
