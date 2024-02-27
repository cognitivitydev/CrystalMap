/* 
 * This module can be found at https://github.com/cognitivitydev/CrystalMap/.
 * You can report any issues or add suggestions there.
 */

/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />

import Settings from "../config"

var pinging;

export function distance(location) {
    var distance = Math.hypot(Player.getX()-location.x+0.5, Player.getZ()-location.z+0.5);
    var decimal = distance >= 100 ? 0 : distance >= 10 ? 1 : 2
    return Math.round(distance * Math.pow(10, decimal)) / Math.pow(10, decimal);
}
export function refreshPing() {
    pinging = Date.now();
    ChatLib.command("?");
}
register("chat", (event) => {
    var formattedMessage = ChatLib.getChatMessage(event);
    var message = ChatLib.removeFormatting(formattedMessage);
    if(message.equals("You're not allowed to do this!") && pinging != 0) {
        Settings.ping = Java.type("java.lang.Integer").valueOf(""+(Date.now() - pinging));
        pinging = 0;
        cancel(event);
        ChatLib.chat("&d[CRYSTAL MAP] &7Your ping has been set to &a"+Settings.ping+" ms&7. This can be changed at any time in settings.")
    }
});
export function calculateDistance(location1, location2) {
    const dx = location1.x - location2.x;
    const dy = location1.y - location2.y;
    const dz = location1.z - location2.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

export function calculateWeightedDistance(location1, location2) {
    return Math.hypot(parseInt(location2.x) - parseInt(location1.x), (parseInt(location2.y) - parseInt(location1.y)) * 3.5, parseInt(location2.z) - parseInt(location1.z));
}