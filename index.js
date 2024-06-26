/* 
 * This module can be found at https://github.com/cognitivitydev/CrystalMap/.
 * You can report any issues or add suggestions there.
 */

/// <reference types="../CTAutocomplete" />
/// <reference lib="es2015" />

import Settings from "./config";
import "./solvers/CompassSolver";
import "./solvers/DivanSolver";
import "./chat/ChatSharing";
import "./chat/ChatCoordinates";
import "./chat/ClientChat";
import "./chat/MineshaftAlert";
import "./chat/MineshaftLeave";
import "./chat/PartyTransfer";
import "./chat/ShareProtection";
import "./waypoints/EntityWaypoints";
import "./render/ColdWarning";
import "./render/GlaciteStatus";
import "./render/MapRenderer";
import "./render/RenderUtils";
import "./render/Status";
import "./waypoints/WaypointRenderer";
import "./waypoints/GlaciteCommissions";
import "./waypoints/MineshaftWaypoints";
import "./waypoints/EntityWaypoints";
import "./WaypointManager";
import "./CrystalMapCommand";
import "./KeyBinds";
import { refreshPing } from "./render/RenderUtils";

register("worldLoad", () => {
    if(Settings.latestVersion != Settings.version) {
        Settings.latestVersion = Settings.version;
        ChatLib.chat(ChatLib.getCenteredText("&5&m                                        &d CRYSTAL MAP &5&m                                        "));
        ChatLib.chat(ChatLib.getCenteredText("&8VERSION "+Settings.version()));
        ChatLib.chat("");
        ChatLib.chat("  &7Thank you for downloading &dCrystalMap&7!");
        ChatLib.chat("  &7To start, type &5/crystalmap &7to create waypoints.");
        ChatLib.chat("  &7For a list of commands or to change your settings,");
        ChatLib.chat("   &7type &5/crystalmap &dsettings&7.");
        ChatLib.chat(new Message("  &7If you find any issues, please report them ", new TextComponent("&d&nhere").setClick("open_url", "https://github.com/cognitivitydev/CrystalMap"), "&7."));
        ChatLib.chat("");
        ChatLib.chat("&5&m"+ChatLib.getChatBreak(" "));
        setTimeout(() => {
            refreshPing();
        }, 5000);
    }
});