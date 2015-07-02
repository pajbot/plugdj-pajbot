exports.names = ['songinfo'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.cd_all = 30;
exports.cd_user = 30;
exports.cd_manager = 5;
exports.min_role = PERMISSIONS.NONE;

function do_history(data, format, cid, songs_ago)
{
    if (!cid || !format) {
        sendMessage('/me :tfw: MFW no song');
        return;
    }

    Song.findAll({
        where: {
            format: format,
            cid: cid,
        },
        order: 'updated_at DESC'
    }).on('success', function (rows) {
        logger.info(rows);
        if (rows && rows.length > 0) {
            var song_ids = [];
            _.each(rows, function (row) {
                song_ids.push(row.id);
            });
            logger.info(song_ids);

            Play.findAll({
                where: { song_id: song_ids },
                order: 'updated_at DESC'
            }).on('success', function (rows) {
                logger.info(rows);
                if (format == 1) {
                    var prefix = 'This song';
                    if (songs_ago >= 0) {
                        prefix = 'The song that played ' + (songs_ago+1) + ' songs ago (https://youtu.be/' + cid + ')';
                    }
                    if (rows && rows.length > 0) {
                        modMessage(data, prefix + ' has been played '+(rows.length)+' times in my lifetime, last time being ' + moment.utc(rows[0]['updated_at']).calendar() + ' (' + moment.utc(rows[0]['updated_at']).fromNow() + ')');
                    } else {
                        modMessage(data, prefix + ' has not been played here in my lifetime.');
                    }
                } else {
                    soundcloud_get_track(cid, function (json_data) {
                        var song_url = json_data.permalink_url;
                        var prefix = 'This song';
                        if (songs_ago >= 0) {
                            prefix = 'The song that played ' + (songs_ago+1) + ' songs ago (' + song_url + ')';
                        }
                        if (rows && rows.length > 0) {
                            modMessage(data, prefix + ' has been played '+(rows.length)+' times in my lifetime, last time being ' + moment.utc(rows[0]['updated_at']).calendar() + ' (' + moment.utc(rows[0]['updated_at']).fromNow() + ')');
                        } else {
                            modMessage(data, prefix + ' has not been played here in my lifetime.');
                        }
                    });
                }
            });
        } else {
            modMessage(data, 'This song has not been played here in my lifetime.');
        }
    });
}

exports.handler = function (data) {
    var input = data.message.split(' ');
    var command = _.first(input);
    var params = _.rest(input);
    var offset = false;
    var cid = false;
    var format = false;

    if (params.length >= 1) {
        var tmp_offset = parseInt(params);

        if (!isNaN(tmp_offset) && tmp_offset >= 1) {
            offset = tmp_offset-1;
        }
    }

    var media = bot.getMedia();
    if (media == null) {
        offset = 0;
    } else {
        cid = media.cid;
        format = media.format;
    }

    if (offset !== false) {
        logger.info('offset: ' + offset);
        sequelize.query('SELECT `plays`.`id`, `songs`.`format`, `songs`.`cid`, `songs`.`author`, `songs`.`title` FROM `plays` INNER JOIN `songs` ON `songs`.`id`=`plays`.`song_id` ORDER BY `plays`.`id` DESC LIMIT '+offset+',1',
                { type: Sequelize.QueryTypes.SELECT })
            .then(function(rows) {
                logger.info(rows);
                if (rows != null && rows.length == 1) {
                    var row = rows[0];
                    logger.info(row);
                    cid = row['cid'];
                    format = row['format'];
                }
            }).then(function() {
                do_history(data, format, cid, offset);
            });
    } else {
        do_history(data, format, cid, -1);
    }
};
