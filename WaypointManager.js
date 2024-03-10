/* 
 * This module can be found at https://github.com/cognitivitydev/CrystalMap/.
 * You can report any issues or add suggestions there.
 */

/// <reference types="../CTAutocomplete" />
/// <reference lib="es2015" />

var waypoints = [];
export var areas = [];

var currentId = 0;

export function getWaypoints() {
    return waypoints;
}

export function registerServer() {
    var serverName = getServerName();
    if(!serverName) return;
    if (!serverExists(serverName)) {
        waypoints.push({server: serverName, waypoints: []});
    }
    if(getServerRegion() == undefined) {
        areas.push({server: serverName, regions: []});
    }
}

export function registerServerName(serverName) {
    if (!serverExists(serverName)) {
        waypoints.push({server: serverName, waypoints: []});
    }
    if(getServerRegion() == undefined) {
        areas.push({server: serverName, regions: []});
    }
}
export function getServerRegion() {
    var foundServer = undefined;
    areas.forEach((server) => {
        if(server.server && server.server.equals(getServerName())) {
            foundServer = server;
        }
    });
    return foundServer;
}
export function getAreaRegion() {
    var foundRegion = undefined;
    var server = getServerRegion();
    var currentArea = getArea();
    if(server != undefined) {
        server.regions.forEach((region) => {
        if(region.name.equals(currentArea)) {
            foundRegion = region;
            return;
        }
        });
    };
    return foundRegion;
}
export function createRegion() {
    if(getAreaRegion() != undefined) return;
    registerServer();
    getServerRegion().regions.push({name: getArea(), min: {x: 0, y: 0, z: 0}, max: {x: 0, y: 0, z: 0}})
}
export function createWaypoint(name, location, automatic) {
    createServerWaypoint(getServerName(), name, location, automatic)
}
export function createServerWaypoint(server, name, location, automatic) {
    registerServerName(server);
    var serverList = getServer(server);
    if(getWaypoint(server, name)) {
        ChatLib.chat("&cA waypoint with the name &5" + name + "&c already exists!");
        return;
    }
    if(automatic) {
        if(/(Fairy )?Grotto/gi.exec(name) && getWaypoint(server, "Fairy Grotto", "grotto")) {
            return;
        }
        if(/(Goblin Queen'?s Den)|(queen)/gi.exec(name) && getWaypoint(server, "Goblin Queen's Den", "Goblin Queens Den", "queen")) {
            return;
        }
        if(/(Goblin King)|(King Yolkar)|(king)/gi.exec(name) && getWaypoint(server, "Goblin King", "King Yolkar", "king")) {
            return;
        }
        if(/(Khazad-dûm)|(bal)/gi.exec(name) && getWaypoint(server, "Khazad-dûm", "bal")) {
            return;
        }
        if(/(Lost Precursor )?City/gi.exec(name) && getWaypoint(server, "Lost Precursor City", "city")) {
            return;
        }
        if(/(Mines of )?Divan/gi.exec(name) && getWaypoint(server, "Mines of Divan", "divan")) {
            return;
        }
        if(/(Jungle )?Temple/gi.exec(name) && getWaypoint(server, "Jungle Temple", "temple")) {
            return;
        }
        if(!server.toLowerCase().startsWith("m")) {
            console.warn("Automatic waypoint "+name+" has an invalid server name! ("+server+")");
            return;
        }
    }
    currentId++;
    serverList.waypoints.push({id: currentId, name: name, location: location});
    index = waypoints.indexOf(getServer(server));
    if (index >= 0) {
        waypoints.splice(index, 1);
    }
    waypoints.push(serverList);

    if (automatic) {
        ChatLib.chat(ChatLib.getCenteredText("&7Automatically registered waypoint &5" + name + "&7 at &d" + location + "&7 in &e"+server+"&7."));
    } else {
        ChatLib.chat(ChatLib.getCenteredText("&aRegistered waypoint &5" + name + "&a at &d" + location + "&a in &e"+server+"&a."));
    }
    ChatLib.chat(new Message(
        "                   ",
        new TextComponent("&e&lEDIT").setClick("run_command", "/crystalmap waypoint "+name),
        "                   ",
        new TextComponent("&c&lDELETE").setClick("run_command", "/crystalmap remove "+name),
        "                 ",
        new TextComponent("&b&lSHARE").setClick("run_command", "/crystalmap share "+currentId),
        "                   "
    ))
}
export function editWaypoint(id, newServer, newName, newCoordinates) {
    var oldWaypoint;
    var oldServer;
    waypoints.forEach((server) => {
        server.waypoints.forEach((waypoint) => {
            if(id == waypoint.id) {
                oldWaypoint = waypoint;
                oldServer = server.server;
                return;
            }
        });
    });
    if(!oldServer) return;
    if(!oldWaypoint) return;
    waypoints.forEach((server) => {
        if(server.server.equals(oldServer)) {
            server.waypoints.forEach((waypoint) => {
                if(waypoint.name.equals(oldWaypoint.name)) {
                    server.waypoints.splice(server.waypoints.indexOf(waypoint), 1);
                    removed = true;
                    return;
                }
            });
        }
    });
    registerServerName(newServer);
    getServer(newServer).waypoints.push({id: id, name: newName, location: newCoordinates});
    ChatLib.chat("&aUpdated waypoint &5" + newName + "&a to &d" + newCoordinates + "&a in &e"+newServer+"&a.");
}
export function removeWaypoint(name) {
    var removed = false;
    waypoints.forEach((server) => {
        server.waypoints.forEach((waypoint) => {
        if(waypoint.name.equals(name)) {
            server.waypoints.splice(server.waypoints.indexOf(waypoint), 1);
            removed = true;
            return;
        }
        });
    });
    if(removed) {
        ChatLib.chat("&7Removed waypoint &5" + name + "&7.");
        return; 
    }
    ChatLib.chat("&cCouldn't find waypoint &5" + name + "&c.");
}
export function removeServerWaypoint(serverName, name) {
    var removed = false;
    waypoints.forEach((server) => {
        if(server.server.equals(serverName)) {
            server.waypoints.forEach((waypoint) => {
                if(waypoint.name.equals(name)) {
                    server.waypoints.splice(server.waypoints.indexOf(waypoint), 1);
                    removed = true;
                    return;
                }
            });
        }
    });
    if(removed) {
        ChatLib.chat("&7Removed waypoint &5" + name + "&7.");
        return; 
    }
    ChatLib.chat("&cCouldn't find waypoint &5" + name + "&c.");
}
export function removeWaypointId(id) {
    var removed = undefined;
    waypoints.forEach((server) => {
        server.waypoints.forEach((waypoint) => {
            if(waypoint.id == id) {
                server.waypoints.splice(server.waypoints.indexOf(waypoint), 1);
                removed = true;
                return;
            }
        });
    });
    if(removed) {
        ChatLib.chat("&7Removed waypoint &5" + name + "&7.");
        return; 
    }
    ChatLib.chat("&cCouldn't find a waypoint to delete.");
}
function serverExists(server) {
    return getServer(server) != undefined;
}
export function getWaypointFromId(id) {
    var foundWaypoint = undefined;
    waypoints.forEach((server) => {
        server.waypoints.forEach((waypoint) => {
            if(id == waypoint.id) {
                foundWaypoint = waypoint;
                return;
            }
        });
    });
    return foundWaypoint;
}
export function getServer(server) {
    var foundServer = undefined;
    waypoints.forEach((serverWaypoints) => {
        if (serverWaypoints != undefined) {
            if (serverWaypoints.server.equals(server)) foundServer = serverWaypoints;
        }
    });
    return foundServer;
}
export function getWaypoint(serverName, name, ...extras) {
    var foundWaypoint = undefined;
    waypoints.forEach((server) => {
        if(server.server.equals(serverName)) {
            server.waypoints.forEach((waypoint) => {
                if(waypoint.name.equalsIgnoreCase(name)) {
                    foundWaypoint = waypoint;
                } else if(extras) {
                    extras.forEach(extra => {
                        if(waypoint.name.equalsIgnoreCase(extra)) {
                            foundWaypoint = waypoint;
                            return;
                        }
                    });
                }
            });
        }
    });
    return foundWaypoint;
}
export function getServerName() {
    var lines = TabList.getNames();
    var server = undefined;
    lines.forEach(formatted => {
        let line = ChatLib.removeFormatting(formatted);
        if(line.startsWith(" Server: ")) {
            server = line.replace(" Server: ", "");
        }
    });
    return server;
}
export function getArea() {
    var area = "None";
    Scoreboard.getLines().forEach((line) => {
        if (ChatLib.removeFormatting(line).startsWith(" ⏣ ")) {
            area = ChatLib.removeFormatting(line).split(" ⏣ ")[1].replace(/[^A-z0-9 :().\-'û]/g, "");
        }
    });
    return area;
}
export function inCrystalHollows() {
    return new RegExp("^(Goblin Holdout)|(Precursor Remnants)|(Mithril Deposits)|(Jungle)|(Magma Fields)" +
        "|(Fairy Grotto)|(Jungle Temple)|(Mines of Divan)|(Lost Precursor City)|(Goblin Queen's Den)|(Khazad-dûm)|(Crystal Nucleus)$").exec(getArea())
}
export function parseCoordinates(coordinates) {
    let array = coordinates.split(",");
    var x = array[0];
    var y = array[1];
    var z = array[2];
    return {x: x, y: y, z: z};
}
export function getCoordinates(entity) {
    if(!entity) {
        var x = Math.round(Player.getX());
        var y = Math.round(Player.getY());
        var z = Math.round(Player.getZ());
        return x+","+y+","+z;      
    }
    var x = Math.round(entity.getX());
    var y = Math.round(entity.getY());
    var z = Math.round(entity.getZ());
    return x+","+y+","+z;  
}
export function shareWaypoints(sharing, compact = false) {
    var message = "";
    if(compact) {
        message = "%CRYSTALMAP=["
        var currentMessage = "";
        if(sharing.constructor !== Array) {
            sharing = [sharing];
        }
        for(var index in sharing) {
            let waypoint = sharing[index];
            let name = waypoint.name.replaceAll("\"", "\\\"");
            let text = "\""+name+"\"@"+waypoint.location+";";
            if((currentMessage+text+"]").length > 256) {
                message = message+currentMessage+"]\n%CRYSTALMAP=[";
                currentMessage = text;
            } else {
                currentMessage = currentMessage+text;
            }

            if(index == sharing.length - 1) {
                message = message+currentMessage+"]";
                return message;
            }
        }
        return message;
    }
    if(sharing.constructor === Array) {
        for(var index in sharing) {
            var waypoint = sharing[index];
            message = message+waypoint.name+": "+waypoint.location.replaceAll(",", " ");
            if(index != sharing.length - 1) {
                message = message+", ";
            }
        }
    } else {
        message = sharing.name+": "+sharing.location.replaceAll(",", " ");
    }
    return message;
}