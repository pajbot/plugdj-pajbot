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
        soundcloud_get_track(media.cid, function (json_data) {
            modMessage(data, 'Waveform of current song: ' + json_data.waveform_url);
        });
    }
};
