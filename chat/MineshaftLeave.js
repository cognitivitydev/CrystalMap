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
    SlideToTransition,
    UIPoint,
    AnimatingConstraints,
    MaxConstraint,
} from "../../Elementa";
import Settings from "../config";

const Color = Java.type("java.awt.Color");

var lastScrap = 0;

new KeyBind("Exit Mineshaft", Keyboard.KEY_Y, "CrystalMap (ChatTriggers)").registerKeyPress(() => {
    if(Date.now()-lastScrap < Settings.mineshaftExitPeriod) {
        ChatLib.chat("&b[CrystalMap] &7Warping out of mineshaft...");
        lastScrap = 0;
        ChatLib.command("warp "+Settings.mineshaftExitLocation);
    }
});

register("chat", (event) => {
    var formattedMessage = ChatLib.getChatMessage(event);
    var message = ChatLib.removeFormatting(formattedMessage);
    if(message.equals("EXCAVATOR! You found a Suspicious Scrap!")) {
        if(Settings.mineshaftExitKeybind) {
            lastScrap = Date.now();
        }
    }
});

register("renderOverlay", () => {
    if(Date.now()-lastScrap > Settings.mineshaftExitPeriod) return;
    const hud = new Window();

    var rectangle = new UIBlock()
        .setColor(new Color(0, 0, 0, 0.5))
        .setX((5).pixels(true))
        .setY((5).pixels(true))
        .setHeight((50).pixels())
        .setChildOf(hud);

    var title = new UIText("§bSuspicious Scrap Found")
        .setX(new CenterConstraint())
        .setY((20).percent())
        .setChildOf(rectangle);

    var text = new UIText("§7Press §e["+Keyboard.getKeyName(Client.getKeyBindFromDescription("Exit Mineshaft").getKeyCode())+"] §7to warp out.")
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
        
    var percentComplete = (Date.now()-lastScrap)/Settings.mineshaftExitPeriod; // easeInOutCubic
    var t = percentComplete * 2
    var progress = new UIBlock()
        .setColor(new Color(1, 1, 0, 1))
        .setWidth((100-(t < 1 ? 0.5 * Math.pow(t, 3) : 0.5 * (Math.pow(t - 2, 3) + 2))*100).percent())
        .setHeight(new FillConstraint())
        .setChildOf(bar);

    hud.draw();
});
