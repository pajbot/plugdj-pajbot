exports.names = ['dc', 'dclookup'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.cd_all = 2;
exports.cd_user = 30;
exports.cd_manager = 0;
exports.min_role = PERMISSIONS.NONE;
exports.handler = function (data) {
    var params = _.rest(data.message.split(' '), 1);
    var user;
    if (params.length < 1 || data.from.role < ROOM_ROLE.BOUNCER) {
        user = data.from;
    } else {
        username_uf = params.join(' ').trim();
        username = username_uf.replace(/@/g, '');
        console.log(username);
        var _user = _.findWhere(bot.getUsers(), {username: username});
        if (_user) {
            user = _user;
        } else {
            chatMessage(username + ' is not here :dansgame:');
            return;
        }
    }
    User.find(user.id).on('success', function (dbUser) {
        var position = bot.getWaitListPosition(user.id);
        logger.info('seconds since last seen: ' + secondsSince(dbUser.last_leave));
        logger.info('user current position: ' + position);
        logger.info('position in database: ' + dbUser.waitlist_position);
        if (dbUser.waitlist_position > -1) {
            logger.info('move is a yes because db waitlist_position > -1');
        }
        if (secondsSince(dbUser.last_leave) <= settings['dctimer']) {
            logger.info('move is a yes because secondssince <= dctimer');
        }
        if (position === -1 || (position > -1 && position > dbUser.waitlist_position)) {
            logger.info('move is a yes current position is either -1 or the user is in queue and that position is further down than his dc position.');
        }

        if (isNaN(secondsSince(dbUser.last_leave))) {
            chatMessage('/me ' + dbUser.username + ' has not disconnected in my presence.');
            return;
        }
        if (secondsSince(dbUser.last_leave) > settings['dctimer']) {
            chatMessage('/me ' + dbUser.username + '\'s last disconnect (DC or leave) was too long ago: ' + sec_to_str(secondsSince(dbUser.last_leave)));
            return;
        }
        if (dbUser.waitlist_position > -1 && secondsSince(dbUser.last_leave) <= settings['dctimer'] && (position === -1 || (position > -1 && position > dbUser.waitlist_position))) {
            chatMessage('/me ' + dbUser.username + ' disconnected ' + timeSince(dbUser.last_leave, true) + ' and should be at position ' + dbUser.waitlist_position);
            move_user(user.id, dbUser.waitlist_position);
            //User.update({last_leave: null}, {where: {id: dbUser.id}});
        } else {
            chatMessage('/me ' + dbUser.username + ' should not be moved.');
        }
    });
};
