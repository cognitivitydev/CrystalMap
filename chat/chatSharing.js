/* 
 * This module can be found on GitHub at https://github.com/cognitivitydev/CrystalMap/
 * Please insult my amazing code.
 */

/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />

import { getServerName, getWaypoint } from "../waypoints";
import Settings from "../config";

const areas = "(temple|odawa|city|king( yolkar)?|queen|divan|bal|grotto|Jungle Temple|Lost Precursor City|King Yolkar|Goblin Queen'?s Den|Mines of Divan|Khazad-d[ûu]m|Fairy Grotto|(boss )?corleone)";

export function parseChatSharing(event, formattedMessage, message, content) {
    var channel = "/ac"
    if(message.startsWith("Party > ")) {
        if(!Settings.showPartyRequests) return;
        channel = "/pc"
    }
    if(message.startsWith("Co-op > ")) {
        if(!Settings.showCoopRequests) return;
        channel = "/cc"
    }
    var coords = new RegExp(areas+" (coord(inate)?s?)\\??", "gi").exec(content);
    if(!new RegExp(areas+" (coord(inate)?s?)\\??", "gi").exec(content)) return;
    var area = new RegExp(areas+"(?= (coord(inate)?s?)\\??)").exec(content);
    if(!area) return; //should never be false
    var server = getServerName();
    var waypoint = undefined;
    if(/Jungle( Temple)?/gi.exec(area)) {
        waypoint = getWaypoint(server, "Jungle Temple", "temple");
    } else if(/(Lost Precursor )?city/gi.exec(area)) {
        waypoint = getWaypoint(server, "Lost Precursor City", "city");
    } else if(/King( Yolkar)?/gi.exec(area)) {
        waypoint = getWaypoint(server, "Goblin King", "King Yolkar", "king");
    } else if(/(queen)|(Goblin Queen'?s Den)/gi.exec(area)) {
        waypoint = getWaypoint(server, "Goblin Queen's Den", "Goblin Queens Den", "queen");
    } else if(/(Mines of )?Divan/gi.exec(area)) {
        waypoint = getWaypoint(server, "Mines of Divan", "divan");
    } else if(/(bal)|(Khazad-d[ûu]m)/gi.exec(area)) {
        waypoint = getWaypoint(server, "Khazad-dûm", "bal");
    } else if(/(Fairy )?Grotto/gi.exec(area)) {
        waypoint = getWaypoint(server, "Fairy Grotto", "grotto");
    } else if(/(Boss )?Corleone/gi.exec(area)) {
        waypoint = getWaypoint(server, "Boss Corleone", "corleone");
    }  else if(/odawa/gi.exec(area)) {
        waypoint = getWaypoint(server, "odawa");
    } else {
        return;
    }
    var highlighted = "&b&n"+coords[0];
    cancel(event)
    if(waypoint == undefined) {
        highlighted = "&7&n"+coords[0];
        ChatLib.chat(new Message(
            formattedMessage.split(coords[0])[0],
            new TextComponent(highlighted).setHover("show_text", "                &cCannot share this waypoint               \n&cIt seems like you don't have this waypoint set!"),
            formattedMessage.split(coords[0])[1]
        ));
        return;
    }
    ChatLib.chat(new Message(
        formattedMessage.split(coords[0])[0],
        new TextComponent(highlighted).setClick("run_command", channel+" "+waypoint.name+" "+waypoint.location.replaceAll(",", " ")),
        formattedMessage.split(coords[0])[1]
    ));
 }