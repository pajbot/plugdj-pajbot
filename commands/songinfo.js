exports.names = ['.songinfo', '!songinfo'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.cd_all = 30;
exports.cd_user = 30;
exports.cd_manager = 10;
exports.handler = function (data) {
    if (data.from.role > 1 || data.from.username == 'PAJLADA') {
        var songId;
        media = bot.getMedia();
        if (media == null) {
            bot.sendChat('No song playing.');
            return;
        }

        var song_ids = [];
        Song.findAll({
            where: {
                format: media.format,
                cid: media.cid,
            },
            order: 'updated_at DESC'
        }).on('success', function (rows) {
            if (rows && rows.length > 0) {
                _.each(rows, function (row) {
                    song_ids.push(row.id);
                });

                Play.findAll({
                    where: { song_id: song_ids },
                    order: 'updated_at DESC'
                }).on('success', function (rows) {
                    if (rows && rows.length > 0) {
                        var num_plays = rows.length;

                        modMessage(data, 'This song has been played '+(num_plays-1)+' times in my lifetime, last time being ' + moment.utc(rows[1]['updated_at']).calendar() + ' (' + moment.utc(rows[1]['updated_at']).fromNow() + ')');
                    }
                });
            } else {
                modMessage(data, 'This song has not been played here in my lifetime.');
            }
        });
    }
};
