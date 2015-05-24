exports.names = ['kill', 'restart'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.cd_all = 5;
exports.cd_user = 10;
exports.cd_manager = 0;
exports.min_role = PERMISSIONS.BOUNCER_PLUS;
exports.handler = function (data) {
    modMessage(data, 'Restarting... :tfw:');
    setTimeout(function() {
        process.kill(process.pid, 'SIGTERM');
    }, 500);
};
