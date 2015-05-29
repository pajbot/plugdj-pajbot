exports.names = ['history'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.cd_all = 15;
exports.cd_user = 30;
exports.cd_manager = 2;
exports.min_role = PERMISSIONS.RDJ;
exports.handler = function (data) {
    var input = data.message.split(' ');
    var command = _.first(input);
    var params = _.rest(input);

    if (params.length != 1) {
        chatMessage('/me Usage: .history X');
        return;
    }

    var offset = parseInt(params);

    if (isNaN(offset) || offset <= 0) {
        chatMessage('/me Usage: .history X');
        return;
    }

    offset -= 1;

    sequelize.query('SELECT `plays`.`id`, `songs`.`format`, `songs`.`cid`, `songs`.`author`, `songs`.`title` FROM `plays` INNER JOIN `songs` ON `songs`.`id`=`plays`.`song_id` ORDER BY `plays`.`id` DESC LIMIT '+offset+',1',
            { type: Sequelize.QueryTypes.SELECT })
        .then(function(rows) {
            if (rows != null && rows.length == 1) {
                var row = rows[0];
                if (row['format'] == 1) {
                    modMessage(data, row['author'] + ' - ' + row['title'] + ' (https://youtu.be/' + row['cid'] + ') played ' + (offset+1) + ' songs ago.');
                } else {
                    var client_id = '73401fe4eb06e6ad2b23368567ed1bae';
                    request('https://api.soundcloud.com/tracks/'+row['cid']+'.json?client_id='+client_id, function (error, response, body) {
                        var json_data = JSON.parse(body);
                        var song_url = json_data.permalink_url;
                        modMessage(data, row['author'] + ' - ' + row['title'] + ' (' + song_url + ') played ' + (offset+1) + ' songs ago.');
                    });
                }
            }
        });
};
