exports.names = ['wave', 'waveform'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.cd_all = 5;
exports.cd_user = 15;
exports.cd_manager = 5;
exports.min_role = PERMISSIONS.BOUNCER;
exports.handler = function (data) {
    var media = bot.getMedia();
    if (!media) {
        return;
    }
    if (media.format == 2) {
        var client_id = config.apiKeys.soundcloud;
        request('https://api.soundcloud.com/tracks/'+media.cid+'.json?client_id='+client_id, function (error, response, body) {
            var json_data = JSON.parse(body);
            modMessage(data, 'Waveform of current song: ' + json_data.waveform_url);
        });
    }
};
