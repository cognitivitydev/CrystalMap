/* 
 * This module can be found at https://github.com/cognitivitydev/CrystalMap/.
 * You can report any issues or add suggestions there.
 */

/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />

import {
    UIContainer,
    UIBlock,
    FillConstraint,
    UIRoundedRectangle,
    CenterConstraint,
    SubtractiveConstraint,
    UIText,
    AdditiveConstraint,
    SiblingConstraint,
    CramSiblingConstraint,
    animate,
    Animations, 
    ConstantColorConstraint,
    UITextInput,
    UIImage,
    AspectConstraint,
    WindowScreen,
    ScrollComponent,
    UIWrappedText,
    Window,
    ChildBasedSizeConstraint,
    ChildBasedMaxSizeConstraint
} from "../../Elementa";
import { getArea, inGlaciteTunnels } from "../WaypointManager";
import Settings from "../config";

const Color = Java.type("java.awt.Color");
const SimpleDateFormat = Java.type("java.text.SimpleDateFormat");
const JavaDate = Java.type("java.util.Date");
const TimeZone = Java.type("java.util.TimeZone");
const formatGMT = new SimpleDateFormat("HH:mm:ss");
formatGMT.setTimeZone(TimeZone.getTimeZone("GMT"));
const shortFormatGMT = new SimpleDateFormat("mm:ss");
shortFormatGMT.setTimeZone(TimeZone.getTimeZone("GMT"));


const start = Date.now();
var mineshaftCount = 0;
var lastMineshaft = 0;

var fuel = {
    remaining: -1,
    max: 0
}

var powderHistory = {
    gemstone: undefined,
    glacite: undefined
}

var lastPowder = {
    gemstone: 0,
    glacite: 0
}

var commissionHistory = [];

var coldUpdates = [];
var cold = Infinity;
var updateRate = 0;
var untilDeath = 0;

var inMineshaft = false;

register("renderOverlay", () => {
    if(!inGlaciteTunnels(true)) return;
    if(!Settings.glaciteStatus) return;

    var x = Settings.glaciteStatusX * Renderer.screen.getWidth();
    var y = Settings.glaciteStatusY * Renderer.screen.getHeight();
    const hud = new Window();

    var rectangle = new UIRoundedRectangle(3)
        .setColor(new Color(0, 0, 0, 180 / 255))
        .setX(x.pixels())
        .setY(y.pixels())
        .setWidth(new AdditiveConstraint(new ChildBasedMaxSizeConstraint(), (10).pixels()))
        .setHeight(new AdditiveConstraint(new ChildBasedSizeConstraint(), (10).pixels()))
        .setChildOf(hud);

    var time;
    if(coldUpdates.length == 0) time = "§cN/A";
    else if(coldUpdates.length < 3) time = "§8Calculating...";
    else if(untilDeath-Date.now() < 15000) time = "§c§l"+toClock(untilDeath-Date.now());
    else time = "§9"+toClock(untilDeath-Date.now());
    new UIText("§7Time Until Death: "+time)
        .setX((5).pixels())
        .setY((5).pixels())
        .setChildOf(rectangle);
        
    new UIText("§7Commisions per Hour: §2"+Math.round(commissionHistory.length == 0 ? "0" : commissionHistory.length/(Date.now()-commissionHistory[0])*3600000))
        .setX((5).pixels())
        .setY(new SiblingConstraint(2))
        .setChildOf(rectangle);
    
    new UIText("§7Gemstone Powder: §d"+Settings.gemstonePowder+" ᠅")
        .setX((5).pixels())
        .setY(new SiblingConstraint(2))
        .setChildOf(rectangle);

    new UIText("§7Glacite Powder: §b"+Settings.glacitePowder+" ᠅")
        .setX((5).pixels())
        .setY(new SiblingConstraint(2))
        .setChildOf(rectangle);

    new UIText("§7Gemstone Powder per Hour: §d"+calculateRate("gemstone", Settings.gemstonePowder)+" ᠅")
        .setX((5).pixels())
        .setY(new SiblingConstraint(2))
        .setChildOf(rectangle);

    new UIText("§7Glacite Powder per Hour: §b"+calculateRate("glacite", Settings.glacitePowder)+" ᠅")
        .setX((5).pixels())
        .setY(new SiblingConstraint(2))
        .setChildOf(rectangle);

    new UIText("§7Session Mineshafts: §3"+mineshaftCount)
        .setX((5).pixels())
        .setY(new SiblingConstraint(2))
        .setChildOf(rectangle);

    new UIText("§7Mineshafts per Hour: §3"+(mineshaftCount/((Date.now()-start)/3600000)).toFixed(2))
        .setX((5).pixels())
        .setY(new SiblingConstraint(2))
        .setChildOf(rectangle);

    new UIText("§7Time Since Mineshaft: "+(lastMineshaft == 0 ? "§cN/A" : "§3"+toClock(Date.now()-lastMineshaft, true)))
        .setX((5).pixels())
        .setY(new SiblingConstraint(2))
        .setChildOf(rectangle);

    var fuelString;
    if(fuel.remaining == -1) {
        fuelString = "§7Drill Fuel: §cUnknown §8(0.0%)";
    } else if(fuel.remaining == Infinity) {
        fuelString = "§7Drill Fuel: §2Infinite §8(100.0%)";
    } else if(fuel.remaining.replace(",", "") == 0) {
        fuelString = "§7Drill Fuel: §c0 §8(0.0%)";
    } else if(fuel.remaining.replace(",", "") < 500) {
        fuelString = "§7Drill Fuel: §e"+fuel.remaining+" §8("+(fuel.remaining.replace(",", "")/fuel.max * 100).toFixed(1)+"%)";
    } else {
        fuelString = "§7Drill Fuel: §a"+fuel.remaining+" §8("+(fuel.remaining.replace(",", "")/fuel.max * 100).toFixed(1)+"%)";
    }

    new UIText(fuelString)
        .setX((5).pixels())
        .setY(new SiblingConstraint(2))
        .setChildOf(rectangle);
    hud.draw();
});

register("chat", (event) => {
    var formatted = ChatLib.getChatMessage(event);
    var message = ChatLib.removeFormatting(formatted);
    if(message.startsWith("WOW! You found a Glacite Mineshaft portal!") && Settings.glacitePersonalMineshafts) {
        lastMineshaft = Date.now();
        mineshaftCount++;
    }
    if(/^(CORPSE LOOTER|MINESHAFT EXPLORER|(((AQUAMARINE|CITRINE|ONYX|PERIDOT) GEMSTONE|TUNGSTEN|UMBER|GLACITE|SCRAP)) COLLECTOR) Commission Complete! Visit the King to claim your rewards!$/g.exec(message)) {
        commissionHistory.push(Date.now());
    }
});

register("renderScoreboard", () => {
    if(!inGlaciteTunnels(true)) return;
    var lines = Scoreboard.getLines();
    var isCold = false;
    lines.forEach((formatted) => {
        let line = ChatLib.removeFormatting(formatted).replace(/[^A-z0-9 :(),.\-'û᠅]/g, "");
        if(line.startsWith("᠅ Gemstone: ")) {
            if(Settings.gemstonePowder != line.replace("᠅ Gemstone: ", "")) {
                Settings.gemstonePowder = line.replace("᠅ Gemstone: ", "");
                if(parseInt(Settings.gemstonePowder.replace(",", "")) < powderHistory.gemstone?.powder) {
                    powderHistory.gemstone = undefined;
                }
                if(!powderHistory.gemstone) {
                    powderHistory.gemstone = {time: Date.now(), powder: parseInt(Settings.gemstonePowder.replace(",", ""))};
                }
                lastPowder.gemstone = Date.now();
            }
        }
        if(line.startsWith("᠅ Glacite: ")) {
            if(Settings.glacitePowder != line.replace("᠅ Glacite: ", "")) {
                Settings.glacitePowder = line.replace("᠅ Glacite: ", "");
                if(parseInt(Settings.glacitePowder.replace(",", "")) < powderHistory.glacite?.powder) {
                    powderHistory.glacite = undefined;
                }
                if(!powderHistory.glacite) {
                    powderHistory.glacite = {time: Date.now(), powder: parseInt(Settings.glacitePowder.replace(",", ""))};
                }
                lastPowder.glacite = Date.now();
            }
        }
        if(line.startsWith("Cold: ")) {
            isCold = true;
            var currentCold = parseInt(line.replace("Cold: ", ""));
            if(cold != currentCold) {
                coldUpdates.push(Date.now());
                updateRate = (Date.now()-coldUpdates[0])/coldUpdates.length;
                untilDeath = Date.now()+((100+currentCold)*updateRate);
            }
            cold = currentCold;
            if(coldUpdates.length > 10) {
                coldUpdates.splice(0, coldUpdates.length-11);
            }
        }
    });
    if(!isCold) {
        coldUpdates = [];
        cold = Infinity;
        updateRate = 0;
        untilDeath = 0;
    }
});

register("step", () => {
    if(!inGlaciteTunnels(true)) return;
    if(getArea().equals("Glacite Mineshafts")) {
        if(!inMineshaft && !Settings.glacitePersonalMineshafts) {
            lastMineshaft = Date.now();
            mineshaftCount++;
        }
        inMineshaft = true;
    } else {
        inMineshaft = false;
    }
    if(Settings.gemstonePowder == "???" || Settings.glacitePowder == "???") {
        TabList.getNames().forEach(formatted => {
            let line = ChatLib.removeFormatting(formatted);
            if(line.startsWith(" Gemstone: ") && Settings.gemstonePowder == "???") {
                Settings.gemstonePowder = line.replace(" Gemstone: ", "");
            }
            if(line.startsWith(" Glacite: ") && Settings.glacitePowder == "???") {
                Settings.glacitePowder = line.replace(" Glacite: ", "");
            }
        });
    }
    if(Player.getHeldItem()) {
        var extraAttributes = Player.getHeldItem().getNBT().getCompoundTag("tag").getCompoundTag("ExtraAttributes");
        if(extraAttributes.getString("id") == "GEMSTONE_GAUNTLET") {
            fuel.remaining = Infinity;
            fuel.max = Infinity;
        } else {
            Player.getHeldItem().getLore().forEach((line) => {
                var text = ChatLib.removeFormatting(line);
                if(!text.startsWith("Fuel: ")) return;
                var drillFuel = text.replace("Fuel: ", "");
                fuel.remaining = drillFuel.split("/")[0];
                fuel.max = parseInt(drillFuel.split("/")[1].replace("k"))*1000;        
            });
            if(extraAttributes.getInteger("drill_fuel")) {
                fuel.remaining = addCommas(extraAttributes.getInteger("drill_fuel"));
            }
        }
    }

}).setFps(4);

function toClock(ms, hours = false) {
    if(hours) {
        return formatGMT.format(new JavaDate(ms));
    }
    return shortFormatGMT.format(new JavaDate(ms));
}
function addCommas(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function calculateRate(powder, currentPowder) {
    if(Date.now()-lastPowder[powder] > 180000) {
        powderHistory[powder] = undefined;
        return 0;
    }
    var history = powderHistory[powder];
    if(!history) return 0;
    var powderDifference = parseInt(currentPowder.replace(",", ""))-history.powder;
    var timeDifference = (Date.now()-(history.time));
    return addCommas(Math.round((powderDifference/timeDifference)*3600000));
}