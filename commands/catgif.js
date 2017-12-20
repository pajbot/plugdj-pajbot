exports.names = ['catgif'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.cd_all = 15;
exports.cd_user = 30;
exports.cd_manager = 10;
exports.min_role = PERMISSIONS.RDJ;
exports.handler = function (data) {
        request('http://thecatapi.com/api/images/get?type=gif', function (error, response, body) {
            try {
                chatMessage(response.request.uri.href);
            } catch (e) {
                console.log(e);
            }
        });
};
