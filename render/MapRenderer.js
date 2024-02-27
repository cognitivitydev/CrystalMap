/* 
 * This module can be found at https://github.com/cognitivitydev/CrystalMap/.
 * You can report any issues or add suggestions there.
 */

/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />

import Settings from "../config";
import { getServerName, getServerRegion, getWaypoint, parseCoordinates, getServer, inCrystalHollows, getArea, registerServer } from "../WaypointManager";

var apiOffline = false;

const mapImage = Image.fromFile("./config/ChatTriggers/modules/CrystalMap/assets/map-normal.png")
const magmaImage = Image.fromFile("./config/ChatTriggers/modules/CrystalMap/assets/map-magma.png")
const mapArrow = Image.fromFile("./config/ChatTriggers/modules/CrystalMap/assets/map-arrow.png")

const genericIcon = {
    "vanilla": Image.fromFile("./config/ChatTriggers/modules/CrystalMap/assets/generic-vanilla.png"),
    "furfsky": Image.fromFile("./config/ChatTriggers/modules/CrystalMap/assets/generic-furfsky.png")
}
const entranceIcon = Image.fromFile("./config/ChatTriggers/modules/CrystalMap/assets/entrance-furfsky.png");
const grottoIcon = {
    "vanilla": Image.fromFile("./config/ChatTriggers/modules/CrystalMap/assets/grotto-vanilla.png"),
    "furfsky": Image.fromFile("./config/ChatTriggers/modules/CrystalMap/assets/grotto-furfsky.png")
}
const templeIcon = {
    "vanilla": Image.fromFile("./config/ChatTriggers/modules/CrystalMap/assets/temple-vanilla.png"),
    "furfsky": Image.fromFile("./config/ChatTriggers/modules/CrystalMap/assets/temple-furfsky.png")
}
const cityIcon = {
    "vanilla": Image.fromFile("./config/ChatTriggers/modules/CrystalMap/assets/city-vanilla.png"),
    "furfsky": Image.fromFile("./config/ChatTriggers/modules/CrystalMap/assets/city-furfsky.png")
}
const kingIcon = {
    "vanilla": Image.fromFile("./config/ChatTriggers/modules/CrystalMap/assets/king-vanilla.png"),
    "furfsky": Image.fromFile("./config/ChatTriggers/modules/CrystalMap/assets/king-furfsky.png")
}
const queenIcon = {
    "vanilla": Image.fromFile("./config/ChatTriggers/modules/CrystalMap/assets/queen-vanilla.png"),
    "furfsky": Image.fromFile("./config/ChatTriggers/modules/CrystalMap/assets/queen-furfsky.png")
}
const divanIcon = {
    "vanilla": Image.fromFile("./config/ChatTriggers/modules/CrystalMap/assets/divan-vanilla.png"),
    "furfsky": Image.fromFile("./config/ChatTriggers/modules/CrystalMap/assets/divan-furfsky.png")
}
const balIcon = {
    "vanilla": Image.fromFile("./config/ChatTriggers/modules/CrystalMap/assets/bal-vanilla.png"),
    "furfsky": Image.fromFile("./config/ChatTriggers/modules/CrystalMap/assets/bal-furfsky.png")
}
const corleoneIcon = {
    "vanilla": Image.fromFile("./config/ChatTriggers/modules/CrystalMap/assets/corleone-vanilla.png"),
    "furfsky": Image.fromFile("./config/ChatTriggers/modules/CrystalMap/assets/corleone-furfsky.png")
}
const odawaIcon = {
    "vanilla": Image.fromFile("./config/ChatTriggers/modules/CrystalMap/assets/odawa-vanilla.png"),
    "furfsky": Image.fromFile("./config/ChatTriggers/modules/CrystalMap/assets/odawa-furfsky.png")
}
var head;
try {
    head = Image.fromUrl("https://visage.surgeplay.com/face/512/"+Player.getUUID()+".png");
} catch (error) {
    if(!apiOffline) {
        console.warn("[CrystalMap] Couldn't load your head texture. (\"https://visage.surgeplay.com/face/512/"+Player.getUUID()+".png\"). Defaulting to arrow icon...");
        console.warn("  Contents:");
        console.warn(FileLib.getUrlContent("https://visage.surgeplay.com/face/512/"+Player.getUUID()+".png"));
        ChatLib.chat("&d[CrystalMap] &7Head textures failed to load. Defaulting to arrow icon for this session...");
        apiOffline = true;
        head = mapArrow;
    }
}

const entrances = [
    // TOP
    {x: 211, y: 86, z: 238},
    {x: 211, y: 113, z: 417},
    {x: 211, y: 138, z: 533},
    {x: 211, y: 65, z: 598},
    {x: 211, y: 115, z: 622},
    {x: 211, y: 160, z: 647},
    // LEFT
    {x: 222, y: 134, z: 211},
    {x: 235, y: 88, z: 211},
    {x: 263, y: 132, z: 211},
    {x: 309, y: 149, z: 211},
    {x: 385, y: 163, z: 211},
    {x: 499, y: 85, z: 211},
    {x: 584, y: 91, z: 211},
    {x: 647, y: 160, z: 211},
    {x: 738, y: 139, z: 211},
    // BOTTOM
    {x: 814, y: 167, z: 281},
    {x: 814, y: 142, z: 425},
    {x: 814, y: 71, z: 428},
    {x: 814, y: 170, z: 479},
    {x: 814, y: 178, z: 586},
    {x: 814, y: 93, z: 604},
    {x: 814, y: 70, z: 694},
    {x: 814, y: 103, z: 743},
    {x: 814, y: 131, z: 794},
    // RIGHT
    {x: 249, y: 142, z: 814},
    {x: 477, y: 95, z: 814},
    {x: 591, y: 148, z: 814},
    {x: 665, y: 91, z: 814},
    {x: 705, y: 66, z: 814},
    {x: 714, y: 127, z: 814},
    {x: 759, y: 121, z: 814},
]

register("renderOverlay", () => {
    if(Player.getX() <= 202 || Player.getX() >= 824) return;
    if(Player.getX() <= 30 || Player.getY() >= 188) return;
    if(Player.getZ() <= 202 || Player.getZ() >= 824) return;
    if(!inCrystalHollows() || !getServerName().startsWith("m")) return;
    if(!Settings.map) return;
    registerServer();

    var size = 128 * Settings.scale;
    var x = Settings.mapX * Renderer.screen.getWidth();
    var y = Settings.mapY * Renderer.screen.getHeight();
    Renderer.drawImage(Player.getY() >= 64 ? mapImage : magmaImage, x, y, size, size);
  
    if(Settings.iconEntranceVisible && Player.getY() >= 64) {
        entrances.forEach(entrance => {
            rot = 0;
            if(entrance.x == 211) {
                rot = 90;
            } else if(entrance.z == 211) {
                rot = 180;
            } else if(entrance.x == 814) {
                rot = -90;
            } else if(entrance.z == 814) {
                rot = 0
            }
            renderIcon(entranceIcon, 8 * Settings.iconEntranceSize, 8 * Settings.iconEntranceSize, entrance.x, entrance.z, rot, false)
        })
    }
    var server = getServerRegion()
    if(server == undefined) {
        console.error("Server region is undefined!");
        console.error(Scoreboard.getLines());
        console.error("Server name: "+getServerName());
    } else {
        server.regions.forEach((region) => {
            if(getArea().equals(region.name) && (Player.getX() >= 563 || Player.getX() <= 463 || Player.getZ() >= 563 || Player.getZ() <= 463)) {
                if((Player.getX() < region.min.x && region.min.x - Player.getX() < 50) || region.min.x == 0) {
                    region.min.x = Player.getX();
                }
                if((Player.getX() > region.max.x && Player.getX() - region.max.x < 50) || region.max.x == 0) {
                    region.max.x = Player.getX();
                }
        
                if((Player.getZ() < region.min.z && region.min.z - Player.getZ() < 50) || region.max.z == 0) {
                    region.min.z = Player.getZ();
                }
                if((Player.getZ() > region.max.z && Player.getZ() - region.max.z < 50) || region.max.z == 0) {
                    region.max.z = Player.getZ();
                }
            }
            if(Settings.showArea) {
                var preferences = {
                    "Fairy Grotto": {
                        visible: Settings.areaGrottoVisible,
                        color: Settings.areaGrottoColor
                    },
                    "Goblin Queen's Den": {
                        visible: Settings.areaQueenVisible,
                        color: Settings.areaQueenColor
                    },
                    "Jungle Temple": {
                        visible: Settings.areaTempleVisible,
                        color: Settings.areaTempleColor
                    },
                    "Khazad-dûm": {
                        visible: Settings.areaBalVisible,
                        color: Settings.areaBalColor
                    },
                    "Lost Precursor City": {
                        visible: Settings.areaCityVisible,
                        color: Settings.areaCityColor
                    },
                    "Mines of Divan": {
                        visible: Settings.areaDivanVisible,
                        color: Settings.areaDivanColor
                    }
                };
                
                var regionSettings = preferences[region.name];
                if(region && regionSettings.visible) {
                    if(region.min.x != 0 && region.max.x != 0 && region.min.z != 0 && region.max.z != 0) {
                        var boxWidth = (region.max.x - region.min.x)*(128/621);
                        var boxHeight = (region.max.z - region.min.z)*(128/621);
                        var color = Renderer.color(regionSettings.color.getRed(), regionSettings.color.getGreen(), regionSettings.color.getBlue());
                        renderRect(color, boxWidth, boxHeight, region.min.x+boxWidth*2, region.min.z+boxHeight*2, 0);
                    }
                }
            }
        });
    }
  
    if(Settings.iconPlayerVisible) {
        let isArrow = Settings.iconPlayerType == 0 || apiOffline;
        if(isArrow) {
            var playerIcon = mapArrow;
            var width = 5;
            var height = 7;
        } else if(Settings.iconPlayerType == 1) {
            var playerIcon = head;
            var width = 8;
            var height = 8;
        }
  
        renderIcon(playerIcon, width * Settings.iconPlayerSize, height * Settings.iconPlayerSize, Player.getX(), Player.getZ(), Player.getYaw()-180, !isArrow);
    }
    width = 16;
    height = 16;
    var server = getServerName();
    renderWaypoint(corleoneIcon, Settings.iconCorleoneVisible, Settings.iconCorleoneType, Settings.iconCorleoneSize, "Boss Corleone", "corleone");
    renderWaypoint(grottoIcon, Settings.iconGrottoVisible, Settings.iconGrottoType, Settings.iconGrottoSize, "Fairy Grotto", "grotto");
    renderWaypoint(kingIcon, Settings.iconKingVisible, Settings.iconKingType, Settings.iconKingSize, "King Yolkar", "king");
    renderWaypoint(queenIcon, Settings.iconQueenVisible, Settings.iconQueenType, Settings.iconQueenSize, "Goblin Queen's Den", "queen");
    renderWaypoint(templeIcon, Settings.iconTempleVisible, Settings.iconTempleType, Settings.iconTempleSize, "Jungle Temple", "temple");
    renderWaypoint(odawaIcon, Settings.iconOdawaVisible, Settings.iconOdawaType, Settings.iconOdawaSize, "Odawa");
    renderWaypoint(balIcon, Settings.iconBalVisible, Settings.iconBalType, Settings.iconBalSize, "Khazad-dûm", "Khazad-dum", "bal");
    renderWaypoint(cityIcon, Settings.iconCityVisible, Settings.iconCityType, Settings.iconCitySize, "Lost Precursor City", "city");
    renderWaypoint(divanIcon, Settings.iconDivanVisible, Settings.iconDivanType, Settings.iconDivanSize, "Mines of Divan", "divan");
    if(Settings.iconGenericVisible) {
        server = getServer(getServerName());
        if(server == undefined) return;
        var waypointList = server.waypoints;
        waypointList.forEach((waypoint) => {
            if(/(corleone|(Fairy )?Grotto|King( Yolkar)?|Goblin Queen's Den|queen|(Jungle )?Temple|Khazad-d[ûu]m|bal|(Lost Precursor )?City|(Mines of )?Divan|Odawa)/gi.exec(waypoint.name)) return;
            coords = parseCoordinates(waypoint.location);
            renderIcon(Settings.iconGenericType == 0 ? genericIcon.vanilla : genericIcon.furfsky, width * Settings.iconGenericSize, height * Settings.iconGenericSize, coords.x, coords.z, 0, false);
        });
    }
});

function renderWaypoint(icon, visible, type, size, ...names) {
    var server = getServerName();
    var waypoint = getWaypoint(server, names[0], names.splice(1, names.length));
    if(!waypoint || !visible) return;

    coords = parseCoordinates(waypoint.location);
    var currentRegion;
    getServerRegion().regions.forEach((region) => {
        names.forEach(name => {
            if(region.name.equalsIgnoreCase(name)) {
                currentRegion = region;
            }
        });
    });
    if(Settings.centerWaypointArea && currentRegion && currentRegion.min.x != 0 && currentRegion.max.x != 0 && currentRegion.min.z != 0 && currentRegion.max.z != 0) {
        coords.x = currentRegion.min.x+(currentRegion.max.x-currentRegion.min.x)/2-32*(128/621);
        coords.z = currentRegion.min.z+(currentRegion.max.z-currentRegion.min.z)/2-32*(128/621);
    }
    renderIcon(type == 0 ? icon.vanilla : icon.furfsky, 16 * size, 16 * size, coords.x, coords.z, 0, false);
}
function renderIcon(icon, width, height, x, y, yaw, outline) {
    if (outline) {
        renderRect(Renderer.color(0, 0, 0), width + 1, height + 1, x, y, yaw, outline);
    }

    Tessellator.pushMatrix();
    Renderer.retainTransforms(true);
    Tessellator.enableAlpha();


    Renderer.translate((x - 202) * (128 / 621) * Settings.scale, (y - 202) * (128 / 621) * Settings.scale);
    Renderer.translate(Settings.mapX * Renderer.screen.getWidth(), Settings.mapY * Renderer.screen.getHeight());
    Renderer.rotate(yaw);
    Renderer.scale(Settings.scale);

    Renderer.drawImage(icon, -width / 2, -height / 2, width, height);

    Renderer.retainTransforms(false);
    Tessellator.popMatrix();
}

function renderRect(color, width, height, x, y, yaw) {
    Tessellator.pushMatrix();
    Renderer.retainTransforms(true);
    Tessellator.enableAlpha();


    Renderer.translate((x - 202) * (128 / 621) * Settings.scale, (y - 202) * (128 / 621) * Settings.scale);
    Renderer.translate(Settings.mapX * Renderer.screen.getWidth(), Settings.mapY * Renderer.screen.getHeight());
    Renderer.rotate(yaw);
    Renderer.scale(Settings.scale); 

    Renderer.drawRect(color, -(width) / 2, -(height) / 2, (width), (height));
    Renderer.retainTransforms(false);
    Tessellator.popMatrix();
}