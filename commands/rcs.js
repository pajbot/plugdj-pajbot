exports.names = ['rcs'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.cd_all = 15;
exports.cd_user = 30;
exports.cd_manager = 10;
exports.handler = function (data) {				
    assist(data.message, 'For Twitch Emotes, Autojoin and more on plug.dj, get https://rcs.radiant.dj/');
};
