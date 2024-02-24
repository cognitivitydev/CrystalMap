/* 
 * This module can be found at https://github.com/cognitivitydev/CrystalMap/.
 * You can report any issues or add suggestions there.
 */

/// <reference types="../CTAutocomplete" />
/// <reference lib="es2015" />

import Settings from "./config";
import { createWaypoint, removeWaypoint, inCrystalHollows, getServerName, getServer, getWaypoint, getCoordinates, registerServer, parseCoordinates, getWaypointFromId, getArea, shareWaypoints, getWaypoints } from "./waypoints";
import RenderLibV2 from "../RenderLibV2"
import { onRender } from "./hud/renderEvent";
import { openWaypointGui } from "./gui/WaypointGui";
import { openDraggableGui } from "./gui/DraggableGui";
import renderBeaconBeam from "../BeaconBeam"
import { parseChatWaypoint } from "./chat/chatWaypoints";
import { parseChatSharing } from "./chat/chatSharing";
import { openSharingGui } from "./gui/SharingGui";
import { openRouteGui, path } from "./gui/RouteGui";
import "./features/CompassSolver";
import { renderCompassLines } from "./features/CompassSolver";
import { getFormattedChat } from "../ClientsideChat";
import "./features/DivanSolver"
import "./hud/renderUtils";
import { calculateDistance, distance, refreshPing } from "./hud/renderUtils";

const meta = JSON.parse(FileLib.read("./config/ChatTriggers/modules/CrystalMap/metadata.json"));
const nucleusEntrances = ["474,116,552","474,116,474","552,116,474","552,116,552","476,63,544","476,63,484","550,63,477","541,63,542"];
const version = meta.version;
const Loader = Java.type("net.minecraftforge.fml.common.Loader");
const hasNEU = Loader.isModLoaded("notenoughupdates");
var dilloClip;

register("worldLoad", () => {
    if(Settings.latestVersion != version) {
        Settings.latestVersion = version;
        ChatLib.chat(ChatLib.getCenteredText("&5&m                                        &d CRYSTAL MAP &5&m                                        "));
        ChatLib.chat(ChatLib.getCenteredText("&8VERSION "+version));
        ChatLib.chat("");
        ChatLib.chat("  &7Thank you for downloading &dCrystalMap&7!");
        ChatLib.chat("  &7To start, type &5/crystalmap &7to create waypoints.");
        ChatLib.chat("  &7For a list of commands or to change your settings,");
        ChatLib.chat("   &7type &5/crystalmap &dsettings&7.");
        ChatLib.chat(new Message("  &7If you find any issues, please report them ", new TextComponent("&d&nhere").setClick("open_url", "https://github.com/cognitivitydev/CrystalMap"), "&7."));
        ChatLib.chat("");
        ChatLib.chat("&5&m"+ChatLib.getChatBreak(" "));
        setTimeout(() => {
            refreshPing();
        }, 5000);
    }
});
register("renderWorld", () => {
    registerServer();
    for(var index in path) {
        index = parseInt(index);
        var point = path[index];

        if(point) {
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
    }
    if(Settings.waypoint) {
        renderCompassLines();
        var area = getArea();
        if(Settings.nucleusWaypoints && inCrystalHollows() && !getArea().equals("Crystal Nucleus")) {
            var closestWaypoint = undefined;
            var waypointDistance = Infinity;
            for(var entrance of nucleusEntrances) {
                if(!closestWaypoint || calculateDistance(parseCoordinates(getCoordinates()), parseCoordinates(entrance)) < waypointDistance) {
                    closestWaypoint = entrance;
                    waypointDistance = calculateDistance(parseCoordinates(getCoordinates()), parseCoordinates(entrance));
                }
            }
            var coordinates = parseCoordinates(closestWaypoint);
            var color = Settings.waypointColor;
            var x = parseInt(coordinates.x);
            var y = parseInt(coordinates.y);
            var z = parseInt(coordinates.z);

            var dist = distance(coordinates);

            renderBeaconBeam(x, 0, z, color.getRed() / 255, color.getGreen() / 255, color.getBlue() / 255, Math.min(0.8, Math.max(0, 0.05*Math.pow(dist, 2))*(color.getAlpha() / 255)), true);
            Tessellator.drawString("§d§lCrystal Nucleus §e("+dist+"m)", x + 0.5, y + 1.5, z + 0.5, 0xFFFFFF, true, 0.75, true)
        }
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
        if(area.equals("Jungle Temple") || (dilloClip && distance(dilloClip) < 20)) {
            if(!dilloClip || !dilloClip.server.equals(getServerName())) {
                let guardian1;
                let guardian2;
                World.getAllEntitiesOfType(net.minecraft.entity.item.EntityArmorStand).forEach(entity => {
                    if(ChatLib.removeFormatting(entity.getName()).equals("Kalhuiki Door Guardian")) {
                        if(!guardian1) guardian1 = entity;
                        else guardian2 = entity;
                    }
                });
                if(guardian2) {
                    let x = (guardian1.getX()+guardian2.getX())/2 + 58;
                    let y = guardian1.getY() - 44;
                    let z = guardian1.getZ() + 18;
                    dilloClip = {server: getServerName(), x: x, y: y, z: z};
                }
            } else {
                var dist = distance(dilloClip);
                Tessellator.drawString("§6Armadillo Clip §e("+dist+"m)", dilloClip.x + 0.5, dilloClip.y + 1.5, dilloClip.z + 0.5, 0xFFFFFF, true, 0.75, true)
            }
        }
    }
});

register("step", () => {
    if(!Settings.createWaypoints) return;
    World.getAllEntitiesOfType(net.minecraft.entity.item.EntityArmorStand).forEach(entity => {
        let coordinates = getCoordinates(entity);
        if(ChatLib.removeFormatting(entity.getName()).startsWith("[Lv100] Butterfly") && !getWaypoint(getServerName(), "Fairy Grotto", "grotto")) {
            if(distance(parseCoordinates(coordinates)) < 8) {
                if(Settings.createButterflyWaypoint) createWaypoint("Fairy Grotto", coordinates, true);
            }
        }
        if(ChatLib.removeFormatting(entity.getName()).startsWith("[Lv200] Boss Corleone") && !getWaypoint(getServerName(), "Boss Corleone", "corleone")) {
            if(distance(parseCoordinates(coordinates)) < 8) {
                if(Settings.createCorleoneWaypoint) createWaypoint("Boss Corleone", coordinates, true);
            }
        }
        if(entity.getName().equals("§6King Yolkar") && !getWaypoint(getServerName(), "King Yolkar", "king")) {
            if(Settings.createKingWaypoint) createWaypoint("King Yolkar", coordinates, true);
        }
        if(entity.getName().equals("Odawa") && !getWaypoint(getServerName(), "Odawa")) {
            if(Settings.createOdawaWaypoint) createWaypoint("Odawa", coordinates, true);
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
        if(!inCrystalHollows()) {
            ChatLib.chat("&cIt seems like you aren't in the Crystal Hollows! Type &n/crystalmap help&c for help.");
            return;
        }
        openWaypointGui();
        return;
    }
    if(args.length ==1 && args[0].equals("settings")) {
        Settings.openGUI();
        return;
    }
    if(args.length == 1 && args[0].equals("ping")) {
        refreshPing();
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
    if(args.length >= 0 && !args[0].equals("waypoint")) {
        if(!inCrystalHollows()) {
            ChatLib.chat("&cIt seems like you aren't in the Crystal Hollows!");
            return;
        }
        var newWaypointCoordinates = undefined;
        var newWaypointName = undefined;  
        if(args.length >= 1) {
            var coords = /^[0-9]{1,3},[0-9]{1,3},[0-9]{1,3}$/g.exec(args[0]);
            if(coords) {
                newWaypointCoordinates = args[0];
                if(args.length >= 2) {
                    newWaypointName = args.slice(1).join(" ");
                }
            } else {
                coords = /^[0-9]{1,3},[0-9]{1,3},[0-9]{1,3}$/g.exec(args[args.length-1]);
                if(coords) {
                    newWaypointCoordinates = args[args.length-1];
                    newWaypointName = args.slice(0, -1).join(" ");
                } else {
                    newWaypointName = args.slice(0).join(" ");
                }
            }
        }
        openWaypointGui(newWaypointName, newWaypointCoordinates);
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
}).setTabCompletions((args) => {
    if(args.length == 0) return [];
    if(args.length == 1) {
        return ["help", "gui", "waypoint", "remove"]
    }
    if(args.length == 2 && args[0].toLowerCase().equals("remove") && args[1].equals("")) {
        let waypoints = [];
        getWaypoints().forEach(server => {
            server.waypoints.forEach(waypoint => {
                waypoints.push(waypoint.name);
            })
        })
        return waypoints
    }
    return [];
}).setName("crystalmap", true).setAliases(["cm", "crystalmaps"]);

register("chat", (event) => {
    var formattedMessage = ChatLib.getChatMessage(event);
    var message = ChatLib.removeFormatting(formattedMessage);
    var content = message.replace(/^((Party|Co-op) > )?(\[[0-9]+\] )?(\S )?(\[.+\] )?[A-Za-z0-9_]{3,16}( .)?: (?!$)/g, "")

    if(Settings.showChatWaypoints) {
        if(content.equals(message)) return;
        if(Settings.onlyParseInHollows) {
            if(!inCrystalHollows()) return;
        }
        parseChatWaypoint(event, formattedMessage, message, content);
        parseChatSharing(event, formattedMessage, message, content);
    }
});

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
registerClientSideChat((...messages) => {
    if(!Settings.showChatWaypoints) return;
    if(Settings.compassSolver != 2) return;
    if(!hasNEU) {
        ChatLib.chat("&d[CRYSTAL MAP] &cYou do not have NotEnoughUpdates installed, reverting compass solver to CrystalMap.");
        Settings.compassSolver = 1;
        return;
    }
    if(!messages) return;
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