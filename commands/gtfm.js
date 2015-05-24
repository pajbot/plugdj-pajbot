exports.names = ['.gtfm', '!gtfm', '.lmgtfy', '!lmgtfy'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.cd_all = 15;
exports.cd_user = 20;
exports.cd_manager = 5;
exports.handler = function (data) {
    if (data.from.role > 1) {
        var input = data.message.split(' ');
        var command = _.first(input);
        var params = _.rest(input);
        var username = '';

        if (params.length >= 1) {
            var query = encodeURIComponent(params.join(' '));
            modMessage(data, 'Let me google that for you: http://lmgtfy.com/?q='+query);
        }
    }
};
