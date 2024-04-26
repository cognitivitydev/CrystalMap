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
    ChildBasedMaxSizeConstraint,
    MaxConstraint
} from "../../Elementa";
import { inGlaciteTunnels } from "../WaypointManager";
import Settings from "../config";

const Color = Java.type("java.awt.Color");
const SimpleDateFormat = Java.type("java.text.SimpleDateFormat");
const JavaDate = Java.type("java.util.Date");
const TimeZone = Java.type("java.util.TimeZone");
const shortFormatGMT = new SimpleDateFormat("mm:ss");
shortFormatGMT.setTimeZone(TimeZone.getTimeZone("GMT"));


var coldUpdates = [];
var cold = Infinity;
var updateRate = 0;
var untilDeath = 0;
var lastTimer = 0;

var showing = false;

export function onWarpCold() {
    if(!Settings.coldWarning) return;
    if(untilDeath == 0) return;
    if(coldUpdates.length < 5) return;
    if(untilDeath-Date.now() > Settings.coldWarningThreshold) return;
    if(untilDeath == 0 || untilDeath-Date.now() > 15000) return;
    ChatLib.chat("&b[CrystalMap] &7Warping to safety...");
    lastScrap = 0;
    ChatLib.command("warp "+Settings.glaciteExitLocation);
}

register("renderOverlay", () => {
    if(!inGlaciteTunnels()) return;
    if(!Settings.coldWarning) return;
    if(untilDeath == 0) return;
    if(coldUpdates.length < 5) return;
    if(showing) {
        if(untilDeath-Date.now() > Settings.coldWarningThreshold + 3000 && showing) {
            showing = false;
            return;
        }
    } else if(untilDeath-Date.now() > Settings.coldWarningThreshold) return;

    showing = true;

    const hud = new Window();

    var rectangle = new UIRoundedRectangle(3)
        .setColor(new Color(0, 0, 0, 0.5))
        .setX(new CenterConstraint())
        .setY((75).percent())
        .setHeight((40).pixels())
        .setChildOf(hud);

    var title = new UIText("§3FREEZING IN §b"+toClock(untilDeath-Date.now()))
        .setX(new CenterConstraint())
        .setY((20).percent())
        .setChildOf(rectangle);

    var text = new UIText("§7Press §e["+Keyboard.getKeyName(Client.getKeyBindFromDescription("Warp Out").getKeyCode())+"] §7to warp out.")
        .setColor(new Color(1, 1, 1, 1))
        .setX(new CenterConstraint())
        .setY((50).percent())
        .setChildOf(rectangle);

    rectangle.setWidth(new AdditiveConstraint(new MaxConstraint((text.getWidth()).pixels(), (title.getWidth()).pixels()), (24).pixels()));


    var bar = new UIBlock()
        .setColor(new Color(0.2, 0.2, 0.2, 1))
        .setWidth((100).percent())
        .setHeight((4).pixels())
        .setX((0).pixels())
        .setY((0).pixels(true))
        .setChildOf(rectangle)
        
    var progress = new UIBlock()
        .setColor(new Color(0, 0.85, 1, 1))
        .setWidth(Math.min(((untilDeath-Date.now())/Settings.coldWarningThreshold)*100, 100).percent())
        .setHeight(new FillConstraint())
        .setChildOf(bar);

    hud.draw();
});

register("renderScoreboard", () => {
    if(!inGlaciteTunnels(true)) return;
    var lines = Scoreboard.getLines();
    var isCold = false;
    lastTimer = untilDeath;
    lines.forEach((formatted) => {
        let line = ChatLib.removeFormatting(formatted).replace(/[^A-z0-9 :(),.\-'û᠅]/g, "");
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

export function getColdTimer() {
    var time;
    if(coldUpdates.length == 0) time = "§cN/A";
    else if(coldUpdates.length < 3) time = "§8Calculating...";
    else if(untilDeath-Date.now() < 15000) time = "§c§l"+toClock(untilDeath-Date.now());
    else time = "§9"+toClock(untilDeath-Date.now());
    return time;
}

function toClock(ms) {
    return shortFormatGMT.format(new JavaDate(ms));
}
