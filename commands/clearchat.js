exports.names = ['.clearchat', '!clearchat'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.cd_all = 0;
exports.cd_user = 0;
exports.cd_manager = 0;
exports.handler = function (data) {
    logger.info('clearchat called');
    if (data.from.role > 2 || data.from.username == 'PAJLADA') {
        for (var i=0; i<message_history.array.length; ++i) {
            bot.moderateDeleteChat(message_history.array[i]);
        }

        message_history.array.length = 0;

        chatMessage('/me [@' + data.from.username + '] Clearing chat.');
    }
};
