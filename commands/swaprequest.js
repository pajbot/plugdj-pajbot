exports.names = ['swaprequest', 'swapyes', 'swapno', 'swapaccept', 'swapdecline', 'swapreq'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.cd_all = 1;
exports.cd_user = 0;
exports.cd_manager = 0;

swap_request = false;
swap_last_request_users = {};
swap_last_perform_users = {};
var request_time = 15; // How long the person has to accept the swap request in seconds
var last_swap = 0;
var swap_cd = 5; // How often a swap can be run
var swap_request_user_cd = 60; // How often a person can request a swap
var swap_perform_user_cd = 60 * 10; // How often a person can perform a swap

exports.handler = function (data) {
    var input = data.message.split(' ');
    var command = _.first(input).substr(1);
    var params = _.rest(input);
    var cur_time = Date.now() / 1000;
    var time_diff = cur_time - last_swap;

    if (swap_cd >= time_diff) {
        /* A swap was run recently */
        logger.info('A swap was recently made, chill out!');
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
                    if (data.from.id in swap_last_perform_users) {
                        var user_diff = cur_time -= swap_last_perform_users[data.from.id];
                        if (swap_perform_user_cd >= user_diff) {
                            logger.info(data.from.username + ' has already performed a swap in the last ' + swap_perform_user_cd + ' seconds, aborting.');
                            modMessage(data, 'You have already performed a swap in the last ' + sec_to_str(swap_perform_user_cd) + '.');
                            return {cd: 1, cd_user: 60};
                        }
                    }

                    if (data.from.id in swap_last_request_users) {
                        var user_diff = cur_time -= swap_last_request_users[data.from.id];
                        if (swap_request_user_cd >= user_diff) {
                            logger.info(data.from.username + ' has already requested a swap in the last ' + swap_request_user_cd + ' seconds, aborting.');
                            return {cd: 1, cd_user: 10};
                        }
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

                    swap_last_request_users[data.from.id] = cur_time;

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
                swap_last_perform_users[req.requestor.id] = cur_time;

                setTimeout(function() {
                    swap_users(req.requestor, req.target);
                    swap_request = false;
                }, 1000);
            } else {
                logger.info('There is no swap request active for you.');
            }
            break;
    }
};
