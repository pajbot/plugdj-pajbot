exports.names = ['noskip'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = true;
exports.cd_all = 1;
exports.cd_user = 2;
exports.cd_manager = 0;
exports.min_role = PERMISSIONS.BOUNCER;
exports.handler = function (data) {
    assist(data.message, 'Don\'t ask for skips, or you\'ll get muted :smorc:');
};
