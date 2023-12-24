/* 
 * This module can be found on GitHub at https://github.com/cognitivitydev/CrystalMap/
 * Please insult my amazing code.
 */

/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />

import {
    UIBlock,
    FillConstraint,
    UIRoundedRectangle,
    CenterConstraint,
    SubtractiveConstraint,
    UIText,
    AdditiveConstraint,
    SiblingConstraint,
    animate,
    Animations, 
    ConstantColorConstraint,
    UITextInput,
    UIImage,
    AspectConstraint,
    WindowScreen,
    ScrollComponent,
    UIWrappedText,
} from "../../Elementa";
import { sort, findPath } from "../pathfinder";
import { getCoordinates, parseCoordinates } from "../waypoints";

const Color = Java.type("java.awt.Color");
const URL = Java.type("java.net.URL")

var gemstones = undefined;
export var path = [];
var sorting = false;
var sortingCount = 0;
var sortingType = "";

export function openRouteGui() {
    const window = new UIBlock()
        .setX((0).pixels())
        .setY((0).pixels())
        .setWidth(new FillConstraint())
        .setHeight(new FillConstraint())
        .setColor(new Color(0, 0, 0, 0));

    const block = new UIRoundedRectangle(7.5)
        .setColor(new Color(0, 0, 0, 150 / 255))
        .setX(new CenterConstraint())
        .setY(new CenterConstraint())
        .setWidth(new SubtractiveConstraint((100).percent(), (30).pixels()))
        .setHeight(new SubtractiveConstraint((100).percent(), (30).pixels()))
        .setChildOf(window);
    
    if(gemstones && !gemstones.warning.equals("")) {
        const warningOutline = new UIBlock()
            .setColor(Color.WHITE)
            .setX(new SubtractiveConstraint((100).percent(), (300).pixels()))
            .setY(new SubtractiveConstraint((100).percent(), (50).pixels()))
            .setWidth((301).pixels())
            .setHeight((51).pixels())
            .setChildOf(window);
        const warningBlock = new UIBlock()
            .setColor(Color.RED)
            .setX(new SubtractiveConstraint((100).percent(), (299.5).pixels()))
            .setY(new SubtractiveConstraint((100).percent(), (49.5).pixels()))
            .setWidth((299).pixels())
            .setHeight((49).pixels())
            .setChildOf(window);
        const warningIcon = new UIText("⚠", false)
            .setX((7.5).pixels())
            .setY((12.5).percent())
            .setWidth((10).percent())
            .setChildOf(warningBlock);
        const warningText = new UIWrappedText(gemstones.warning, false)
            .setX(new AdditiveConstraint(new SiblingConstraint(), (10).pixels()))
            .setY(new CenterConstraint())
            .setWidth((242).pixels())
            .setChildOf(warningBlock)
    }

    if(!gemstones) {
        const downloadingText1 = new UIText("↻")
            .setX(new CenterConstraint())
            .setY(new SubtractiveConstraint(new CenterConstraint(), (20).pixels()))
            .setTextScale((7.5).pixels())
            .setChildOf(block);
        const downloadingText2 = new UIText("Downloading locations...")
            .setX(new CenterConstraint())
            .setY(new AdditiveConstraint(new CenterConstraint(), (20).pixels()))
            .setTextScale((2.5).pixels())
            .setChildOf(block);
        block.setColor(new Color(0, 0, 0, 220 / 255));
    } else if(sorting) {
        path.length = 0;
        block
            .setX(new CenterConstraint())
            .setY(new CenterConstraint())
            .setWidth(new SubtractiveConstraint((100).percent(), (30).pixels()))
            .setHeight(new SubtractiveConstraint((100).percent(), (30).pixels()))
            .setColor(new Color(0, 0, 0, 220 / 255));

        const downloadingText1 = new UIText("↻")
            .setX(new CenterConstraint())
            .setY(new SubtractiveConstraint(new CenterConstraint(), (20).pixels()))
            .setTextScale((7.5).pixels())
            .setChildOf(block);
        const downloadingText2 = new UIText("Sorting "+sortingCount+" locations...")
            .setX(new CenterConstraint())
            .setY(new AdditiveConstraint(new CenterConstraint(), (20).pixels()))
            .setTextScale((2.5).pixels())
            .setChildOf(block);
        new Thread(() => {
            var points = findPath(sort(getCoordinates(), gemstones.waypoints[sortingType]).slice(0, sortingCount));
            for(var point of points) {
                var coordinates = parseCoordinates(point.location);
                coordinates.x = parseInt(coordinates.x);
                coordinates.y = parseInt(coordinates.y);
                coordinates.z = parseInt(coordinates.z);
                path.push(coordinates);
            }
            sorting = false;
            sortingCount = 0;
            sortingType = "";
            Client.currentGui.close();
        }).start();
    } else {
        let ores = [];
        var selected = "";
        for (let key in gemstones.waypoints) {
            if (gemstones.waypoints.hasOwnProperty(key)) {
                ores.push(key.toUpperCase());
            }
        }

        var buttons = [];

        for(let index in ores) {
            let ore = ores[index];
            block.setWidth((45).percent()).setHeight((50).percent());
            let oreButton = new UIRoundedRectangle(3)
                .setColor(new Color(10 / 255, 64 / 255, 127 / 255))
                .setX((10).percent())
                .setY(new AdditiveConstraint(new SiblingConstraint(), (15).pixels()))
                .setWidth((30).percent())
                .setHeight((20).pixels())
                .onMouseEnter((comp) => {
                    animate(comp, (animation) => {
                        if(selected.equals(ore)) {
                            animation.setColorAnimation(Animations.OUT_EXP, 0.5, new ConstantColorConstraint(new Color(255 / 255, 20 / 255, 255 / 255, 1)));
                        } else {
                            animation.setColorAnimation(Animations.OUT_EXP, 0.5, new ConstantColorConstraint(new Color(20 / 255, 127 / 255, 255 / 255, 1)));
                        }
                    });
                })
                .onMouseLeave((comp) => {
                    animate(comp, (anim) => {
                        if(selected.equals(ore)) {
                            anim.setColorAnimation(Animations.OUT_EXP, 0.5, new ConstantColorConstraint(new Color(127 / 255, 10 / 255, 127 / 255, 1)));
                        } else {
                            anim.setColorAnimation(Animations.OUT_EXP, 0.5, new ConstantColorConstraint(new Color(10 / 255, 64 / 255, 127 / 255, 1)));
                        }
                    });
                })
                .setChildOf(block);
            oreButton.onMouseClick(() => {
                selected = ore;
                buttons.forEach(button => button.setColor(new Color(10 / 255, 64 / 255, 127 / 255)));
                oreButton.setColor(new Color(255 / 255, 20 / 255, 255 / 255));
                confirmBlock.setColor(new Color(30 / 255, 255 / 255, 30 / 255, 1));
            })
            new UIText(ore)
                .setX(new CenterConstraint())
                .setY(new CenterConstraint())
                .setTextScale((1.5).pixels())
                .setChildOf(oreButton);
            buttons.push(oreButton);

        }

        const pointText = new UIText("Number of Points")
            .setX(new AdditiveConstraint(new CenterConstraint(), (25).percent()))
            .setY((20).percent())
            .setTextScale((1.5).pixels())
            .setChildOf(block);

        const pointInputBlock = new UIRoundedRectangle(5)
            .setColor(new Color(0 / 255, 0 / 255, 0 / 255, 255 / 255))
            .setX(new AdditiveConstraint(new CenterConstraint(), (25).percent()))
            .setY((30).percent())
            .setWidth((33).percent())
            .setHeight((8).percent())
            .onMouseEnter((comp) => {
                animate(comp, (animation) => {
                    animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(new Color(20 / 255, 20 / 255, 20 / 255, 255 / 255)));
                });
            })
            .onMouseLeave((comp) => {
                animate(comp, (anim) => {
                    anim.setColorAnimation(Animations.IN_EXP, 0.2, new ConstantColorConstraint(new Color(0 / 255, 0 / 255, 0 / 255, 255 / 255)));
                });
            })
            .onMouseClick(() => {
                pointInput.grabWindowFocus();
            })
            .setChildOf(block);
        const pointInput = new UITextInput("20")
            .setX(new AdditiveConstraint(new CenterConstraint(), (10).pixels()))
            .setY(new CenterConstraint())
            .setWidth(new FillConstraint())
            .setChildOf(pointInputBlock);

        const confirmBlock = new UIRoundedRectangle(5)
            .setColor(new Color(30 / 255, 30 / 255, 30 / 255, 255 / 255))
            .setX(new AdditiveConstraint(new CenterConstraint(), (25).percent()))
            .setY((70).percent())
            .setWidth((33).percent())
            .setHeight((8).percent())
            .onMouseEnter((comp) => {
                animate(comp, (animation) => {
                    if(selected) {
                        animation.setColorAnimation(Animations.OUT_EXP, 0.5, new ConstantColorConstraint(new Color(60 / 255, 255 / 255, 60 / 255, 1)));
                    } else {
                        animation.setColorAnimation(Animations.OUT_EXP, 0.5, new ConstantColorConstraint(new Color(60 / 255, 60 / 255, 60 / 255, 1)));
                    }
                });
            })
            .onMouseLeave((comp) => {
                animate(comp, (animation) => {
                    if(selected) {
                        animation.setColorAnimation(Animations.OUT_EXP, 0.5, new ConstantColorConstraint(new Color(30 / 255, 255 / 255, 30 / 255, 1)));
                    } else {
                        animation.setColorAnimation(Animations.OUT_EXP, 0.5, new ConstantColorConstraint(new Color(30 / 255, 30 / 255, 30 / 255, 1)));
                    }
                });
            })
            .onMouseClick(() => {
                if(selected) {
                    var points = 20;
                    if(!pointInput.getText().equals("")) {
                        points = parseInt(pointInput.getText());
                    }
                    sorting = true;
                    sortingType = selected.toLowerCase();
                    sortingCount = Math.max(Math.min(points, gemstones.waypoints[sortingType].length), 2);

                    openRouteGui()
                }
            })    
            .setChildOf(block);

        const confirmText = new UIText("CONFIRM")
            .setX(new CenterConstraint())
            .setY(new CenterConstraint())
            .setTextScale((1.5).pixels())
            .setChildOf(confirmBlock);

        const clearBlock = new UIRoundedRectangle(5)
            .setColor(new Color(30 / 255, 30 / 255, 30 / 255, 1))
            .setX(new AdditiveConstraint(new CenterConstraint(), (25).percent()))
            .setY(new AdditiveConstraint(new SiblingConstraint(), (3).percent()))
            .setWidth((33).percent())
            .setHeight((8).percent())
            .onMouseEnter((comp) => {
                animate(comp, (animation) => {
                    if(path.length != 0) {
                        animation.setColorAnimation(Animations.OUT_EXP, 0.5, new ConstantColorConstraint(new Color(255 / 255, 60 / 255, 60 / 255, 1)));
                    } else {
                        animation.setColorAnimation(Animations.OUT_EXP, 0.5, new ConstantColorConstraint(new Color(60 / 255, 60 / 255, 60 / 255, 1)));
                    }
                });
            })
            .onMouseLeave((comp) => {
                animate(comp, (animation) => {
                    if(path.length != 0) {
                        animation.setColorAnimation(Animations.OUT_EXP, 0.5, new ConstantColorConstraint(new Color(255 / 255, 30 / 255, 30 / 255, 1)));
                    } else {
                        animation.setColorAnimation(Animations.OUT_EXP, 0.5, new ConstantColorConstraint(new Color(30 / 255, 30 / 255, 30 / 255, 1)));
                    }
                });
            })
            .onMouseClick(() => {
                path.length = 0;
                sorting = false;
                sortingCount = 0;
                sortingType = "";
                openRouteGui();
            })
            .setChildOf(block);
        if(path.length != 0) {
            clearBlock.setColor(new Color(255 / 255, 30 / 255, 30 / 255, 1));
        }

        const clearText = new UIText("CLEAR")
            .setX(new CenterConstraint())
            .setY(new CenterConstraint())
            .setTextScale((1.5).pixels())
            .setChildOf(clearBlock);
    }

    const gui = new JavaAdapter(WindowScreen, {
        init() {
            window.setChildOf(this.getWindow());
        }
    });
    gui.init();
    GuiHandler.openGui(gui);
    if(!gemstones) {
        new Thread(() => {
            gemstones = JSON.parse(FileLib.getUrlContent("https://raw.githubusercontent.com/cognitivitydev/CrystalHollows/main/gemstones.json").replaceAll("\r", ""));
            openRouteGui();
        }).start();
    }
}