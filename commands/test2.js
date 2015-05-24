exports.names = ['.test2', '!test2'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.cd_all = 0;
exports.cd_user = 0;
exports.cd_manager = 0;
exports.min_role = PERMISSIONS.RDJ;
exports.handler = function (data) {
    logger.info('[TEST]', 'Test command run by ' + data.from.username);
};
