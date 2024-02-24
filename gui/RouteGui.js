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
} from "../../Elementa";
import { getCoordinates, parseCoordinates } from "../waypoints";
import Settings from "../config";
import { PathfinderType, findPath } from "../pathfinder";

const Color = Java.type("java.awt.Color");
const Desktop = Java.type("java.awt.Desktop");
const URI = Java.type("java.net.URI");

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
        const downloadingText2 = new UIText("Loading...")
            .setX(new CenterConstraint())
            .setY(new AdditiveConstraint(new CenterConstraint(), (20).pixels()))
            .setTextScale((2.5).pixels())
            .setChildOf(block);
        block.setColor(new Color(0, 0, 0, 220 / 255));
        new Thread(() => {
            var file = FileLib.read("./config/ChatTriggers/modules/CrystalMap/gemstones.json");
            if(!file) {
                downloadingText2.setText("Downloading repository...");
                var repository = FileLib.getUrlContent(Settings.routeURL).replaceAll("\r", "");
                gemstones = JSON.parse(repository);
                FileLib.write("./config/ChatTriggers/modules/CrystalMap/gemstones.json", repository);
            } else {
                downloadingText2.setText("Loading...");
                gemstones = JSON.parse(file);
                if(Settings.updateRoutes) {
                    downloadingText2.setText("Checking for updates...")
                    var repository = FileLib.getUrlContent(Settings.routeURL).replaceAll("\r", "");
                    var parsedRepository = JSON.parse(repository);
                    if(parsedRepository.version > gemstones.version) {
                        downloadingText2.setText("Updating...")
                        FileLib.write("./config/ChatTriggers/modules/CrystalMap/gemstones.json", repository);
                        gemstones = parsedRepository;
                    }
                }
            }
            gemstones = JSON.parse(FileLib.getUrlContent(Settings.routeURL).replaceAll("\r", ""));
            openRouteGui();
        }).start();

    } else if(sorting) {
        path.length = 0;
        block
            .setX(new CenterConstraint())
            .setY(new CenterConstraint())
            .setWidth(new SubtractiveConstraint((100).percent(), (30).pixels()))
            .setHeight(new SubtractiveConstraint((100).percent(), (30).pixels()))
            .setColor(new Color(0, 0, 0, 220 / 255));

        const sortingText1 = new UIText("↻")
            .setX(new CenterConstraint())
            .setY(new SubtractiveConstraint(new CenterConstraint(), (20).pixels()))
            .setTextScale((7.5).pixels())
            .setChildOf(block);
        const sortingText2 = new UIText("Sorting "+sortingCount+" locations...")
            .setX(new CenterConstraint())
            .setY(new AdditiveConstraint(new CenterConstraint(), (20).pixels()))
            .setTextScale((2.5).pixels())
            .setChildOf(block);
        const sortingText3 = new UIText("Elapsed: 0.0s")
            .setX((2).percent())
            .setY((92).percent())
            .setChildOf(block);
        const sortingText4 = new UIText("Estimate: 0.0s")
            .setX((2).percent())
            .setY((95).percent())
            .setChildOf(block);
        var finished = false;
        var starting = Date.now();
        var estimate = Math.round(gemstones.waypoints[sortingType].length / 120)/100;
        new Thread(() => {
            var points = findPath(gemstones.waypoints[sortingType], sortingCount, PathfinderType.NEAREST_NEIGHBOR);
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
            finished = true;
        }).start();
        var timerThread = new Thread(() => {
            while(!finished) {
                sortingText3.setText("Elapsed: "+Math.round(100*(Date.now()-starting)/1000)/100+"s")
                sortingText4.setText("Estimate: "+estimate+"s")
                timerThread.sleep(1);
            }
        })
        timerThread.start();
    } else {
        block.setWidth((45).percent()).setHeight((50).percent());

        const versionText = new UIText("Version "+gemstones.version)
            .setY(new SubtractiveConstraint((25).percent(), (10).pixels()))
            .setColor(new Color(1, 1, 1, 0.2))
            .onMouseEnter((comp) => {
                animate(comp, (animation) => {
                    animation.setColorAnimation(Animations.OUT_EXP, 0.5, new ConstantColorConstraint(new Color(0, 1, 1, 0.75)));
                });
            })
            .onMouseLeave((comp) => {
                animate(comp, (animation) => {
                    animation.setColorAnimation(Animations.OUT_EXP, 0.5, new ConstantColorConstraint(new Color(1, 1, 1, 0.2)));
                });
            })
            .onMouseClick(() => {
                Desktop.getDesktop().browse(new URI("https://github.com/cognitivitydev/CrystalHollows/tree/main"));
            })
            .setChildOf(window);
        versionText.setX(new AdditiveConstraint(new SiblingConstraint(0, true), (versionText.getWidth()+2).pixels()))
        
        const creditText = new UIText("Thank you Campionnn!")
            .setX(new AdditiveConstraint(new SiblingConstraint(0, true), new SubtractiveConstraint((45).percent(), (4).pixels())))
            .setY(new SubtractiveConstraint((25).percent(), (10).pixels()))
            .setColor(new Color(1, 1, 1, 0.2))
            .onMouseEnter((comp) => {
                animate(comp, (animation) => {
                    animation.setColorAnimation(Animations.OUT_EXP, 0.5, new ConstantColorConstraint(new Color(0, 1, 1, 0.75)));
                });
            })
            .onMouseLeave((comp) => {
                animate(comp, (animation) => {
                    animation.setColorAnimation(Animations.OUT_EXP, 0.5, new ConstantColorConstraint(new Color(1, 1, 1, 0.2)));
                });
            })
            .onMouseClick(() => {
                Desktop.getDesktop().browse(new URI("https://github.com/Campionnn/CleanCH/"));
            })
            .setChildOf(window);
        let ores = [];
        var selected = "";
        for (let key in gemstones.waypoints) {
            if (gemstones.waypoints.hasOwnProperty(key)) {
                ores.push(key.toUpperCase());
            }
        }
        const buttonsBlock = new UIContainer()
            .setX((10).percent())
            .setY((15).pixels())
            .setWidth((40).percent())
            .setHeight((100).percent())
            .setChildOf(block);

        var buttons = [];

        for(let index in ores) {
            let ore = ores[index];
            let oreButton = new UIRoundedRectangle(3)
                .setColor(Color.decode(gemstones.colors[ore.toLowerCase()]).darker().darker().darker())
                .setX(new CramSiblingConstraint(15))
                .setY(new CramSiblingConstraint(15))
                .setWidth(new SubtractiveConstraint((45).percent(), (0).pixels()))
                .setHeight((20).pixels())
                .onMouseEnter((comp) => {
                    animate(comp, (animation) => {
                        if(selected.equals(ore)) {
                            animation.setColorAnimation(Animations.OUT_EXP, 0.5, new ConstantColorConstraint(Color.decode(gemstones.colors[ore.toLowerCase()])));
                        } else {
                            animation.setColorAnimation(Animations.OUT_EXP, 0.5, new ConstantColorConstraint(Color.decode(gemstones.colors[ore.toLowerCase()]).darker().darker()));
                        }
                    });
                })
                .onMouseLeave((comp) => {
                    animate(comp, (animation) => {
                        if(selected.equals(ore)) {
                            animation.setColorAnimation(Animations.OUT_EXP, 0.5, new ConstantColorConstraint(Color.decode(gemstones.colors[ore.toLowerCase()]).darker()));
                        } else {
                            animation.setColorAnimation(Animations.OUT_EXP, 0.5, new ConstantColorConstraint(Color.decode(gemstones.colors[ore.toLowerCase()]).darker().darker().darker()));
                        }
                    });
                })
                .onMouseClick(() => {
                    selected = ore;
                    buttons.forEach(button => {
                        let buttonName = ores[buttons.indexOf(button)];
                        button.setColor(Color.decode(gemstones.colors[buttonName.toLowerCase()]).darker().darker().darker());
                    });
                    oreButton.setColor(Color.decode(gemstones.colors[ore.toLowerCase()]));
                    confirmBlock.setColor(new Color(30 / 255, 255 / 255, 30 / 255, 1));
                })
                .setChildOf(buttonsBlock);
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
        const pointInput = new UITextInput("30")
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
                    var points = 30;
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
}