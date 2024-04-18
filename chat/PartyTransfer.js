/* 
 * This module can be found at https://github.com/cognitivitydev/CrystalMap/.
 * You can report any issues or add suggestions there.
 */

/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />

import { inDwarvenMines } from "../WaypointManager";
import Settings from "../config";

var lastTranfer = 0;

register("chat", (event) => {
    if(!inDwarvenMines()) return;
    if(!Settings.mineshaftTransferParty) return;
    var formattedMessage = ChatLib.getChatMessage(event);
    var message = ChatLib.removeFormatting(formattedMessage);
    if(message.equals("-----------------------------------------------------") || message.equals("You cannot invite that player since they're not online.") || message.equals("Couldn't find a player with that name!") || message.equals("You are not this party's leader!") || message.equals("You are not currently in a party!")) {
        if(Date.now()-lastTranfer < 3000) {
            cancel(event);
            return;
        }
    }
    var content = message.replace(/^(Party > )?(\[[0-9]+\] )?(\S )?(\[.+\] )?[A-Za-z0-9_]{3,16}( .)?: !ptme$/g, "");
    if(content.equals(message)) return;
    lastTranfer = Date.now();
    var player = /(?!^(Party > )?(\[[0-9]+\] )?(\S )?(\[.+\] )?)[A-Za-z0-9_]{3,16}( .)?(?=: !ptme$)/g.exec(message)[0];
    if(player.equals(Player.getName())) return;
    ChatLib.chat("&7Attempting to transfero7 to &b"+player+"&7...");
    ChatLib.command("party transfer "+player);
    lastTranfer = Date.now();
});