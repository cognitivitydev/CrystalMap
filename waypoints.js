/* 
 * This module can be found on GitHub at https://github.com/cognitivitydev/CrystalMap/
 * Please insult my amazing code.
 */

export var waypoints = [];
export var areas = [];

export function registerServer() {
  var serverName = getServerName();
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
  getServerRegion().regions.push({name: getArea(), min: {x: 0, y: 0, z: 0}, max: {x: 0, y: 0, z: 0}})
}
export function createWaypoint(name, location, automatic) {
  var server = getServerName();
  registerServer();
  var serverList = getServer(server);
  serverList.waypoints.push({name: name, location: location});
  index = waypoints.indexOf(getServer(server));
  if (index >= 0) {
    waypoints.splice(index, 1);
  }
  waypoints.push(serverList);

  if (automatic) {
    ChatLib.chat("&7Automatically registered waypoint &5" + name + "&7 at &d" + location + "&7. &8"+server);
  } else {
    ChatLib.chat("&aRegistered waypoint &5" + name + "&a at &d" + location + "&a. &8"+server);
  }
  ChatLib.chat(new Message(new TextComponent("&8&oClick here to remove this waypoint.").setClick("run_command", "/crystalmap remove "+name)));
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
function serverExists(server) {
  return getServer(server) != undefined;
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
            if(extra.equalsIgnoreCase(waypoint.name)) {
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
  var lines = Scoreboard.getLines();
  var server = ChatLib.removeFormatting(lines[lines.length - 1]).replace(/[0-9]{2}\/[0-9]{2}\/[0-9]{2}\s*/g, "").replace(/[^A-Za-z0-9]/g, "");
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
  array = coordinates.split(",");
  var x = array[0];
  var y = array[1];
  var z = array[2];
  return {x: x, y: y, z: z};
}