exports.names = ['.kill'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.cd_all = 5;
exports.cd_user = 10;
exports.cd_manager = 0;
exports.handler = function (data) {
    if (data.from.role > 2 || data.from.username == 'PAJLADA') {
        modMessage(data, 'Restarting... :tfw:');
        setTimeout(function() {
            process.kill(process.pid, 'SIGTERM');
        }, 500);
    }
};
