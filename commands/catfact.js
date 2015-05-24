exports.names = ['catfact'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.cd_all = 15;
exports.cd_user = 30;
exports.cd_manager = 10;
exports.min_role = PERMISSIONS.RDJ;
exports.handler = function (data) {
    request('http://catfacts-api.appspot.com/api/facts', function (error, response, body) {
        chatMessage(JSON.parse(body).facts[0] + ' :smartcat:');
    });
};
