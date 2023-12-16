/* 
 * This module can be found on GitHub at https://github.com/cognitivitydev/CrystalMap/
 * Please insult my amazing code.
 */

/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />

import Settings from "../config";
import { createWaypoint } from "../waypoints";

const areas = "(temple|odawa|city|king|queen|divan|bal|grotto|Jungle Temple|Lost Precursor City|King Yolkar|Goblin Queen'?s Den|Mines of Divan|Khazad-d[ûu]m|Fairy Grotto|(boss )?corleone)";

export function parseChatWaypoint(event, formattedMessage, message, content) {
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