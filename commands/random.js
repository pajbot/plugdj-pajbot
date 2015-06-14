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
    var result = '';

    if (input.length >= 2) {
        var from = 1;
        var to = 100;

        if (input.length >= 3) {
            from = parseInt(input[1]);
            to = parseInt(input[2]);
        } else {
            to = parseInt(input[1]);
        }

        if (isNaN(from) || isNaN(to)) {
            return false;
        }

        result = _.random(from, to);
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
