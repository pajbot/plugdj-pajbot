exports.names = ['ban'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.cd_all = 5;
exports.cd_user = 10;
exports.cd_manager = 0;
exports.min_role = PERMISSIONS.MANAGER;
exports.handler = function (data) {
    var input = data.message.split(' ');
    var command = _.first(input);
    var params = _.rest(input);
    var username = '';

    if (params.length >= 2) {
        username = _.initial(params).join(' ').trim();
        duration = _.last(params).toUpperCase();
    } else if (params.length == 1) {
        username = params.join(' ').trim();
        var duration = 'HOUR';
    } else {
        chatMessage('/me Usage: .ban username [PERMA|DAY|HOUR]');
        return;
    }

    var usernameFormatted = S(username).chompLeft('@').s;

    users = bot.getUsers();
    var user = _.findWhere(users, {username: usernameFormatted});

    if (user !== undefined) {
        // Don't let bouncers get too feisty (API should prohibit this, but just making sure!
        if (data.from.role <= ROOM_ROLE.BOUNCER) {
            duration = 'HOUR';
        }

        var duration_string;
        var real_dur = '';

        switch (duration) {
            case 'DAY':
            case 'D':
                duration_string = 'for one day';
                real_dur = 'd';
                break;

            case 'HOUR':
            case 'H':
                duration_string = 'for one hour';
                real_dur = 'h';
                break;

            case 'PERMA':
            case 'P':
                duration_string = 'permanently';
                real_dur = 'f';
                break;

            default:
                chatMessage('/me Usage: .ban username [PERMA|DAY|HOUR]');
                return;
        }

        var r = bot.moderateBanUser(user.id, null, real_dur, function() {
            chatMessage('/me [@' + data.from.username + '] Banned ' + usernameFormatted + ' ' + duration_string + '.');
            logger.info('[BAN] ' + usernameFormatted + ' was banned by ' + data.from.username + ' ' + duration_string);
            var userData = {
                type: 'ban',
                details: 'Banned by ' + data.from.username + ' ' + duration_string,
                user_id: user.id,
                mod_user_id: data.from.id
            };
            Karma.create(userData);
        });

        if (r === false) {
            chatMessage('/me [@' + data.from.userame + '] Couldn\'t ban ' + usernameFormatted + ' for some reason.');
        }
    }
};
