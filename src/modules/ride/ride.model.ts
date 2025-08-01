import mongoose, { Schema } from "mongoose";
import { IRide, RideStatus } from "./ride.interface";
import { Role } from "../user/user.interface";

const rideSchema = new Schema<IRide>(
    {
        rider: { type: Schema.Types.ObjectId, ref: "User" },
        driver: { type: Schema.Types.ObjectId, ref: "User" },

        pickupLocation: {
            coordinates: {
                type: [Number],
                required: true,
            },
            address: String,
        },

        destinationLocation: {
            coordinates: {
                type: [Number],
                required: true,
            },
            address: String,
        },

        fare: { type: Number, default: 0 },

        status: {
            type: String,
            enum: Object.values(RideStatus),
            default: RideStatus.REQUESTED,
        },

        statusHistory: {
            status: {
                type: String,
                enum: Object.values(RideStatus),
                default: RideStatus.REQUESTED
            },
            timestamp: { type: Date, default: Date.now },
        },

        cancelledBy: {
            type: String,
            enum: Object.values(Role),
            default: null,
        },
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export const Ride = mongoose.model<IRide>("Ride", rideSchema);
