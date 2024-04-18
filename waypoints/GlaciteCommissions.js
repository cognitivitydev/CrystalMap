/* 
 * This module can be found at https://github.com/cognitivitydev/CrystalMap/.
 * You can report any issues or add suggestions there.
 */

/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />

import { distance } from "../render/RenderUtils";
import renderBeaconBeam from "../../BeaconBeam"
import { inGlaciteTunnels } from "../WaypointManager";
import Settings from "../config";

const Color = Java.type("java.awt.Color");

const gemstones = {
    AQUAMARINE: {name: "Aquamarine", color: new Color(0, 0, 170 / 255, 1), locations: [{x: -1, y: 140, z: 435}, {x: 53, y: 151, z: 401}, {x: 84, y: 151, z: 323}]},
    CITRINE: {name: "Citrine", color: new Color(170 / 255, 0, 0, 1), locations: [{x: -40, y: 129, z: 416}, {x: -57, y: 145, z: 421}, {x: 36, y: 120, z: 387}]},
    ONYX: {name: "Onyx", color: new Color(85 / 255, 85 / 255, 85 / 255, 1), locations: [{x: 79, y: 120, z: 412}, {x: -11, y: 133, z: 386}, {x: -68, y: 131, z: 409}]},
    PERIDOT: {name: "Peridot", color: new Color(0, 170 / 255, 0, 1), locations: [{x: 91, y: 123, z: 397}, {x: -73, y: 124, z: 461}, {x: -76, y: 121, z: 281}, {x: -62, y: 147, z: 304}]}
}

var currentLocations = [];

register("renderWorld", () => {
    if(!inGlaciteTunnels()) return;
    if(!Settings.glaciteCommissions) return;
    currentLocations.forEach(gemstone => {
        gemstone.locations.forEach(location => {
            var dist = distance(location);

            renderBeaconBeam(location.x, 0, location.z, gemstone.color.getRed() / 255, gemstone.color.getGreen() / 255, gemstone.color.getBlue() / 255, Math.min(0.8, Math.max(0, 0.05*Math.pow(dist, 2))), true);
            Tessellator.drawString(gemstone.name+" §b("+dist+"m)", location.x + 0.5, location.y + 1.5, location.z + 0.5, gemstone.color.getRGB(), true, 0.75, true);    
        });
    })
})

register("step", () => {
    if(!inGlaciteTunnels()) return;
    if(!Settings.glaciteCommissions) return;

    currentLocations = [];
    try {
        TabList.getNames().forEach(name => {
            let line = ChatLib.removeFormatting(name);
            if(line.startsWith(" Aquamarine Gemstone Collector:")) {
                currentLocations.push(gemstones.AQUAMARINE);
            }
            if(line.startsWith(" Citrine Gemstone Collector:")) {
                currentLocations.push(gemstones.CITRINE);
            }
            if(line.startsWith(" Onyx Gemstone Collector:")) {
                currentLocations.push(gemstones.ONYX);
            }
            if(line.startsWith(" Peridot Gemstone Collector:")) {
                currentLocations.push(gemstones.PERIDOT);
            }
        });
    } catch(exception) {}
}).setFps(5);