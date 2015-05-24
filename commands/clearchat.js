exports.names = ['clearchat'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.cd_all = 0;
exports.cd_user = 0;
exports.cd_manager = 0;
exports.min_role = PERMISSIONS.MANAGER;
exports.handler = function (data) {
    for (var i=message_history.array.length-1; i>0; --i) {
        bot.moderateDeleteChat(message_history.array[i]);
    }

    message_history.array.length = 0;

    modMessage(data, 'Clearing chat.');
};
