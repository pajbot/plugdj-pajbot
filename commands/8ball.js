exports.names = ['8ball'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = true;
exports.cd_all = 10;
exports.cd_user = 30;
exports.cd_manager = 10;
exports.min_role = PERMISSIONS.NONE;
var responses = [
    "Trump point to yes :trumpw:.",
    "Yes.",
    "Reply hazy, try again.",
    "Without a doubt.",
    "My sources say no.",
    "As I see it, yes.",
    "You may rely on it.",
    "Concentrate and ask again.",
    "Outlook not so good :tfw:.",
    "It is decidedly so.",
    "Better not tell you now.",
    "Very doubtful.",
    "Yes - definitely.",
    "It is certain.",
    "Cannot predict now.",
    "Most likely.",
    "Ask again later.",
    "My reply is no.",
    "Outlook good.",
    "Don't count on it.",
    "Yes, in due time.",
    "My sources say no.",
    "Definitely not.",
    "You will have to wait.",
    "I have my doubts.",
    "Outlook so so.",
    "Looks good to me!",
    "Who knows?",
    "Looking good!",
    "Probably.",
    "Sure :kappa:.",
    "Are you kidding? :elegiggle:",
    "Don't bet on it.",
    "Forget about it.",
    "I don't see the value."
    ];
exports.handler = function (data) {
    var url_regex = /(https?:\/\/[^\s]+)/g;
    var rest = _.rest(data.message.split(' '), 1).join(' ');
    if (rest.length < 3) {
        return false;
    }
    var response = responses[Crypto_rand.randInt(0, responses.length-1)];
    var re = new RegExp('@', 'g');
    var question = rest.replace(re, '');
    question = question.replace(url_regex, '');
    chatMessage('/me ' + data.from.username + '\'s question was: "' + question + '" and Trump\'s response is: \"' + response + '\"');
};
