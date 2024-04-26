/* 
 * This module can be found at https://github.com/cognitivitydev/CrystalMap/.
 * You can report any issues or add suggestions there.
 */

/// <reference types="../CTAutocomplete" />
/// <reference lib="es2015" />

import { onWarpScrap } from "./chat/MineshaftLeave";
import { onWarpCold } from "./render/ColdWarning";

new KeyBind("Warp Out", Keyboard.KEY_Y, "CrystalMap (ChatTriggers)").registerKeyPress(() => {
    onWarpScrap();
    onWarpCold();
});
