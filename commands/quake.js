exports.names = ['.quake', '!quake'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.cd_all = 15;
exports.cd_user = 30;
exports.cd_manager = 10;
exports.handler = function (data) {
    request('http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson', function (error, response, body) {
        if (error) {
            logger.error('Error with the quake api: ' + error);
            return;
        }
        var quakes = JSON.parse(body).features.slice(0, 3);
        chatMessage('/me Recent earthquakes: ' + _.map(quakes, function (quake) {
            var timeElapsed = new Date() - new Date(quake.properties.time);
            return quake.properties.title + ' (' + Math.floor(timeElapsed / 3600000) + 'h ' + Math.floor((timeElapsed % 3600000) / 60000) + 'm ago)';
        }).join(' · '));
    });
};
