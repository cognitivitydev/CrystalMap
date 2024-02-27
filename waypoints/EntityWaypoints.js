/* 
 * This module can be found at https://github.com/cognitivitydev/CrystalMap/.
 * You can report any issues or add suggestions there.
 */

/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />

import Settings from "../config";
import { distance } from "../render/RenderUtils";
import { createWaypoint, getArea, getCoordinates, getServerName, getWaypoint, parseCoordinates } from "../WaypointManager";

register("step", () => {
    if(Settings.createWaypoints) {
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
    }
}).setFps(2);