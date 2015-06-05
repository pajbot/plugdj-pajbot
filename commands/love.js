exports.names = ['love'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.cd_all = 3;
exports.cd_user = 10;
exports.cd_manager = 3;
exports.min_role = PERMISSIONS.NONE;
exports.handler = function (data) {
    var params = _.rest(data.message.split(' '), 1);
    if (params.length < 1) {
        return false;
    }
    username = params.join(' ').trim()
    usernameFormatted = S(username).chompLeft('@').s;

    User.find({
        where: {username: usernameFormatted}
    }).on('success', function (dbUser) {
        if (dbUser) {
            if (dbUser.id === data.from.id) {
                return false;
            }
            var min = Math.min(data.from.id, dbUser.id);
            var max = Math.max(data.from.id, dbUser.id);
            var love = Math.round(Noise.noise2f(min, max) * 100);
            var msg = '';
            if (love <= 10) {
                msg = 'You\'re not destined to love ' + dbUser.username + ' :tfw:';
            } else if (love <= 30) {
                msg = 'You have a tough road ahead of you with ' + dbUser.username;
            } else if (love >= 80) {
                msg = 'You have a lot of love with ' + dbUser.username + ' :nb3h:';
            } else if (love == 69) {
                msg = 'Your love with ' + dbUser.username + ' could work :kreygasm:';
            } else {
                msg = 'Your love with ' + dbUser.username + ' could work :legit:';
            }
            modMessage(data, msg + ' (' + love + '%)');
        } else {
            return false;
        }
    });
};
