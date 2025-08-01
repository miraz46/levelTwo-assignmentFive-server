import { Types } from "mongoose";

export enum Role {
    ADMIN = "ADMIN",
    RIDER = "RIDER",
    DRIVER = "DRIVER",
}

export enum BlockedStatus {
    BLOCKED = "BLOCKED",
    UNBLOCKED = "UNBLOCKED"
}

export interface IUser {
    _id?: Types.ObjectId;
    name: string;
    email: string;
    password: string;
    role: Role;
    phone?: string;
    blockedStatus: BlockedStatus;
    driverInfo?: {
        approved: boolean;
        suspended: boolean;
        online: boolean;
        vehicleType?: string;
        licenseNumber?: string;
    };
}
