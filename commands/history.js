exports.names = ['.history'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.cd_all = 15;
exports.cd_user = 30;
exports.cd_manager = 5;
exports.handler = function (data) {
    if (data.from.role > 2 || data.from.username == 'PAJLADA') {
        var input = data.message.split(' ');
        var command = _.first(input);
        var params = _.rest(input);

        if (params.length != 1) {
            return;
        }

        var offset = parseInt(params)-1;

        sequelize.query('SELECT `plays`.`id`, `songs`.`format`, `songs`.`cid`, `songs`.`author`, `songs`.`title` FROM `plays` INNER JOIN `songs` ON `songs`.`id`=`plays`.`song_id` ORDER BY `plays`.`id` DESC LIMIT '+offset+',1',
                { type: Sequelize.QueryTypes.SELECT })
            .then(function(rows) {
                if (rows != null && rows.length == 1) {
                    var row = rows[0];
                    if (row['format'] == 1) {
                        bot.sendChat('/me ' + row['author'] + ' - ' + row['title'] + ' (https://youtube.com/watch?v=' + row['cid'] + ') was played ' + (offset+1) + ' songs ago');
                    } else {
                        var client_id = '73401fe4eb06e6ad2b23368567ed1bae';
                        request('https://api.soundcloud.com/tracks/'+row['cid']+'.json?client_id='+client_id, function (error, response, body) {
                            var json_data = JSON.parse(body);
                            var song_url = json_data.permalink_url;
                            bot.sendChat('/me ' + row['author'] + ' - ' + row['title'] + ' (' + song_url + ') was played ' + (offset+1) + ' songs ago');
                        });
                    }

                }
            });
    }
};
