/* 
 * This module can be found at https://github.com/cognitivitydev/CrystalMap/.
 * You can report any issues or add suggestions there.
 */

/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />

import { getServerName, getWaypoint, inCrystalHollows, shareWaypoints } from "../WaypointManager";
import Settings from "../config";

const areas = "(temple|odawa|city|king( yolkar)?|queen|king( (and )?|/| / )queen|divan|mod|mines|bal|grotto|Jungle Temple|Lost Precursor City|King Yolkar|Goblin Queen'?s Den|Mines of Divan|Khazad-d[ûu]m|Fairy Grotto|(boss )?corleone)";

register("chat", (event) => {
    var formattedMessage = ChatLib.getChatMessage(event);
    var message = ChatLib.removeFormatting(formattedMessage);
    var content = message.replace(/^((Party|Co-op) > )?(\[[0-9]+\] )?(\S )?(\[.+\] )?[A-Za-z0-9_]{3,16}( .)?: (?!$)/g, "");
    if(content.equals(message)) return;
    if(!Settings.showChatWaypoints) return;
    if(Settings.onlyParseInHollows && !inCrystalHollows()) return;

    var channel = "/ac"
    if(message.startsWith("Party > ")) {
        if(!Settings.showPartyRequests) return;
        channel = "/pc"
    }
    if(message.startsWith("Co-op > ")) {
        if(!Settings.showCoopRequests) return;
        channel = "/cc"
    }
    var coords = new RegExp(areas+" (coo?rd(inate)?s?)\\??", "gi").exec(content);
    if(!new RegExp(areas+" (coo?rd(inate)?s?)\\??", "gi").exec(content)) return;
    var area = new RegExp(areas+"(?= (coo?rd(inate)?s?)\\??)", "gi").exec(content);
    if(!area) return; //should never be false
    var server = getServerName();
    var waypoint = undefined;
    var multipleWaypoints = false;
    if(/(Jungle )?Temple/gi.exec(area)) {
        waypoint = getWaypoint(server, "Jungle Temple", "temple");
    } else if(/(Lost Precursor )?city/gi.exec(area)) {
        waypoint = getWaypoint(server, "Lost Precursor City", "city");
    } else if(/king( (and )?|\/| \/ )queen/gi.exec(area)) {
        multipleWaypoints = true;
        waypoint = [getWaypoint(server, "Goblin King", "King Yolkar", "king"), getWaypoint(server, "Goblin Queen's Den", "Goblin Queens Den", "queen")];
    } else if(/King( Yolkar)?/gi.exec(area)) {
        waypoint = getWaypoint(server, "Goblin King", "King Yolkar", "king");
    } else if(/(queen)|(Goblin Queen'?s Den)/gi.exec(area)) {
        waypoint = getWaypoint(server, "Goblin Queen's Den", "Goblin Queens Den", "queen");
    } else if(/((Mines of )?Divan)|(mod)|(mines)/gi.exec(area)) {
        waypoint = getWaypoint(server, "Mines of Divan", "divan", "mod", "mines");
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
    cancel(event);
    var filtered = waypoint == undefined || !multipleWaypoints ? undefined : waypoint.filter(waypoints => waypoints != undefined);
    if(waypoint == undefined || (multipleWaypoints && filtered.length == 0)) {
        highlighted = "&7&n"+coords[0];
        ChatLib.chat(new Message(
            formattedMessage.split(coords[0])[0],
            new TextComponent(highlighted).setHover("show_text", "                &cCannot share this waypoint               \n&cIt seems like you don't have this waypoint set!"),
            formattedMessage.split(coords[0])[1]
        ));
        return;
    }
    if(multipleWaypoints && filtered.length != 0) {
        if(filtered.length != waypoint.length) {
            highlighted = "&3&n"+coords[0];
        }
        ChatLib.chat(new Message(
            formattedMessage.split(coords[0])[0],
            new TextComponent(highlighted).setClick("run_command", channel+" "+shareWaypoints(filtered)),
            formattedMessage.split(coords[0])[1]
        ));
    } else {
        ChatLib.chat(new Message(
            formattedMessage.split(coords[0])[0],
            new TextComponent(highlighted).setClick("run_command", channel+" "+shareWaypoints(waypoint)),
            formattedMessage.split(coords[0])[1]
        ));
    }
});