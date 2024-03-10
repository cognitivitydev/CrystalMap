/* 
 * This module can be found at https://github.com/cognitivitydev/CrystalMap/.
 * You can report any issues or add suggestions there.
 */

/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />

import { calculateDistance, distance } from "../render/RenderUtils";
import { createRegion, createWaypoint, getArea, getCoordinates, getServer, getServerName, getWaypoints, inCrystalHollows, parseCoordinates, registerServer } from "../WaypointManager";
import renderBeaconBeam from "../../BeaconBeam"
import Settings from "../config"

const nucleusEntrances = ["474,116,552","474,116,474","552,116,474","552,116,552","476,63,544","476,63,484","550,63,477","541,63,542"];
var dilloClip;

register("renderWorld", () => {
    if(!inCrystalHollows()) return;
    registerServer();
    var area = getArea();
    if(Settings.createWaypoints && /^(Fairy Grotto)|(Jungle Temple)|(Mines of Divan)|(Lost Precursor City)|(Goblin Queen's Den)|(Khazad-dûm)$/g.exec(area)) {
        createRegion();
        var exists = false;
        getWaypoints().forEach((server) => {
            if(server.server.equals(getServerName())) {
                server.waypoints.forEach((waypoint) => {
                    if(waypoint.name.equals(area)) exists = true;
                });
            }
        });
        if(!exists) createWaypoint(area, Math.round(Player.getX())+","+Math.round(Player.getY())+","+Math.round(Player.getZ()), true)
    }
    if(Settings.createArmadilloClip) {
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
        if(dilloClip && dilloClip.server.equals(getServerName()) && (area.equals("Jungle Temple") || distance(dilloClip) < 20)) {
            var dist = distance(dilloClip);
            Tessellator.drawString("§6Armadillo Clip §e("+dist+"m)", dilloClip.x + 0.5, dilloClip.y + 1.5, dilloClip.z + 0.5, 0xFFFFFF, true, 0.75, true)
        }
    }
    if(!Settings.waypoint) return;
    if(Settings.nucleusWaypoints && !getArea().equals("Crystal Nucleus")) {
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
        Tessellator.drawString("§d§lCrystal Nucleus §e("+dist+"m)", x + 0.5, y + 1.5, z + 0.5, 0xFFFFFF, true, 0.75, true);
    }
    var server = getServer(getServerName());
    server.waypoints.forEach((waypoint) => {
        var coordinates = parseCoordinates(waypoint.location);
        var color = Settings.waypointColor;
        var x = parseInt(coordinates.x)-1;
        var y = parseInt(coordinates.y);
        var z = parseInt(coordinates.z)-1;

        var dist = distance(coordinates);
        renderBeaconBeam(x, 0, z, color.getRed() / 255, color.getGreen() / 255, color.getBlue() / 255, Math.min(0.8, Math.max(0, 0.05*Math.pow(dist, 2))*(color.getAlpha() / 255)), true);
        Tessellator.drawString("§e"+waypoint.name+" §c("+dist+"m)", x + 0.5, y + 1.5, z + 0.5, 0xFFFFFF, true, 0.75, true);
    });
});

// [123] lives on
register("renderPlayerList", () => {
    World.getAllPlayers().forEach(player => {
        
        if(player.getDisplayName().getText().endsWith("§7[123]")) {
            player.setTabDisplayName(new TextComponent(player.getDisplayName().getText().replace("§7[123]", "§7[§a1§e2§c3§7]")))
        }
    })
})