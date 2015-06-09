exports.names = ['spam'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = true;
exports.cd_all = 10;
exports.cd_user = 30;
exports.cd_manager = 5;
exports.handler = function (data) {
    if (data.from.username == 'PAJLADA') {
        for (var i=0; i<20; ++i) {
            chatMessage(':tfw: reeeeee ' + i);
        }
    }
};
