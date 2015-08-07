exports.names = ['botsucksbabyrage'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.cd_all = 600;
exports.cd_user = 3600;
exports.cd_manager = 0;
exports.min_role = PERMISSIONS.NONE;
exports.handler = function (data) {
    bot.moderateSetRole(4205958, 0, function() {
        modMessage(data, ':babyrage: the bot still sucks :babyrage:');
    });
};
