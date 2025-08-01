"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RidesService = void 0;
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const calculateFare_1 = require("../../utils/calculateFare");
const user_interface_1 = require("../user/user.interface");
const user_model_1 = require("../user/user.model");
const ride_interface_1 = require("./ride.interface");
const ride_model_1 = require("./ride.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const requestRides = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const user = yield user_model_1.User.findById(userId);
    if ((user === null || user === void 0 ? void 0 : user.role) !== user_interface_1.Role.RIDER) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "You are not a Rider");
    }
    if (user.blockedStatus === user_interface_1.BlockedStatus.BLOCKED) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are blocked from requesting rides");
    }
    const activeStatuses = [
        ride_interface_1.RideStatus.REQUESTED,
        ride_interface_1.RideStatus.ACCEPTED,
        ride_interface_1.RideStatus.PICKED_UP,
        ride_interface_1.RideStatus.IN_TRANSIT,
    ];
    const existingRide = yield ride_model_1.Ride.findOne({
        rider: userId,
        status: { $in: activeStatuses },
    });
    if (existingRide) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `You already have an active ride (${existingRide.status})`);
    }
    if (!((_a = payload.pickupLocation) === null || _a === void 0 ? void 0 : _a.coordinates) || !((_b = payload.destinationLocation) === null || _b === void 0 ? void 0 : _b.coordinates)) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Pickup and destination coordinates are required");
    }
    const pickupCoords = payload.pickupLocation.coordinates;
    const destinationCoords = payload.destinationLocation.coordinates;
    const distanceKm = (0, calculateFare_1.calculateDistanceKm)(pickupCoords, destinationCoords);
    const fare = Math.round(distanceKm * 30);
    const ride = yield ride_model_1.Ride.create({
        rider: userId,
        pickupLocation: payload.pickupLocation,
        destinationLocation: payload.destinationLocation,
        fare,
        status: "REQUESTED",
        statusHistory: {
            status: "REQUESTED",
            timestamp: new Date(),
        },
    });
    return ride;
});
const cancelRides = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const existingRide = yield ride_model_1.Ride.findById(id);
    if (!existingRide) {
        throw new Error("Ride not found.");
    }
    if (((_a = existingRide.rider) === null || _a === void 0 ? void 0 : _a.toString()) !== userId) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not allowed to cancel this ride");
    }
    const restrictedStatuses = [
        ride_interface_1.RideStatus.ACCEPTED,
        ride_interface_1.RideStatus.PICKED_UP,
        ride_interface_1.RideStatus.IN_TRANSIT,
        ride_interface_1.RideStatus.COMPLETED,
    ];
    if (!existingRide.status) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Ride status is missing");
    }
    if (restrictedStatuses.includes(existingRide.status)) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `Cannot cancel a ride that is ${existingRide.status}`);
    }
    return yield ride_model_1.Ride.findByIdAndDelete(id);
});
const getRideHistory = (userId, role) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = {
        status: ride_interface_1.RideStatus.COMPLETED
    };
    if (role === user_interface_1.Role.RIDER) {
        filter.rider = userId;
    }
    else if (role === user_interface_1.Role.DRIVER) {
        filter.driver = userId;
    }
    else {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "Only riders and drivers can view ride history");
    }
    const rides = yield ride_model_1.Ride.find(filter).sort({ createdAt: -1 });
    return rides;
});
const acceptRides = (rideId, verifiedToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (verifiedToken.role !== user_interface_1.Role.DRIVER) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "Only driver can accept rides.");
    }
    const ride = yield ride_model_1.Ride.findById(rideId);
    if (!ride) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Ride not found.");
    }
    if (ride.status !== ride_interface_1.RideStatus.REQUESTED) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `Ride can't be accepted as its current status is '${ride.status}'.`);
    }
    ride.status = ride_interface_1.RideStatus.ACCEPTED;
    ride.driver = verifiedToken.userId;
    ride.statusHistory = {
        status: ride_interface_1.RideStatus.ACCEPTED,
        timestamp: new Date(),
    };
    yield ride.save();
    return ride;
});
const rejectRides = (rideId, verifiedToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (verifiedToken.role !== user_interface_1.Role.DRIVER) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "Only driver can reject rides.");
    }
    const ride = yield ride_model_1.Ride.findById(rideId);
    if (!ride) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Ride not found.");
    }
    const notRejectableStatuses = [
        ride_interface_1.RideStatus.ACCEPTED,
        ride_interface_1.RideStatus.PICKED_UP,
        ride_interface_1.RideStatus.IN_TRANSIT,
        ride_interface_1.RideStatus.COMPLETED,
        ride_interface_1.RideStatus.CANCELED,
    ];
    if (!ride.status || notRejectableStatuses.includes(ride.status)) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `You can't reject a ride that is '${ride.status}'.`);
    }
    // Set ride as FAILED if rejected
    ride.status = ride_interface_1.RideStatus.REJECTED;
    ride.statusHistory = {
        status: ride_interface_1.RideStatus.REJECTED,
        timestamp: new Date(),
    };
    ride.driver = verifiedToken.userId;
    yield ride.save();
    return ride;
});
const changeRideStatus = (rideId, payload, verifiedToken) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (verifiedToken.role !== user_interface_1.Role.DRIVER) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "Only drivers can change ride status.");
    }
    const ride = yield ride_model_1.Ride.findById(rideId);
    if (!ride) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Ride not found.");
    }
    const newStatus = payload.status;
    const allowedStatuses = [
        ride_interface_1.RideStatus.PICKED_UP,
        ride_interface_1.RideStatus.IN_TRANSIT,
        ride_interface_1.RideStatus.COMPLETED,
    ];
    if (!newStatus) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `Give status: ${allowedStatuses.join("/ ")}`);
    }
    if (!allowedStatuses.includes(newStatus)) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `Drivers can only update status to: ${allowedStatuses.join("/ ")}.`);
    }
    if (((_a = ride.driver) === null || _a === void 0 ? void 0 : _a.toString()) !== verifiedToken.userId) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not the assigned driver for this ride.");
    }
    ride.status = newStatus;
    ride.statusHistory = {
        status: newStatus,
        timestamp: new Date(),
    };
    yield ride.save();
    return ride;
});
const getAllRides = () => __awaiter(void 0, void 0, void 0, function* () {
    const rides = yield ride_model_1.Ride.find({});
    const totalRides = yield ride_model_1.Ride.countDocuments();
    return {
        data: rides,
        meta: {
            total: totalRides
        }
    };
});
exports.RidesService = {
    requestRides,
    cancelRides,
    getRideHistory,
    acceptRides,
    rejectRides,
    changeRideStatus,
    getAllRides
};
