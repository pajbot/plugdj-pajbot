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
|.delcom | ALIAS | Removes the command with alias **ALIAS**. Note that the alias must match exactly the one used with .addcom, that means for a command that has multiple aliases, ALL aliases must be included in the original order. Just ask pajlada Kappa if there\'s any trouble |
|.reload | | Reloads all user-created commands. There should never be a reason to run this command, but it's there anyway. |

Manager
-------

|Command | Arguments |  Description |
|:------:|:---------:|:--------------------------------------:|
|.autoskip | (on\|off\|status) | Toggles the autoskip setting. This helps prevent songs from endlessly spinning. |
|.ban | @username (perma\|day\|**hour**) | Bans `@username` for the specified duration.  |
|.unban | @username | Unbans `@username` from the room.  |
|.clearchat | | Clears the chat. (max 1000 messages from bots last connect) |
|.dctime | (X) | Sets the allowed elapsed time before .dc is unavailable. Prints the current DC time if no argument is passwewd |
|.lockdown | (on\|off\|status) | Toggles the Lockdown effect. Lockdown means no grayplebs can type in the chat. |
|.setrank | @username [Nazi\|DiscPleb\|Pleb] | Sets the rank of `@username` to the specified rank. |
|.cycle | [on\|off] | Sets the current DJ cycle status. |
|.lockskippos | (X) | Sets the current lock skip position to **X**. |
|.bouncerplus | (on\|off\|status) | Toggles the Bouncer+ status. It decides whether the Bouncer+ commands below can be used by Bouncers or not. |
|.skipunavailable | (on\|off\|status) | Toggles the Skip Unavailable Song status. It decides whether songs that are found to be unavailable should be automatically skipped or not. |

Bouncer+
-------

|Command | Arguments |  Description |
|:------:|:---------:|:--------------------------------------:|
|.cleverbot | (on\|off\|status) | Toggles the Cleverbot setting. |
|.timeguard | (on\|off\|status) | Toggles the Timeguard setting. |
|.kill | | Kills the bot. |
|.lock | | Locks the waitlist. |
|.unlock | | Unlocks the waitlist. |
|.swap | @userA @userB | Swaps the position of `@userA` and `@userB`. At least one of the users must be in the waitlist. |
|.move | @username X | Moves `@username` to position **X**. |
|.maxlength | (X) | Sets the max song length to **X** minutes (so 5.5 is 5 minutes 30 seconds). |
|.roulette | (X\|stop) | Starts a roulette that lasts for 60 or **X** seconds. Use stop to stop a running roulette. |

Bouncer
-------

|Command | Arguments |  Description |
|:------:|:---------:|:--------------------------------------:|
|.status | | Prints out a bunch of mod-related status information. |
|.songinfo | (X) | Prints information about the current song (or the song that was played **X** songs ago), like whether it's been played before or not. |
|.movequeue | | Prints a list of the current movement queue. |
|.pos | (@username) | Prints the current position of the given username (or yourself if no username is specified). |
|.lockskip | | Skips the current DJ and moves the DJ to the current lock skip position. |
|.waveform | | Prints the waveform of the current song. (Soundcloud only) |



Resident DJ
----

|Command | Arguments |  Description |
|:------:|:---------:|:--------------------------------------:|
|.gtfm | query | Links to lmgtfy.com with the query string attached. |
|.whois | @username | Prints some information about `@username`. |
|.catfact |  | Prints a random fact about cats! |
|.history | X | Prints information about the song that was played X songs ago. |
|.lastseen | @username | Prints the last time `@username` was in the room. |
|.lastplay | @username | Prints the last song played by `@username`. |



User
----

|Command | Arguments |  Description |
|:------:|:---------:|:--------------------------------------:|
|.banners |  | Links to Vaxom's dank banners. |
|.commands |  | Links to this page! |
|.dc | (@username) | Puts you back in queue if you disconnected a short time ago. Only bouncers+ can use .dc for others. |
|.ping | | Prints the current uptime of the bot. |
|.eta | (@username) | Prints your approximate time left before you can play your song. Only bouncers+ can use .eta for others. |
|.join | | Joins the current roulette if one is active. |
|.leave | | Leaves the current roulette, if you joined. |
|.tp | | Links to the TastyPlug extension. |
|.rules | | Link to the latest rules. |
|.reward | (@username) | Gives a random reward to `@username`. |
|.quake | | Prints information about recent earthquakes. |
|.link | | Prints a link to the current song. |
