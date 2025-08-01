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
exports.DriverService = void 0;
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const user_interface_1 = require("../user/user.interface");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const user_model_1 = require("../user/user.model");
const ride_model_1 = require("../ride/ride.model");
const ride_interface_1 = require("../ride/ride.interface");
const onlineDriverStatus = (userId, role) => __awaiter(void 0, void 0, void 0, function* () {
    if (role !== user_interface_1.Role.DRIVER) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "Only drivers can change online status.");
    }
    const driver = user_model_1.User.findByIdAndUpdate(userId, { "driverInfo.online": true }, { new: true, runValidators: true });
    if (!driver) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Driver not found");
    }
    return driver;
});
const offlineDriverStatus = (userId, role) => __awaiter(void 0, void 0, void 0, function* () {
    if (role !== user_interface_1.Role.DRIVER) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "Only drivers can change online status.");
    }
    const driver = user_model_1.User.findByIdAndUpdate(userId, { "driverInfo.online": false }, { new: true, runValidators: true });
    if (!driver) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Driver not found");
    }
    return driver;
});
const driverEarnings = (userId, role) => __awaiter(void 0, void 0, void 0, function* () {
    if (role !== user_interface_1.Role.DRIVER) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "Only drivers can view earnings.");
    }
    const completedRides = yield ride_model_1.Ride.find({
        driver: userId,
        status: ride_interface_1.RideStatus.COMPLETED,
    });
    const completedRideCount = yield ride_model_1.Ride.countDocuments({
        driver: userId,
        status: ride_interface_1.RideStatus.COMPLETED,
    });
    const totalEarnings = completedRides.reduce((acc, ride) => acc + (ride.fare || 0), 0);
    return {
        totalEarnings,
        completedRideCount,
    };
});
const driverCompletedRides = (userId, role) => __awaiter(void 0, void 0, void 0, function* () {
    if (role !== user_interface_1.Role.DRIVER) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "Only drivers can view earnings.");
    }
    const completedRides = yield ride_model_1.Ride.find({
        driver: userId,
        status: ride_interface_1.RideStatus.COMPLETED,
    });
    const completedRideCount = yield ride_model_1.Ride.countDocuments({
        driver: userId,
        status: ride_interface_1.RideStatus.COMPLETED,
    });
    return {
        completedRideCount,
        completedRides
    };
});
const approveDriver = (driverId, verifiedToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (verifiedToken.role !== user_interface_1.Role.ADMIN) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "Only admins can block users.");
    }
    const driver = yield user_model_1.User.findById(driverId);
    if (!driver) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Driver not found.");
    }
    if (driver.role !== user_interface_1.Role.DRIVER) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "The selected user is not a driver.");
    }
    driver.driverInfo.approved = true;
    driver.driverInfo.suspended = false;
    yield driver.save();
    return driver;
});
const suspendDriver = (driverId, verifiedToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (verifiedToken.role !== user_interface_1.Role.ADMIN) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "Only admins can block users.");
    }
    const driver = yield user_model_1.User.findById(driverId);
    if (!driver) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Driver not found.");
    }
    if (driver.role !== user_interface_1.Role.DRIVER) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "The selected user is not a driver.");
    }
    driver.driverInfo.suspended = true;
    driver.driverInfo.approved = false;
    yield driver.save();
    return driver;
});
exports.DriverService = {
    onlineDriverStatus,
    offlineDriverStatus,
    driverEarnings,
    driverCompletedRides,
    approveDriver,
    suspendDriver
};
