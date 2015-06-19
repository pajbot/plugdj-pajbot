exports.names = ['experience', 'xp'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = true;
exports.cd_all = 10;
exports.cd_user = 30;
exports.cd_manager = 5;
exports.min_role = PERMISSIONS.MANAGER;
var exp_table = [
    12,
    33,
    135,
    1170,
    1650,
    5400,
    4100,
    6400,
    7250,
    8725,
    9125,
    11500,
    13725,
    16350,
    24975,
    28740,
];
exports.handler = function (data) {
    var user = bot.getUser();
    if (user) {
        var last_exp_required = _.reduce(_.first(exp_table, user.level-1), function(memo, num) { return memo + num; }, 0);
        var exp_required = _.reduce(_.first(exp_table, user.level), function(memo, num) { return memo + num; }, 0);
        var exp_til_next = exp_required - user.xp;
        var current_level_exp = user.xp - last_exp_required;
        modMessage(data, 'I am currently level ' + user.level + ', I need ' + exp_til_next + ' experience to level up. (' + current_level_exp + '/' + exp_table[user.level-1] + ')');
    }
};
