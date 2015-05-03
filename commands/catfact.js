exports.names = ['.catfact'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.cd_all = 15;
exports.cd_user = 30;
exports.cd_manager = 10;
exports.handler = function (data) {
    if (data.from.role > 2 || data.from.username == 'PAJLADA' || data.from.username == 'Klusek' || data.from.username == 'makalkin' || data.from.username == '-DARKSBANE') {
        request('http://catfacts-api.appspot.com/api/facts', function (error, response, body) {
            bot.sendChat(JSON.parse(body).facts[0] + ' :smartcat:');

            if (_.random(1, 100) == 100) {
                setTimeout(function () {
                    bot.sendChat('Isn\'t that cool? :smartcat:');
                }, 5000);
            }
        });
    }
};
