/* 
 * This module can be found at https://github.com/cognitivitydev/CrystalMap/.
 * You can report any issues or add suggestions there.
 */

/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />

import Settings from "../config"

const C17PacketCustomPayload = net.minecraft.network.play.client.C17PacketCustomPayload
const PacketBuffer = net.minecraft.network.PacketBuffer
const Unpooled = Java.type('io.netty.buffer.Unpooled')
const System = Java.type("java.lang.System");

var pinging;

export function distance(location) {
    var distance = Math.hypot(Player.getX()-location.x+0.5, Player.getZ()-location.z+0.5);
    var decimal = distance >= 100 ? 0 : distance >= 10 ? 1 : 2
    return Math.round(distance * Math.pow(10, decimal)) / Math.pow(10, decimal);
}
export function refreshPing() {
    const hypixelPing = new C17PacketCustomPayload("hypixel:ping", new PacketBuffer(Unpooled.buffer(1).writeByte(1)))
    Client.sendPacket(hypixelPing);
    var start = System.nanoTime();
    ChatLib.chat("&8&oPinging... (1/3)");
    var pings = [];
    const packetEvent = register('packetReceived', packet => {
        if (packet.func_149169_c() == 'hypixel:ping') {
            var ms = Math.floor((System.nanoTime() - start) / 1000000);
            pings.push(ms);
            if(pings.length >= 3) {
                packetEvent.unregister();
                Settings.ping = Math.floor((pings[0]+pings[1]+pings[2])/3);
                ChatLib.chat("&d[CRYSTAL MAP] &7Your ping has been set to &a"+Settings.ping+" ms&7. This can be changed at any time in settings.")
            } else {
                Client.sendPacket(hypixelPing);
                start = System.nanoTime();
                ChatLib.chat("&8&oPinging... ("+(pings.length+1)+"/3)");
            }
        }
    }).setFilteredClass(net.minecraft.network.play.server.S3FPacketCustomPayload);    
}

export function calculateDistance(location1, location2) {
    const dx = location1.x - location2.x;
    const dy = location1.y - location2.y;
    const dz = location1.z - location2.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

export function calculateWeightedDistance(location1, location2) {
    return Math.hypot(parseInt(location2.x) - parseInt(location1.x), (parseInt(location2.y) - parseInt(location1.y)) * 3.5, parseInt(location2.z) - parseInt(location1.z));
}