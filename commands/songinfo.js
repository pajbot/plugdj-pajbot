exports.names = ['.songinfo', '!songinfo'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.cd_all = 30;
exports.cd_user = 30;
exports.cd_manager = 10;
exports.handler = function (data) {
    if (data.from.role > 1 || data.from.username == 'PAJLADA') {
        var media = bot.getMedia();
        if (media == null) {
            modMessage(data, 'No song playing. :wutface:');
            return;
        }

        Song.findAll({
            where: {
                format: media.format,
                cid: media.cid,
            },
            order: 'updated_at DESC'
        }).on('success', function (rows) {
            if (rows && rows.length > 0) {
                var song_ids = [];
                _.each(rows, function (row) {
                    song_ids.push(row.id);
                });

                Play.findAll({
                    where: { song_id: song_ids },
                    order: 'updated_at DESC'
                }).on('success', function (rows) {
                    if (rows && rows.length > 0) {
                        modMessage(data, 'This song has been played '+(rows.length)+' times in my lifetime, last time being ' + moment.utc(rows[0]['updated_at']).calendar() + ' (' + moment.utc(rows[0]['updated_at']).fromNow() + ')');
                    } else {
                        modMessage(data, 'This song has not been played here in my lifetime.');
                    }
                });
            } else {
                modMessage(data, 'This song has not been played here in my lifetime.');
            }
        });
    }
};
