/* 
 * This module can be found at https://github.com/cognitivitydev/CrystalMap/.
 * You can report any issues or add suggestions there.
 */

/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />

import Settings from "../config";
import { createWaypoint, inCrystalHollows } from "../WaypointManager";

const areas = "(temple|odawa|city|king|queen|divan|bal|grotto|Jungle Temple|Lost Precursor City|King Yolkar|Goblin Queen'?s Den|Mines of Divan|Khazad-d[ûu]m|Fairy Grotto|(boss )?corleone)";

register("chat", (event) => {
    var formattedMessage = ChatLib.getChatMessage(event);
    var message = ChatLib.removeFormatting(formattedMessage);
    var content = message.replace(/^((Party|Co-op) > )?(\[[0-9]+\] )?(\S )?(\[.+\] )?[A-Za-z0-9_]{3,16}( .)?: (?!$)/g, "");
    if(content.equals(message)) return;
    if(!Settings.showChatWaypoints) return;
    if(Settings.onlyParseInHollows && !inCrystalHollows()) return;
    var waypointSBE = sbe(content);
    if(waypointSBE) {
        cancel(event);
        var text = ("&d&n"+content+"&r").replace(waypointSBE.name, "&5&n"+waypointSBE.name+"&d&n");
        ChatLib.chat(new Message(
            formattedMessage.split(content)[0],
            new TextComponent(text).setClick("run_command", "/crystalmap waypoint "+waypointSBE.name+" "+waypointSBE.coordinates),
            formattedMessage.split(content)[1]
        ));
        if(Settings.parseChatWaypoints) {
            createWaypoint(waypointSBE.name, waypointSBE.coordinates, true);
        }
        return;
    }
    var waypointCM = cm(content);
    if(waypointCM) {
        cancel(event);
        var text = ("&d&n"+content+"&r");
        ChatLib.chat(new Message(
            formattedMessage.split(content)[0],
            new TextComponent(text),
            formattedMessage.split(content)[1]
        ));
        if(Settings.parseChatWaypoints) {
            for(let waypoint of waypointCM) {
                createWaypoint(waypoint.name, waypoint.coordinates, true);
            }
        }
        return;
    }
    if(/(?!(^|\s))([0-9]{1,3}(,| |, )[0-9]{1,3}(,| |, ){1,2}[0-9]{1,3})|(x:? ?\d{1,3}(,| |, )y:? ?\d{1,3}(,| |, )z:? ?\d{1,3})(?=\s|$)/gi.exec(content)) {
        var newMessage = new Message(formattedMessage);
        var coords = content.match(new RegExp(areas + ":? (([0-9]{1,3}(,| |, )[0-9]{1,3}(,| |, )[0-9]{1,3})|(x:? ?\\d{1,3}(,| |, )y:? ?\\d{1,3}(,| |, )z:? ?\\d{1,3}))(?=(\\s|$|,? ))", "gi"));
        if(coords) {
            for(var coord of coords) {
                var coordinates = /(([0-9]{1,3}(,| |, )[0-9]{1,3}(,| |, )[0-9]{1,3})|(x:? ?\d{1,3}(,| |, )y:? ?\d{1,3}(,| |, )z:? ?\d{1,3}))(?=\s|$)/gi.exec(coord)[0];
                var waypointName = coord.replace(coordinates, "").replace(":", "").trim();
                var waypoint = "&5&n"+waypointName+"&d&n "+coordinates;
                coordinates = coordinates.replace(/x:? ?/gi, "").replace(/(,| |, )[yz]:? ?/gi, ",");
                cancel(event);
                newMessage = new Message(
                    newMessage.getFormattedText().split(coord)[0],
                    new TextComponent(waypoint).setClick("run_command", "/crystalmap waypoint "+coordinates.replace(/(, |,| )/g, ",")+" "+waypointName),
                    newMessage.getFormattedText().split(coord)[1]
                );
                if(Settings.parseChatWaypoints) {
                    createWaypoint(waypointName, coordinates.replace(/(, |,| )/g, ","), true);
                }
            }
            if(newMessage != formattedMessage) {
                ChatLib.chat(newMessage)
                return;
            }
        }
        newMessage = new Message(formattedMessage);
        coords = content.match(new RegExp("(([0-9]{1,3}(,| |, )[0-9]{1,3}(,| |, )[0-9]{1,3})|(x:? ?\\d{1,3}(,| |, )y:? ?\\d{1,3}(,| |, )z:? ?\\d{1,3})):? " + areas, "gi"));
        if(coords) {
            for(var coord of coords) {
                var coordinates = /(([0-9]{1,3}(,| |, )[0-9]{1,3}(,| |, )[0-9]{1,3})|(x:? ?\d{1,3}(,| |, )y:? ?\d{1,3}(,| |, )z:? ?\d{1,3}))(?=\s|$)/gi.exec(coord)[0];
                var waypointName = coords[0].replace(coordinates, "").replace(":", "").trim();
                var waypoint = "&d&n"+coordinates+" &5&n"+waypointName;
                coordinates = coordinates.replace(/x:? ?/gi, "").replace(/(,| |, )[yz]:? ?/gi, ",");
                cancel(event);
                newMessage = new Message(
                    newMessage.getFormattedText().split(coord)[0],
                    new TextComponent(waypoint).setClick("run_command", "/crystalmap waypoint "+coordinates.replace(/(, |,| )/g, ",")+" "+waypointName),
                    newMessage.getFormattedText().split(coord)[1]
                );
                if(Settings.parseChatWaypoints) {
                    createWaypoint(waypointName, coordinates.replace(/(, |,| )/g, ","), true);
                }
            }
            if(newMessage != formattedMessage) {
                ChatLib.chat(newMessage)
                return;
            }
        }
        coords = /(\s|^)(([0-9]{1,3}(,| |, )[0-9]{1,3}(,| |, )[0-9]{1,3})|(x:? ?\d{1,3}(,| |, )y:? ?\d{1,3}(,| |, )z:? ?\d{1,3}))(?=\s|$)/gi.exec(content);
        if(coords) {
            coords = coords[0].trim();
            var coordinates = coords.replace(/x:? ?/gi, "").replace(/(,| |, )[yz]:? ?/gi, ",").replace(/(, |,| )/gi, ",");
            cancel(event);
            ChatLib.chat(new Message(
                formattedMessage.split(coords)[0],
                new TextComponent("&d&n"+coords).setClick("run_command", "/crystalmap waypoint "+coordinates),
                formattedMessage.split(coords)[1]
            ));
            return;
        }
    }
});

const sbeFormat = /^\$SBECHWP:.+@-[0-9]{1,3},[0-9]{1,3},[0-9]{1,3}$/g

function sbe(message) {
    if(sbeFormat.exec(message) == undefined) return undefined;

    var waypointName = message.replace("$SBECHWP:", "").replace(/@-[0-9]{1,3},[0-9]{1,3},[0-9]{1,3}$/g, "")
    var coordinates = message.replace("$SBECHWP:"+waypointName+"@-", "");

    return {name: waypointName, coordinates: coordinates};
}

const cmFormat = /^%CRYSTALMAP=\[(\".+\"\d{1,3},\d{1,3},\d{1,3};)+]$/g

function cm(message) {
    if(cmFormat.exec(message) == undefined) return undefined;

    var trimmed = message.replace(/^%CRYSTALMAP=\[/g, "").replace(/]$/g, "");
    var textWaypoints = trimmed.split(/(\".+?\"\d{1,3},\d{1,3},\d{1,3};)/g).filter(waypoint => waypoint.length != 0);
    var waypoints = [];

    for(var waypoint of textWaypoints) {
        console.log("-> "+waypoint+" // "+/\".+?\"(?=\d{1,3},\d{1,3},\d{1,3};)/g.exec(waypoint))
        let waypointName = /\".+?\"(?=\d{1,3},\d{1,3},\d{1,3};)/g.exec(waypoint)[0];
        let coordinates = /(?!\".+?\")\d{1,3},\d{1,3},\d{1,3}(?=;)/g.exec(waypoint)[0];

        waypoints.push({name: waypointName, coordinates: coordinates});
    }
    return waypoints;
}