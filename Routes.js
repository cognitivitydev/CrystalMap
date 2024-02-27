/* 
 * This module can be found at https://github.com/cognitivitydev/CrystalMap/.
 * You can report any issues or add suggestions there.
 */

/// <reference types="../CTAutocomplete" />
/// <reference lib="es2015" />

import RenderLibV2 from "../RenderLibV2";
import Settings from "./config";

export var path = [];

register("renderWorld", () => {
    for(var index in path) {
        index = parseInt(index);
        var point = path[index];
        if(!point) continue;
        
        if(Settings.showRouteLines) {
            var nextPoint = index == path.length - 1 ? path[0] : path[index+1]
            RenderLibV2.drawLine(
                point.x+0.5, point.y+0.5, point.z+0.5,
                nextPoint.x+0.5, nextPoint.y+0.5, nextPoint.z+0.5,
                0, 0.5, 1, 1,
                true, 3
            );
        }
        if(index == 0) {
            RenderLibV2.drawEspBox(point.x+0.5, point.y, point.z+0.5, 1, 1, 0.08, 1, 0.08, 1, true)
            Tessellator.drawString("§a("+(index+1)+")", point.x+0.5, point.y-0.5, point.z+0.5, 0xFFFFFF, true, 0.75, true)
        } else {
            RenderLibV2.drawEspBox(point.x+0.5, point.y, point.z+0.5, 1, 1, 0.75, 0.08, 1, 1, true)
            Tessellator.drawString("§b("+(index+1)+")", point.x+0.5, point.y-0.5, point.z+0.5, 0xFFFFFF, true, 0.75, true);
        }
    }
});