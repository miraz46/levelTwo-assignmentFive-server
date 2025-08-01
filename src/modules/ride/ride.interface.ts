import { Types } from "mongoose";
import { Role } from "../user/user.interface";

export enum RideStatus {
    REQUESTED = "REQUESTED",
    ACCEPTED = "ACCEPTED",
    PICKED_UP = "PICKED_UP",
    IN_TRANSIT = "IN_TRANSIT",
    COMPLETED = "COMPLETED",
    CANCELED = "CANCELED",
    REJECTED = "REJECTED"
}


export interface IRide {
    rider?: Types.ObjectId;
    driver?: Types.ObjectId;
    pickupLocation: {
        coordinates: [number, number];
        address?: string;
    };
    destinationLocation: {
        coordinates: [number, number];
        address?: string;
    };
    fare?: number;
    status?: RideStatus;
    statusHistory: { status: RideStatus; timestamp: Date };
    cancelledBy: Role | null;
}
