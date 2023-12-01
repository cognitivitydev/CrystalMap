import Settings from "../config"

export function renderIcon(icon, width, height, x, y, yaw, outline) {
    if (outline) {
        renderRect(Renderer.color(0, 0, 0), width + 1, height + 1, x, y, yaw, outline);
    }

    Tessellator.pushMatrix();
    Renderer.retainTransforms(true);
    Tessellator.enableAlpha();


    Renderer.translate((x - 202) * (128 / 621) * Settings.scale, (y - 202) * (128 / 621) * Settings.scale);
    Renderer.translate(Settings.mapX * Renderer.screen.getWidth(), Settings.mapY * Renderer.screen.getHeight());
    Renderer.rotate(yaw);
    Renderer.scale(Settings.scale);

    Renderer.drawImage(icon, -width / 2, -height / 2, width, height);

    Renderer.retainTransforms(false);
    Tessellator.popMatrix();
}
export function renderRect(color, width, height, x, y, yaw) {
    Tessellator.pushMatrix();
    Renderer.retainTransforms(true);
    Tessellator.enableAlpha();


    Renderer.translate((x - 202) * (128 / 621) * Settings.scale, (y - 202) * (128 / 621) * Settings.scale);
    Renderer.translate(Settings.mapX * Renderer.screen.getWidth(), Settings.mapY * Renderer.screen.getHeight());
    Renderer.rotate(yaw);
    Renderer.scale(Settings.scale);

    Renderer.drawRect(color, -(width) / 2, -(height) / 2, (width), (height));
    Renderer.retainTransforms(false);
    Tessellator.popMatrix();
}
export function distance(location) {
    var distance = Math.hypot(Player.getX()-location.x+0.5, Player.getY()-location.y, Player.getZ()-location.z+0.5);
    var decimal = distance >= 100 ? 0 : distance >= 10 ? 1 : 2
    return Math.round(distance * Math.pow(10, decimal)) / Math.pow(10, decimal);
}