/* 
 * This module can be found at https://github.com/cognitivitydev/CrystalMap/.
 * You can report any issues or add suggestions there.
 */

/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />

import { getFormattedChat } from "../../ClientsideChat";
import { createWaypoint } from "../WaypointManager";
import Settings from "../config";

const Loader = Java.type("net.minecraftforge.fml.common.Loader");
const hasNEU = Loader.isModLoaded("notenoughupdates");

const arraysEqual = (a, b) => a.every((e, i) => e === b[i]);
const arrayDifference = (newArray, oldArray) => {
    if (oldArray.length === 0) {
        return newArray;
    }
    const temp = [];
    const offset = newArray.length - oldArray.length;
    for (let i = newArray.length - 1; i >= 0; i--) {
        let newElement = newArray[i];
        let oldElement = oldArray[i - offset];
    
        if (oldElement !== newElement) {
            temp.unshift(newElement);
        }
    }
    return temp;
};

const registerClientSideChat = (callback) => {
    let cachedStack = getFormattedChat();
    register("tick", () => {
        const currentStack = getFormattedChat();
  
        if (!arraysEqual(cachedStack, currentStack)) {
            callback(...arrayDifference(currentStack, cachedStack));
            cachedStack = currentStack;
        }
    });
};

registerClientSideChat((...messages) => {
    if(!Settings.showChatWaypoints) return;
    if(Settings.compassSolver != 2) return;
    if(!hasNEU) {
        ChatLib.chat("&d[CRYSTAL MAP] &cYou do not have NotEnoughUpdates installed, reverting compass solver to CrystalMap.");
        Settings.compassSolver = 1;
        return;
    }
    messages.forEach(message => {
        var content = ChatLib.removeFormatting(message);
        var coords = /^\[NEU\] Wishing compass points to (the )?.+ \([0-9]{1,3} [0-9]{1,3} [0-9]{1,3}\) \[Add Skytils Waypoint\](?! \[Add CrystalMap Waypoint\])/g.exec(content);
        if(coords) {
            var waypointName = coords[0].replace(/\[NEU\] Wishing compass points to (the )?/g, "").replace(/ \([0-9]{1,3} [0-9]{1,3} [0-9]{1,3}\) \[Add Skytils Waypoint\]/g, "")
            var coordinates = coords[0].replace(new RegExp("\\[NEU\\] Wishing compass points to (the )?"+waypointName+" \\(", "g"), "").replace(new RegExp("\\) \\[Add Skytils Waypoint\\]", "g"), "");
            if(waypointName.equals("Precursor City")) waypointName = "Lost Precursor City";
            if(waypointName.equals("Bal")) waypointName = "Khazad-dûm";
            if(waypointName.equals("Goblin Queen")) waypointName = "Goblin Queen's Den";
            ChatLib.editChat(content, new Message(
                message.split("[Add Skytils Waypoint]")[0],
                new TextComponent("&e[Add Skytils Waypoint]").setClick("run_command", "/sthw add "+coordinates+" "+waypointName),
                new TextComponent(" &d[Add CrystalMap Waypoint]").setClick("run_command", "/cm waypoint "+waypointName+" "+coordinates.replaceAll(" ", ","))
            ));
            if(Settings.parseChatWaypoints) createWaypoint(waypointName, coordinates.replaceAll(" ", ","), true);
        }
    });
});