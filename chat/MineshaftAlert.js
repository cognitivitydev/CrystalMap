/* 
 * This module can be found at https://github.com/cognitivitydev/CrystalMap/.
 * You can report any issues or add suggestions there.
 */

/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />

import {
    CenterConstraint,
    SubtractiveConstraint,
    UIText,
    Window,
} from "../../Elementa";
import Settings from "../config";


var lastMineshaft = 0;

register("chat", (event) => {
    var formattedMessage = ChatLib.getChatMessage(event);
    var message = ChatLib.removeFormatting(formattedMessage);
    if(message.equals("-----------------------------------------------------") || message.equals("You are not in a party right now.")) {
        if((Date.now() - lastMineshaft) < 3000 && Settings.mineshaftChatChannel == 1) {
            cancel(event);
            return;
        }
    }
    if(!message.startsWith("WOW! You found a Glacite Mineshaft portal!")) {
        return;
    }
    lastMineshaft = Date.now();
    if(Settings.mineshaftChat) {
        var command = "pc";
        if(Settings.mineshaftChatChannel == 0) {
            command = "ac"
        } else if(Settings.mineshaftChatChannel == 1) {
            command = "pc"
        } else if(Settings.mineshaftChatChannel == 2) {
            command = "cc"
        } else if(Settings.mineshaftChatChannel == 3) {
            command = "gc"
        }
        ChatLib.command(command+" "+Settings.mineshaftChatMessage);
    }
});

register("renderOverlay", () => {
    if(!Settings.mineshaftWarning) return;
    if((Date.now() - lastMineshaft) < 3000) {

        const hud = new Window();

        new UIText("§cMINESHAFT!")
            .setX(new CenterConstraint())
            .setY(new SubtractiveConstraint(new CenterConstraint(), (20).pixels()))
            .setTextScale((4).pixels())
            .setChildOf(hud);

        hud.draw();

        World.playSound("note.pling", 1, 2)
    }
});