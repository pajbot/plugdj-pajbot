exports.names = ['.lastplay', '!lastplay'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.cd_all = 5;
exports.cd_user = 10;
exports.cd_manager = 5;
exports.handler = function (data) {
    if (data.from.role > 1) {
        var params = _.rest(data.message.split(' '), 1);
        if (params.length < 1) {
            bot.sendChat('/me usage: .lastplay username');
            return;
        }

        username = params.join(' ');
        usernameFormatted = S(username).chompLeft('@').s;

        User.find({where: {username: usernameFormatted}}).on('success', function (dbUser) {
            if (dbUser === null) {
                modMessage(data, usernameFormatted + ' was not found.');
            } else {
                Play.find({where: {user_id: dbUser['id']}}).on('success', function(dbPlay) {
                    if (dbPlay === null) {
                        modMessage(data, usernameFormatted + ' has not played a song in this room.');
                    } else {
                        Song.find({where: {id: dbPlay['song_id']}}).on('success', function(dbSong) {
                            if (dbSong === null) {
                                modMessage(data, usernameFormatted + ' has not played a song in this room.');
                            } else {
                                var song_link = null;
                                if (dbSong['format'] == 1) {
                                    song_link = 'https://youtu.be/' + dbSong['cid'];
                                    modMessage(data, usernameFormatted + ' last played ' + dbSong['author'] + ' - ' + dbSong['title'] + ' (' + song_link + ') ' + moment.utc(dbPlay['created_at']).calendar() + ' (' + moment.utc(dbPlay['created_at']).fromNow() + ')');
                                } else {
                                    var client_id = '73401fe4eb06e6ad2b23368567ed1bae';
                                    request('https://api.soundcloud.com/tracks/'+dbSong['cid']+'.json?client_id='+client_id, function (error, response, body) {
                                        var json_data = JSON.parse(body);
                                        song_link = json_data.permalink_url;
                                        });
                                }
                            }
                        });
                    }
                });
            }
        });
    }
};
