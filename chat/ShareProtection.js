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
    UIWrappedText,
} from "../../Elementa";

const Color = Java.type("java.awt.Color");

var exempt = false;

register("messageSent", (message, event) => {
    if(exempt) {
        exempt = false;
        return;
    }
    if(!message.startsWith("/ac")) return;
    if(/((Khazad[- ]d[ûu]m)|(bal)):( \d{1,3}){3}/gi.exec(message)) {
        cancel(event);
        ChatLib.chat("cancelled "+message);
        openWarningGui(message.replace(/^\//g, ""), "§cKhazad-dûm");
    } else if(/((Fairy )?Grotto):( \d{1,3}){3}/gi.exec(message)) {
        cancel(event);
        ChatLib.chat("cancelled "+message);
        openWarningGui(message.replace(/^\//g, ""), "§dFairy Grotto");
    }
})

function openWarningGui(command, name) {
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
        .setWidth((227).pixels())
        .setHeight((132).pixels())
        .setChildOf(window)

    const block = new UIBlock()
        .setColor(new Color(20 / 255, 20 / 255, 22 / 255, 1))
        .setX(new CenterConstraint())
        .setY(new CenterConstraint())
        .setWidth((225).pixels())
        .setHeight((130).pixels())
        .setChildOf(window);
    
    const titleOutline = new UIBlock()
        .setColor(new Color(36 / 255, 36 / 255, 36 / 255, 1))
        .setX(new CenterConstraint())
        .setY((3).percent())
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

    const titleText = new UIText("§6Sharing Confirmation", false)
        .setX(new CenterConstraint())
        .setY(new CenterConstraint())
        .setTextScale((1.5).pixels())
        .setChildOf(titleBar);

    const descriptionText = new UIWrappedText("You are about to share coordinates to "+name+" §fin all chat. Are you sure you want to do this?")
        .setX(new CenterConstraint())
        .setY(new SiblingConstraint(10))
        .setWidth((80).percent())
        .setChildOf(block);

    const sendButton = new UIRoundedRectangle(3)
        .setColor(new Color(0 / 255, 125 / 255, 0 / 255, 255 / 255))
        .setX((5).percent())
        .setY((70).percent())
        .setWidth((40).percent())
        .setHeight((20).pixels())
        .onMouseEnter((comp) => {
            animate(comp, (animation) => {
                animation.setColorAnimation(Animations.OUT_EXP, 0.5, new ConstantColorConstraint(new Color(0 / 255, 255 / 255, 0 / 255, 255 / 255)));
            });
        })
        .onMouseLeave((comp) => {
            animate(comp, (anim) => {
                anim.setColorAnimation(Animations.OUT_EXP, 0.5, new ConstantColorConstraint(new Color(0 / 255, 125 / 255, 0 / 255, 255 / 255)));
            });
        })
        .onMouseClick(() => {
            Client.currentGui.close();
            exempt = true;
            ChatLib.command(command);
        })
        .setChildOf(block);

    const sendText = new UIText("Send", true)
        .setTextScale((1.5).pixels())
        .setX(new CenterConstraint())
        .setY(new CenterConstraint())
        .setColor(new Color(255 / 255, 255 / 255, 255 / 255, 1))
        .setChildOf(sendButton);

    const cancelButton = new UIRoundedRectangle(3)
        .setColor(new Color(175 / 255, 0 / 255, 0 / 255, 255 / 255))
        .setX((55).percent())
        .setY((70).percent())
        .setWidth((40).percent())
        .setHeight((20).pixels())
        .onMouseEnter((comp) => {
            animate(comp, (animation) => {
                animation.setColorAnimation(Animations.OUT_EXP, 0.5, new ConstantColorConstraint(new Color(255 / 255, 0 / 255, 0 / 255, 255 / 255)));
            });
        })
        .onMouseLeave((comp) => {
            animate(comp, (anim) => {
                anim.setColorAnimation(Animations.OUT_EXP, 0.5, new ConstantColorConstraint(new Color(175 / 255, 0 / 255, 0 / 255, 255 / 255)));
            });
        })
        .onMouseClick(() => {
            Client.currentGui.close();
        })
        .setChildOf(block);

    const cancelText = new UIText("Cancel", true)
        .setTextScale((1.5).pixels())
        .setX(new CenterConstraint())
        .setY(new CenterConstraint())
        .setColor(new Color(255 / 255, 255 / 255, 255 / 255, 1))
        .setChildOf(cancelButton);

    const gui = new JavaAdapter(WindowScreen, {
        init() {
            window.setChildOf(this.getWindow());
        }
    });
    gui.init();
    GuiHandler.openGui(gui);
}