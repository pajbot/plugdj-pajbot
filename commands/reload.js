exports.names = ['reload'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = true;
exports.cd_all = 10;
exports.cd_user = 30;
exports.cd_manager = 0;
exports.min_role = PERMISSIONS.COHOST;
exports.handler = function (data) {
    modMessage(data, 'Reloading commands...');

    load_responses();
};
