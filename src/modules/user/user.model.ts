import mongoose, { Schema } from "mongoose";
import { BlockedStatus, IUser, Role } from "./user.interface";


const userSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        email: { type: String, unique: true, required: true },
        password: { type: String, required: true },
        role: {
            type: String,
            enum: Object.values(Role),
            default: Role.RIDER
        },
        phone: { type: String },
        blockedStatus: {
            type: String,
            enum: Object.values(BlockedStatus),
            default: BlockedStatus.UNBLOCKED
        },

        driverInfo: {
            approved: { type: Boolean, default: false },
            suspended: { type: Boolean, default: false },
            online: { type: Boolean, default: false },
            vehicleType: { type: String },
            licenseNumber: { type: String },
        },
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export const User = mongoose.model<IUser>("User", userSchema);
