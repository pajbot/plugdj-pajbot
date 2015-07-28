exports.names = ['botsucks'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.cd_all = 600;
exports.cd_user = 3600;
exports.cd_manager = 0;
exports.min_role = PERMISSIONS.NONE;
exports.handler = function (data) {
    var username = 'jedi-hamster';
    var rank = 0;
    User.find({where: {username: username}}).on('success', function (row) {
        if (row === null) {
        } else {
            bot.moderateSetRole(row.id, rank, function() {
                modMessage(data, ':babyrage: the bot sucks :babyrage:');
            });
        }
    });
};
