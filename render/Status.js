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
import { inCrystalHollows } from "../WaypointManager";
import Settings from "../config";

const Color = Java.type("java.awt.Color");

var fuel = {
    remaining: -1,
    max: 0
}

var powders = {
    mithril: "???",
    gemstone: "???"
}

var robotParts = {
    switch: false,
    motor: false,
    heart: false,
    transmitter: false,
    ftx: false,
    reflector: false
}

var foundTools = {
    diamond: false,
    emerald: false,
    gold: false,
    lapis: false
}

register("renderOverlay", () => {
    if(!inCrystalHollows()) return;
    if(!Settings.status) return;

    var x = Settings.statusX * Renderer.screen.getWidth();
    var y = Settings.statusY * Renderer.screen.getHeight();
    const hud = new Window();

    var rectangle = new UIRoundedRectangle(3)
        .setColor(new Color(0, 0, 0, 180 / 255))
        .setX(x.pixels())
        .setY(y.pixels())
        .setWidth(new AdditiveConstraint(new ChildBasedMaxSizeConstraint(), (10).pixels()))
        .setHeight(new AdditiveConstraint(new ChildBasedSizeConstraint(), (10).pixels()))
        .setChildOf(hud);
    
    new UIText(Settings.jadeCrystal ? "§7Jade Crystal: §a§lFOUND  " : "§7Jade Crystal: §c§lMISSING  ")
        .setX((5).pixels())
        .setY((5).pixels())
        .setChildOf(rectangle);

    new UIText(Settings.amberCrystal ? "§7Amber Crystal: §a§lFOUND  " : "§7Amber Crystal: §c§lMISSING  ")
        .setX((5).pixels())
        .setY(new SiblingConstraint(2))
        .setChildOf(rectangle);

    new UIText(Settings.amethystCrystal ? "§7Amethyst Crystal: §a§lFOUND  " : "§7Amethyst Crystal: §c§lMISSING  ")
        .setX((5).pixels())
        .setY(new SiblingConstraint(2))
        .setChildOf(rectangle);

    new UIText(Settings.sapphireCrystal ? "§7Sapphire Crystal: §a§lFOUND  " : "§7Sapphire Crystal: §c§lMISSING  ")
        .setX((5).pixels())
        .setY(new SiblingConstraint(2))
        .setChildOf(rectangle);

    new UIText(Settings.topazCrystal ? "§7Topaz Crystal: §a§lFOUND  " : "§7Topaz Crystal: §c§lMISSING  ")
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

    new UIText("§7Mithril Powder: §2"+powders.mithril+" ᠅")
        .setX((5).pixels())
        .setY(new SiblingConstraint(2))
        .setChildOf(rectangle);
    
    new UIText("§7Gemstone Powder: §d"+powders.gemstone+" ᠅")
        .setX((5).pixels())
        .setY(new SiblingConstraint(2))
        .setChildOf(rectangle);
    let sumParts = robotParts.switch+robotParts.motor+robotParts.heart+robotParts.transmitter+robotParts.ftx+robotParts.reflector;
    new UIText(sumParts == 0 ? "§7Robot Parts: §c0§8/6" : sumParts == 6 ? "§7Robot Parts: §a6§8/6" : "§7Robot Parts: §e"+sumParts+"§8/6" )
        .setX((5).pixels())
        .setY(new SiblingConstraint(2))
        .setChildOf(rectangle);

    let sumTools = foundTools.diamond+foundTools.emerald+foundTools.gold+foundTools.lapis;
    new UIText(sumTools == 0 ? "§7Tools Found: §c0§8/4" : sumTools == 4 ? "§7Tools Found: §a4§8/4" : "§7Tools Found: §e"+sumTools+"§8/4" )
        .setX((5).pixels())
        .setY(new SiblingConstraint(2))
        .setChildOf(rectangle);

    hud.draw();
});

register("chat", (event) => {
    var message = ChatLib.removeFormatting(ChatLib.getChatMessage(event));
    if(message == "  You've earned a Crystal Loot Bundle!") {
        Settings.jadeCrystal = false;
        Settings.amberCrystal = false;
        Settings.amethystCrystal = false;
        Settings.sapphireCrystal = false;
        Settings.topazCrystal = false;
    }
    if(message == "                                Jade Crystal") Settings.jadeCrystal = true;
    if(message == "                                Amber Crystal") Settings.amberCrystal = true;
    if(message == "                              Amethyst Crystal") Settings.amethystCrystal = true;
    if(message == "                              Sapphire Crystal") Settings.sapphireCrystal = true;
    if(message == "                                Topaz Crystal") Settings.topazCrystal = true;
});

register("renderScoreboard", () => {
    var lines = Scoreboard.getLines();
    lines.forEach((formatted) => {
        let line = ChatLib.removeFormatting(formatted).replace(/[^A-z0-9 :(),.\-'û᠅]/g, "");
        if(line.startsWith("᠅ Gemstone: ")) {
            powders.gemstone = line.replace("᠅ Gemstone: ", "");
        }
        if(line.startsWith("᠅ Mithril: ")) {
            powders.mithril = line.replace("᠅ Mithril: ", "");
        }
    });
})

register("step", () => {
    robotParts = {switch: false, motor: false, heart: false, transmitter: false, ftx: false, reflector: false}
    
    foundTools = {diamond: false, emerald: false, gold: false, lapis: false}    
    if(Player.getInventory()) {
        Player.getInventory().getItems().forEach((item) => {
            if(!item) return;
            let id = item.getNBT().getCompoundTag("tag").getCompoundTag("ExtraAttributes").getString("id");
            if(id == "CONTROL_SWITCH") {
                robotParts.switch = true;
            }
            if(id == "SUPERLITE_MOTOR") {
                robotParts.motor = true;
            }
            if(id == "SYNTHETIC_HEART") {
                robotParts.heart = true;
            }
            if(id == "ELECTRON_TRANSMITTER") {
                robotParts.transmitter = true;
            }
            if(id == "FTX_3070") {
                robotParts.ftx = true;
            }
            if(id == "ROBOTRON_REFLECTOR") {
                robotParts.reflector = true;
            }

            if(id == "DWARVEN_DIAMOND_AXE") {
                foundTools.diamond = true;
            }
            if(id == "DWARVEN_EMERALD_HAMMER") {
                foundTools.emerald = true;
            }
            if(id == "DWARVEN_GOLD_HAMMER") {
                foundTools.gold = true;
            }
            if(id == "DWARVEN_LAPIS_SWORD") {
                foundTools.lapis = true;
            }
        });
    }

    try {
        TabList.getNames().forEach(name => {
            let line = ChatLib.removeFormatting(name);
            if(line.startsWith(" Mithril Powder: ")) {
                powders.mithril = line.replace(" Mithril Powder: ", "");
            }
            if(line.startsWith(" Gemstone Powder: ")) {
                powders.gemstone = line.replace(" Gemstone Powder: ", "");
            }
        })    
    } catch(exception) {}

    if(Player.getHeldItem()) {
        if(Player.getHeldItem().getNBT().getCompoundTag("tag").getCompoundTag("ExtraAttributes").getString("id") == "GEMSTONE_GAUNTLET") {
            fuel.remaining = Infinity;
            fuel.max = Infinity;
        } else {
            Player.getHeldItem().getLore().forEach((line) => {
                var text = ChatLib.removeFormatting(line);
                if(!text.startsWith("Fuel: ")) return;
                var drillFuel = text.replace("Fuel: ", "");
                fuel.remaining = drillFuel.split("/")[0];
                fuel.max = parseInt(drillFuel.split("/")[1].replace("k"))*1000;        
            })
        }
    }
}).setFps(4);
