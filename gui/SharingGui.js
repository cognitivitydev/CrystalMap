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
} from "../../Elementa";
import { createServerWaypoint, createWaypoint, editWaypoint, getServerName, getWaypoint, getWaypointFromId, getWaypoints, removeServerWaypoint } from "../waypoints";

const Color = Java.type("java.awt.Color");

export function openSharingGui(id) {
    var waypoint = getWaypointFromId(id);
    if(!waypoint) return;
    const window = new UIBlock()
        .setX((0).pixels())
        .setY((0).pixels())
        .setWidth(new FillConstraint())
        .setHeight(new FillConstraint())
        .setColor(new Color(0, 0, 0, 0));

    const outline = new UIBlock()
        .setColor(Color.DARK_GRAY)
        .setX(new CenterConstraint())
        .setY(new CenterConstraint())
        .setWidth((202).pixels())
        .setHeight((132).pixels())
        .setChildOf(window)

    const block = new UIBlock()
        .setColor(new Color(20 / 255, 20 / 255, 22 / 255, 1))
        .setX(new CenterConstraint())
        .setY(new CenterConstraint())
        .setWidth((200).pixels())
        .setHeight((130).pixels())
        .setChildOf(window);
    
    const titleOutline = new UIBlock()
        .setColor(new Color(36 / 255, 36 / 255, 36 / 255, 1))
        .setX(new CenterConstraint())
        .setY((2).percent())
        .setWidth((97).percent())
        .setHeight((25).pixels())
        .setChildOf(block);

    const titleBar = new UIBlock()
        .setColor(new Color(27 / 255, 27 / 255, 30 / 255, 1))
        .setX(new CenterConstraint())
        .setY(new CenterConstraint())
        .setWidth(new SubtractiveConstraint((100).percent(), (2).pixels()))
        .setHeight(new SubtractiveConstraint((100).percent(), (2).pixels()))
        .setChildOf(titleOutline);

    const titleText = new UIText(id+" - "+waypoint.name, false)
        .setX(new CenterConstraint())
        .setY(new CenterConstraint())
        .setTextScale((1.5).pixels())
        .setChildOf(titleBar);

    
    const allButton = new UIRoundedRectangle(3)
        .setColor(new Color(0 / 255, 175 / 255, 10 / 255, 255 / 255))
        .setX(new CenterConstraint())
        .setY((37).percent())
        .setWidth((80).percent())
        .setHeight((20).pixels())
        .onMouseEnter((comp) => {
            animate(comp, (animation) => {
                animation.setColorAnimation(Animations.OUT_EXP, 0.5, new ConstantColorConstraint(new Color(0 / 255, 255 / 255, 25 / 255, 255 / 255)));
            });
        })
        .onMouseLeave((comp) => {
            animate(comp, (anim) => {
                anim.setColorAnimation(Animations.OUT_EXP, 0.5, new ConstantColorConstraint(new Color(0 / 255, 175 / 255, 10 / 255, 255 / 255)));
            });
        })
        .onMouseClick(() => {
            Client.currentGui.close();
            ChatLib.command("ac "+waypoint.name+": "+waypoint.location.replaceAll(",", " "));
        })
        .setChildOf(block);

    const allText = new UIText("All Chat", true)
        .setTextScale((1.5).pixels())
        .setX(new CenterConstraint())
        .setY(new CenterConstraint())
        .setColor(new Color(255 / 255, 255 / 255, 255 / 255, 1))
        .setChildOf(allButton);

    const partyButton = new UIRoundedRectangle(3)
        .setColor(new Color(0 / 255, 64 / 255, 127 / 255, 255 / 255))
        .setX((10).percent())
        .setY((57).percent())
        .setWidth((35).percent())
        .setHeight((20).pixels())
        .onMouseEnter((comp) => {
            animate(comp, (animation) => {
                animation.setColorAnimation(Animations.OUT_EXP, 0.5, new ConstantColorConstraint(new Color(0 / 255, 127 / 255, 255 / 255, 255 / 255)));
            });
        })
        .onMouseLeave((comp) => {
            animate(comp, (anim) => {
                anim.setColorAnimation(Animations.OUT_EXP, 0.5, new ConstantColorConstraint(new Color(0 / 255, 64 / 255, 127 / 255, 255 / 255)));
            });
        })
        .onMouseClick(() => {
            Client.currentGui.close();
            ChatLib.command("pc "+waypoint.name+": "+waypoint.location.replaceAll(",", " "));
        })
        .setChildOf(block);

    const partyText = new UIText("Party Chat", true)
        .setTextScale((1.25).pixels())
        .setX(new CenterConstraint())
        .setY(new CenterConstraint())
        .setColor(new Color(255 / 255, 255 / 255, 255 / 255, 1))
        .setChildOf(partyButton);

    const coopButton = new UIRoundedRectangle(3)
        .setColor(new Color(0 / 255, 127 / 255, 127 / 255, 255 / 255))
        .setX((55).percent())
        .setY((57).percent())
        .setWidth((35).percent())
        .setHeight((20).pixels())
        .onMouseEnter((comp) => {
            animate(comp, (animation) => {
                animation.setColorAnimation(Animations.OUT_EXP, 0.5, new ConstantColorConstraint(new Color(0 / 255, 255 / 255, 255 / 255, 255 / 255)));
            });
        })
        .onMouseLeave((comp) => {
            animate(comp, (anim) => {
                anim.setColorAnimation(Animations.OUT_EXP, 0.5, new ConstantColorConstraint(new Color(0 / 255, 127 / 255, 127 / 255, 255 / 255)));
            });
        })
        .onMouseClick(() => {
            Client.currentGui.close();
            ChatLib.command("cc "+waypoint.name+": "+waypoint.location.replaceAll(",", " "));
        })
        .setChildOf(block);

    const coopText = new UIText("Co-op Chat", true)
        .setTextScale((1.25).pixels())
        .setX(new CenterConstraint())
        .setY(new CenterConstraint())
        .setColor(new Color(255 / 255, 255 / 255, 255 / 255, 1))
        .setChildOf(coopButton);

    const editButton = new UIRoundedRectangle(3)
        .setColor(new Color(200 / 255, 200 / 255, 50 / 255, 1))
        .setX(new CenterConstraint())
        .setY((80).percent())
        .setWidth((180).pixels())
        .setHeight((20).pixels())
        .onMouseEnter((comp) => {
            animate(comp, (anim) => {
                anim.setColorAnimation(Animations.OUT_EXP, 0.5, new ConstantColorConstraint(new Color(255 / 255, 255 / 255, 69 / 255, 1)));
            });
        })
        .onMouseLeave((comp) => {
            animate(comp, (anim) => {
                anim.setColorAnimation(Animations.OUT_EXP, 0.5, new ConstantColorConstraint(new Color(127 / 255, 127 / 255, 35 / 255, 1)));
            });
        })
        .setChildOf(block);

    const editText = new UIText("EDIT WAYPOINT", true)
        .setColor(Color.WHITE)
        .setX(new CenterConstraint())
        .setY(new CenterConstraint())
        .setChildOf(editButton);

    const gui = new JavaAdapter(WindowScreen, {
        init() {
            window.setChildOf(this.getWindow());
        }
    });
    gui.init();
    GuiHandler.openGui(gui);
}