import z from "zod";
import { RideStatus } from "./ride.interface";
import { Role } from "../user/user.interface";

export const createRideZodSchema = z.object({
    rider: z.string({ required_error: "Rider ID is required" }).optional(),

    driver: z.string().optional(),

    pickupLocation: z.object({
        coordinates: z
            .array(z.number())
            .length(2, { message: "Coordinates must have exactly 2 numbers" }),
        address: z.string().optional(),
    }),

    destinationLocation: z.object({
        coordinates: z
            .array(z.number())
            .length(2, { message: "Coordinates must have exactly 2 numbers" }),
        address: z.string().optional(),
    }),

    fare: z.number().min(0).optional(),

    status: z.nativeEnum(RideStatus).optional(),

    statusHistory: z.object({
        status: z.nativeEnum(RideStatus).optional(),
        timestamp: z.date().optional(),
    }).optional(),

    cancelledBy: z.nativeEnum(Role).nullable().optional(),
});