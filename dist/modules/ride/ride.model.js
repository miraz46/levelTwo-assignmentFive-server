"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ride = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const ride_interface_1 = require("./ride.interface");
const user_interface_1 = require("../user/user.interface");
const rideSchema = new mongoose_1.Schema({
    rider: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    driver: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
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
        enum: Object.values(ride_interface_1.RideStatus),
        default: ride_interface_1.RideStatus.REQUESTED,
    },
    statusHistory: {
        status: {
            type: String,
            enum: Object.values(ride_interface_1.RideStatus),
            default: ride_interface_1.RideStatus.REQUESTED
        },
        timestamp: { type: Date, default: Date.now },
    },
    cancelledBy: {
        type: String,
        enum: Object.values(user_interface_1.Role),
        default: null,
    },
}, {
    timestamps: true,
    versionKey: false
});
exports.Ride = mongoose_1.default.model("Ride", rideSchema);
