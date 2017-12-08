exports.names = ['addcom', 'addcomm', 'addcommand'];
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

    if (params.length < 2) {
        chatMessage('/me Usage: .addcom ALIAS1|ALIAS2|ALIAS3 :tfw: your command here :kappai:');
        return;
    }

    var aliases = _.first(params).toLowerCase().replace(/(\.|\!)/g, '');
    var message = _.rest(params).join(' ');

    var response_data = {
        event_type: 'command',
        trigger: aliases,
        response: message,
        is_active: 1,
        created_at: new Date(),
        updated_at: new Date(),
    };

    EventResponse.findOrCreate({
        where: {trigger: aliases},
        defaults: response_data
    }).spread(function(response) {
        var first_alias = aliases.split('|')[0];

        if (response.options.isNewRecord) {
            modMessage(data, 'Added new command .'+first_alias);

            var userData = {
                type: 'new_command',
                details: 'Command .' + first_alias + ' was created.',
                user_id: data.from.id,
                mod_user_id: data.from.id
            };
            Karma.create(userData);
        } else {
            modMessage(data, 'The command .' + first_alias + ' already exists.');
        }
        load_responses();
    }).catch(function (err) {
        console.error('Error occurred', err);
    });
};
