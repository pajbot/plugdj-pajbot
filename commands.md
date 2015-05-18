Commands:
=========

X specifies a number  
Arguments between ( ) are optional  
Arguments between [ ] are required

Manager
-------

|Command | Arguments |  Description |
|:------:|:---------:|:--------------------------------------:|
|.roulette | (X\|stop) | Starts a roulette that lasts for 60 or **X** seconds. Use stop to stop a running roulette. |
|.autoskip | (on\|off\|status) | Toggles the autoskip setting. This helps prevent songs from endlessly spinning. |
|.ban | @username [perma\|day\|**hour**] | Bans `@username` for the specified duration.  |
|.unban | @username | Unbans `@username` from the room.  |
|.lock | | Locks the waitlist. |
|.unlock | | Unlocks the waitlist. |
|.clearchat | | Clears the chat. (max 1000 messages from bots last connect) |
|.dctime | (X) | Sets the allowed elapsed time before .dc is unavailable. Prints the current DC time if no argument is passwewd |
|.lockdown | (on\|off\|status) | Toggles the Lockdown effect. Lockdown means no grayplebs can type in the chat. |
|.cleverbot | (on\|off\|status) | Toggles the Cleverbot setting. |
|.timeguard | (on\|off\|status) | Toggles the Timeguard setting. |
|.maxlength | (X) | Sets the max song length to **X** minutes (so 5.5 is 5 minutes 30 seconds). |
|.swap | @userA @userB | Swaps the position of `@userA` and `@userB`. At least one of the users must be in the waitlist. |
|.setrank | @username [Nazi\|DiscPleb\|Pleb] | Sets the rank of `@username` to the specified rank. |
|.move | @username X | Moves `@username` to position **X**. |

Bouncer
-------

|Command | Arguments |  Description |
|:------:|:---------:|:--------------------------------------:|
|.catfact |  | Prints a random fact about cats! |
|.history | X | Prints information about the song that was played X songs ago. |
|.lastseen | @username | Prints the last time `@username` was in the room. |
|.status | | Prints out a bunch of mod-related status information. |
|.songinfo | | Prints information about the current song, like whether it's been played before or not. |
|.movequeue | | Prints a list of the current movement queue. |



User
----

|Command | Arguments |  Description |
|:------:|:---------:|:--------------------------------------:|
|.banners |  | Links to Vaxom's dank banners. |
|.commands |  | Links to this page! |
|.dc | (@username) | Puts you back in queue if you disconnected a short time ago. Only bouncers+ can use .dc for others. |
|.ping | | Prints the current uptime of the bot. |
|.eta | | Prints your approximate time left before you can play your song. |
|.join | | Joins the current roulette if one is active. |
|.leave | | Leaves the current roulette, if you joined. |
|.tp | | Links to the TastyPlug extension. |
|.rules | | Link to the latest rules. |
|.reward | (@username) | Gives a random reward to `@username`. |
|.quake | | Prints information about recent earthquakes. |
|.link | | Prints a link to the current song. |
