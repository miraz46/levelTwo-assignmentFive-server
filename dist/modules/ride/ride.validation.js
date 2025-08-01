"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRideZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const ride_interface_1 = require("./ride.interface");
const user_interface_1 = require("../user/user.interface");
exports.createRideZodSchema = zod_1.default.object({
    rider: zod_1.default.string({ required_error: "Rider ID is required" }).optional(),
    driver: zod_1.default.string().optional(),
    pickupLocation: zod_1.default.object({
        coordinates: zod_1.default
            .array(zod_1.default.number())
            .length(2, { message: "Coordinates must have exactly 2 numbers" }),
        address: zod_1.default.string().optional(),
    }),
    destinationLocation: zod_1.default.object({
        coordinates: zod_1.default
            .array(zod_1.default.number())
            .length(2, { message: "Coordinates must have exactly 2 numbers" }),
        address: zod_1.default.string().optional(),
    }),
    fare: zod_1.default.number().min(0).optional(),
    status: zod_1.default.nativeEnum(ride_interface_1.RideStatus).optional(),
    statusHistory: zod_1.default.object({
        status: zod_1.default.nativeEnum(ride_interface_1.RideStatus).optional(),
        timestamp: zod_1.default.date().optional(),
    }).optional(),
    cancelledBy: zod_1.default.nativeEnum(user_interface_1.Role).nullable().optional(),
});
