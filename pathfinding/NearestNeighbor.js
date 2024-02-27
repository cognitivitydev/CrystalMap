/* 
 * This module can be found at https://github.com/cognitivitydev/CrystalMap/.
 * You can report any issues or add suggestions there.
 */

/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />

import { calculateWeightedDistance } from "../render/RenderUtils";

function findNearestNeighbor(currentPoint, unvisitedPoints) {
    let nearestNeighbor = null;
    let minDistance = Infinity;

    for (const point of unvisitedPoints) {
        const distance = calculateWeightedDistance(currentPoint, point);
        if (distance < minDistance) {
            minDistance = distance;
            nearestNeighbor = point;
        }
    }

    return nearestNeighbor;
}

export function nearestNeighborPath(points) {
    const path = [];
    const unvisitedPoints = [points];
    let currentPoint = unvisitedPoints.shift();

    path.push(currentPoint);

    while (unvisitedPoints.length > 0) {
        const nearestNeighbor = findNearestNeighbor(currentPoint, unvisitedPoints);
        path.push(nearestNeighbor);
        currentPoint = unvisitedPoints.splice(unvisitedPoints.indexOf(nearestNeighbor), 1)[0];
    }
    return path[0];
}