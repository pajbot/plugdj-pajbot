exports.names = ['whois'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.cd_all = 5;
exports.cd_user = 10;
exports.cd_manager = 0;
exports.min_role = PERMISSIONS.BOUNCER;
exports.handler = function (data) {
    var input = data.message.split(' ');
    var params = _.rest(input, 1);
    username = params.join(' ').trim()
    usernameFormatted = S(username).chompLeft('@').s;

    User.find({where: {username: usernameFormatted}}).on('success', function (dbUser) {
        if (dbUser) {
            var rank;
            if (dbUser.global_role > 0) {
                switch (dbUser.global_role) {
                    case 5: rank = 'Admin'; break;
                    case 3: rank = 'Brand Ambassador'; break;
                    default: rank = 'Unknown global role ('+dbUser.global_role+')';
                }
            } else {
                switch (dbUser.role) {
                    case ROOM_ROLE.NONE: rank = 'User'; break;
                    case ROOM_ROLE.RESIDENTDJ: rank = 'Resident DJ'; break;
                    case ROOM_ROLE.BOUNCER: rank = 'Bouncer'; break;
                    case ROOM_ROLE.MANAGER: rank = 'Manager'; break;
                    case ROOM_ROLE.COHOST: rank = 'Co-Host'; break;
                    case ROOM_ROLE.HOST: rank = 'Host'; break;
                    default: rank = 'Unknown role ('+dbUser.role+')'; break;
                }
            }
            var profile = '';
            if (dbUser.slug && dbUser.slug.length > 0) {
                profile = ', Profile: https://plug.dj/@/' + dbUser.slug;
            }
            modMessage(data, 'Username: ' + dbUser.username + ', Joined: ' + dbUser.joined + ', Rank: ' + rank + ', Level: ' + dbUser.level + profile + '.');
        } else {
            modMessage(data, 'No user with the name ' + usernameFormatted + ' found.');
        }
    });
};
