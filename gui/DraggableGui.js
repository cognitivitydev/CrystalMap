import {
    UIBlock,
    animate,
    Animations, 
    ConstantColorConstraint,
    WindowScreen,
} from "../../Elementa";
import Settings from "../config";

const Color = Java.type("java.awt.Color");
const dragOffset = { x: 0, y: 0 };

export function openDraggableGui() {
    var box = new UIBlock(new Color(49/255, 175/255, 236/255, 150/255))
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
        });
        
    const gui = new JavaAdapter(WindowScreen, {
        init() {
            box.setChildOf(this.getWindow());
        }
    });
    gui.init();
    GuiHandler.openGui(gui);
}
