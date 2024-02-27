/* 
 * This module can be found at https://github.com/cognitivitydev/CrystalMap/.
 * You can report any issues or add suggestions there.
 */

/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />

import RenderLibV2 from "../../RenderLibV2"
import renderBeaconBeam from "../../BeaconBeam"
import { getArea, getCoordinates, getServerName, getWaypoint, inCrystalHollows, parseCoordinates } from "../WaypointManager";
import Settings from "../config"
import { calculateDistance } from "../render/RenderUtils";

const treasures = [
    "43,-20,-16",
    "12,-21,31",
    "6,-20,28",
    "-37,-20,-22",
    "-14,-20,2  2",
    "-37,-20,-14",
    "20,-20,-26",
    "-17,-20,20",
    "42,-18,-41",
    "25,-21,17",
    "-23,-21,40",
    "12,-20,7",
    "24,-21,27",
    "29,-20,-44",
    "38,-21,-26",
    "-42,-19,-28",
    "30,-20,-25",
    "22,-20,-14",
    "-14,-20,43",
    "-5,-20,16",
    "23,-21,-39",
    "7,-20,11",
    "12,-21,-22",
    "19,-21,29",
    "-40,-21,18",
    "12,-20,-43",
    "-12,-20,-44",
    "-36,-19,42",
    "7,-20,22",
    "-31,-20,-40",
    "20,-21,0",
    "-1,-21,-20",
    "-20,-21,0",
    "-38,-21,26",
    "-31,-20,-12",
    "-24,-21,12",
    "-43,-21,-40",
    "1,-20,20",
    "40,-21,-30",
    "-14,-20,22"
];

var refreshes = 0;
var treasureLocation = undefined;
var lastMovement = 0;
var lastTreasure = 0;
var lastActionBar = 0;
var locations = 0;
var middle = undefined;
var actionBar = "";

register("chat", (event) => {
    var message = ChatLib.removeFormatting(ChatLib.getChatMessage(event));
    if(!/^You found .+ with your Metal Detector!$/g.exec(message)) return;
    locations = 0;
    treasureLocation = undefined;
    lastTreasure = Date.now();
});

register("renderOverlay", () => {
    if(!Settings.divanSolver) return;
    if(!getArea().equals("Mines of Divan")) return;
    var server = getServerName();
    World.getAllEntitiesOfType(net.minecraft.entity.item.EntityArmorStand).forEach(entity => {
        if(ChatLib.removeFormatting(entity.getName()).equals("Keeper of Lapis") && (!middle || !middle.server.equals(server))) {            
            middle = {server: server, location: Math.ceil(entity.getX()-33)+","+entity.getY()+","+Math.ceil(entity.getZ()-3)};
        }
        if(ChatLib.removeFormatting(entity.getName()).equals("Keeper of Emerald") && (!middle || !middle.server.equals(server))) {
            middle = {server: server, location: Math.ceil(entity.getX()-3)+","+entity.getY()+","+Math.ceil(entity.getZ()+33)};
        }
        if(ChatLib.removeFormatting(entity.getName()).equals("Keeper of Diamond") && (!middle || !middle.server.equals(server))) {
            middle = {server: server, location: Math.ceil(entity.getX()+33)+","+entity.getY()+","+Math.ceil(entity.getZ()+3)};
        }
        if(ChatLib.removeFormatting(entity.getName()).equals("Keeper of Gold") && (!middle || !middle.server.equals(server))) {
            middle = {server: server, location: Math.ceil(entity.getX()+3)+","+entity.getY()+","+Math.ceil(entity.getZ()-33)};
        }
    });
    if(!middle || !middle.server.equals(server)) {
        if(!actionBar.includes("TREASURE: ")) return;
        Renderer.drawString("&6Metal Detector Solver is disabled.", 1920/4+5, 1080/4+5, true);
        Renderer.drawString("&7&oMove closer to a Keeper.", 1920/4+5, 1080/4+15, true);
        return;
    }
    var coords = parseCoordinates(middle.location);
    if(locations == 1 && treasureLocation) {
        var location = parseCoordinates(treasureLocation);
        if(Settings.metalDetectorDebug) {
            let offset = {x: Math.ceil(Player.getX()-coords.x), y: Math.ceil(Player.getY()-coords.y), z: Math.ceil(Player.getZ()-coords.z)};
            Renderer.drawString("&7offset="+JSON.stringify(offset), 1920/4+5, 1080/4+27, true);
            Renderer.drawString("&7solution="+JSON.stringify(location), 1920/4+5, 1080/4+37, true);
        }    
        location.x = parseFloat(location.x) + parseFloat(coords.x) - 1;
        location.y = parseFloat(location.y) + parseFloat(coords.y);
        location.z = parseFloat(location.z) + parseFloat(coords.z) - 1;
        Renderer.drawString("&a&l"+calculateDistance(location, {x: Player.getX(), y: Player.getY(), z: Player.getZ()}).toFixed(2)+"&am", 1920/4+5, 1080/4+5, true);
        return;
    }
    if(!actionBar.includes("TREASURE: ")) {
        return;
    }
    var coords = parseCoordinates(middle.location);
    if(Settings.metalDetectorDebug) {
        let offset = {x: Math.ceil(Player.getX()-coords.x), y: Math.ceil(Player.getY()-coords.y), z: Math.ceil(Player.getZ()-coords.z)};
        Renderer.drawString("&7offset="+JSON.stringify(offset), 1920/4+5, 1080/4+27, true);
        Renderer.drawString("&7solution=none", 1920/4+5, 1080/4+37, true);
    }
    if(lastMovement - lastTreasure > Settings.ping+50 && locations == 0) {
        Renderer.drawString("&5Cannot find location.", 1920/4+5, 1080/4+5, true);
        Renderer.drawString("&7&oPlease stand still.", 1920/4+5, 1080/4+15, true);
        return;
    } else {
        if((Date.now()-lastTreasure) < 2500 && locations == 0) return;
    }
    if(locations == 0) {
        Renderer.drawString("&cNo solutions found.", 1920/4+5, 1080/4+5, true);
        Renderer.drawString("&7&oMove around and try again.", 1920/4+5, 1080/4+15, true);
    } else if(locations > 1) {
        Renderer.drawString("&e&l"+locations+"&e solutions found.", 1920/4+5, 1080/4+5, true);
        Renderer.drawString("&7&oMove around and try again.", 1920/4+5, 1080/4+15, true);
    }
});

register("actionBar", (msg) => {
    if(!Settings.divanSolver) return;
    if(!getArea().equals("Mines of Divan")) return;
    lastActionBar = Date.now();
    actionBar = ChatLib.removeFormatting(ChatLib.getChatMessage(msg));
    if(!middle || !middle.server.equals(getServerName())) return;
    refreshes++;
    if(!actionBar.includes("TREASURE: ")) {
        return;
    }
    if((Date.now() - lastMovement) < Settings.ping+50 || refreshes < 2) return;
    var results = [];
    let distance = parseFloat(actionBar.split("TREASURE: ")[1].replace("m", ""));
    var coords = parseCoordinates(middle.location);
    for(var index in treasures) {
        var treasure = treasures[index];
        let offset = parseCoordinates(treasure);
        let chest = {x: parseFloat(coords.x)+parseFloat(offset.x)-1, y: parseFloat(coords.y)+parseFloat(offset.y), z: parseFloat(coords.z)+parseFloat(offset.z)-1};
        let player = {x: Player.getX(), y: Player.getY(), z: Player.getZ()};
        if(parseFloat((calculateDistance(player, chest)).toFixed(1))-distance == 0) {
            results.push(treasure);
        }
    }
    locations = results.length;
    if(results.length == 1) {
        treasureLocation = results[0];
        return;
    }
    treasureLocation = undefined;
});
register("renderWorld", () => {
    if(!Settings.divanSolver) return;
    if(!getArea().equals("Mines of Divan")) return;
    if(!middle || !middle.server.equals(getServerName())) return;
    if(Player.getMotionX() != 0 || Math.abs(Player.getMotionY()) > 0.08 || Player.getMotionZ() != 0) {
        lastMovement = Date.now();
        refreshes = 0;
    }
    if(!treasureLocation) return;
    let coords = parseCoordinates(middle.location);
    let offset = parseCoordinates(treasureLocation);
    var beacon = Settings.divanBeacon;
    var line = Settings.divanLine;
    let chest = {x: parseFloat(coords.x)+parseFloat(offset.x)-1, y: parseFloat(coords.y)+parseFloat(offset.y), z: parseFloat(coords.z)+parseFloat(offset.z)-1};
    
    renderBeaconBeam(chest.x, chest.y, chest.z, beacon.getRed() / 255, beacon.getGreen() / 255, beacon.getBlue() / 255, 1, false);
    RenderLibV2.drawInnerEspBoxV2(chest.x+0.5, chest.y-1, chest.z+0.5, 1, 1, 1, line.getRed() / 255, line.getGreen() / 255, line.getBlue() / 255, 0.25, true)
    RenderLibV2.drawLine(Player.getRenderX(), Player.getRenderY() + Player.asPlayerMP().getEyeHeight(), Player.getRenderZ(), chest.x+0.5, chest.y, chest.z+0.5, line.getRed() / 255, line.getGreen() / 255, line.getBlue() / 255, 1, true)
});