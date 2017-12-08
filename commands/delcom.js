exports.names = ['delcom', 'delcomm', 'delcommand', 'remcom', 'remcomm', 'remcommand'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.cd_all = 5;
exports.cd_user = 10;
exports.cd_manager = 0;
exports.min_role = PERMISSIONS.COHOST;
exports.handler = function (data) {
    var input = data.message.split(' ');
    var command = _.first(input);
    var params = _.rest(input);

    if (params.length != 1) {
        chatMessage('/me Usage: .delcom ALIAS1|ALIAS2|ALIAS3');
        return;
    }

    var aliases = _.first(params).toLowerCase().replace(/(\.|\!)/g, '');

    EventResponse.destroy({
        where: {trigger: aliases}
    }).on('success', function(response) {
        var first_alias = aliases.split('|')[0];

        if (response === 1) {
            modMessage(data, 'Removed command .'+first_alias);

            var userData = {
                type: 'del_command',
                details: 'Command .' + first_alias + ' was deleted.',
                user_id: data.from.id,
                mod_user_id: data.from.id
            };
            Karma.create(userData);

            load_responses();
        } else {
            modMessage(data, 'The command .'+aliases.split('|')[0] + ' doesn\'t exist!');
        }
    }).catch(function (err) {
        console.error('Error occurred', err);
    });
};
