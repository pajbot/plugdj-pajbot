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

        console.log('hello');
        if (media.format == 1) {
            sequelize.query('SELECT `songs`.`created_at` FROM `songs` WHERE `format`=? AND `cid`=? ORDER BY `songs`.`created_at` DESC',
                    { replacements: [media.format, media.cid], type: Sequelize.QueryTypes.SELECT}
                    ).then(function(rows) {
                        console.log(rows);
                        var num_plays = rows.length;
                        if (num_plays > 1) {
                            bot.sendChat('/me [@'+data.from.username+'] This song has been played '+(num_plays-1)+' times in my lifetime, last time being ' + moment.utc(rows[1]['created_at']).calendar() + ' (' + moment.utc(rows[1]['created_at']).fromNow() + ')');
                        } else {
                            bot.sendChat('/me [@'+data.from.username+'] This song has not been played here in my lifetime.');
                        }
                    }
                    );
        } else {
            var num_plays = 0;
            sequelize.query('SELECT `songs`.`created_at` FROM `songs` WHERE `format`=? AND `cid`=? ORDER BY `songs`.`created_at` DESC',
                    { replacements: [media.format, media.cid], type: Sequelize.QueryTypes.SELECT}
                    ).then(function(rows) {
                        num_plays += rows.length;
                    }
                    )
                    .then(function() {
                        sequelize.query('SELECT `created_at` FROM `plays` WHERE `song_id`=? ORDER BY `created_at` DESC',
                                { replacements: [media.format, media.cid], type: Sequelize.QueryTypes.SELECT}
                                ).then(function(rows) {
                                    num_plays += rows.length;
                                }
                                );
                    })
                    .then(function() {
                        if (num_plays > 1) {
                            bot.sendChat('/me [@'+data.from.username+'] This song has been played '+(num_plays-1)+' times in my lifetime.');
                        } else {
                            bot.sendChat('/me [@'+data.from.username+'] This song has not been played here in my lifetime.');
                        }
                    });
        }
    }
};
