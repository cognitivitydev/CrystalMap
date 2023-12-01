import Settings from "../config";
import { renderIcon, renderRect } from "./renderUtils";
import { registerServer, getArea, createRegion, getServerName, waypoints, createWaypoint, getServerRegion, getWaypoint, parseCoordinates, getServer } from "../waypoints";


const mapImage = new Image("crystalmap.png", "https://i.imgur.com/hlDUhZo.png");
const magmaImage = new Image("crystalmap2.png", "https://i.imgur.com/HafT7bu.png");
const mapArrow = new Image("mapArrow.png", "https://i.imgur.com/D9u8vVi.png");

const genericIcon = {
    "vanilla": new Image("generic_waypoint.png", "https://i.imgur.com/ePP6A2C.png"),
    "furfsky": new Image("generic_waypoint_furf.png", "https://i.imgur.com/KkBwFpx.png")
}
const entranceIcon = new Image("entrance.png", "https://i.imgur.com/8GiZNCK.png");
const grottoIcon = {
    "vanilla": new Image("fairy_grotto.png", "https://i.imgur.com/bKaR3fq.png"),
    "furfsky": new Image("fairy_grotto_furf.png", "https://i.imgur.com/IVTsnSc.png")
}
const templeIcon = {
    "vanilla": new Image("jungle_temple.png", "https://i.imgur.com/A6FQKAi.png"),
    "furfsky": new Image("jungle_temple_furf.png", "https://i.imgur.com/yZFXMpJ.png"),
}
const cityIcon = {
    "vanilla": new Image("lost_precursor_city.png", "https://i.imgur.com/229wTg5.png"),
    "furfsky": new Image("lost_precursor_city_furf.png", "https://i.imgur.com/qiOKcvm.png"),
}
const kingIcon = {
    "vanilla": new Image("goblin_king.png", "https://i.imgur.com/Nf5TlQk.png"),
    "furfsky": new Image("goblin_king_furf.png", "https://i.imgur.com/DRIb8Rd.png"),
}
const queenIcon = {
    "vanilla": new Image("goblin_queens_den.png", "https://i.imgur.com/NxrepNN.png"),
    "furfsky": new Image("goblin_queens_den_furf.png", "https://i.imgur.com/yN4yNwL.png"),
}
const divanIcon = {
    "vanilla": new Image("mines_of_divan.png", "https://i.imgur.com/zpHBXbi.png"),
    "furfsky": new Image("mines_of_divan_furf.png", "https://i.imgur.com/iPQAu4b.png"),
}
const balIcon = {
    "vanilla": new Image("khazad_dum.png", "https://i.imgur.com/PFAoHh1.png"),
    "furfsky": new Image("khazad_dum_furf.png", "https://i.imgur.com/8GiZNCK.png"),
}
const corleoneIcon = { // TODO 
    "vanilla": new Image("corleone.png", "https://i.imgur.com/iXoq0MQ.png"),
    "furfsky": new Image("corleone_furf.png", "https://i.imgur.com/MEh8dN6.png"),
}

const head = new Image("head_"+Player.getUUID()+".png", "https://crafatar.com/avatars/"+Player.getUUID()+"?overlay&size=8&default=MHF_Steve");
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

export function onRender() {
    registerServer();
    var area = getArea();
    if(Settings.createWaypoints && /^(Fairy Grotto)|(Jungle Temple)|(Mines of Divan)|(Lost Precursor City)|(Goblin Queen's Den)|(Khazad-dûm)$/g.exec(area)) {
        createRegion();
        var server = getServerName();
        var exists = false;
        waypoints.forEach((server) => {
            if(server.server.equals(getServerName())) {
                server.waypoints.forEach((waypoint) => {
                    if(waypoint.name.equals(area)) exists = true;
                });
            }
        });
        if(!exists) createWaypoint(area, Math.round(Player.getX())+","+Math.round(Player.getY())+","+Math.round(Player.getZ()), true)
    }

    if(!Settings.map) return;
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
        console.log(Scoreboard.getLines().toString());
    }
    server.regions.forEach((region) => {
        if(area.equals(region.name)) {
            if(Player.getX() < region.min.x || region.min.x == 0) {
                region.min.x = Player.getX();
            } else if(Player.getX() > region.max.x) {
                region.max.x = Player.getX();
            }
    
            if(Player.getZ() < region.min.z || region.max.x == 0) {
                region.min.z = Player.getZ();
            } else if(Player.getZ() > region.max.z) {
                region.max.z = Player.getZ();
            }
        }
        var render = false;
        color = Renderer.color(255, 255, 255);
        if(Settings.showArea) {
            if(region.name.equals("Fairy Grotto")) {
                if(Settings.areaGrottoVisible) {
                    settingsColor = Settings.areaGrottoColor;
                    color = Renderer.color(settingsColor.getRed(), settingsColor.getGreen(), settingsColor.getBlue());
                    render = true;
                }
            }
            if(region.name.equals("Goblin Queen's Den")) {
                if(Settings.areaQueenVisible) {
                    settingsColor = Settings.areaQueenColor;
                    color = Renderer.color(settingsColor.getRed(), settingsColor.getGreen(), settingsColor.getBlue());
                    render = true;
                }
            }
            if(region.name.equals("Jungle Temple")) {
                if(Settings.areaTempleVisible) {
                    settingsColor = Settings.areaTempleColor;
                    color = Renderer.color(settingsColor.getRed(), settingsColor.getGreen(), settingsColor.getBlue());
                    render = true;
                }
            }
            if(region.name.equals("Khazad-dûm")) {
                if(Settings.areaBalVisible) {
                    settingsColor = Settings.areaBalColor;
                    color = Renderer.color(settingsColor.getRed(), settingsColor.getGreen(), settingsColor.getBlue());
                    render = true;
                }
            }
            if(region.name.equals("Lost Precursor City")) {
                if(Settings.areaCityVisible) {
                    settingsColor = Settings.areaCityColor;
                    color = Renderer.color(settingsColor.getRed(), settingsColor.getGreen(), settingsColor.getBlue());
                    render = true;
                }
            }
            if(region.name.equals("Mines of Divan")) {
                if(Settings.areaDivanVisible) {
                    settingsColor = Settings.areaDivanColor;
                    color = Renderer.color(settingsColor.getRed(), settingsColor.getGreen(), settingsColor.getBlue());
                    render = true;
                }
            }
            var boxWidth = (region.max.x - region.min.x)*(128/621);
            var boxHeight = (region.max.z - region.min.z)*(128/621);
            if(render && region.min.x != 0 && region.max.x != 0 && region.min.z != 0 && region.max.z != 0) {
                renderRect(color, boxWidth, boxHeight, region.min.x+boxWidth*2, region.min.z+boxHeight*2, 0);
            }
        }
    });
  
    if(Settings.iconPlayerVisible) {
        if(Settings.iconPlayerType == 0) {
            var playerIcon = mapArrow;
            var width = 5;
            var height = 7;
        } else if(Settings.iconPlayerType == 1) {
            var playerIcon = head;
            var width = 8;
            var height = 8;
        }
  
        renderIcon(playerIcon, width * Settings.iconPlayerSize, height * Settings.iconPlayerSize, Player.getX(), Player.getZ(), Player.getYaw()-180, Settings.iconPlayerType == 1);
    }
    width = 16;
    height = 16;
    var server = getServerName()
    renderWaypoint(corleoneIcon, Settings.iconCorleoneVisible, Settings.iconCorleoneType, Settings.iconCorleoneSize, "Boss Corleone", "corleone");
    renderWaypoint(grottoIcon, Settings.iconGrottoVisible, Settings.iconGrottoType, Settings.iconGrottoSize, "Fairy Grotto", "grotto");
    renderWaypoint(kingIcon, Settings.iconKingVisible, Settings.iconKingType, Settings.iconKingSize, "King Yolkar", "king");
    renderWaypoint(queenIcon, Settings.iconQueenVisible, Settings.iconQueenType, Settings.iconQueenSize, "Goblin Queen's Den", "queen");
    renderWaypoint(templeIcon, Settings.iconTempleVisible, Settings.iconTempleType, Settings.iconTempleSize, "Jungle Temple", "temple");
    renderWaypoint(balIcon, Settings.iconBalVisible, Settings.iconBalType, Settings.iconBalSize, "Khazad-dûm", "Khazad-dum", "bal");
    renderWaypoint(cityIcon, Settings.iconCityVisible, Settings.iconCityType, Settings.iconCitySize, "Lost Precursor City", "city");
    renderWaypoint(divanIcon, Settings.iconDivanVisible, Settings.iconDivanType, Settings.iconDivanSize, "Mines of Divan", "divan");
    if(Settings.iconGenericVisible) {
        server = getServer(getServerName())
        if(server == undefined) return;
        var waypointList = server.waypoints;
        waypointList.forEach((waypoint) => {
            if(/(corleone|(Fairy )?Grotto|King( Yolkar)?|Goblin Queen's Den|queen|(Jungle )?Temple|Khazad-d[ûu]m|bal|(Lost Precursor )?City|(Mines of )?Divan)/gi.exec(waypoint.name)) return;
            coords = parseCoordinates(waypoint.location);
            renderIcon(Settings.iconGenericType == 0 ? genericIcon.vanilla : genericIcon.furfsky, width * Settings.iconGenericSize, height * Settings.iconGenericSize, coords.x, coords.z, 0, false);
        });
    }
}
function renderWaypoint(icon, visible, type, size, ...names) {
    var server = getServerName();

    var waypoint = getWaypoint(server, names[0], names.splice(1, names.length));
    if(waypoint != undefined && visible) {
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
}