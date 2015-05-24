exports.names = ['lock'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.cd_all = 0;
exports.cd_user = 0;
exports.cd_manager = 0;
exports.min_role = PERMISSIONS.BOUNCER_PLUS;
exports.handler = function (data) {
    bot.moderateLockBooth(true, false, function() {
        modMessage(data, 'Locked waitlist.');
    });
};
