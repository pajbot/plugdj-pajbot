Commands:
=========

X specifies a number  
Arguments between ( ) are optional  
Arguments between [ ] are required  
Arguments listed between | are the various choices you have to use
Arguments marked in **bold** are the default actions

Co-Host
-------

|Command | Arguments |  Description |
|:------:|:---------:|:--------------------------------------:|
|.addcom | ALIAS COMMAND | Adds a command with alias **ALIAS**, which outputs `COMMAND`. **ALIAS** can be pipe-separated to have multiple aliases on a single command, i.e. jeppe|jeppe950|yeeppe950 |
|.delcom | ALIAS | Removes the command with alias **ALIAS**. Note that the alias must match exactly the one used with .addcom, that means for a command that has multiple aliases, ALL aliases must be included in the original order. Just ask pajlada Kappa if there is any trouble |
|.reload | | Reloads all user-created commands. There should never be a reason to run this command, but it's there anyway. |
|.say | MESSAGE | Sends `MESSAGE` as the bot. |

Manager
-------

|Command | Arguments |  Description |
|:------:|:---------:|:--------------------------------------:|
|.autoskip | (on\|off\|status) | Toggles the autoskip setting. This helps prevent songs from endlessly spinning. |
|.ban | @username (perma\|day\|**hour**) | Bans `@username` for the specified duration.  |
|.unban | @username | Unbans `@username` from the room.  |
|.bouncerplus | (on\|off\|status) | Toggles the Bouncer+ status. It decides whether the Bouncer+ commands below can be used by Bouncers or not. |
|.clearchat | | Clears the chat. (max 1000 messages from bots last connect) |
|.cycle | [on\|off] | Sets the current DJ cycle status. |
|.dctime | (X) | Sets the allowed elapsed time before .dc is unavailable. Prints the current DC time if no argument is passwewd |
|.experience |  | Check experience of the bot. |
|.fors |  | Notify all DJs and Staff that FORSEN is in the room, or is on his way. |
|.lockdown | (on\|off\|status) | Toggles the Lockdown effect. Lockdown means no grayplebs can type in the chat. |
|.lockskippos | (X) | Sets the current lock skip position to **X**. |
|.roulette | (X\|stop) | Starts a roulette that lasts for 60 or **X** seconds. Use stop to stop a running roulette. |
|.russianroulettee | (X\|stop) | Starts a russian roulette that lasts for 60 or **X** seconds. Use stop to stop a running roulette. |
|.doubleroulette | (X) | Starts a normal and russian roulette that lasts for 60 or **X** seconds. |
|.setrank | @username [Nazi\|DiscPleb\|Pleb] | Sets the rank of `@username` to the specified rank. |
|.skipunavailable | (on\|off\|status) | Toggles the Skip Unavailable Song status. It decides whether songs that are found to be unavailable should be automatically skipped or not. |
|.swap | @userA @userB | Swaps the position of `@userA` and `@userB`. At least one of the users must be in the waitlist. |

Bouncer+
-------

|Command | Arguments |  Description |
|:------:|:---------:|:--------------------------------------:|
|.cleverbot | (on\|off\|status) | Toggles the Cleverbot setting. |
|.kill | | Kills the bot. |
|.lock | | Locks the waitlist. |
|.unlock | | Unlocks the waitlist. |
|.maxlength | (X) | Sets the max song length to **X** minutes (so 5.5 is 5 minutes 30 seconds). |
|.move | @username X | Moves `@username` to position **X**. |
|.timeguard | (on\|off\|status) | Toggles the Timeguard setting. |

Bouncer
-------

|Command | Arguments |  Description |
|:------:|:---------:|:--------------------------------------:|
|.english | @username | Tells `@username` to speak english. |
|.lockskip | | Skips the current DJ and moves the DJ to the current lock skip position. |
|.movequeue | | Prints a list of the current movement queue. |
|.pos | (@username) | Prints the current position of the given username (or yourself if no username is specified). |
|.songinfo | (X) | Prints information about the current song (or the song that was played **X** songs ago), like whether it's been played before or not. |
|.status | | Prints out a bunch of mod-related status information. |
|.waveform | | Prints the waveform of the current song. (Soundcloud only) |


Resident DJ
----

|Command | Arguments |  Description |
|:------:|:---------:|:--------------------------------------:|
|.catfact |  | Prints a random fact about cats! |
|.gtfm | query | Links to lmgtfy.com with the query string attached. |
|.history | X | Prints information about the song that was played X songs ago. |
|.lastplay | @username | Prints the last song played by `@username`. |
|.lastseen | @username | Prints the last time `@username` was in the room. |
|.whois | @username | Prints some information about `@username`. |


User
----

|Command | Arguments |  Description |
|:------:|:---------:|:--------------------------------------:|
|.banners |  | Links to Vaxom's dank banners. |
|.commands |  | Links to this page! |
|.dc | (@username) | Puts you back in queue if you disconnected a short time ago. Only bouncers+ can use .dc for others. |
|.duel | @username | Initiate a [duel](https://github.com/pajlada/pajbot/blob/master/docs/dueling.md) with `@username`. |
|.eta | (@username) | Prints your approximate time left before you can play your song. Only bouncers+ can use .eta for others. |
|.join | | Joins the current roulette if one is active. |
|.leave | | Leaves the current roulette, if you joined. |
|.link | | Prints a link to the current song. |
|.love | @username | Outputs the percentage chance of love developing between you and `@username`. |
|.ping | | Prints the current uptime of the bot. |
|.quake | | Prints information about recent earthquakes. |
|.tp | | Links to the TastyPlug extension. |
|.random | (FROM, TO) | If no argument is given, flips a coin and returns the results. If one argument is given, returns a value between 1 and the given number. If two arguments are given, returns a number between the two given numbers. (Inclusive) |
|.rules | | Link to the latest rules. |
|.reward | (@username) | Gives a random reward to `@username`. |
|.swaprequest | @username | Request to [swap](https://github.com/pajlada/pajbot/blob/master/docs/swaprequest.md) with `@username`. |

