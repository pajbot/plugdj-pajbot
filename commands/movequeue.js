exports.names = ['movequeue','showqueue', 'queue', 'dcqueue'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.cd_all = 5;
exports.cd_user = 10;
exports.cd_manager = 5;
exports.min_role = PERMISSIONS.BOUNCER;
exports.handler = function (data) {
    if (move_queue.length == 0) {
        modMessage(data, 'The move queue is empty.');
    } else {
        var strings = [];

        _.each(move_queue, function(md) {
            var user = bot.getUser(md.user_id);
            strings.push(user.username + '(' + md.position + ')');
        });

        modMessage(data, 'Move queue (' + move_queue.length + '): ' + strings.join(', '));
    }
};
