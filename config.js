/* 
 * This module can be found on GitHub at https://github.com/cognitivitydev/CrystalMap/
 * Please insult my amazing code.
 */

/// <reference types="../CTAutocomplete" />
/// <reference lib="es2015" />

import { @Vigilant, @SwitchProperty, @DecimalSliderProperty, @SelectorProperty, @PercentSliderProperty, @ButtonProperty, @SliderProperty, @CheckboxProperty, @ColorProperty, Color } from "../Vigilance";

@Vigilant("CrystalMap", "Settings", {
    getCategoryComparator: () => (a, b) => {
        const categories = ["Map", "Waypoints", "Icons"];

        return categories.indexOf(a.name) - categories.indexOf(b.name);
    }
})
class Settings {
    @CheckboxProperty({
        name: "Latest Version",
        category: "General",
        hidden: true
    })
    latestVersion = "";

    // HIDDEN
    @DecimalSliderProperty({
        name: "X Location",
        category: "General",
        min: 0,
        max: 1,
        hidden: true
    })
    mapX = 0;

    // HIDDEN
    @DecimalSliderProperty({
        name: "Y Location",
        category: "General",
        min: 0,
        max: 1,
        hidden: true
    })
    mapY = 0;


    @SwitchProperty({
        name: "Minimap",
        description: "Toggles the minimap's display.",
        category: "Map"
    })
    map = true;

    @DecimalSliderProperty({
        name: "Scale",
        description: "Changes the scale of the minimap.",
        category: "Map",
        subcategory: "Display",
        minF: 0.5,
        maxF: 2.0
    })
    scale = 1.0;

    @ButtonProperty({
        name: "Move GUI",
        description: "Drag the minimap around.",
        category: "Map",
        subcategory: "Display",
        placeholder: "Move...",
    })
    openMoveGui() {
        Client.currentGui.close()
        ChatLib.command("crystalmap gui", true)
    }

    @ButtonProperty({
        name: "Create a Waypoint",
        description: "Opens a menu for creating waypoints.",
        category: "Map",
        subcategory: "Display",
        placeholder: "Open...",
    })
    createWaypointGui() {
        Client.currentGui.close()
        ChatLib.command("crystalmap waypoint", true)
    }

    @SwitchProperty({
        name: "Beacon Waypoints",
        description: "Toggles the world's beacon waypoints.",
        category: "Waypoints",
        subcategory: "Beacons"
    })
    waypoint = true;

    @ColorProperty({
        name: "Waypoint Beacon Color",
        description: "Automatically centers icons in the middle of the area's box.",
        category: "Waypoints",
        subcategory: "Beacons"
    })
    waypointColor = new Color(99 / 255, 66 / 255, 245 / 255, 1.0);

    @SwitchProperty({
        name: "Automatically Create Waypoints",
        description: "Automatically generates a waypoint when first entering a named location.",
        category: "Waypoints",
        subcategory: "Waypoint Creation"
    })
    createWaypoints = true;

    @SwitchProperty({
        name: "Automatically Create King Yolkar Waypoint",
        description: "Creates a waypoint when you are near King Yolkar.",
        category: "Waypoints",
        subcategory: "Waypoint Creation"
    })
    createKingWaypoint = true;

    @SwitchProperty({
        name: "Automatically Create Odawa Waypoint",
        description: "Creates a waypoint when you are near Odawa.",
        category: "Waypoints",
        subcategory: "Waypoint Creation"
    })
    createOdawaWaypoint = true;

    @SwitchProperty({
        name: "Show Waypoints from Chat",
        description: "Automatically highlights waypoints in chat. Click it to create a waypoint.",
        category: "Waypoints",
        subcategory: "Waypoint Creation"
    })
    showChatWaypoints = true;

    // REQUIRES "Show Waypoints from Chat"
    @SwitchProperty({
        name: "Automatically Parse Waypoints from Chat",
        description: "Automatically parses waypoints sent in chat.\n&cOnly parses waypoints with a given description. (eg: \"king 512 64 512\")",
        category: "Waypoints",
        subcategory: "Waypoint Creation"
    })
    parseChatWaypoints = true;

    @SwitchProperty({
        name: "Show Waypoint's Area",
        description: "Creates a box that automatically expands to the area's size while you move around.",
        category: "Waypoints",
        subcategory: "Waypoint Creation"
    })
    showArea = true;

    @SwitchProperty({
        name: "Center Icon With Area's Box",
        description: "Automatically centers icons in the middle of the area's box.",
        category: "Waypoints",
        subcategory: "Waypoint Creation"
    })
    centerWaypointArea = true;

    @SwitchProperty({
        name: "Show Coordinate Requests",
        description: "Automatically highlights people asking for waypoints in chat. Click to share it.",
        category: "Waypoints",
        subcategory: "Waypoint Requests"
    })
    showCoordinateRequests = true;

    // REQUIRES "Show Coordinate Requests"
    @CheckboxProperty({
        name: "Show Requests in All Chat",
        description: "Highlight requests sent in all chat.",
        category: "Waypoints",
        subcategory: "Waypoint Requests"
    })
    showAllRequests = true;

    // REQUIRES "Show Coordinate Requests"
    @CheckboxProperty({
        name: "Show Requests in Party Chat",
        description: "Highlight requests sent in party chat. Sharing sends the message in party chat.",
        category: "Waypoints",
        subcategory: "Waypoint Requests"
    })
    showPartyRequests = true;

    // REQUIRES "Show Coordinate Requests"
    @CheckboxProperty({
        name: "Show Requests in Co-op Chat",
        description: "Highlight requests sent in party chat. Sharing sends the message in co-op chat.",
        category: "Waypoints",
        subcategory: "Waypoint Requests"
    })
    showCoopRequests = true;

    @SwitchProperty({
        name: "Player Icon",
        description: "Toggles the icon at the player's location.",
        category: "Icons",
        subcategory: "Player"
    })
    iconPlayerVisible = true;

    // REQUIRES "Player Icon"
    @SelectorProperty({
        name: "Player Icon Type",
        description: "Changes the design of the player's location.",
        category: "Icons",
        subcategory: "Player",
        options: ["Vanilla", "Player Head"]
    })
    iconPlayerType = 0;

    // REQUIRES "Player Icon"
    @DecimalSliderProperty({
        name: "Player Icon Size",
        description: "Changes the size of the player's icon",
        category: "Icons",
        subcategory: "Player",
        minF: 0.5,
        maxF: 2.0
    })
    iconPlayerSize = 1.0;

    @SwitchProperty({
        name: "Corleone Icon",
        description: "Shows the icon for Corleone waypoints.",
        category: "Icons",
        subcategory: "Corleone"
    })
    iconCorleoneVisible = true;

    // REQUIRES "Corleone Icon"
    @SelectorProperty({
        name: "Corleone Icon Type",
        description: "Changes the design of Corleone icons.",
        category: "Icons",
        subcategory: "Corleone",
        options: ["Vanilla", "FurfSky"]
    })
    iconCorleoneType = 0;

    // REQUIRES "Corleone Icon"
    @DecimalSliderProperty({
        name: "Corleone Icon Size",
        description: "Changes the size of Corleone icons.",
        category: "Icons",
        subcategory: "Corleone",
        minF: 0.5,
        maxF: 2.0
    })
    iconCorleoneSize = 1.0;

    @SwitchProperty({
        name: "Entrance Icon",
        description: "Toggles the icon at the mine's entrances. ",
        category: "Icons",
        subcategory: "Entrance"
    })
    iconEntranceVisible = true;

    // REQUIRES "Entrance Icon"
    @SelectorProperty({
        name: "Entrance Icon Type",
        description: "Changes the design of entrance icons.",
        category: "Icons",
        subcategory: "Entrance",
        options: ["FurfSky"]
    })
    iconEntranceType = 0;

    // REQUIRES "Entrance Icon"
    @DecimalSliderProperty({
        name: "Entrance Icon Size",
        description: "Changes the size of the entrance icons",
        category: "Icons",
        subcategory: "Entrance",
        minF: 0.5,
        maxF: 2.0
    })
    iconEntranceSize = 1.0;

    @SwitchProperty({
        name: "Generic Icon",
        description: "Shows the icon for generic waypoints.",
        category: "Icons",
        subcategory: "Generic"
    })
    iconGenericVisible = true;

    // REQUIRES "Generic Icon"
    @SelectorProperty({
        name: "Generic Icon Type",
        description: "Changes the design of generic icons.",
        category: "Icons",
        subcategory: "Generic",
        options: ["Vanilla", "FurfSky"]
    })
    iconGenericType = 0;

    // REQUIRES "Generic Icon"
    @DecimalSliderProperty({
        name: "Generic Icon Size",
        description: "Changes the size of generic icons.",
        category: "Icons",
        subcategory: "Generic",
        minF: 0.5,
        maxF: 2.0
    })
    iconGenericSize = 1.0;

    @SwitchProperty({
        name: "Fairy Grotto Icon",
        description: "Shows the icon for Fairy Grotto waypoints.",
        category: "Icons",
        subcategory: "Fairy Grotto"
    })
    iconGrottoVisible = true;

    // REQUIRES "Fairy Grotto Icon"
    @SelectorProperty({
        name: "Fairy Grotto Icon Type",
        description: "Changes the design of Fairy Grotto icons.",
        category: "Icons",
        subcategory: "Fairy Grotto",
        options: ["Vanilla", "FurfSky"]
    })
    iconGrottoType = 0;

    // REQUIRES "Fairy Grotto Icon"
    @DecimalSliderProperty({
        name: "Fairy Grotto Icon Size",
        description: "Changes the size of Fairy Grotto icons.",
        category: "Icons",
        subcategory: "Fairy Grotto",
        minF: 0.5,
        maxF: 2.0
    })
    iconGrottoSize = 1.0;

    @SwitchProperty({
        name: "Show Fairy Grotto Area",
        description: "Shows the area for Fairy Grotto locations.",
        category: "Icons",
        subcategory: "Fairy Grotto"
    })
    areaGrottoVisible = true;

    @ColorProperty({
        name: "Fairy Grotto Area Color",
        description: "Change the color of Fairy Grotto areas.",
        category: "Icons",
        subcategory: "Fairy Grotto",
        allowAlpha: false
    })
    areaGrottoColor = new Color(234 / 255, 74 / 255, 223 / 255, 1.0);

    @SwitchProperty({
        name: "King Yolkar Icon",
        description: "Shows the icon for King Yolkar waypoints.",
        category: "Icons",
        subcategory: "King Yolkar"
    })
    iconKingVisible = true;

    // REQUIRES "King Yolkar Icon"
    @SelectorProperty({
        name: "King Yolkar Icon Type",
        description: "Changes the design of King Yolkar icons.",
        category: "Icons",
        subcategory: "King Yolkar",
        options: ["Vanilla", "FurfSky"]
    })
    iconKingType = 0;

    // REQUIRES "King Yolkar Icon"
    @DecimalSliderProperty({
        name: "King Yolkar Icon Size",
        description: "Changes the size of King Yolkar icons.",
        category: "Icons",
        subcategory: "King Yolkar",
        minF: 0.5,
        maxF: 2.0
    })
    iconKingSize = 1.0;

    @SwitchProperty({
        name: "Goblin Queen's Den Icon",
        description: "Shows the icon for Goblin Queen's Den waypoints.",
        category: "Icons",
        subcategory: "Goblin Queen's Den"
    })
    iconQueenVisible = true;

    // REQUIRES "Goblin Queen's Den Icon"
    @SelectorProperty({
        name: "Goblin Queen's Den Icon Type",
        description: "Changes the design of Goblin Queen's Den icons.",
        category: "Icons",
        subcategory: "Goblin Queen's Den",
        options: ["Vanilla", "FurfSky"]
    })
    iconQueenType = 0;

    // REQUIRES "Goblin Queen's Den Icon"
    @DecimalSliderProperty({
        name: "Goblin Queen's Den Icon Size",
        description: "Changes the size of Goblin Queen's Den icons.",
        category: "Icons",
        subcategory: "Goblin Queen's Den",
        minF: 0.5,
        maxF: 2.0
    })
    iconQueenSize = 1.0;

    @SwitchProperty({
        name: "Show Goblin Queen's Den Area",
        description: "Shows the area for Goblin Queen's Den locations.",
        category: "Icons",
        subcategory: "Goblin Queen's Den"
    })
    areaQueenVisible = true;

    @ColorProperty({
        name: "Goblin Queen's Den Area Color",
        description: "Change the color of Goblin Queen's Den areas.",
        category: "Icons",
        subcategory: "Goblin Queen's Den",
        allowAlpha: false
    })
    areaQueenColor = new Color(252 / 255, 186 / 255, 3 / 255, 1.0);

    @SwitchProperty({
        name: "Jungle Temple Icon",
        description: "Shows the icon for Jungle Temple waypoints.",
        category: "Icons",
        subcategory: "Jungle Temple"
    })
    iconTempleVisible = true;

    // REQUIRES "Jungle Temple Icon"
    @SelectorProperty({
        name: "Jungle Temple Icon Type",
        description: "Changes the design of Jungle Temple icons.",
        category: "Icons",
        subcategory: "Jungle Temple",
        options: ["Vanilla", "FurfSky"]
    })
    iconTempleType = 0;

    // REQUIRES "Jungle Temple Icon"
    @DecimalSliderProperty({
        name: "Jungle Temple Icon Size",
        description: "Changes the size of Jungle Temple icons.",
        category: "Icons",
        subcategory: "Jungle Temple",
        minF: 0.5,
        maxF: 2.0
    })
    iconTempleSize = 1.0;

    @SwitchProperty({
        name: "Show Jungle Temple Area",
        description: "Shows the area for Jungle Temple locations.",
        category: "Icons",
        subcategory: "Jungle Temple"
    })
    areaTempleVisible = true;

    @ColorProperty({
        name: "Jungle Temple Area Color",
        description: "Change the color of Jungle Temple areas.",
        category: "Icons",
        subcategory: "Jungle Temple",
        allowAlpha: false
    })
    areaTempleColor = new Color(58 / 255, 251 / 255, 167 / 255, 1.0);

    @SwitchProperty({
        name: "Khazad-dûm Icon",
        description: "Shows the icon for Khazad-dûm waypoints.",
        category: "Icons",
        subcategory: "Khazad-dûm"
    })
    iconBalVisible = true;

    // REQUIRES "Khazad-dûm Icon"
    @SelectorProperty({
        name: "Khazad-dûm Icon Type",
        description: "Changes the design of Khazad-dûm icons.",
        category: "Icons",
        subcategory: "Khazad-dûm",
        options: ["Vanilla", "FurfSky"]
    })
    iconBalType = 0;

    // REQUIRES "Khazad-dûm Icon"
    @DecimalSliderProperty({
        name: "Khazad-dûm Icon Size",
        description: "Changes the size of Khazad-dûm icons.",
        category: "Icons",
        subcategory: "Khazad-dûm",
        minF: 0.5,
        maxF: 2.0
    })
    iconBalSize = 1.0;

    @SwitchProperty({
        name: "Show Khazad-dûm Area",
        description: "Shows the area for Khazad-dûm locations.",
        category: "Icons",
        subcategory: "Khazad-dûm"
    })
    areaBalVisible = true;

    @ColorProperty({
        name: "Khazad-dûm Area Color",
        description: "Change the color of Khazad-dûm areas.",
        category: "Icons",
        subcategory: "Khazad-dûm",
        allowAlpha: false
    })
    areaBalColor = new Color(253 / 255, 48 / 255, 58 / 255, 1.0);

    @SwitchProperty({
        name: "Lost Precursor City Icon",
        description: "Shows the icon for Lost Precursor City waypoints.",
        category: "Icons",
        subcategory: "Lost Precursor City"
    })
    iconCityVisible = true;

    // REQUIRES "Lost Precursor City Icon"
    @SelectorProperty({
        name: "Lost Precursor City Icon Type",
        description: "Changes the design of Lost Precursor City icons.",
        category: "Icons",
        subcategory: "Lost Precursor City",
        options: ["Vanilla", "FurfSky"]
    })
    iconCityType = 0;

    // REQUIRES "Lost Precursor City Icon"
    @DecimalSliderProperty({
        name: "Lost Precursor City Icon Size",
        description: "Changes the size of Lost Precursor City icons.",
        category: "Icons",
        subcategory: "Lost Precursor City",
        minF: 0.5,
        maxF: 2.0
    })
    iconCitySize = 1.0;

    @SwitchProperty({
        name: "Show Lost Precursor City Area",
        description: "Shows the area for Lost Precursor City locations.",
        category: "Icons",
        subcategory: "Lost Precursor City"
    })
    areaCityVisible = true;

    @ColorProperty({
        name: "Lost Precursor City Area Color",
        description: "Change the color of Lost Precursor City areas.",
        category: "Icons",
        subcategory: "Lost Precursor City",
        allowAlpha: false
    })
    areaCityColor = new Color(49 / 255, 175 / 255, 236 / 255, 1.0);

    @SwitchProperty({
        name: "Mines of Divan Icon",
        description: "Shows the icon for Mines of Divan waypoints.",
        category: "Icons",
        subcategory: "Mines of Divan"
    })
    iconDivanVisible = true;

    // REQUIRES "Mines of Divan Icon"
    @SelectorProperty({
        name: "Mines of Divan Icon Type",
        description: "Changes the design of Mines of Divan icons.",
        category: "Icons",
        subcategory: "Mines of Divan",
        options: ["Vanilla", "FurfSky"]
    })
    iconDivanType = 0;

    // REQUIRES "Mines of Divan Icon"
    @DecimalSliderProperty({
        name: "Mines of Divan Icon Size",
        description: "Changes the size of Mines of Divan icons.",
        category: "Icons",
        subcategory: "Mines of Divan",
        minF: 0.5,
        maxF: 2.0
    })
    iconDivanSize = 1.0;

    @SwitchProperty({
        name: "Show Mines of Divan Area",
        description: "Shows the area for Mines of Divan locations.",
        category: "Icons",
        subcategory: "Mines of Divan"
    })
    areaDivanVisible = true;

    @ColorProperty({
        name: "Mines of Divan Area Color",
        description: "Change the color of Mines of Divan areas.",
        category: "Icons",
        subcategory: "Mines of Divan",
        allowAlpha: false
    })
    areaDivanColor = new Color(24 / 255, 108 / 255, 20 / 255, 1.0);

    @SwitchProperty({
        name: "Odawa Icon",
        description: "Shows the icon for Odawa waypoints.",
        category: "Icons",
        subcategory: "Odawa"
    })
    iconOdawaVisible = true;

    // REQUIRES "Odawa Icon"
    @SelectorProperty({
        name: "Odawa Icon Type",
        description: "Changes the design of Odawa icons.",
        category: "Icons",
        subcategory: "Odawa",
        options: ["Vanilla", "FurfSky"]
    })
    iconOdawaType = 0;

    // REQUIRES "Odawa Icon"
    @DecimalSliderProperty({
        name: "Odawa Icon Size",
        description: "Changes the size of Odawa icons.",
        category: "Icons",
        subcategory: "Odawa",
        minF: 0.5,
        maxF: 2.0
    })
    iconOdawaSize = 1.0;

    constructor() {
        this.initialize(this);

        this.addDependency("Automatically Parse Waypoints from Chat", "Show Waypoints from Chat")

        this.addDependency("Show Requests in All Chat", "Show Coordinate Requests")
        this.addDependency("Show Requests in Party Chat", "Show Coordinate Requests")
        this.addDependency("Show Requests in Co-op Chat", "Show Coordinate Requests")

        this.addDependency("Center Icon With Area's Box", "Show Waypoint's Area")

        this.addDependency("Automatically Create King Yolkar Waypoint", "Automatically Create Waypoints")
        this.addDependency("Automatically Create Odawa Waypoint", "Automatically Create Waypoints")

        this.addDependency("Player Icon Type", "Player Icon");
        this.addDependency("Player Icon Size", "Player Icon");

        this.addDependency("Entrance Icon Type", "Entrance Icon");
        this.addDependency("Entrance Icon Size", "Entrance Icon");

        this.addDependency("Generic Icon Type", "Generic Icon");
        this.addDependency("Generic Icon Size", "Generic Icon");

        this.addDependency("Fairy Grotto Icon Type", "Fairy Grotto Icon");
        this.addDependency("Fairy Grotto Icon Size", "Fairy Grotto Icon");
        this.addDependency("Show Fairy Grotto Area", "Show Waypoint's Area");
        this.addDependency("Fairy Grotto Area Color", "Show Fairy Grotto Area");

        this.addDependency("King Yolkar Icon Type", "King Yolkar Icon");
        this.addDependency("King Yolkar Icon Size", "King Yolkar Icon");

        this.addDependency("Goblin Queen's Den Icon Type", "Goblin Queen's Den Icon");
        this.addDependency("Goblin Queen's Den Icon Size", "Goblin Queen's Den Icon");
        this.addDependency("Show Goblin Queen's Den Area", "Show Waypoint's Area");
        this.addDependency("Goblin Queen's Den Area Color", "Show Goblin Queen's Den Area");

        this.addDependency("Jungle Temple Icon Type", "Jungle Temple Icon");
        this.addDependency("Jungle Temple Icon Size", "Jungle Temple Icon");
        this.addDependency("Show Jungle Temple Area", "Show Waypoint's Area");
        this.addDependency("Jungle Temple Area Color", "Show Jungle Temple Area");

        this.addDependency("Khazad-dûm Icon Type", "Khazad-dûm Icon");
        this.addDependency("Khazad-dûm Icon Size", "Khazad-dûm Icon");
        this.addDependency("Show Khazad-dûm Area", "Show Waypoint's Area");
        this.addDependency("Khazad-dûm Area Color", "Show Khazad-dûm Area");
        this.addDependency("Khazad-dûm Area Color", "Show Waypoint's Area");

        this.addDependency("Lost Precursor City Icon Type", "Lost Precursor City Icon");
        this.addDependency("Lost Precursor City Icon Size", "Lost Precursor City Icon");
        this.addDependency("Show Lost Precursor City Area", "Show Waypoint's Area");
        this.addDependency("Lost Precursor City Area Color", "Show Lost Precursor City Area");

        this.addDependency("Mines of Divan Icon Type", "Mines of Divan Icon");
        this.addDependency("Mines of Divan Icon Size", "Mines of Divan Icon");
        this.addDependency("Show Mines of Divan Area", "Show Waypoint's Area");
        this.addDependency("Mines of Divan Area Color", "Show Mines of Divan Area");

        this.addDependency("Odawa Icon Type", "Odawa Icon");
        this.addDependency("Odawa Icon Size", "Odawa Icon");

        this.setCategoryDescription("Icons", "&c&lDISCLAIMER\n\n&7Icons using the \"FurfSky\" type are from the &5FurfSky Reborn &7texture pack.\n&7Their discord and the download to the texture pack can be found at &9&ndiscord.gg/fsr&7.\n\n\n\nUsing a scale other than 0.5, 1.0, or 2.0 may cause the icon to appear distorted.");
    }
}

export default new Settings();