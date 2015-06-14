exports.names = ['random', 'rng'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.cd_all = 15;
exports.cd_user = 60;
exports.cd_manager = 0;
exports.min_role = PERMISSIONS.NONE;
exports.handler = function (data) {
    var input = data.message.split(' ');
    var range = _.last(input);
    var result = '';

    if (input.length >= 2) {
        result = _.random(1, range);
    } else { 
        var x = _.random(1, 2);
        if (x === 1) {
            result = 'Heads';
        } else {
            result = 'Tails';
        }
    };
    chatMessage('/me [@' + data.from.username + '] Your random result is: ' + result + '.');
};
