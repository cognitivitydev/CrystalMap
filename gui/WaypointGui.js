/* 
 * This module can be found at https://github.com/cognitivitydev/CrystalMap/.
 * You can report any issues or add suggestions there.
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
} from "../../Elementa";
import { createServerWaypoint, editWaypoint, getServer, getServerName, getWaypoint, getWaypoints, parseCoordinates, removeServerWaypoint } from "../WaypointManager";

const Color = Java.type("java.awt.Color");
const File = Java.type("java.io.File");

export function openWaypointGui(name = "New Waypoint", coordinates = Math.round(Player.getX()) + "," + Math.round(Player.getY()) + "," + Math.round(Player.getZ())) {
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
        .setWidth(new SubtractiveConstraint(new FillConstraint(), (30).pixels()))
        .setHeight(new SubtractiveConstraint(new FillConstraint(), (30).pixels()))
        .setChildOf(window);

    const settingsBlock = new UIBlock()
        .setX((1).percent())
        .setY((2).percent())
        .setWidth((75).pixels())
        .setHeight((20).pixels())
        .setColor(new Color(21 / 255, 24 / 255, 28 / 255, 1))
        .onMouseEnter((comp) => {
            animate(comp, (animation) => {
                animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(new Color(17 / 255, 19 / 255, 22 / 255, 1)));
            });
        })
        .onMouseLeave((comp) => {
            animate(comp, (anim) => {
                anim.setColorAnimation(Animations.IN_EXP, 0.2, new ConstantColorConstraint(new Color(21 / 255, 24 / 255, 28 / 255, 1)));
            });
        })
        .onMouseClick(() => {
            ChatLib.command("crystalmap settings", true)
        })
        .setChildOf(block);

    const settingsName = new UIText("Settings", false)
        .setX((10).percent())
        .setY(new CenterConstraint())
        .setChildOf(settingsBlock);

    const settingsIcon = new UIText("˃", false)
        .setX(new SubtractiveConstraint((100).percent(), (12).pixels()))
        .setY((20).percent())
        .setWidth((6).pixels())
        .setChildOf(settingsBlock);


    const routeBlock = new UIBlock()
        .setX(new AdditiveConstraint((5).percent(), (2).pixels()))
        .setY((20).percent())
        .setWidth((252).pixels())
        .setHeight((20).pixels())
        .setColor(new Color(21 / 255, 24 / 255, 28 / 255, 1))
        .onMouseEnter((comp) => {
            animate(comp, (animation) => {
                animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(new Color(17 / 255, 19 / 255, 22 / 255, 1)));
            });
        })
        .onMouseLeave((comp) => {
            animate(comp, (anim) => {
                anim.setColorAnimation(Animations.IN_EXP, 0.2, new ConstantColorConstraint(new Color(21 / 255, 24 / 255, 28 / 255, 1)));
            });
        })
        .onMouseClick(() => {
            ChatLib.command("crystalmap route", true)
        })
        .setChildOf(block);

    const routeName = new UIText("Generate gemstone route...", false)
        .setX((5).percent())
        .setY(new CenterConstraint())
        .setChildOf(routeBlock);

    const routeIcon = new UIText("˃", false)
        .setX(new SubtractiveConstraint((100).percent(), (12).pixels()))
        .setY((20).percent())
        .setWidth((6).pixels())
        .setChildOf(routeBlock);

    const image = UIImage.Companion.ofFile(new File("config/ChatTriggers/modules/CrystalMap/assets/map-normal.png"))
        .setX((5).percent())
        .setY(new CenterConstraint())
        .setWidth((256).pixels())
        .setHeight(new AspectConstraint())
        .setChildOf(block);

    var waypointsDropped = false;
    const dropBlock = new UIBlock()
        .setX(new AdditiveConstraint((5).percent(), (2).pixels()))
        .setY(new AdditiveConstraint(new SiblingConstraint(), (1).percent()))
        .setWidth((252).pixels())
        .setHeight((20).pixels())
        .setColor(new Color(21 / 255, 24 / 255, 28 / 255, 1))
        .onMouseEnter((comp) => {
            animate(comp, (animation) => {
                animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(new Color(17 / 255, 19 / 255, 22 / 255, 1)));
            });
        })
        .onMouseLeave((comp) => {
            animate(comp, (anim) => {
                anim.setColorAnimation(Animations.IN_EXP, 0.2, new ConstantColorConstraint(new Color(21 / 255, 24 / 255, 28 / 255, 1)));
            });
        })
        .setChildOf(block);

    const dropName = new UIText("Create new waypoint...", false)
        .setX((5).percent())
        .setY(new CenterConstraint())
        .setChildOf(dropBlock);

    const dropIcon = new UIText("˅", false)
        .setX(new SubtractiveConstraint((100).percent(), (12).pixels()))
        .setY((25).percent())
        .setWidth((8).pixels())
        .setChildOf(dropBlock);

    const waypoints = new ScrollComponent()
        .setX(new AdditiveConstraint((5).percent(), (4).pixels()))
        .setY(new SiblingConstraint(1))
        .setWidth((248).pixels())
        .setHeight((90).pixels())
        .setChildOf(block);
    
    var dropWaypoints = [];
    var dropTexts = [];

    var dropWaypoint = new UIBlock()
        .setX((0).pixels())
        .setY(new SiblingConstraint())
        .setWidth((100).percent())
        .setHeight((12).pixels())
        .setColor(new Color(5 / 255, 24 / 255, 10 / 255, 1))
        .onMouseClick(() => {
            textInput1.setText(name);
            textInput2.setText(coordinates);
            if(parseCoordinates(coordinates).y < 64) {
                magmaImage.setWidth((256).pixels());
            } else {
                magmaImage.setWidth((0).pixels());
            }
            textInput3.setText(getServerName())
            dropName.setText("Create new waypoint...");
            if(getWaypoint(getServerName(), "New Waypoint")) {
                confirmText.setText("EDIT");
            } else {
                confirmText.setText("CONFIRM");
            }
        })
        .setChildOf(waypoints);
    dropWaypoints.push(dropWaypoint);
    var dropText = new UIText("Create new waypoint...", false)
        .setX((5).percent())
        .setY(new CenterConstraint())
        .setChildOf(dropWaypoint);
    dropTexts.push(dropText);

    let serverWaypoints = getServer(getServerName()).waypoints;
    let waypointsArray = [];

    waypointsArray = waypointsArray.concat(serverWaypoints);
    getWaypoints().forEach(servers => {
        servers.waypoints.forEach(serverWaypoint => {
            if(!servers.server.equals(getServerName())) {
                waypointsArray.push(serverWaypoint);
            }
        });
    });
    

    for(var i = 0; i < waypointsArray.length; i++) {
        let waypoint = waypointsArray[i];

        let displayName = waypoint.name.substring(0, 32);
        if(!waypoint.name.equals(displayName)) displayName = displayName + "...";

        let color = new Color(28 / 255, 34 / 255, 35 / 255);
        if(i % 2 == 0) {
            color = new Color(31 / 255, 36 / 255, 37 / 255);
        }

        dropWaypoint = new UIBlock()
            .setX((0).pixels())
            .setY(new SiblingConstraint())
            .setWidth((100).percent())
            .setHeight((12).pixels())
            .setColor(color)
            .onMouseClick(() => {
                textInput1.setText(waypoint.name);
                textInput2.setText(waypoint.location);
                if(parseCoordinates(waypoint.location).y < 64) {
                    magmaImage.setWidth((256).pixels());
                } else {
                    magmaImage.setWidth((0).pixels());
                }
                getWaypoints().forEach((server) => {
                    let serverName = server.server;
                    server.waypoints.forEach(serverWaypoint => {
                        if(serverWaypoint.id == waypoint.id) {
                            textInput3.setText(serverName);
                        }
                    });
                });
                dropName.setText(displayName);
                confirmText.setText("EDIT");
            })
            .setChildOf(waypoints);
        dropWaypoints.push(dropWaypoint);

        dropText = new UIText(waypoint.id+" - "+displayName, false)
            .setX((5).percent())
            .setY(new CenterConstraint())
            .setChildOf(dropWaypoint);
        getServer(getServerName()).waypoints.forEach((serverWaypoint) => {
            if(serverWaypoint.id == waypoint.id) {
                dropText.setText("§e✮ §r"+dropText.getText())
            }
        });
        dropTexts.push(dropText);
    }
    dropTexts = dropTexts.reverse();
    dropWaypoints = dropWaypoints.reverse();
    
    dropBlock.onMouseClick(() => {
        if(waypointsDropped) {
            dropIcon.setText("˅");
            dropWaypoints.forEach(waypointElement => {
                waypointElement.unhide(true);
            });
            dropTexts.forEach(textElement => {
                textElement.unhide(true);
            });
        } else {
            dropIcon.setText("\u02c4")
            dropWaypoints.forEach(waypointElement => {
                waypointElement.hide();
            });
            dropTexts.forEach(textElement => {
                textElement.hide();
            });
        }
        waypointsDropped = !waypointsDropped;
    });

    const text1 = new UIText("Waypoint Name", true)
        .setX(new AdditiveConstraint(new CenterConstraint(), (12).percent()))
        .setY((20).percent())
        .setTextScale((2).pixels())
        .setChildOf(block);

    const textInputBlock1 = new UIRoundedRectangle(5)
        .setColor(new Color(0 / 255, 0 / 255, 0 / 255, 255 / 255))
        .setX(new AdditiveConstraint(new CenterConstraint(), (12).percent()))
        .setY(new AdditiveConstraint(new SiblingConstraint(), (10).pixels()))
        .setWidth((300).pixels())
        .setHeight((18).pixels())
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
            textInput1.grabWindowFocus();
        })
        .setChildOf(block);

    const textInput1 = new UITextInput(name)
        .setX(new CenterConstraint())
        .setY(new CenterConstraint())
        .setWidth((250).pixels())
        .onKeyType(() => {
            var inputName = textInput1.getText();
            if (inputName.trim().length === 0) {
                inputName = name;
            }
            var inputServer = textInput3.getText();
            if (inputServer.trim().length === 0) {
                inputServer = getServerName();
            }
            if(getWaypoint(inputServer, inputName)) {
                confirmText.setText("EDIT");
            } else {
                confirmText.setText("CONFIRM");
            }
        })
        .setChildOf(textInputBlock1);

    const text3 = new UIText("Server ID", true)
        .setX(new AdditiveConstraint(new CenterConstraint(), (12).percent()))
        .setY(new AdditiveConstraint(new SiblingConstraint(), (12).percent()))
        .setTextScale((2).pixels())
        .setChildOf(block);

    const textInputBlock3 = new UIRoundedRectangle(5)
        .setColor(new Color(0 / 255, 0 / 255, 0 / 255, 255 / 255))
        .setX(new AdditiveConstraint(new CenterConstraint(), (12).percent()))
        .setY(new AdditiveConstraint(new SiblingConstraint(), (10).pixels()))
        .setWidth((300).pixels())
        .setHeight((18).pixels())
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
            textInput3.grabWindowFocus();
        })
        .setChildOf(block);

    const textInput3 = new UITextInput(getServerName())
        .setX(new CenterConstraint())
        .setY(new CenterConstraint())
        .setWidth((250).pixels())
        .setChildOf(textInputBlock3);

    const text2 = new UIText("Coordinates (x,y,z)", true)
        .setX(new AdditiveConstraint(new CenterConstraint(), (12).percent()))
        .setY(new AdditiveConstraint(new SiblingConstraint(), (12).percent()))
        .setTextScale((2).pixels())
        .setChildOf(block);

    const textInputBlock2 = new UIRoundedRectangle(5)
        .setColor(new Color(0 / 255, 0 / 255, 0 / 255, 255 / 255))
        .setX(new AdditiveConstraint(new CenterConstraint(), (12).percent()))
        .setY(new AdditiveConstraint(new SiblingConstraint(), (10).pixels()))
        .setWidth((300).pixels())
        .setHeight((18).pixels())
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
            textInput2.grabWindowFocus();
        })
        .setChildOf(block);

    const textInput2 = new UITextInput(coordinates)
        .setX(new CenterConstraint())
        .setY(new CenterConstraint())
        .setWidth((250).pixels())
        .onKeyType(() => {
            var inputCoords = textInput2.getText();
            if (textInput2.getText().trim().length === 0) {
                inputCoords = coordinates;
            }
            if (!/^[0-9]{1,3},[0-9]{1,3},[0-9]{1,3}(?=\s|$)/g.exec(inputCoords)) {
                textImageInvalid.setColor(new Color(1, 0, 0, 1));
                blockImageInvalid.setColor(new Color(0, 0, 0, 0.66));
                icon.setWidth((0).pixels());
            } else {
                textImageInvalid.setColor(new Color(1, 0, 0, 0));
                blockImageInvalid.setColor(new Color(0, 0, 0, 0));
                icon.setWidth((16).pixels());
                var x = inputCoords.split(",")[0];
                var y = inputCoords.split(",")[1];
                var z = inputCoords.split(",")[2];
                x = Math.min(Math.max(x, 202), 823);
                z = Math.min(Math.max(z, 202), 823);

                if (y < 64) {
                    magmaImage.setWidth((256).pixels());
                } else {
                    magmaImage.setWidth((0).pixels());
                }
                icon.setX(new SubtractiveConstraint(((x - 202) * (256 / 621)).pixels(), (8).pixels()))
                    .setY(new SubtractiveConstraint(((z - 202) * (256 / 621)).pixels(), (8).pixels()));
            }
        })
        .setChildOf(textInputBlock2);

    if (textInput2.getText() && !textInput2.getText().isBlank()) {
        x = textInput2.getText().split(",")[0];
        z = textInput2.getText().split(",")[2];
    } else {
        x = Math.round(coordinates.split(",")[0]);
        z = Math.round(coordinates.split(",")[2]);
    }
    x = Math.min(Math.max(x, 202), 823);
    z = Math.min(Math.max(z, 202), 823);
    
    const magmaImage = UIImage.Companion.ofFile(new File("config/ChatTriggers/modules/CrystalMap/assets/map-magma.png"))
        .setX((0).pixels())
        .setY((0).pixels())
        .setWidth(((textInput2.getText() ? textInput2.getText().split(",")[1] : parseCoordinates(coordinates).y) >= 64 ? 0 : 256).pixels())
        .setHeight(new AspectConstraint())
        .setChildOf(image);

    const icon = UIImage.Companion.ofFile(new File("config/ChatTriggers/modules/CrystalMap/assets/generic-vanilla.png"))
        .setX(new SubtractiveConstraint(((x - 202) * (256 / 621)).pixels(), (8).pixels()))
        .setY(new SubtractiveConstraint(((z - 202) * (256 / 621)).pixels(), (8).pixels()))
        .setWidth((16).pixels())
        .setHeight(new AspectConstraint())
        .setChildOf(image);

    const blockImageInvalid = new UIBlock()
        .setX(new CenterConstraint())
        .setY(new CenterConstraint())
        .setWidth((256).pixels())
        .setHeight(new AspectConstraint())
        .setColor(new Color(0, 0, 0, 0))
        .setChildOf(image);

    const textImageInvalid = new UIText("INVALID COORDINATES", false)
        .setX(new CenterConstraint())
        .setY(new CenterConstraint())
        .setWidth((240).pixels())
        .setColor(new Color(1, 0, 0, 0))
        .setChildOf(image);

    const confirmText = new UIText("CONFIRM", true)
        .setX(new CenterConstraint())
        .setY(new CenterConstraint())
        .setColor(new ConstantColorConstraint(Color.WHITE));

    const confirmBlock = new UIRoundedRectangle(5)
        .setX(new AdditiveConstraint(new CenterConstraint(), (4).percent()))
        .setY((80).percent())
        .setColor(new ConstantColorConstraint(Color.BLACK))
        .setWidth((125).pixels())
        .setHeight((25).pixels())
        .onMouseEnter((comp) => {
            animate(comp, (animation) => {
                if(confirmText.getText().equals("EDIT")) {
                    animation.setColorAnimation(Animations.OUT_EXP, 0.5, new ConstantColorConstraint(new Color(255 / 255, 255 / 255, 69 / 255, 1)));
                } else {
                    animation.setColorAnimation(Animations.OUT_EXP, 0.5, new ConstantColorConstraint(Color.GREEN));
                }
            });
        })
        .onMouseLeave((comp) => {
            animate(comp, (anim) => {
                anim.setColorAnimation(Animations.OUT_EXP, 0.5, new ConstantColorConstraint(Color.BLACK));
            });
        })
        .onMouseClick(() => {
            if (textInput1.getText()) {
                name = textInput1.getText();
            }
            if (textInput2.getText()) {
                coordinates = textInput2.getText();
            }
            var server = getServerName();
            if(textInput3.getText()) {
                server = textInput3.getText();  
            }
            var foundWaypoint = getWaypoint(server, name)
            if(foundWaypoint) {
                var id = foundWaypoint.id;
                editWaypoint(id, server, name, coordinates)
            } else {
                createServerWaypoint(server, name, coordinates, false);
            }
            ChatLib.command("crystalmap waypoint", true)
        })
        .setChildOf(block);

    confirmText.setChildOf(confirmBlock);
    
    if(getWaypoint(textInput3.getText().trim().length === 0 ? getServerName() : textInput3.getText(), textInput1.getText().trim().length === 0 ? name : textInput1.getText())) {
        confirmText.setText("EDIT");
    }

    const deleteBlock = new UIRoundedRectangle(5)
        .setX(new AdditiveConstraint(new CenterConstraint(), (20).percent()))
        .setY((80).percent())
        .setColor(new ConstantColorConstraint(Color.BLACK))
        .setWidth((125).pixels())
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
            var server = getServerName();
            if(textInput3.getText()) {
                server = textInput3.getText();  
            }
            if (textInput1.getText()) {
                name = textInput1.getText();
            }
            removeServerWaypoint(server, name);
            ChatLib.command("crystalmap waypoint", true)
        })
        .setChildOf(block);

    new UIText("DELETE", true)
        .setX(new CenterConstraint())
        .setY(new CenterConstraint())
        .setColor(new ConstantColorConstraint(Color.WHITE))
        .setChildOf(deleteBlock);

    const shareBlock = new UIRoundedRectangle(5)
        .setX(new AdditiveConstraint(new CenterConstraint(), (12).percent()))
        .setY(new AdditiveConstraint((80).percent(), (35).pixels()))
        .setColor(new ConstantColorConstraint(Color.BLACK))
        .setWidth((275).pixels())
        .setHeight((25).pixels())
        .onMouseEnter((comp) => {
            animate(comp, (animation) => {
                if(confirmText.getText().equals("EDIT")) {
                    animation.setColorAnimation(Animations.OUT_EXP, 0.5, new ConstantColorConstraint(Color.CYAN));
                } else {
                    animation.setColorAnimation(Animations.OUT_EXP, 0.5, new ConstantColorConstraint(new Color(25 / 255, 25 / 255, 25 / 255)));
                }
            });
        })
        .onMouseLeave((comp) => {
            animate(comp, (anim) => {
                anim.setColorAnimation(Animations.OUT_EXP, 0.5, new ConstantColorConstraint(Color.BLACK));
            });
        })
        .onMouseClick(() => {
            if(confirmText.getText().equals("EDIT")) {
                if (textInput1.getText()) {
                    name = textInput1.getText();
                }
                if (textInput2.getText()) {
                    coordinates = textInput2.getText();
                }
                var server = getServerName();
                if(textInput3.getText()) {
                    server = textInput3.getText();  
                }
                var foundWaypoint = getWaypoint(server, name);
                if(!foundWaypoint) return;
                ChatLib.command("crystalmap share "+foundWaypoint.id, true)
            }
        })
        .setChildOf(block);

    new UIText("SHARE", true)
        .setX(new CenterConstraint())
        .setY(new CenterConstraint())
        .setColor(new ConstantColorConstraint(Color.WHITE))
        .setChildOf(shareBlock);

    const gui = new JavaAdapter(WindowScreen, {
        init() {
            window.setChildOf(this.getWindow());
        }
    });
    gui.init();
    GuiHandler.openGui(gui);
}