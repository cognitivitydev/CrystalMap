/* 
 * This module can be found on GitHub at https://github.com/cognitivitydev/CrystalMap/
 * Please insult my amazing code.
 */

import Settings from "./config";
import {
  AdditiveConstraint,
  animate,
  Animations,
  CenterConstraint,
  ConstantColorConstraint,
  FillConstraint,
  SiblingConstraint,
  SubtractiveConstraint,
  UIBlock,
  UIRoundedRectangle,
  UIText,
  UIImage,
  UITextInput,
  WindowScreen,
  AspectConstraint,
} from "../Elementa";
import { registerServer, waypoints, createWaypoint, getServerName, removeWaypoint, getWaypoint, parseCoordinates, getArea, getServer, inCrystalHollows, getAreaRegion, createRegion, areas, getServerRegion } from "./waypoints";

const Color = Java.type("java.awt.Color");
const URL = Java.type("java.net.URL")

const dragOffset = { x: 0, y: 0 };

const mapImage = new Image("crystalmap.png", "https://i.imgur.com/44O0mF6.png");
const magmaImage = new Image("crystalmap2.png", "https://i.imgur.com/QhPuKCm.png");
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

if(Settings.firstJoin) {
  Settings.firstJoin = false;
  ChatLib.chat(ChatLib.getCenteredText("&5&m                                        &d CRYSTAL MAP &5&m                                        "));
  ChatLib.chat(ChatLib.getCenteredText("&8VERSION 1.0.0"));
  ChatLib.chat("");
  ChatLib.chat("  &7Thank you for downloading &dCrystalMap&7!");
  ChatLib.chat("  &7To start, type &5/crystalmap &7to open a config menu.");
  ChatLib.chat("  &7For more information on commands, type &5/crystalmap &dhelp&7.");
  ChatLib.chat(new Message("  &7If you find any issues, please report them ", new TextComponent("&d&nhere").setClick("open_url", "https://github.com/cognitivitydev/CrystalMap"), "&7."));
  ChatLib.chat("");
  ChatLib.chat("&5&m"+ChatLib.getChatBreak(" "));
}

register("renderOverlay", () => {
  if(Player.getX() <= 202 || Player.getX() >= 824) return;
  if(Player.getX() <= 30 || Player.getY() >= 188) return;
  if(Player.getZ() <= 202 || Player.getZ() >= 824) return;
  if(!inCrystalHollows()) return;

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
    render = false;
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
  var waypoint = getWaypoint(server, "corleone");
  if(waypoint != undefined && Settings.iconCorleoneVisible) {
    coords = parseCoordinates(waypoint.location);
    renderIcon(Settings.iconCorleoneType == 0 ? corleoneIcon.vanilla : corleoneIcon.furfsky, width * Settings.iconCorleoneSize, height * Settings.iconCorleoneSize, coords.x, coords.z, 0, false);
  }
  waypoint = getWaypoint(server, "Fairy Grotto", "grotto");
  if(waypoint != undefined && Settings.iconGrottoVisible) {
    coords = parseCoordinates(waypoint.location);
    renderIcon(Settings.iconGrottoType == 0 ? grottoIcon.vanilla : grottoIcon.furfsky, width * Settings.iconGrottoSize, height * Settings.iconGrottoSize, coords.x, coords.z, 0, false);
  }
  waypoint = getWaypoint(server, "King Yolkar", "king");
  if(waypoint != undefined && Settings.iconKingVisible) {
    coords = parseCoordinates(waypoint.location);
    renderIcon(Settings.iconKingType == 0 ? kingIcon.vanilla : kingIcon.furfsky, width * Settings.iconKingSize, height * Settings.iconKingSize, coords.x, coords.z, 0, false);
  }
  waypoint = getWaypoint(server, "Goblin Queen's Den", "queen");
  if(waypoint != undefined && Settings.iconQueenVisible) {
    coords = parseCoordinates(waypoint.location);
    renderIcon(Settings.iconQueenType == 0 ? queenIcon.vanilla : queenIcon.furfsky, width * Settings.iconQueenSize, height * Settings.iconQueenSize, coords.x, coords.z, 0, false);
  }
  waypoint = getWaypoint(server, "Jungle Temple", "temple");
  if(waypoint != undefined && Settings.iconTempleVisible) {
    coords = parseCoordinates(waypoint.location);
    renderIcon(Settings.iconTempleType == 0 ? templeIcon.vanilla : templeIcon.furfsky, width * Settings.iconTempleSize, height * Settings.iconTempleSize, coords.x, coords.z, 0, false);
  }
  waypoint = getWaypoint(server, "Khazad-dûm", "Khazad-dum", "bal");
  if(waypoint != undefined && Settings.iconBalVisible) {
    coords = parseCoordinates(waypoint.location);
    renderIcon(Settings.iconBalType == 0 ? balIcon.vanilla : balIcon.furfsky, width * Settings.iconBalSize, height * Settings.iconBalSize, coords.x, coords.z, 0, false);
  }
  waypoint = getWaypoint(server, "Lost Precursor City", "city");
  if(waypoint != undefined && Settings.iconCityVisible) {
    coords = parseCoordinates(waypoint.location);
    renderIcon(Settings.iconCityType == 0 ? cityIcon.vanilla : cityIcon.furfsky, width * Settings.iconCitySize, height * Settings.iconCitySize, coords.x, coords.z, 0, false);
  }
  waypoint = getWaypoint(server, "Mines of Divan", "divan");
  if(waypoint != undefined && Settings.iconDivanVisible) {
    coords = parseCoordinates(waypoint.location);
    renderIcon(Settings.iconDivanType == 0 ? divanIcon.vanilla : divanIcon.furfsky, width * Settings.iconDivanSize, height * Settings.iconDivanSize, coords.x, coords.z, 0, false);
  }
  if(Settings.iconGenericVisible) {
    server = getServer(getServerName())
    if(server == undefined) return;
    waypointList = server.waypoints;
    waypointList.forEach((waypoint) => {
      if(/(corleone|(Fairy )?Grotto|King( Yolkar)?|Goblin Queen's Den|queen|(Jungle )?Temple|Khazad-d[ûu]m|bal|(Lost Precursor )?City|(Mines of )?Divan)/gi.exec(waypoint.name)) return;
      coords = parseCoordinates(waypoint.location);
      renderIcon(Settings.iconGenericType == 0 ? genericIcon.vanilla : genericIcon.furfsky, width * Settings.iconGenericSize, height * Settings.iconGenericSize, coords.x, coords.z, 0, false);
    });
  }
})

function renderIcon(icon, width, height, x, y, yaw, outline) {
  if(outline) {
    renderRect(Renderer.color(0, 0, 0), width + 1, height + 1, x, y, yaw, outline)
  }

  Tessellator.pushMatrix();
  Renderer.retainTransforms(true);
  Tessellator.enableAlpha();


  Renderer.translate((x - 202) * (128/621) * Settings.scale, (y - 202) * (128/621) * Settings.scale)
  Renderer.translate(Settings.mapX * Renderer.screen.getWidth(), Settings.mapY * Renderer.screen.getHeight())
  Renderer.rotate(yaw);
  Renderer.scale(Settings.scale);

  Renderer.drawImage(icon, -width/2, -height/2, width, height);

  Renderer.retainTransforms(false);
  Tessellator.popMatrix();
}

function renderRect(color, width, height, x, y, yaw) {
  Tessellator.pushMatrix();
  Renderer.retainTransforms(true);
  Tessellator.enableAlpha();


  Renderer.translate((x - 202) * (128/621) * Settings.scale, (y - 202) * (128/621) * Settings.scale)
  Renderer.translate(Settings.mapX * Renderer.screen.getWidth(), Settings.mapY * Renderer.screen.getHeight())
  Renderer.rotate(yaw);
  Renderer.scale(Settings.scale);

  Renderer.drawRect(color, -(width)/2, -(height)/2, (width), (height));
  Renderer.retainTransforms(false);
  Tessellator.popMatrix();
}

register("command", (...args) => {
  if(!args[0]) {
    Settings.openGUI();
    return;
  }
  if(args.length == 1 && args[0].equals("help")) {
    ChatLib.chat(ChatLib.getCenteredText("&5&m                                                &d HELP &5&m                                                "));
    ChatLib.chat("&d/crystalmap &8- &7Opens the mod's config.");
    ChatLib.chat("&d/crystalmap help &8- &7Lists available commands for CrystalMap.");
    ChatLib.chat("&d/crystalmap gui &8- &7Move the position of the minimap.");
    ChatLib.chat("&d/crystalmap waypoint &e[name] [coordinates] &8- &7Opens a menu for creating waypoints.");
    ChatLib.chat("&d/crystalmap remove &c<name> &8- &7Removes waypoints by name.");
    ChatLib.chat("&5&m"+ChatLib.getChatBreak(" "));
    return;
  }
  if(args.length >= 1 && args[0].equals("remove")) {
    if(args.length == 1) {
      ChatLib.chat("&cNo waypoint name specified!")
      return;
    }
    if(!inCrystalHollows()) {
      ChatLib.chat("&cIt seems like you aren't in the Crystal Hollows!");
      return;
    }
    removeWaypoint(args.slice(1).join(" "));
    return;
  }
  if(args.length == 1 && args[0].equals("gui")) {
    box.setWidth((128 * Settings.scale).pixels()).setHeight((128 * Settings.scale).pixels())
    GuiHandler.openGui(locationGui);
    return;
  }
  if(args.length >= 1 && args[0].equals("waypoint")) {
    if(!inCrystalHollows()) {
      ChatLib.chat("&cIt seems like you aren't in the Crystal Hollows!");
      return;
    }
    newWaypointCoordinates = undefined;
    newWaypointName = undefined;  
    if(args.length >= 2) {
      var coords = /^[0-9]{1,3},[0-9]{1,3},[0-9]{1,3}$/g.exec(args[1]);
      if(coords) {
        newWaypointCoordinates = args[1];
        if(args.length >= 3) {
          newWaypointName = args.slice(2).join(" ");
        }
      } else {
        newWaypointName = args.slice(1).join(" ");
      }
    }
    GuiHandler.openGui(getTextGui());
    return;
  }
  Settings.openGUI();
}).setName("crystalmap", true);

register("chat", (event) => {
  var formattedMessage = ChatLib.getChatMessage(event);
  var message = ChatLib.removeFormatting(formattedMessage);
  var content = message.replace(/^(\[[0-9]+\] )?(\S )?(\[.+\] )?[A-Za-z0-9_]{3,16}: (?!$)/g, "")

  if(content.equals(message)) return;
  if(Settings.showChatWaypoints) {
    coords = /^\$SBECHWP:.+@-[0-9]{1,3},[0-9]{1,3},[0-9]{1,3}$/g.exec(content);
    if(coords) {
      var waypointName = coords[0].replace("$SBECHWP:", "").replace(/@-[0-9]{1,3},[0-9]{1,3},[0-9]{1,3}$/g, "")
      if(waypointName) {
        cancel(event);
        waypoint = ("&d&n"+coords[0]+"&r").replace(waypointName, "&5&n"+waypointName+"&d&n");
        coordinates = coords[0].replace("$SBECHWP:"+waypointName+"@-", "");
        ChatLib.chat(new Message(
          formattedMessage.split(coords[0])[0],
          new TextComponent(waypoint).setClick("run_command", "/crystalmap waypoint "+coordinates+" "+waypointName),
          formattedMessage.split(coords[0])[1]
        ));
        if(Settings.parseChatWaypoints) {
          createWaypoint(waypointName, coordinates, true);
        }
        return;
      }
    }
    const areas = "(temple|city|king|queen|divan|bal|grotto|Jungle Temple|Lost Precursor City|Goblin King|King Yolkar|Goblin Queen'?s Den|Mines of Divan|Khazad-d[ûu]m|Fairy Grotto|(boss )?corleone)";
    if(/(?!(^|\s))[0-9]{1,3}(,| |, )[0-9]{1,3}(,| |, ){1,2}[0-9]{1,3}/g.exec(content)) {
      coords = new RegExp(areas + ":? [0-9]{1,3}(,| |, )[0-9]{1,3}(,| |, )[0-9]{1,3}", "gi").exec(content);
      if(coords) {
        coordinates = /[0-9]{1,3}(,| |, )[0-9]{1,3}(,| |, )[0-9]{1,3}/g.exec(coords[0])[0];
        waypointName = coords[0].replace(coordinates, "").replace(":", "").trim();
        waypoint = "&5&n"+waypointName+"&d&n "+coordinates;
        cancel(event);
        ChatLib.chat(new Message(
          formattedMessage.split(coords[0])[0],
          new TextComponent(waypoint).setClick("run_command", "/crystalmap waypoint "+coordinates.replace(/(, |,| )/g, ",")+" "+waypointName),
          formattedMessage.split(coords[0])[1]
        ));
        if(Settings.parseChatWaypoints) {
          createWaypoint(waypointName, coordinates.replace(/(, |,| )/g, ","), true);
        }
        return;
      }
      coords = new RegExp("/[0-9]{1,3}(,| |, )[0-9]{1,3}(,| |, )[0-9]{1,3}:? " + areas, "gi").exec(content);
      if(coords) {
        coordinates = /[0-9]{1,3}(,| |, )[0-9]{1,3}(,| |, )[0-9]{1,3}/g.exec(coords[0])[0];
        waypointName = coords[0].replace(coordinates, "").replace(":", "").trim();
        waypoint = "&d&n"+coordinates+" &5&n"+waypointName;
        cancel(event);
        ChatLib.chat(new Message(
          formattedMessage.split(coords[0])[0],
          new TextComponent(waypoint).setClick("run_command", "/crystalmap waypoint "+coordinates.replace(/(, |,| )/g, ",")+" "+waypointName),
          formattedMessage.split(coords[0])[1]
        ));
        if(Settings.parseChatWaypoints) {
          createWaypoint(waypointName, coordinates.replace(/(, |,| )/g, ","), true);
        }
        return;
      }
      coords = /[0-9]{1,3}(,| |, )[0-9]{1,3}(,| |, ){1,2}[0-9]{1,3}/g.exec(content);
      if(coords) {
        cancel(event);
        ChatLib.chat(new Message(
          formattedMessage.split(coords[0])[0],
          new TextComponent("&d&n"+coords[0]).setClick("run_command", "/crystalmap waypoint "+coords[0].replace(/(, |,| )/g, ",")),
          formattedMessage.split(coords[0])[1]
        ));
        return;
      }
    }
  }
});

box = new UIBlock(new Color(49/255, 175/255, 236/255, 150/255))
  .setX((Settings.mapX * Renderer.screen.getWidth()).pixels())
  .setY((Settings.mapY * Renderer.screen.getHeight()).pixels())
  .setWidth((128 * Settings.scale).pixels())
  .setHeight((128 * Settings.scale).pixels())
  .onMouseClick((comp, event) => {
    isDragging = true;
    dragOffset.x = event.absoluteX;
    dragOffset.y = event.absoluteY;
  })
  .onMouseRelease(() => {
    isDragging = false;
  })
  .onMouseDrag((comp, mx, my) => {
    if (!isDragging) return;
    const absoluteX = mx + comp.getLeft();
    const absoluteY = my + comp.getTop();
    const dx = absoluteX - dragOffset.x;
    const dy = absoluteY - dragOffset.y;
    dragOffset.x = absoluteX;
    dragOffset.y = absoluteY;
    const newX = box.getLeft() + dx;
    Settings.mapX = newX / Renderer.screen.getWidth();
    const newY = box.getTop() + dy;
    Settings.mapY = newY / Renderer.screen.getHeight();
    box.setX(newX.pixels());
    box.setY(newY.pixels());
  })
  .onMouseEnter((comp) => {
    animate(comp, (animation) => {
      animation.setColorAnimation(Animations.OUT_EXP, 0.3, new ConstantColorConstraint(new Color(164/255, 82/255, 227/255, 90/255)));
    });
  })
  .onMouseLeave((comp) => {
    animate(comp, (anim) => {
      anim.setColorAnimation(Animations.OUT_EXP, 0.3, new ConstantColorConstraint(new Color(49/255, 175/255, 236/255, 150/255)));
    });
  })

this.newWaypointCoordinates = undefined;
this.newWaypointName = undefined;

const createWaypointGui = () => {
  const window = new UIBlock()
    .setX((0).pixels())
    .setY((0).pixels())
    .setWidth(new FillConstraint())
    .setHeight(new FillConstraint())
    .setColor(new Color(0, 0, 0, 0));

  const block = new UIRoundedRectangle(5)
    .setColor(new Color(0/255, 0/255, 0/255, 150/255))
    .setX(new CenterConstraint())
    .setY((15).pixels())
    .setWidth(new SubtractiveConstraint(new FillConstraint(), (275).pixels()))
    .setHeight(new SubtractiveConstraint(new FillConstraint(), (30).percent()))
    .setChildOf(window);
    
  const text1 = new UIText("Waypoint Name", true)
    .setX(new CenterConstraint())
    .setY((50).pixels())
    .setTextScale((2).pixels())
    .setChildOf(block);

  const textInputBlock1 = new UIRoundedRectangle(5)
    .setColor(new Color(0/255, 0/255, 0/255, 255/255))
    .setX(new CenterConstraint())
    .setY(new AdditiveConstraint(new SiblingConstraint(), (10).pixels()))
    .setWidth((300).pixels())
    .setHeight((18).pixels())
    .onMouseEnter((comp) => {
      animate(comp, (animation) => {
        animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(new Color(20/255, 20/255, 20/255, 255/255)));
      });
    })
    .onMouseLeave((comp) => {
      animate(comp, (anim) => {
        anim.setColorAnimation(Animations.IN_EXP, 0.2, new ConstantColorConstraint(new Color(0/255, 0/255, 0/255, 255/255)));
      });
    })
    .onMouseClick(() => {
      textInput1.grabWindowFocus();
    })
    .setChildOf(block);
  
  if(!newWaypointName) {
    newWaypointName = "Waypoint";
  }
  const textInput1 = new UITextInput(newWaypointName)
    .setX(new CenterConstraint())
    .setY(new CenterConstraint())
    .setWidth((250).pixels())
    .setChildOf(textInputBlock1);

  const text2 = new UIText("Coordinates (x,y,z)", true)
    .setX(new CenterConstraint())
    .setY(new AdditiveConstraint(new SiblingConstraint(), (50).pixels()))
    .setTextScale((2).pixels())
    .setChildOf(block);

  const textInputBlock2 = new UIRoundedRectangle(5)
    .setColor(new Color(0/255, 0/255, 0/255, 255/255))
    .setX(new CenterConstraint())
    .setY(new AdditiveConstraint(new SiblingConstraint(), (10).pixels()))
    .setWidth((300).pixels())
    .setHeight((18).pixels())
    .onMouseEnter((comp) => {
      animate(comp, (animation) => {
        animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(new Color(20/255, 20/255, 20/255, 255/255)));
      });
    })
    .onMouseLeave((comp) => {
      animate(comp, (anim) => {
        anim.setColorAnimation(Animations.IN_EXP, 0.2, new ConstantColorConstraint(new Color(0/255, 0/255, 0/255, 255/255)));
      });
    })
    .onMouseClick(() => {
      textInput2.grabWindowFocus();
    })
    .setChildOf(block);

  if(!newWaypointCoordinates) {
    newWaypointCoordinates = Math.round(Player.getX())+","+Math.round(Player.getY())+","+Math.round(Player.getZ());
  }
  const textInput2 = new UITextInput(newWaypointCoordinates)
    .setX(new CenterConstraint())
    .setY(new CenterConstraint())
    .setWidth((250).pixels())
    .onKeyType(() => {
      coords = textInput2.getText();
      if(textInput2.getText().trim().length === 0) {
        coords = newWaypointCoordinates;
      }
      if(!/[0-9]{1,3},[0-9]{1,3},[0-9]{1,3}/g.exec(coords)) {
        textImageInvalid.setColor(new Color(1, 0, 0, 1));
        blockImageInvalid.setColor(new Color(0, 0, 0, 0.66));
        icon.setWidth((0).pixels());
      } else {
        textImageInvalid.setColor(new Color(1, 0, 0, 0));
        blockImageInvalid.setColor(new Color(0, 0, 0, 0));
        icon.setWidth((16).pixels())
        var x = coords.split(",")[0];
        var y = coords.split(",")[1];
        var z = coords.split(",")[2];
        x = Math.min(Math.max(x, 202), 823);
        z = Math.min(Math.max(z, 202), 823);

        if(y < 64) {
          magmaImage.setWidth((128).pixels());
        } else {
          magmaImage.setWidth((0).pixels());
        }
        icon.setX(new SubtractiveConstraint(((x - 202) * (128/621)).pixels(), (8).pixels()))
        .setY(new SubtractiveConstraint(((z - 202) * (128/621)).pixels(), (8).pixels()))
      }
    })
    .setChildOf(textInputBlock2);

  const exitBlock = new UIRoundedRectangle(5)
    .setColor(new ConstantColorConstraint(Color.BLACK))
    .setX(new SubtractiveConstraint(new CenterConstraint(), (42).pixels()))
    .setY((4).pixels(true))
    .setColor(new ConstantColorConstraint(Color.BLACK))
    .setWidth((50).pixels())
    .setHeight((25).pixels())
    .onMouseEnter((comp) => {
      animate(comp, (animation) => {
        animation.setColorAnimation(Animations.OUT_EXP, 0.5, new ConstantColorConstraint(Color.RED));
      });
    })
    .onMouseLeave((comp) => {
      animate(comp, (anim) => {
        anim.setColorAnimation(Animations.OUT_EXP, 0.5, new ConstantColorConstraint(Color.BLACK));
      });
    })
    .onMouseClick(() => {
      waypointCoordinates = "";
      waypointName = "";
      Client.currentGui.close();
    })
    .setChildOf(block);

  new UIText("DISCARD", true)
    .setX(new CenterConstraint())
    .setY(new CenterConstraint())
    .setColor(new ConstantColorConstraint(Color.WHITE))
    .setChildOf(exitBlock);

  const confirmBlock = new UIRoundedRectangle(5)
    .setColor(new ConstantColorConstraint(Color.BLACK))
    .setX(new AdditiveConstraint(new CenterConstraint(), (42).pixels()))
    .setY((4).pixels(true))
    .setColor(new ConstantColorConstraint(Color.BLACK))
    .setWidth((50).pixels())
    .setHeight((25).pixels())
    .onMouseEnter((comp) => {
      animate(comp, (animation) => {
        animation.setColorAnimation(Animations.OUT_EXP, 0.5, new ConstantColorConstraint(Color.GREEN));
      });
    })
    .onMouseLeave((comp) => {
      animate(comp, (anim) => {
        anim.setColorAnimation(Animations.OUT_EXP, 0.5, new ConstantColorConstraint(Color.BLACK));
      });
    })
    .onMouseClick(() => {
      if(textInput1.getText()) {
        newWaypointName = textInput1.getText();
      }
      if(textInput2.getText()) {
        newWaypointCoordinates = textInput2.getText();
      }
      createWaypoint(newWaypointName, newWaypointCoordinates, false)
      Client.currentGui.close();
    })
    .setChildOf(block);

  new UIText("CONFIRM", true)
    .setX(new CenterConstraint())
    .setY(new CenterConstraint())
    .setColor(new ConstantColorConstraint(Color.WHITE))
    .setChildOf(confirmBlock);
  
  const image = UIImage.Companion.ofURL(new URL("https://i.imgur.com/44O0mF6.png"))
    .setX(new CenterConstraint())
    .setY(new AdditiveConstraint(new SiblingConstraint(), (15).percent()))
    .setWidth((128).pixels())
    .setHeight(new AspectConstraint())
    .setChildOf(window);
    
  const magmaImage = UIImage.Companion.ofURL(new URL("https://i.imgur.com/QhPuKCm.png"))
    .setX((0).pixels())
    .setY((0).pixels())
    .setWidth(((textInput2.getText() ? textInput2.getText().split(",")[1] : Player.getY()) >= 64 ? 0 : 128).pixels())
    .setHeight(new AspectConstraint())
    .setChildOf(image);
  
  if(textInput2.getText() && !textInput2.getText().isBlank()) {
    x = textInput2.getText().split(",")[0];
    z = textInput2.getText().split(",")[2];
  } else {
    x = Math.round(newWaypointCoordinates.split(",")[0]);
    z = Math.round(newWaypointCoordinates.split(",")[2]);
  }
  x = Math.min(Math.max(x, 202), 823);
  z = Math.min(Math.max(z, 202), 823);
  
  const icon = UIImage.Companion.ofURL(new URL("https://i.imgur.com/ePP6A2C.png"))
    .setX(new SubtractiveConstraint(((x - 202) * (128/621)).pixels(), (8).pixels()))
    .setY(new SubtractiveConstraint(((z - 202) * (128/621)).pixels(), (8).pixels()))
    .setWidth((16).pixels())
    .setHeight(new AspectConstraint())
    .setChildOf(image);

  const blockImageInvalid = new UIBlock()
    .setX(new CenterConstraint())
    .setY(new CenterConstraint())
    .setWidth((128).pixels())
    .setHeight(new AspectConstraint())
    .setColor(new Color(0, 0, 0, 0))
    .setChildOf(image);

  const textImageInvalid = new UIText("INVALID COORDINATES", false)
    .setX(new CenterConstraint())
    .setY(new CenterConstraint())
    .setWidth((120).pixels())

    .setColor(new Color(1, 0, 0, 0))
    .setChildOf(image);
  return window;
}
const locationGui = new JavaAdapter(WindowScreen, {
  init() {
    box.setChildOf(this.getWindow());
  }
})
locationGui.init();

function getTextGui() {
  const textGui = new JavaAdapter(WindowScreen, {
    init() {
      createWaypointGui().setChildOf(this.getWindow());
    }
  });
  textGui.init();
  return textGui;
}
