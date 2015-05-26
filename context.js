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

    ROOM_ROLE = {
        NONE: 0,
        RESIDENTDJ: 1,
        BOUNCER: 2,
        MANAGER: 3,
        COHOST: 4,
        HOST: 5
    };

    PERMISSIONS = {
        NONE: 0,
        RDJ: 1,
        BOUNCER: 2,
        BOUNCER_PLUS: 2.5,
        MANAGER: 3,
        COHOST: 4,
        HOST: 5
    }

    settings = {
        'autoskip': false,
        'timeguard': false,
        'motd': 'u wot m8?',
        'motd_interval': 10,
        'dctimer': 20 * 60,
        'maxlength': 330,
        'lockdown': false,
        'cleverbot': false,
        'lockskippos': 3,
        'bouncerplus': false,
        'rdjtest': false
    };
    setting_names = {
        'autoskip': 'Autoskip',
        'timeguard': 'Timeguard',
        'motd': 'MotD',
        'motd_interval': 'MotD interval',
        'dctimer': 'DC timer',
        'maxlength': 'Max length',
        'lockdown': 'Lockdown',
        'cleverbot': 'Cleverbot',
        'lockskippos': 'Lock skip position',
        'bouncerplus': 'Bouncer+',
        'rdjtest': 'RDJ test'
    };
    message_history = FixedArray(900);
    move_queue = [];
    add_to_waitlist_history = {};
    room_locked = false; /* XXX: Is there a way for us to get the room locked status on connect? */

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

    timeUntil = function (timestamp, prefixMessage) {
        var message = moment.utc(timestamp).fromNow();
        if(prefixMessage !== undefined) {
            return '(' + prefixMessage + ' ' + message + ')';
        }
        else {
            return '(' + message + ')';
        }

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
                        activeUsers.push(dbUser.id);
                    }
                }
            });
        }).then(function () {
            callback(activeUsers);
        });
    }

    hasAccess = function(user, min_role) {
        if (user.role == PlugAPI.ROOM_ROLE.BOUNCER) {
            return (user.role >= min_role || (min_role == PERMISSIONS.BOUNCER_PLUS && settings['bouncerplus']));
        }

        return user.role >= min_role;
    }

    loadCommands = function() {
        commands.length = 0;
        commands = [];

        // Load commands
        try {
            fs.readdirSync(path.resolve(__dirname, 'commands')).forEach(function (file) {
                var command = require(path.resolve(__dirname, 'commands/' + file));

                var new_names = [];

                _.each(command.names, function(alias) {
                    var first_char = alias.charAt(0);
                    if (first_char !== '.' && first_char !== '!') {
                        new_names.push('.' + alias);
                        new_names.push('!' + alias);
                    } else {
                        new_names.push(alias);
                    }
                });

                command.names = new_names;
                command.last_run = 0;
                command.last_run_users = {};

                if (command.min_role === undefined) {
                    command.min_role = PERMISSIONS.NONE;
                }
                commands.push(command);
            });
        } catch (e) {
            console.error('Unable to load command: ', e);
        }
    }

    sec_to_str = function(sec) {
        var days = Math.floor(sec / 86400);
        var hours = Math.floor(sec / 3600) % 24;
        var minutes = Math.floor(sec / 60) % 60;
        var seconds = sec % 60;

        var str_array = [];

        if (days > 0) { str_array.push(days + ' days'); }
        if (hours > 0) { str_array.push(hours + ' hours'); }
        if (minutes > 0) { str_array.push(minutes + ' minutes'); }
        if (seconds > 0) { str_array.push(seconds + ' seconds'); }

        return _.first(str_array, 2).join(', ');
    }

    move_user = function(user_id, new_position) {
        var md = {'user_id': user_id, 'position': new_position};
        var room_length = bot.getWaitList().length;
        var current_position = bot.getWaitListPosition(md.user_id);
        var in_queue = false;

        logger.info('[MQUEUE1]', 'Adding ' + user_id + ' to the move queue, position ' + new_position + '. (' + room_length + ')');

        _.each(move_queue, function(_md) {
            if (_md.user_id === user_id) {
                in_queue = true;
                _md.position = new_position;
            }
        });

        if (in_queue) {
            var user = bot.getUser(user_id);
            logger.info('[MQUEUE1]', user.username + ' is in the queue already, changing desired position to ' + new_position + '.');
            chatMessage('/me ' + user.username + ' is already in the queue, changing desired position to ' + new_position + '.');
            return;
        }

        /* If the user is out of the waitlist, and the waitlist is full (50 or more)
         * we add the user to the move queue instead. */
        if (current_position === 0 || (current_position === -1 && room_length >= 50)) {
            logger.info('[MQUEUE1]', 'Added ' + user_id + ' to the move queue, position ' + new_position + '.');
            move_queue_push(md);
            return;
        }

        process_move_event(md);
    }

    move_queue_push = function(md) {
        move_queue.push(md);
        bot.moderateLockBooth(true);

        var user = bot.getUser(md.user_id);
        var room_length = bot.getWaitList().length;
        var current_position = bot.getWaitListPosition(md.user_id);
        if (user) {
            chatMessage('/me Added ' + user.username + ' to the queue. Queue length: ' + move_queue.length);
        }
    }

    move_queue_remove = function(md) {
        move_queue = _.without(move_queue, md);

        if (move_queue.length == 0) {
            logger.info('[MQUEUE]', 'Unlocking booth. (move_queue_remove)');
            bot.moderateLockBooth(false, false, function() {
                logger.info('[MQUEUE]', 'Successfully unlocked booth. (move_queue_remove)');
            });
        }
    }

    process_move_event = function(md) {
        var current_position = bot.getWaitListPosition(md.user_id);
        var new_position = md.position;
        var room_length = bot.getWaitList().length;
        var user = bot.getUser(md.user_id);

        if (!user) {
            chatMessage('/me Removing ' + md.user_id + ' from movement queue, because he\'s not here.');
            move_queue_remove(md);
            return;
        }

        if (new_position > room_length) {
            new_position = room_length;
        }

        /* We're trying to move the user to the same position, just assume we're done! */
        if (current_position === new_position) {
            logger.info('[MQUEUE]', 'Trying to move ' + user.username + ' from ' + current_position + ' to ' + new_position + ', skipping.');
            move_queue_remove(md);
            return false;
        }

        /* If the requested position is -1 we assume
         * the person should be removed from the wait list. */
        if (new_position === -1) {
            logger.info('[MQUEUE]', 'Removing ' + user.username + ' from the waitlist.');
            bot.moderateRemoveDJ(md.user_id, function() {
                logger.info('[MQUEUE]', 'Successfully removed ' + user.username + ' from the waitlist.');
                move_queue_remove(md);
            });
            return true;
        }

        if (current_position === 0) {
            logger.info('[MQUEUE]', user.username + ' is currently playing...');
            if (move_queue.length > 1) {
                var cur_md = move_queue.shift();
                move_queue.push(cur_md);
            }
        } else if (current_position === -1) {
            /* The user is not in queue, for us to move this person,
             * we need to have a free spot in the wait list. */
            if (room_length !== 50) {
                logger.info('[MQUEUE]', 'Adding ' + user.username + ' to the queue. (1)');
                add_to_waitlist_history[user.id] = true;
                bot.moderateAddDJ(md.user_id, function () {
                    add_to_waitlist_history[user.id] = true;
                    setTimeout(function() {
                        add_to_waitlist_history[user.id] = false;
                    }, 1000);
                    logger.info('[MQUEUE]', 'Successfully added ' + user.username + ' to the queue! (1)');

                    logger.info('[MQUEUE]', 'Moving ' + user.username + ' from ' + current_position + ' to ' + new_position + '. (1)');
                    setTimeout(function() {
                        bot.moderateMoveDJ(md.user_id, new_position, function() {
                            move_queue_remove(md);

                            User.update({waitlist_position: new_position}, {where: {id: md.user_id}});
                            logger.info('[MQUEUE]', 'Successfully moved ' + user.username + ' from ' + current_position + ' to ' + new_position + '. (1)');

                            if (move_queue.length == 0) {
                                /* The queue is empty, we can unlock the waitlist! */
                                logger.info('[MQUEUE]', 'Unlocking booth. (1)');
                                bot.moderateLockBooth(false, false, function() {
                                    logger.info('[MQUEUE]', 'Successfully unlocked booth. (1)');
                                });
                            } else {
                                logger.info('[MQUEUE]', 'Move queue is not empty, not unlocking booth. (1)');
                                logger.info(move_queue);
                            }
                        });
                    }, 250);
                });
            }
        } else {
            logger.info('[MQUEUE]', 'Moving ' + user.username + ' from ' + current_position + ' to ' + new_position + '. (2)');
            bot.moderateMoveDJ(md.user_id, new_position, function() {
                logger.info('[MQUEUE]', 'Successfully moved ' + user.username + ' from ' + current_position + ' to ' + new_position + '. (2)');

                move_queue_remove(md);

                User.update({waitlist_position: new_position}, {where: {id: md.user_id}});
            });
        }
    }

    message_out_history = [];
    message_queue = [];

    chatMessage = function(message, timeout, add_to_queue) {
        if (timeout === undefined) {
            timeout = 0;
        }
        if (add_to_queue === undefined) {
            add_to_queue = true;
        }
        if (message_out_history.length < 4) {
            logger.info('[MSG]', 'Sending chat message: ' + message);
            bot.sendChat(message, timeout);

            message_out_history.push(1);

            setTimeout(function() {
                message_out_history.shift();
            }, 3000);

            return true;
        } else if (add_to_queue === true) {
            logger.info('[MSG]', 'Chat history is full, queueing up ' + message);
            message_queue.push({'message': message, 'timeout': timeout});
        } else {

        }

        return false;
    }

    setInterval(function() {
        if (message_queue.length > 0) {
            logger.info('[MSG]', 'There\'s a message in the queue. (' + message_queue.length + ')');
            var msg = message_queue[0];

            if (chatMessage(msg.message, msg.timeout, false) === true) {
                message_queue.shift();
                logger.info('[MSG]', 'Sent message from queue! New queue length: ' + message_queue.length);
            }
        }
    }, 250);

    modMessage = function(data, message) {
        chatMessage('/me [@' + data.from.username + '] ' + message);
    }

    setting_value_verbose = function(id) {
        if (id in settings) {
            switch (id) {
                case 'maxlength':
                case 'dctimer':
                    return sec_to_str(setting_value(id));
                    break;

                default:
                    return setting_value(id);
                    break;
            }
        }

        return '?';
    }

    setting_value = function(id) {
        if (id in settings) {
            var type = typeof settings[id];

            switch (type) {
                case 'boolean':
                    if (settings[id]) {
                        return 'enabled';
                    } else {
                        return 'disabled';
                    }
                    break;

                default:
                    return settings[id];
                    //logger.error('setting_value is not implemented for ' + type);
                    break;
            }
        }
    }

    set_setting = function(id, value, data) {
        if (id in settings) {
            var old_value = settings[id];
            settings[id] = value;

            var type = typeof settings[id];

            if (type === 'boolean') {
                if (value) {
                    value = '1';
                } else {
                    value = '0';
                }
                if (old_value) {
                    old_value = '1';
                } else {
                    old_value = '0';
                }
            }

            sequelize.query('UPDATE `settings` SET `value`=? WHERE `id`=?',
                    { replacements: [value, id] });

            var userData = {
                type: 'setting_change',
                details: 'Setting ' + id + ' changed from ' + old_value + ' to ' + value + ' by ' + data.from.username,
                user_id: data.from.id,
                mod_user_id: data.from.id
            };
            Karma.create(userData);
        }
    }

    /**
     * This handles all setting changes from user commands.
     *
     * setting_handle('autoskip', data) will be called on .autoskip
     * The function will then read all additional parameters and make sure the
     * setting is properly updated in the database if it is changed.
     **/
    setting_handle = function(id, data) {
        if (id in settings) {
            var params = _.rest(data.message.split(' '), 1);
            var name = id;
            if (id in setting_names) {
                name = setting_names[id];
            }

            var type = typeof settings[id];

            if (params.length < 1) {
                switch (type) {
                    case 'boolean':
                        set_setting(id, !settings[id], data);
                        modMessage(data, name + ' is now ' + setting_value(id) + '.');
                        break;

                    default:
                        modMessage(data, name + ': ' + setting_value(id));
                        break;
                }
            } else {
                var msg = params.join(' ').trim();
                switch (type) {
                    case 'boolean':
                        switch (msg.toLowerCase()) {
                            case 'on':
                            case '1':
                                if (settings[id] === true) {
                                    modMessage(data, name + ' is already ' + setting_value(id) + '.');
                                } else {
                                    set_setting(id, true, data);
                                    modMessage(data, name + ' is now ' + setting_value(id) + '.');
                                }
                                break;

                            case 'off':
                            case '0':
                                if (settings[id] === false) {
                                    modMessage(data, name + ' is already ' + setting_value(id) + '.');
                                } else {
                                    set_setting(id, false, data);
                                    modMessage(data, name + ' is now ' + setting_value(id) + '.');
                                }
                                break;

                            case 'status':
                                modMessage(data, name + ' is currently ' + setting_value(id) + '.');
                                break;

                            default:
                                set_setting(id, !settings[id], data);
                                modMessage(data, name + ' is now ' + setting_value(id) + '.');
                                break;
                        }
                        break;

                    case 'string':
                        if (msg.length > 0) {
                            set_setting(id, msg, data);
                            modMessage(data, name + ' changed to: ' + setting_value(id));
                        }
                        break;

                    case 'number':
                        set_setting(id, parseInt(msg), data);
                        modMessage(data, name + ' changed to: ' + setting_value(id));
                        break;

                    default:
                        logger.error('Unhandled type: ' + type);
                        break;
                }
            }
        } else {
            logger.error(id + ' is not a valid key in settings.');
        }
    }

    /**
     * Returns false if no username is found.
     * Otherwise, returns the username without the @.
     **/
    get_param_username = function(input) {
        var space_pos = input.indexOf(' ');
        if (space_pos === -1 || input.length == space_pos) {
            return false;
        }

        var username = input.substr(space_pos + 1, input.length);

        if (username.length > 1 && username.indexOf(' ') == 0) {
            username = username.substr(1);
        }

        return username;
    }
};
