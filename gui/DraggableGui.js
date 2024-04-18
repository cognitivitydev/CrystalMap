/* 
 * This module can be found at https://github.com/cognitivitydev/CrystalMap/.
 * You can report any issues or add suggestions there.
 */

/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />

import {
    UIBlock,
    animate,
    Animations, 
    ConstantColorConstraint,
    WindowScreen,
    UIText,
    CenterConstraint,
    SubtractiveConstraint,
    AdditiveConstraint
} from "../../Elementa";
import Settings from "../config";

const Color = Java.type("java.awt.Color");
const mapOffset = { x: 0, y: 0 };
const statusOffset = { x: 0, y: 0 };
const glaciteStatusOffset = { x: 0, y: 0 };
var draggingMap = false;
var draggingStatus = false;
var draggingGlaciteStatus = false;


export function openDraggableGui() {
    var mapBox = new UIBlock(new Color(49/255, 175/255, 236/255, 50/255))
        .setX((Settings.mapX * Renderer.screen.getWidth()).pixels())
        .setY((Settings.mapY * Renderer.screen.getHeight()).pixels())
        .setWidth((128 * Settings.scale).pixels())
        .setHeight((128 * Settings.scale).pixels())
        .onMouseClick((comp, event) => {
            draggingMap = true;
            mapOffset.x = event.absoluteX;
            mapOffset.y = event.absoluteY;
        })
        .onMouseRelease(() => {
            draggingMap = false;
        })
        .onMouseDrag((comp, mx, my) => {
            if (!draggingMap) return;
            const absoluteX = mx + comp.getLeft();
            const absoluteY = my + comp.getTop();
            const dx = absoluteX - mapOffset.x;
            const dy = absoluteY - mapOffset.y;
            mapOffset.x = absoluteX;
            mapOffset.y = absoluteY;
            const newX = mapBox.getLeft() + dx;
            Settings.mapX = newX / Renderer.screen.getWidth();
            const newY = mapBox.getTop() + dy;
            Settings.mapY = newY / Renderer.screen.getHeight();
            mapBox.setX(newX.pixels());
            mapTextX.setText((newX*2)+" px");
            mapTextY.setText((newY*2)+" px");
            mapBox.setY(newY.pixels());
        })
        .onMouseEnter((comp) => {
            animate(comp, (animation) => {
                animation.setColorAnimation(Animations.OUT_EXP, 0.3, new ConstantColorConstraint(new Color(164/255, 82/255, 227/255, 50/255)));
            });
        })
        .onMouseLeave((comp) => {
            animate(comp, (anim) => {
                anim.setColorAnimation(Animations.OUT_EXP, 0.3, new ConstantColorConstraint(new Color(49/255, 175/255, 236/255, 50/255)));
            });
        });
    
    new UIText("Crystal Hollows Map")
        .setX(new CenterConstraint())
        .setY((10).percent())
        .setColor(Color.MAGENTA)
        .setChildOf(mapBox);
    
    var mapTextX = new UIText(Math.round(Settings.mapX * Renderer.screen.getWidth())*2+" px")
        .setX(new CenterConstraint())
        .setY(new SubtractiveConstraint(new CenterConstraint(), (5).pixels()))
        .setColor(Color.ORANGE)
        .setChildOf(mapBox);
    var mapTextY = new UIText(Math.round(Settings.mapY * Renderer.screen.getHeight())*2+" px")
        .setX(new CenterConstraint())
        .setY(new AdditiveConstraint(new CenterConstraint(), (5).pixels()))
        .setColor(Color.ORANGE)
        .setChildOf(mapBox);


    var statusBox = new UIBlock(new Color(49/255, 175/255, 236/255, 50/255))
        .setX((Settings.statusX * Renderer.screen.getWidth()).pixels())
        .setY((Settings.statusY * Renderer.screen.getHeight()).pixels())
        .setWidth((192).pixels())
        .setHeight((118).pixels())
        .onMouseClick((comp, event) => {
            draggingStatus = true;
            statusOffset.x = event.absoluteX;
            statusOffset.y = event.absoluteY;
        })
        .onMouseRelease(() => {
            draggingStatus = false;
        })
        .onMouseDrag((comp, mx, my) => {
            if (!draggingStatus) return;
            const absoluteX = mx + comp.getLeft();
            const absoluteY = my + comp.getTop();
            const dx = absoluteX - statusOffset.x;
            const dy = absoluteY - statusOffset.y;
            statusOffset.x = absoluteX;
            statusOffset.y = absoluteY;
            const newX = statusBox.getLeft() + dx;
            Settings.statusX = newX / Renderer.screen.getWidth();
            const newY = statusBox.getTop() + dy;
            Settings.statusY = newY / Renderer.screen.getHeight();
            statusBox.setX(newX.pixels());
            statusTextX.setText((newX*2)+" px");
            statusTextY.setText((newY*2)+" px");
            statusBox.setY(newY.pixels());
        })
        .onMouseEnter((comp) => {
            animate(comp, (animation) => {
                animation.setColorAnimation(Animations.OUT_EXP, 0.3, new ConstantColorConstraint(new Color(164/255, 82/255, 227/255, 50/255)));
            });
        })
        .onMouseLeave((comp) => {
            animate(comp, (anim) => {
                anim.setColorAnimation(Animations.OUT_EXP, 0.3, new ConstantColorConstraint(new Color(49/255, 175/255, 236/255, 50/255)));
            });
        });
    
    new UIText("Status HUD")
        .setX(new CenterConstraint())
        .setY((10).percent())
        .setColor(Color.MAGENTA)
        .setChildOf(statusBox);
    
    var statusTextX = new UIText(Math.round(Settings.statusX * Renderer.screen.getWidth())*2+" px")
        .setX(new CenterConstraint())
        .setY(new SubtractiveConstraint(new CenterConstraint(), (5).pixels()))
        .setColor(Color.ORANGE)
        .setChildOf(statusBox);
    var statusTextY = new UIText(Math.round(Settings.statusY * Renderer.screen.getHeight())*2+" px")
        .setX(new CenterConstraint())
        .setY(new AdditiveConstraint(new CenterConstraint(), (5).pixels()))
        .setColor(Color.ORANGE)
        .setChildOf(statusBox);


    var glaciteStatusBox = new UIBlock(new Color(49/255, 175/255, 236/255, 50/255))
        .setX((Settings.glaciteStatusX * Renderer.screen.getWidth()).pixels())
        .setY((Settings.glaciteStatusY * Renderer.screen.getHeight()).pixels())
        .setWidth((192).pixels())
        .setHeight((118).pixels())
        .onMouseClick((comp, event) => {
            draggingGlaciteStatus = true;
            glaciteStatusOffset.x = event.absoluteX;
            glaciteStatusOffset.y = event.absoluteY;
        })
        .onMouseRelease(() => {
            draggingGlaciteStatus = false;
        })
        .onMouseDrag((comp, mx, my) => {
            if (!draggingGlaciteStatus) return;
            const absoluteX = mx + comp.getLeft();
            const absoluteY = my + comp.getTop();
            const dx = absoluteX - glaciteStatusOffset.x;
            const dy = absoluteY - glaciteStatusOffset.y;
            glaciteStatusOffset.x = absoluteX;
            glaciteStatusOffset.y = absoluteY;
            const newX = glaciteStatusBox.getLeft() + dx;
            Settings.glaciteStatusX = newX / Renderer.screen.getWidth();
            const newY = glaciteStatusBox.getTop() + dy;
            Settings.glaciteStatusY = newY / Renderer.screen.getHeight();
            glaciteStatusBox.setX(newX.pixels());
            glaciteStatusTextX.setText((newX*2)+" px");
            glaciteStatusTextY.setText((newY*2)+" px");
            glaciteStatusBox.setY(newY.pixels());
        })
        .onMouseEnter((comp) => {
            animate(comp, (animation) => {
                animation.setColorAnimation(Animations.OUT_EXP, 0.3, new ConstantColorConstraint(new Color(164/255, 82/255, 227/255, 50/255)));
            });
        })
        .onMouseLeave((comp) => {
            animate(comp, (anim) => {
                anim.setColorAnimation(Animations.OUT_EXP, 0.3, new ConstantColorConstraint(new Color(49/255, 175/255, 236/255, 50/255)));
            });
        });

    new UIText("Glacite Status HUD")
        .setX(new CenterConstraint())
        .setY((10).percent())
        .setColor(Color.MAGENTA)
        .setChildOf(glaciteStatusBox);

    var glaciteStatusTextX = new UIText(Math.round(Settings.glaciteStatusX * Renderer.screen.getWidth())*2+" px")
        .setX(new CenterConstraint())
        .setY(new SubtractiveConstraint(new CenterConstraint(), (5).pixels()))
        .setColor(Color.ORANGE)
        .setChildOf(glaciteStatusBox);
    var glaciteStatusTextY = new UIText(Math.round(Settings.glaciteStatusY * Renderer.screen.getHeight())*2+" px")
        .setX(new CenterConstraint())
        .setY(new AdditiveConstraint(new CenterConstraint(), (5).pixels()))
        .setColor(Color.ORANGE)
        .setChildOf(glaciteStatusBox);

    const gui = new JavaAdapter(WindowScreen, {
        init() {
            mapBox.setChildOf(this.getWindow());
            statusBox.setChildOf(this.getWindow());
            glaciteStatusBox.setChildOf(this.getWindow());
        }
    });
    gui.init();
    GuiHandler.openGui(gui);
}
