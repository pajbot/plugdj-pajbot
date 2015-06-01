exports.names = ['link'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.cd_all = 5;
exports.cd_user = 15;
exports.cd_manager = 5;
exports.min_role = PERMISSIONS.NONE;
exports.handler = function (data) {
    var media = bot.getMedia();
    if (media.format == 1) {
        modMessage(data, 'Link to current song: https://youtu.be/' + media.cid);
    } else {
        var client_id = config.apiKeys.soundcloud;
        request('https://api.soundcloud.com/tracks/'+media.cid+'.json?client_id='+client_id, function (error, response, body) {
            var json_data = JSON.parse(body);
            var song_url = json_data.permalink_url;
            modMessage(data, 'Link to current song: ' + song_url);
        });
    }
};
