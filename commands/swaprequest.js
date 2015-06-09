exports.names = ['swaprequest', 'swapyes', 'swapno', 'swapaccept', 'swapdecline', 'swapreq'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.cd_all = 5;
exports.cd_user = 5;
exports.cd_manager = 5;

swap_request = false;
swap_last_run_users = {};
var request_time = 15; // How long the person has to accept the swap request in seconds
var last_swap = 0;
var swap_cd = 30; // How often a swap can be run
var swap_request_user_cd = 1; // How often a person can request a swap

exports.handler = function (data) {
    var input = data.message.split(' ');
    var command = _.first(input).substr(1);
    var params = _.rest(input);
    var cur_time = Date.now() / 1000;
    var time_diff = cur_time - last_swap;

    if (swap_cd >= time_diff) {
        /* A swap was run recently */
        logger.info('A swap was run recently made, chill out!');
        logger.info(swap_cd);
        logger.info(time_diff);
        logger.info(last_swap);
        return false;
    }

    logger.info(command);

    switch (command) {
        case 'swaprequest':
        case 'swapreq':
            get_user_by_param(params, function(err, user, db_user) {
                if (user) {
                    var time_diff_user = cur_time;
                    if (data.from.id in swap_last_run_users) {
                        time_diff_user -= swap_last_run_users[data.from.id];
                    }

                    if (swap_request_user_cd >= time_diff_user) {
                        logger.info(data.from.username + ' has already requested a swap in the last ' + swap_request_user_cd + ' seconds, aborting.');
                        return {cd: 1, cd_user: 10};
                    }

                    var current_position = bot.getWaitListPosition(data.from.id);
                    var partner_position = bot.getWaitListPosition(user.id);

                    if (current_position === -1 && partner_position === -1) {
                        logger.info('At least one of you must be in the waitlist to swap!.');
                        modMessage(data, 'You and ' + user.username + ' must be in the waitlist to swap.');
                        /* Someone needs to have a spot in list to swap. */
                        return {cd: 2, cd_user: 10};
                    } else { 
                        if (current_position === 0 || partner_position === 0) {
                            modMessage(data, 'You or ' + user.username + ' can\'t be playing your songs when you want to swap.');
                            /* You must be in the waitlist to swap someone. */
                            return {cd: 2, cd_user: 10};
                        } 
                    }

                    if (user.id === data.from.id) {
                        logger.info('You can\'t swap with yourself...');
                        /* wtf are you doing swapping yourself man */
                        return false;
                    }

                    if (swap_request) {
                        logger.info('There\'s already a swap request active.');
                        return false;
                    }

                    swap_last_run_users[data.from.id] = cur_time;

                    /* This person does not have any swap requests atm */
                    swap_request = {
                        target: user,
                        requestor: data.from,
                        running: false,
                        timeout: setTimeout(function() {
                            modMessage(data, 'Your swap request to ' + user.username + ' has been cancelled, because the target took too long to respond.');
                            swap_request = false;
                        }, request_time * 1000)
                    };

                    chatMessage('/me @' + user.username + ', (' + partner_position + ') you have been requested to swap with ' + data.from.username + ', (' + current_position + ') respond with .swapyes or .swapno');
                }
            });
            break;

        case 'swapno':
        case 'swapdecline':
            if (swap_request && swap_request.target.id === data.from.id && swap_request.running === false) {
                modMessage(data, 'You denied the swap request from @' + swap_request.requestor.username + '.');
                clearTimeout(swap_request.timeout);
                swap_request = false;
            } else {
                logger.info('There is no swap request for you active.');
            }
            break;

        case 'swapyes':
        case 'swapaccept':
            if (swap_request && swap_request.target.id === data.from.id && swap_request.running === false) {
                swap_request.running = true;
                clearTimeout(swap_request.timeout);
                var req = swap_request;

                modMessage(data, 'You accepted the swap request from @' + req.requestor.username + '. Commencing swap!');
                last_swap = cur_time;
                setTimeout(function() {
                    if (swap_request === false) {
                        chatMessage('/me You can now swap again.');
                    }
                }, swap_cd * 1000);
                setTimeout(function() {

                    user_1 = req.requestor;
                    user_2 = req.target;

                    if (user_1 && user_2) {
                        var position_1 = bot.getWaitListPosition(user_1.id);
                        var position_2 = bot.getWaitListPosition(user_2.id);

                        logger.info(position_1);
                        logger.info(position_2);

                        if (position_1 !== -1 || position_2 !== -1) {
                            chatMessage('/me [@' + data.from.username + '] Swapping ' + user_1.username + ' with ' + user_2.username + '.');

                            logger.info(user_1.id + ' to position ' + position_2);
                            logger.info(user_2.id + ' to position ' + position_1);

                            if (position_2 === -1) {
                                move_user(user_2.id, position_1);
                                setTimeout(function() {
                                    move_user(user_1.id, position_2);
                                }, 500);
                            } else {
                                move_user(user_1.id, position_2);
                                setTimeout(function() {
                                    move_user(user_2.id, position_1);
                                }, 500);
                            }
                        }
                    } else {
                        modMessage(data, 'Invalid users specified.');
                    }


                    swap_request = false;
                }, 1000);
            } else {
                logger.info('There is no swap request active for you.');
            }
            break;
    }
};
