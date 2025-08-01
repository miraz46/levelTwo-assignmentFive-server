"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateDistanceKm = void 0;
const EARTH_RADIUS_KM = 6371;
const toRadians = (deg) => deg * (Math.PI / 180);
const calculateDistanceKm = (coord1, coord2) => {
    const [lat1, lon1] = coord1;
    const [lat2, lon2] = coord2;
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(toRadians(lat1)) *
            Math.cos(toRadians(lat2)) *
            Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return EARTH_RADIUS_KM * c;
};
exports.calculateDistanceKm = calculateDistanceKm;
