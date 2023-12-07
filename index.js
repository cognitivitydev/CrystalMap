/* 
 * This module can be found on GitHub at https://github.com/cognitivitydev/CrystalMap/
 * Please insult my amazing code.
 */

/// <reference types="../CTAutocomplete" />
/// <reference lib="es2015" />

import Settings from "./config";
import { createWaypoint, removeWaypoint, inCrystalHollows, getServerName, getServer, getWaypoint, getCoordinates, registerServer, parseCoordinates, getWaypointFromId } from "./waypoints";
import { onRender } from "./hud/renderEvent";
import { openWaypointGui } from "./gui/WaypointGui";
import { openDraggableGui } from "./gui/DraggableGui";
import renderBeaconBeam from "../BeaconBeam"
import { distance } from "./hud/renderUtils";

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
            createWaypoint("King Yolkar", getCoordinates(entity), true);
        }
    });
}).setFps(2);

register("renderOverlay", () => {
    if(Player.getX() <= 202 || Player.getX() >= 824) return;
    if(Player.getX() <= 30 || Player.getY() >= 188) return;
    if(Player.getZ() <= 202 || Player.getZ() >= 824) return;
    if(!inCrystalHollows()) return;
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
    var content = message.replace(/^(\[[0-9]+\] )?(\S )?(\[.+\] )?[A-Za-z0-9_]{3,16}( .)?: (?!$)/g, "")

    if(content.equals(message)) return;
    if(Settings.showChatWaypoints) {
        coords = /^\$SBECHWP:.+@-[0-9]{1,3},[0-9]{1,3},[0-9]{1,3}$/g.exec(content);
        if(coords) {
            var waypointName = coords[0].replace("$SBECHWP:", "").replace(/@-[0-9]{1,3},[0-9]{1,3},[0-9]{1,3}$/g, "")
            if(waypointName) {
                cancel(event);
                waypoint = ("&d&n"+coords[0]+"&r").replace(waypointName, "&5&n"+waypointName+"&d&n");
                coordinates = coords[0].replace("$SBECHWP:"+waypointName+"@-", "");
                ChatLib.chat(new Message(
                    formattedMessage.split(coords[0])[0],
                    new TextComponent(waypoint).setClick("run_command", "/crystalmap waypoint "+coordinates+" "+waypointName),
                    formattedMessage.split(coords[0])[1]
                ));
                if(Settings.parseChatWaypoints) {
                    createWaypoint(waypointName, coordinates, true);
                }
                return;
            }
        }
        const areas = "(temple|city|king|queen|divan|bal|grotto|Jungle Temple|Lost Precursor City|King Yolkar|Goblin Queen'?s Den|Mines of Divan|Khazad-d[ûu]m|Fairy Grotto|(boss )?corleone)";
        if(/(?!(^|\s))[0-9]{1,3}(,| |, )[0-9]{1,3}(,| |, ){1,2}[0-9]{1,3}(?=\s|$)/g.exec(content)) {
            coords = new RegExp(areas + ":? [0-9]{1,3}(,| |, )[0-9]{1,3}(,| |, )[0-9]{1,3}(?=\s|$)", "gi").exec(content);
            if(coords) {
                coordinates = /[0-9]{1,3}(,| |, )[0-9]{1,3}(,| |, )[0-9]{1,3}(?=\s|$)/g.exec(coords[0])[0];
                waypointName = coords[0].replace(coordinates, "").replace(":", "").trim();
                waypoint = "&5&n"+waypointName+"&d&n "+coordinates;
                cancel(event);
                ChatLib.chat(new Message(
                    formattedMessage.split(coords[0])[0],
                    new TextComponent(waypoint).setClick("run_command", "/crystalmap waypoint "+coordinates.replace(/(, |,| )/g, ",")+" "+waypointName),
                    formattedMessage.split(coords[0])[1]
                ));
                if(Settings.parseChatWaypoints) {
                    createWaypoint(waypointName, coordinates.replace(/(, |,| )/g, ","), true);
                }
                return;
            }
            coords = new RegExp("[0-9]{1,3}(,| |, )[0-9]{1,3}(,| |, )[0-9]{1,3}:? " + areas, "gi").exec(content);
            if(coords) {
                coordinates = /[0-9]{1,3}(,| |, )[0-9]{1,3}(,| |, )[0-9]{1,3}/g.exec(coords[0])[0];
                waypointName = coords[0].replace(coordinates, "").replace(":", "").trim();
                waypoint = "&d&n"+coordinates+" &5&n"+waypointName;
                cancel(event);
                ChatLib.chat(new Message(
                    formattedMessage.split(coords[0])[0],
                    new TextComponent(waypoint).setClick("run_command", "/crystalmap waypoint "+coordinates.replace(/(, |,| )/g, ",")+" "+waypointName),
                    formattedMessage.split(coords[0])[1]
                ));
                if(Settings.parseChatWaypoints) {
                    createWaypoint(waypointName, coordinates.replace(/(, |,| )/g, ","), true);
                }
                return;
            }
            coords = /(\s|^)[0-9]{1,3}(,| |, )[0-9]{1,3}(,| |, ){1,2}[0-9]{1,3}(?=\s|$)/g.exec(content);
            if(coords) {
                coords = coords[0].trim();
                cancel(event);
                ChatLib.chat(new Message(
                    formattedMessage.split(coords)[0],
                    new TextComponent("&d&n"+coords).setClick("run_command", "/crystalmap waypoint "+coords.replace(/(, |,| )/g, ",")),
                    formattedMessage.split(coords)[1]
                ));
                return;
            }
        }
    }
});