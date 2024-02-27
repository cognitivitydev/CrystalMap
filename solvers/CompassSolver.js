/* 
 * This module can be found at https://github.com/cognitivitydev/CrystalMap/.
 * You can report any issues or add suggestions there.
 */

/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />

import RenderLibV2 from "../../RenderLibV2";
import Settings from "../config"
import { calculateDistance } from "../render/RenderUtils";

const EnumParticleTypes = Java.type("net.minecraft.util.EnumParticleTypes");

var lastCompass = 0;
var spawningParticles = false;
var firstParticle = undefined;
var spawnedParticles = 0;
var particle1 = undefined;
var particle2 = undefined;
var particle3 = undefined;
var particle4 = undefined;

register("chat", (event) => {
    if(Settings.compassSolver != 1) return;
    var formattedMessage = ChatLib.getChatMessage(event);
    var message = ChatLib.removeFormatting(formattedMessage);
    if(message.equals("Your Wishing Compass shattered into pieces!")) {
        lastCompass = Date.now();
        spawnedParticles = 0;
        spawningParticles = false;
    }
});
register("renderWorld", () => {
    if(Settings.compassSolver != 1) return;
    if(particle1 && particle2) {
        let x = particle1.getX();
        let y = particle1.getY();
        let z = particle1.getZ();
        let x2 = particle2.getX();
        let y2 = particle2.getY();
        let z2 = particle2.getZ();
        const dx = x2 - x;
        const dy = y2 - y;
        const dz = z2 - z;
        
        const extendedX2 = x + (dx * 100);
        const extendedY2 = y + (dy * 100);
        const extendedZ2 = z + (dz * 100);
        
        RenderLibV2.drawLine(x, y, z, extendedX2, extendedY2, extendedZ2, 0, 0.25, 1, 0.8, true);
    }
    if(particle3 && particle4) {
        let x = particle3.getX();
        let y = particle3.getY();
        let z = particle3.getZ();
        let x2 = particle4.getX();
        let y2 = particle4.getY();
        let z2 = particle4.getZ();
        const dx = x2 - x;
        const dy = y2 - y;
        const dz = z2 - z;

        const extendedX2 = x + (dx * 100);
        const extendedY2 = y + (dy * 100);
        const extendedZ2 = z + (dz * 100);

        RenderLibV2.drawLine(x, y, z, extendedX2, extendedY2, extendedZ2, 0, 0.5, 1, 0.8, true);
    }
});

register("spawnParticle", (particle, type, event) => {
    if((Date.now() - lastCompass) > 8000) {
        return;
    }
    if(!type.equals(EnumParticleTypes.VILLAGER_HAPPY)) {
        return;
    }
    if(spawnedParticles == 19) {
        return;
    }
    if(calculateDistance(Player.getX(), Player.getY(), Player.getZ(), particle.getX(), particle.getY(), particle.getZ()) > 15) return;
    if(!spawningParticles) {
        if(particle4) {
            particle1 = undefined;
            particle2 = undefined;
            particle3 = undefined;
            particle4 = undefined;
        }
        spawningParticles = true;
        spawnedParticles = 0;
        firstParticle = particle;
        if(!particle1) {
            particle1 = particle;
        } else {
            particle3 = particle;
        }
    } else if(spawnedParticles == 18) {
        lastParticle = particle;
        if(!particle2) {
            particle2 = particle;
        } else {
            particle4 = particle;
            triangulate();
        }
    }
    spawnedParticles++;
});

function triangulate() {
    const p1 = { x: particle1.getX(), y: particle1.getY(), z: particle1.getZ() };
    const p2 = { x: particle2.getX(), y: particle2.getY(), z: particle2.getZ() };
    const p3 = { x: particle3.getX(), y: particle3.getY(), z: particle3.getZ() };
    const p4 = { x: particle4.getX(), y: particle4.getY(), z: particle4.getZ() };

    const dir1 = { x: p2.x - p1.x, y: p2.y - p1.y, z: p2.z - p1.z };
    const dir2 = { x: p4.x - p3.x, y: p4.y - p3.y, z: p4.z - p3.z };
    const d1 = (p1.x - p3.x) * dir2.x + (p1.y - p3.y) * dir2.y + (p1.z - p3.z) * dir2.z;
    const d2 = dir2.x * dir1.x + dir2.y * dir1.y + dir2.z * dir1.z;
    const d3 = (p1.x - p3.x) * dir1.x + (p1.y - p3.y) * dir1.y + (p1.z - p3.z) * dir1.z;
    const d4 = dir2.x * dir2.x + dir2.y * dir2.y + dir2.z * dir2.z;
    const d5 = dir1.x * dir1.x + dir1.y * dir1.y + dir1.z * dir1.z;

    const denominator = d5 * d4 - d2 * d2;
    let mua, mub;
    if (denominator !== 0) {
        mua = (d1 * d2 - d3 * d4) / denominator;
        mub = (d1 + mua * d2) / d4;
    } else return null;

    const x = Math.round((p1.x + mua * dir1.x + p3.x + mub * dir2.x) / 2);
    const y = Math.round((p1.y + mua * dir1.y + p3.y + mub * dir2.y) / 2);
    const z = Math.round((p1.z + mua * dir1.z + p3.z + mub * dir2.z) / 2);
    
    ChatLib.chat("&aEstimated solution for compasses: "+x+","+y+","+z);
    ChatLib.chat(new TextComponent("&e&nClick here to add a waypoint.").setClick("run_command", "/crystalmap waypoint Wishing Compass "+x+","+y+","+z));
}