exports.names = ['.dc', '!dc'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.cd_all = 2;
exports.cd_user = 30;
exports.cd_manager = 0;
exports.handler = function (data) {
    if (data.from.role > 2 || data.from.username == 'PAJLADA') {
        var params = _.rest(data.message.split(' '), 1);
        console.log(params);
        var user;
        if (params.length < 1) {
            user = data.from;
        } else {
            username_uf = params.join(' ').trim();
            username = username_uf.replace('@', '');
            console.log(username);
            var _user = _.findWhere(bot.getUsers(), {username: username});
            if (_user) {
                user = _user;
            } else {
                bot.sendChat(username + ' is not here :dansgame:');
                return;
            }
        }
        User.find(user.id).on('success', function (dbUser) {
            var position = bot.getWaitListPosition(user.id);
            /*
            bot.sendChat('seconds since last seen: ' + secondsSince(dbUser.last_leave));
            bot.sendChat('user current position: ' + position);
            bot.sendChat('position in database: ' + dbUser.waitlist_position);
            if (dbUser.waitlist_position > -1) {
                bot.sendChat('move is a yes because db waitlist_position > -1');
            }
            if (secondsSince(dbUser.last_leave) <= settings['dctimer']) {
                bot.sendChat('move is a yes because secondssince <= dctimer');
            }
            if (position === -1 || (position > -1 && position > dbUser.waitlist_position)) {
                bot.sendChat('move is a yes current position is either -1 or the user is in queue and that position is further down than his dc position.');
            }
            */

            if (isNaN(secondsSince(dbUser.last_leave))) {
                bot.sendChat('/me ' + dbUser.username + ' has not disconnected in my presence.');
                return;
            }
            if (isNaN(secondsSince(dbUser.last_leave)) || secondsSince(dbUser.last_leave) > settings['dctimer']) {
                bot.sendChat('/me ' + dbUser.username + '\'s last disconnect (DC or leave) was too long ago: ' + sec_to_str(secondsSince(dbUser.last_leave)));
                return;
            }
            if (dbUser.waitlist_position > -1 && secondsSince(dbUser.last_leave) <= settings['dctimer'] && (position === -1 || (position > -1 && position > dbUser.waitlist_position))) {
                bot.sendChat('/me ' + dbUser.username + ' disconnected ' + timeSince(dbUser.last_leave, true) + ' and should be at position ' + dbUser.waitlist_position);
                move_user(user.id, dbUser.waitlist_position);
                User.update({last_leave: null}, {where: {id: dbUser.id}});
            } else {
                bot.sendChat('/me ' + dbUser.username + ' should not be moved.');
            }
        });

        // Restore spot in line if user has been gone < 15 mins
        /*
        var position = bot.getWaitListPosition(data.id);
        if (!newUser && dbUser.waitlist_position > -1 && secondsSince(dbUser.last_seen) <= 900 && (position === -1 || (position > -1 && position > dbUser.waitlist_position))) {
            bot.moderateAddDJ(data.id, function () {
                if (dbUser.waitlist_position < bot.getWaitList().length && position !== dbUser.waitlist_position) {
                    bot.moderateMoveDJ(data.id, dbUser.waitlist_position);
                    var userData = {
                        type: 'restored',
                        details: 'Restored to position ' + dbUser.waitlist_position + ' (disconnected for ' + timeSince(dbUser.last_seen, true) + ')',
                        user_id: data.id,
                        mod_user_id: bot.getUser().id
                    };
                    Karma.create(userData);

                    setTimeout(function () {
                        //bot.sendChat('/me put @' + data.username + ' back in line :thumbsup:')
                    }, 5000);
                }

            });
        }
        */
    }
};
