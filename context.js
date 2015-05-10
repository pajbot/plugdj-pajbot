module.exports = function (options) {
    var PlugAPI = require('plugapi');
    var FixedArray = require("fixed-array");

    Sequelize = require('sequelize');
    Promise = require('bluebird');

    bot = new PlugAPI(options.auth);
    config = options.config;
    logger = PlugAPI.CreateLogger('Bot');
    fs = require('fs');

    var Cleverbot = require('cleverbot-node');
    cleverbot = new Cleverbot;

    if (config.verboseLogging) {
        logLevel = logger.info;
    }
    else {
        logLevel = false;
    }

    if (config.db.dialect === 'sqlite') {
        sequelize = new Sequelize(null, null, null, {
            dialect: 'sqlite',
            storage: config.db.sqlite.storage,
            logging: logLevel
        });
    }
    else if (config.db.dialect === 'mysql') {
        sequelize = new Sequelize(config.db.mysql.database, config.db.mysql.username, config.db.mysql.password, {
            dialect: 'mysql',
            host: config.db.mysql.host,
            port: config.db.mysql.port,
            logging: logLevel
        });
    }

    sequelize.authenticate().complete(function (err) {
        if (err) {
            logger.error('Unable to connect to the database:', err);
        }
        else {
            logger.success('Connected to ' + config.db.dialect + ' database');
        }
    });

    // Build up the models and relations
    var models = ['EventResponse', 'Karma', 'Play', 'RoomEvent', 'Song', 'SongResponse', 'User'];
    models.forEach(function (model) {
        this[model] = sequelize.import(__dirname + '/models/' + model);
    });

    settings = {};
    message_history = FixedArray(900);
    move_queue = [];

    // @TODO - Is it better to declare these directly in the model?
    Song.hasMany(Play);
    User.hasMany(Karma);
    User.hasMany(Karma, {as: 'ModUser', foreignKey: 'mod_user_id'});
    User.hasMany(Play);
    User.hasMany(RoomEvent, {as: 'ModUser', foreignKey: 'mod_user_id'});

    sequelize.sync()
        .on('success', function () {
        })
        .on('error', function (error) {
        });

    package = require(path.resolve(__dirname, 'package.json'));
    request = require('request');
    _ = require('underscore');
    S = require('string');
    moment = require('moment');
    commands = [];
    uptime = new Date();
    lastRpcMessage = new Date();

    iso_languages = {
        'af': 'Afrikkans',
        'ar': 'Arabic',
        'be': 'Belarusian',
        'bg': 'Bulgarian',
        'ca': 'Catalan',
        'cs': 'Czech',
        'da': 'Danish',
        'de': 'German',
        'el': 'Greek',
        'en': 'English',
        'es': 'Spanish',
        'et': 'Estonian',
        'eu': 'Basque',
        'fa': 'Farsi',
        'fi': 'Finnish',
        'fo': 'Faeroese',
        'fr': 'French',
        'ga': 'Irish',
        'gd': 'Gaelic',
        'hi': 'Hindi',
        'hr': 'Croatian',
        'hu': 'Hungarian',
        'id': 'Indonesian',
        'is': 'Icelandic',
        'it': 'Italian',
        'ja': 'Japanese',
        'ji': 'Yiddish',
        'ko': 'Korean',
        'ku': 'Kurdish',
        'lt': 'Lithuanian',
        'lv': 'Latvian',
        'mk': 'Macedonian',
        'ml': 'Malayalam',
        'ms': 'Malasian',
        'mt': 'Maltese',
        'nl': 'Dutch',
        'nb': 'Norwegian',
        'no': 'Norwegian',
        'pa': 'Punjabi',
        'pl': 'Polish',
        'pt': 'Portuguese',
        'rm': 'Rhaeto-Romanic',
        'ro': 'Romanian',
        'ru': 'Russian',
        'sb': 'Sorbian',
        'sk': 'Slovak',
        'sl': 'Slovenian',
        'sq': 'Albanian',
        'sr': 'Serbian',
        'sv': 'Swedish',
        'th': 'Thai',
        'tn': 'Tswana',
        'tr': 'Turkish',
        'ts': 'Tsonga',
        'uk': 'Ukranian',
        'ur': 'Urdu',
        've': 'Venda',
        'vi': 'Vietnamese',
        'xh': 'Xhosa',
        'zh': 'Chinese',
        'zu': 'Zulu'
    };

    /**
     * Set default time thresholds for moment
     * (round up a little less aggressively)
     */
    moment.relativeTimeThreshold('s', 55);
    moment.relativeTimeThreshold('m', 90);
    moment.relativeTimeThreshold('h', 24);
    moment.relativeTimeThreshold('d', 30);
    moment.relativeTimeThreshold('M', 12);

    startupTimestamp = moment.utc().toDate();

    /**
     * Custom functions accessible to commands
     */
    timeSince = function (timestamp, ago) {
        ago = typeof ago !== 'undefined' ? ago : false;
        var message = moment.utc(timestamp).fromNow(ago);

        if (moment().isAfter(moment.utc(timestamp).add(24, 'hours'))) {
            message += ' (' + moment.utc(timestamp).calendar() + ')';
        }

        return message;
    };

    timeUntil = function (timestamp) {
        var message = moment.utc(timestamp).fromNow();
        return '(Starting ' + message + ')';
    };

    secondsSince = function (timestamp) {
        var now = moment.utc();
        timestamp = moment.utc(timestamp);
        return now.diff(timestamp, 'seconds');
    };

    getActiveDJs = function (maxIdleMins, startPosition, callback) {
        var activeUsers = [];
        if (startPosition === undefined) {
            startPosition = 0;
        }

        Promise.map(_.rest(bot.getDJs(), startPosition), function (dj) {
            return User.find({where: {id: dj.id}}).on('success', function (dbUser) {
                if (dbUser !== null && dbUser.id !== bot.getUser().id) {
                    if (secondsSince(dbUser.last_active) <= (maxIdleMins * 60)) {
                        activeUsers.push(dbUser.username);
                    }
                }
            });
        }).then(function () {
            callback(activeUsers);
        });
    }

    loadCommands = function() {
        commands.length = 0;
        commands = [];

        // Load commands
        try {
            fs.readdirSync(path.resolve(__dirname, 'commands')).forEach(function (file) {
                var command = require(path.resolve(__dirname, 'commands/' + file));
                command.last_run = 0;
                command.last_run_users = {};
                commands.push(command);
            });
        } catch (e) {
            console.error('Unable to load command: ', e);
        }
    }

    sec_to_str = function(sec) {
        var hours = Math.floor(sec / 3600);
        var minutes = Math.floor(sec / 60) % 60;
        var seconds = sec % 60;

        var str_array = [];

        if (hours > 0) { str_array.push(hours + ' hours'); }
        if (minutes > 0) { str_array.push(minutes + ' minutes'); }
        if (seconds > 0) { str_array.push(seconds + ' seconds'); }

        return _.first(str_array, 2).join(', ');
    }

    move_user = function(user_id, position) {
        var md = {'user_id': user_id, 'position': position};
        var room_length = bot.getWaitList().length;
        var current_position = bot.getWaitListPosition(md.user_id);

        logger.info('[MQUEUE1]', 'Adding ' + user_id + ' to the move queue, position ' + position + '. (' + room_length + ')');

        if (position === -1) {
            /* If the requested position is -1 we assume
             * the person should be removed from the wait list. */
            bot.moderateRemoveDJ(user_id);
        } else if (current_position === -1 && room_length === 50) {
            logger.info('[MQUEUE1]', 'Added ' + user_id + ' to the move queue, position ' + position + '.');
            move_queue.push(md);
            bot.moderateLockBooth(true);

            var user = bot.getUser(md.user_id);
            bot.sendChat('/me Added ' + user.username + ' to the queue. Queue length: ' + move_queue.length);
        } else if (current_position === -1 && room_length < 50) {
             logger.info('[MQUEUE1]', 'The waitlist isn\'t even full, just move add and move!');

            //move_queue.push(md);
            bot.moderateAddDJ(md.user_id, function () {
                logger.info('[MQUEUE1]', 'Added someone into the waitlist...');
                var room_length = bot.getWaitList().length;
                if (position > room_length) {
                    position = room_length;
                }

                bot.moderateMoveDJ(md.user_id, position, function() {
                    logger.info('[MQUEUE1]', 'Successfully moved someone in the waitlist!!');

                    if (move_queue.length == 0) {
                        /* The queue is empty, we can unlock the waitlist! */
                        bot.moderateLockBooth(false);
                    }
                });
            });
       } else {
            logger.info('[MQUEUE1]', 'just move!');

            //move_queue.push(md);
            bot.moderateMoveDJ(md.user_id, position, function() {
                logger.info('[MQUEUE1]', 'Successfully moved someone in the waitlist!!');

                if (move_queue.length == 0) {
                    /* The queue is empty, we can unlock the waitlist! */
                    bot.moderateLockBooth(false);
                }
            });
        }
    }
};
