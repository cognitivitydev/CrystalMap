import Settings from "../config";
import renderBeaconBeam from "../../BeaconBeam"
import { getArea, getCoordinates, parseCoordinates } from "../WaypointManager";
import { calculateDistance, distance } from "../render/RenderUtils";

const corpses = {
    LAPIS: {
        name: "Lapis",
        id: "LAPIS_ARMOR_BOOTS"
    },
    TUNGSTEN: {
        name: "Tungsten",
        id: "MINERAL_BOOTS"
    },
    UMBER: {
        name: "Umber",
        id: "ARMOR_OF_YOG_BOOTS"
    },
    VANGUARD: {
        name: "Vanguard",
        id: "VANGUARD_BOOTS"
    },
}

var inMineshaft = false;
var exit = undefined;
var waypoints = [];

register("renderWorld", () => {
    if(Settings.mineshaftExit && exit) {
        var dist = distance(exit);
        renderBeaconBeam(exit.x-1, 0, exit.z-1, 1, 0, 0, Math.min(0.5, Math.max(0, 0.05*Math.pow(dist, 2))), true);
        Tessellator.drawString("§c§lEXIT §e("+dist+"m)", exit.x - 0.5, exit.y + 1.5, exit.z - 0.5, 0xFFFFFF, true, 0.75, true);
    }
    if(Settings.mineshaftShowWaypoints) {
        waypoints.forEach(waypoint => {
            var location = waypoint.location;
            var dist = distance(location);
            if(!waypoint.type) {
                renderBeaconBeam(parseInt(location.x)-1, parseInt(location.y), parseInt(location.z)-1, 0.5, 0.5, 0.5, Math.min(0.8, Math.max(0, 0.05*Math.pow(dist, 2))), true);
                Tessellator.drawString("§7Unknown §b("+dist+"m)", parseInt(location.x) - 0.5, parseInt(location.y) + 1.5, parseInt(location.z) - 0.5, 0xFFFFFF, true, 0.75, true);
            } else {
                renderBeaconBeam(parseInt(location.x)-1, parseInt(location.y), parseInt(location.z)-1, 0, 0.75, 1, Math.min(0.8, Math.max(0, 0.05*Math.pow(dist, 2))), true);
                Tessellator.drawString("§3"+waypoint.type.name+" §b("+dist+"m)", parseInt(location.x) - 0.5, parseInt(location.y) + 1.5, parseInt(location.z) - 0.5, 0xFFFFFF, true, 0.75, true);
            }
        });
    }
});

register("step", () => {
    if(getArea().equals("Glacite Mineshafts")) {
        if(!inMineshaft) {
            exit = {x: Math.round(Player.getX()), y: Math.round(Player.getY()), z: Math.round(Player.getZ())};
        }
        inMineshaft = true;
    } else {
        inMineshaft = false;
        exit = undefined;
        waypoints = [];
        return;
    }
    if(!Settings.mineshaftShowWaypoints) return;
    World.getAllEntitiesOfType(net.minecraft.entity.item.EntityArmorStand).filter(entity => distance(entity) < 5).forEach(entity => {
        var boots = new EntityLivingBase(entity.entity).getItemInSlot(1);
        if(!boots) return;
        var item = boots.getNBT().getCompoundTag("tag").getCompoundTag("ExtraAttributes").getString("id");
        for(var type in corpses) {
            if(corpses.hasOwnProperty(type) && corpses[type].id == item) {
                var found = false;
                waypoints.forEach(waypoint => {
                    if(distance(waypoint.location, entity) < 5) {
                        found = true;
                    }
                });
                if(found) return;
                waypoints.push({type: corpses[type], location: {x: entity.getX(), y: entity.getY(), z: entity.getZ()}});
                ChatLib.chat("&b[CRYSTALMAP] &7Added "+corpses[type].name + " Corpse waypoint to this mineshaft at &3"+Math.round(entity.getX())+", "+Math.round(entity.getY())+", "+Math.round(entity.getZ())+"&7!");
                
                if(!Settings.mineshaftShareWaypoints) return;
                var command = "pc"
                if(Settings.mineshaftShareChannel == 0) {
                    command = "ac"
                } else if(Settings.mineshaftShareChannel == 1) {
                    command = "pc"
                } else if(Settings.mineshaftShareChannel == 2) {
                    command = "cc"
                } else if(Settings.mineshaftShareChannel == 3) {
                    command = "gc"
                }            
                ChatLib.command(command+" "+corpses[type].name+" Corpse: "+Math.round(entity.getX())+", "+Math.round(entity.getY())+", "+Math.round(entity.getZ()));
            }
        }
    });
}).setFps(5);

register("chat", (event) => {
    if(!getArea().equals("Glacite Mineshafts")) return;
    if(!Settings.mineshaftParseWaypoints) return;
    var formatted = ChatLib.getChatMessage(event);
    var message = ChatLib.removeFormatting(formatted);
    var content = message.replace(/^((Party|Co-op) > )?(\[[0-9]+\] )?(\S )?(\[.+\] )?[A-Za-z0-9_]{3,16}( .)?: (?!$)/g, "");
    if(content.equals(message)) return;
    var coords = /(\s|^)((-?[0-9]{1,3}(,| |, )-?[0-9]{1,3}(,| |, )-?[0-9]{1,3})|(x:? ?-?\d{1,3}(,| |, )y:? ?-?\d{1,3}(,| |, )z:? ?-?\d{1,3}))(?=\s|$)/gi.exec(content);
    if(coords && Settings.mineshaftWaypoints) {
        var type = undefined;
        var coordinates = parseCoordinates(coords[0].trim().replace(/x:? ?/gi, "").replace(/(,| |, )[yz]:? ?/gi, ",").replace(/(, |,| )/gi, ","));
        for(var corpseType in corpses) {
            if(corpses.hasOwnProperty(corpseType)) {
                if(content.toLowerCase().includes(corpses[corpseType].name.toLowerCase())) {
                    type = corpses[corpseType];
                }
            }
        }
        var found = false;
        waypoints.forEach(waypoint => {
            if(calculateDistance(coordinates, waypoint.location) < 5) {
                found = true;
            }
        })
        if(!found) {
            waypoints.push({type: type, location: coordinates});
            ChatLib.chat("&b[CRYSTALMAP] &7Added "+(type ? type.name + " Corpse" : "an unknown") +" waypoint to this mineshaft at &3"+coordinates.x+", "+coordinates.y+", "+coordinates.z+"&7!");
        }
    }
});