/* 
 * This module can be found on GitHub at https://github.com/cognitivitydev/CrystalMap/
 * Please insult my amazing code.
 */

/// <reference types="../CTAutocomplete" />
/// <reference lib="es2015" />

import Settings from "./config";
import { createWaypoint, removeWaypoint, inCrystalHollows, getServerName, getServer, getWaypoint, getCoordinates, registerServer, parseCoordinates, getWaypointFromId, getArea, shareWaypoints } from "./waypoints";
import RenderLibV2 from "../RenderLibV2"
import { onRender } from "./hud/renderEvent";
import { openWaypointGui } from "./gui/WaypointGui";
import { openDraggableGui } from "./gui/DraggableGui";
import renderBeaconBeam from "../BeaconBeam"
import { distance } from "./hud/renderUtils";
import { parseChatWaypoint } from "./chat/chatWaypoints";
import { parseChatSharing } from "./chat/chatSharing";
import { openSharingGui } from "./gui/SharingGui";
import { openRouteGui, path } from "./gui/RouteGui";

const meta = JSON.parse(FileLib.read("./config/ChatTriggers/modules/CrystalMap/metadata.json"));
const version = meta.version;

register("worldLoad", () => {
    if(Settings.latestVersion != version) {
        Settings.latestVersion = version;
        ChatLib.chat(ChatLib.getCenteredText("&5&m                                        &d CRYSTAL MAP &5&m                                        "));
        ChatLib.chat(ChatLib.getCenteredText("&8VERSION "+version));
        ChatLib.chat("");
        ChatLib.chat("  &7Thank you for downloading &dCrystalMap&7!");
        ChatLib.chat("  &7To start, type &5/crystalmap &7to open a config menu.");
        ChatLib.chat("  &7For more information on commands, type &5/crystalmap &dhelp&7.");
        ChatLib.chat(new Message("  &7If you find any issues, please report them ", new TextComponent("&d&nhere").setClick("open_url", "https://github.com/cognitivitydev/CrystalMap"), "&7."));
        ChatLib.chat("");
        ChatLib.chat("&5&m"+ChatLib.getChatBreak(" "));
    }
});
register("renderWorld", () => {
    registerServer();
    for(var index in path) {
        index = parseInt(index);
        var point = path[index];

        if(Settings.showRouteLines) {
            var nextPoint = index == path.length - 1 ? path[0] : path[index+1]
            RenderLibV2.drawLine(
                point.x+0.5, point.y+0.5, point.z+0.5,
                nextPoint.x+0.5, nextPoint.y+0.5, nextPoint.z+0.5,
                0, 0.5, 1, 1,
                true, 3
            );
        }
        if(index == 0) {
            RenderLibV2.drawEspBox(point.x+0.5, point.y, point.z+0.5, 1, 1, 0.08, 1, 0.08, 1, true)
            Tessellator.drawString("§a("+(index+1)+")", point.x+0.5, point.y-0.5, point.z+0.5, 0xFFFFFF, true, 0.75, true)
        } else {
            RenderLibV2.drawEspBox(point.x+0.5, point.y, point.z+0.5, 1, 1, 0.75, 0.08, 1, 1, true)
            Tessellator.drawString("§b("+(index+1)+")", point.x+0.5, point.y-0.5, point.z+0.5, 0xFFFFFF, true, 0.75, true);
        }
    }
    if(Settings.waypoint) {
        getServer(getServerName()).waypoints.forEach((waypoint) => {
            var coordinates = parseCoordinates(waypoint.location);
            var color = Settings.waypointColor;
            var x = parseInt(coordinates.x)-1;
            var y = parseInt(coordinates.y);
            var z = parseInt(coordinates.z)-1;

            var dist = distance(coordinates);
            renderBeaconBeam(x, 0, z, color.getRed() / 255, color.getGreen() / 255, color.getBlue() / 255, Math.min(0.8, Math.max(0, 0.05*Math.pow(dist, 2))*(color.getAlpha() / 255)), true);
            Tessellator.drawString("§e"+waypoint.name+" §c("+dist+"m)", x + 0.5, y + 1.5, z + 0.5, 0xFFFFFF, true, 0.75, true)
        });
    }
});

register("step", () => {
    if(!Settings.createWaypoints) return;
    World.getAllEntitiesOfType(net.minecraft.entity.item.EntityArmorStand).forEach(entity => {
        if(entity.getName().equals("§6King Yolkar") && !getWaypoint(getServerName(), "King Yolkar", "king")) {
            if(Settings.createKingWaypoint) createWaypoint("King Yolkar", getCoordinates(entity), true);
        }
        if(entity.getName().equals("Odawa") && !getWaypoint(getServerName(), "Odawa")) {
            if(Settings.createOdawaWaypoint) createWaypoint("Odawa", getCoordinates(entity), true);
        }
        if(ChatLib.removeFormatting(entity.getName()).startsWith("[Lv100] Butterfly") && !getWaypoint(getServerName(), "Fairy Grotto")) {
            createWaypoint("Fairy Grotto", getCoordinates(entity), true);
        }
    });
}).setFps(2);

register("renderOverlay", () => {
    if(Player.getX() <= 202 || Player.getX() >= 824) return;
    if(Player.getX() <= 30 || Player.getY() >= 188) return;
    if(Player.getZ() <= 202 || Player.getZ() >= 824) return;
    if(!inCrystalHollows() || !getServerName().startsWith("m")) return;
    onRender();
})

register("command", (...args) => {
    if(!args || !args[0]) {
        Settings.openGUI();
        return;
    }
    if(args.length == 1 && args[0].equals("help")) {
        ChatLib.chat(ChatLib.getCenteredText("&5&m                                                &d HELP &5&m                                                "));
        ChatLib.chat("&d/crystalmap &8- &7Opens the mod's config.");
        ChatLib.chat("&d/crystalmap help &8- &7Lists available commands for CrystalMap.");
        ChatLib.chat("&d/crystalmap gui &8- &7Move the position of the minimap.");
        ChatLib.chat("&d/crystalmap waypoint &e[name] [coordinates] &8- &7Opens a menu for creating waypoints.");
        ChatLib.chat("&d/crystalmap remove &c<name> &8- &7Removes waypoints by name.");
        ChatLib.chat("&5&m"+ChatLib.getChatBreak(" "));
        return;
    }
    if(args.length == 1 && args[0].equals("route")) {
        openRouteGui();
        return;
    }
    if(args.length == 2 && args[0].equals("share")) {
        openSharingGui(args[1]);
        return;
    }
    if(args.length >= 1 && args[0].equals("remove")) {
        if(!inCrystalHollows()) {
            ChatLib.chat("&cIt seems like you aren't in the Crystal Hollows!");
            return;
        }
        if(args.length == 1) {
            ChatLib.chat("&cNo waypoint name specified!")
            return;
        }
        removeWaypoint(args.slice(1).join(" "));
        return;
    }
    if(args.length == 1 && args[0].equals("gui")) {
        openDraggableGui();
        return;
    }
    if(args.length >= 1 && args[0].equals("waypoint")) {
        if(!inCrystalHollows()) {
            ChatLib.chat("&cIt seems like you aren't in the Crystal Hollows!");
            return;
        }
        newWaypointCoordinates = undefined;
        newWaypointName = undefined;  
        if(args.length >= 2) {
            var coords = /^[0-9]{1,3},[0-9]{1,3},[0-9]{1,3}$/g.exec(args[1]);
            if(coords) {
                newWaypointCoordinates = args[1];
                if(args.length >= 3) {
                    newWaypointName = args.slice(2).join(" ");
                }
            } else {
                coords = /^[0-9]{1,3},[0-9]{1,3},[0-9]{1,3}$/g.exec(args[args.length-1]);
                if(coords) {
                    newWaypointCoordinates = args[args.length-1];
                    newWaypointName = args.slice(1, -1).join(" ");
                } else {
                    newWaypointName = args.slice(1).join(" ");
                }
            }
        }
        openWaypointGui(newWaypointName, newWaypointCoordinates);
        return;
    }
    Settings.openGUI();
}).setName("crystalmap", true);

register("chat", (event) => {
    var formattedMessage = ChatLib.getChatMessage(event);
    var message = ChatLib.removeFormatting(formattedMessage);
    var content = message.replace(/^((Party|Co-op) > )?(\[[0-9]+\] )?(\S )?(\[.+\] )?[A-Za-z0-9_]{3,16}( .)?: (?!$)/g, "")

    if(content.equals(message)) return;
    if(Settings.showChatWaypoints) {
        if(Settings.onlyParseInHollows) {
            if(!inCrystalHollows()) return;
        }
        parseChatWaypoint(event, formattedMessage, message, content);
        parseChatSharing(event, formattedMessage, message, content);
    }
});