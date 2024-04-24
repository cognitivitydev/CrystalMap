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
import RenderLibV2 from "../../RenderLibV2";
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

register("renderWorld", () => {
    if(!Settings.mineshaftLine) return;
    World.getAllEntitiesOfType(net.minecraft.entity.item.EntityArmorStand).forEach(entity => {
        let distance = Player.asPlayerMP().distanceTo(entity);
        if(distance < 10 && entity.getName().equals("§e§lClick to enter!")) {
            RenderLibV2.drawLine(Player.getRenderX(), Player.getRenderY() + Player.asPlayerMP().getEyeHeight(), Player.getRenderZ(), entity.getX(), entity.getY(), entity.getZ(), 0, 0.8, 1, 1, true);
        }
    });
});