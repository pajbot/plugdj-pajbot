exports.names = ['muted'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.cd_all = 0;
exports.cd_user = 2;
exports.cd_manager = 0;
exports.min_role = PERMISSIONS.BOUNCER;
exports.handler = function (data) {
    assist(data.message, 'Do not ask for skips. You have been muted for 15 minutes.');
};
