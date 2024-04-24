/* 
 * This module can be found at https://github.com/cognitivitydev/CrystalMap/.
 * You can report any issues or add suggestions there.
 */

/// <reference types="../CTAutocomplete" />
/// <reference lib="es2015" />

import { openDraggableGui } from "./gui/DraggableGui";
import { openRouteGui } from "./gui/RouteGui";
import { openSharingGui } from "./gui/SharingGui";
import { openWaypointGui } from "./gui/WaypointGui";
import { refreshPing } from "./render/RenderUtils";
import { inCrystalHollows, inDwarvenMines, inGlaciteTunnels, removeWaypoint } from "./WaypointManager";
import Settings from "./config";

register("command", (...args) => {

    if(!args || !args[0]) {
        if(!inCrystalHollows() && !inDwarvenMines() && !inGlaciteTunnels(true)) {
            ChatLib.chat("&cIt seems like you aren't in the Crystal Hollows or Dwarven Mines! Type &n/crystalmap settings&c to open settings.");
            return;
        }
        if(inDwarvenMines() || inGlaciteTunnels(true)) {
            Settings.openGUI();
            return;
        }
        openWaypointGui();
        return;
    }
    if(args.length == 1 && args[0].equals("settings")) {
        Settings.openGUI();
        return;
    }
    if(args.length == 1 && args[0].equals("ping")) {
        refreshPing();
        return;
    }
    if(args.length == 1 && args[0].equals("route")) {
        if(!inCrystalHollows()) {
            ChatLib.chat("&cIt seems like you aren't in the Crystal Hollows! Type &n/crystalmap settings&c to open settings.");
            return;
        }
        openRouteGui();
        return;
    }
    if(args.length == 2 && args[0].equals("share")) {
        openSharingGui(args[1]);
        return;
    }
    if(args.length >= 1 && args[0].equals("remove")) {
        if(!inCrystalHollows()) {
            ChatLib.chat("&cIt seems like you aren't in the Crystal Hollows! Type &n/crystalmap settings&c to open settings.");
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
            ChatLib.chat("&cIt seems like you aren't in the Crystal Hollows! Type &n/crystalmap settings&c to open settings.");
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
            ChatLib.chat("&cIt seems like you aren't in the Crystal Hollows! Type &n/crystalmap settings&c to open settings.");
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
        return ["help", "gui", "waypoint", "remove", "route", "ping"]
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