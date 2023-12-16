/* 
 * This module can be found on GitHub at https://github.com/cognitivitydev/CrystalMap/
 * Please insult my amazing code.
 */

/// <reference types="../CTAutocomplete" />
/// <reference lib="es2015" />

import { parseCoordinates } from "./waypoints";

function calculateDistance(point1, point2) {
    const dx = point1.x - point2.x;
    const dy = (point1.y - point2.y);
    const dz = point1.z - point2.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

function findNearestNeighbor(currentPoint, unvisitedPoints) {
    let nearestNeighbor = null;
    let minDistance = Infinity;

    for (const point of unvisitedPoints) {
        const distance = calculateDistance(currentPoint, point);
        if (distance < minDistance) {
            minDistance = distance;
            nearestNeighbor = point;
        }
    }

    return nearestNeighbor;
}

export function findPath(points) {
    if (points.length < 2) {
        throw new Error('There must be at least two points to solve the Traveling Salesman Problem.');
    }

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
export function sort(location, waypoints) {
    if (waypoints.length <= 1) {
        return waypoints;
    }
    var map = [];
    for (var waypoint of waypoints) {
        let coordinates = typeof waypoint === 'object' ? waypoint.location : waypoint;
        map.push(JSON.parse('{"distance": ' + distance(parseCoordinates(location), parseCoordinates(coordinates)) + ', "location": ' + JSON.stringify(coordinates) + '}'));
    }
    const middle = Math.floor(map.length / 2);
    const leftHalf = map.slice(0, middle);
    const rightHalf = map.slice(middle);

    return merge(sort(location, leftHalf), sort(location, rightHalf));
}

function merge(left, right) {
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

export function distance(location1, location2) {
    return Math.hypot(parseInt(location2.x) - parseInt(location1.x), (parseInt(location2.y) - parseInt(location1.y)) * 3.5, parseInt(location2.z) - parseInt(location1.z));
}