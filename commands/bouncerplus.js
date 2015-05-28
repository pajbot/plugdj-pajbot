exports.names = ['bouncerplus', 'bplus', 'bouncer+'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.cd_all = 0;
exports.cd_user = 0;
exports.cd_manager = 0;
exports.min_role = PERMISSIONS.MANAGER;
exports.handler = function (data) {
    setting_handle('bouncerplus', data);
};
