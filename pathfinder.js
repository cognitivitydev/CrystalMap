/* 
 * This module can be found at https://github.com/cognitivitydev/CrystalMap/.
 * You can report any issues or add suggestions there.
 */

/// <reference types="../CTAutocomplete" />
/// <reference lib="es2015" />

import { calculateWeightedDistance } from "./hud/renderUtils";
import { nearestNeighborPath } from "./pathfinding/NearestNeighbor";
import { getCoordinates, parseCoordinates } from "./waypoints";

export const PathfinderType = {
    NEAREST_NEIGHBOR: 0,
};

export function findPath(locations, count, type) {
    if (count < 2) {
        throw new Error("There must be at least two points to create a path.");
    }
    var points = sortClosest(getCoordinates(), locations).slice(0, count);
    if(type == PathfinderType.NEAREST_NEIGHBOR) {
        return nearestNeighborPath(points);
    }
    // soontm
    throw new Error("Unknown pathfinding algorithm.");
}

function sortClosest(location, waypoints) {
    if (waypoints.length <= 1) {
        return waypoints;
    }
    var map = [];
    for (var waypoint of waypoints) {
        let coordinates = parseCoordinates(typeof waypoint === 'string' ? waypoint : waypoint.location);
        map.push({distance: calculateWeightedDistance(parseCoordinates(location), coordinates), location: coordinates.x+","+coordinates.y+","+coordinates.z});
    }
    const middle = Math.floor(map.length / 2);
    const leftHalf = map.slice(0, middle);
    const rightHalf = map.slice(middle);

    return mergeSort(sortClosest(location, leftHalf), sortClosest(location, rightHalf));
}

function mergeSort(left, right) {
    let result = [];
    let leftIndex = 0;
    let rightIndex = 0;

    while (leftIndex < left.length && rightIndex < right.length) {
        if (left[leftIndex].distance < right[rightIndex].distance) {
            result.push(left[leftIndex]);
            leftIndex++;
        } else {
            result.push(right[rightIndex]);
            rightIndex++;
        }
    }

    return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
}