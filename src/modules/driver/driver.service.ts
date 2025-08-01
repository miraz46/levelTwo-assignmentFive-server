/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from "../../errorHelpers/AppError";
import { Role } from "../user/user.interface";
import httpStatus from "http-status-codes"
import { User } from "../user/user.model";
import { Ride } from "../ride/ride.model";
import { RideStatus } from "../ride/ride.interface";
import { JwtPayload } from "jsonwebtoken";



const onlineDriverStatus = async (userId: string, role: Role) => {

    if (role !== Role.DRIVER) {
        throw new AppError(httpStatus.FORBIDDEN, "Only drivers can change online status.");
    }
    const driver = User.findByIdAndUpdate(userId,
        { "driverInfo.online": true },
        { new: true, runValidators: true }
    )
    if (!driver) {
        throw new AppError(httpStatus.NOT_FOUND, "Driver not found");
    }
    return driver
};
const offlineDriverStatus = async (userId: string, role: Role) => {

    if (role !== Role.DRIVER) {
        throw new AppError(httpStatus.FORBIDDEN, "Only drivers can change online status.");
    }
    const driver = User.findByIdAndUpdate(userId,
        { "driverInfo.online": false },
        { new: true, runValidators: true }
    )
    if (!driver) {
        throw new AppError(httpStatus.NOT_FOUND, "Driver not found");
    }
    return driver
};
const driverEarnings = async (userId: string, role: Role) => {

    if (role !== Role.DRIVER) {
        throw new AppError(httpStatus.FORBIDDEN, "Only drivers can view earnings.");
    }

    const completedRides = await Ride.find({
        driver: userId,
        status: RideStatus.COMPLETED,
    });
    const completedRideCount = await Ride.countDocuments({
        driver: userId,
        status: RideStatus.COMPLETED,
    });

    const totalEarnings = completedRides.reduce((acc, ride) => acc + (ride.fare || 0), 0);

    return {
        totalEarnings,
        completedRideCount,
    };
};
const driverCompletedRides = async (userId: string, role: Role) => {

    if (role !== Role.DRIVER) {
        throw new AppError(httpStatus.FORBIDDEN, "Only drivers can view earnings.");
    }
    const completedRides = await Ride.find({
        driver: userId,
        status: RideStatus.COMPLETED,
    });

    const completedRideCount = await Ride.countDocuments({
        driver: userId,
        status: RideStatus.COMPLETED,
    });

    return {
        completedRideCount,
        completedRides
    }
};

const approveDriver = async (driverId: string, verifiedToken: JwtPayload) => {
    if (verifiedToken.role !== Role.ADMIN) {
        throw new AppError(httpStatus.FORBIDDEN, "Only admins can block users.");
    }
    const driver = await User.findById(driverId);
    if (!driver) {
        throw new AppError(httpStatus.NOT_FOUND, "Driver not found.");
    }
    if (driver.role !== Role.DRIVER) {
        throw new AppError(httpStatus.BAD_REQUEST, "The selected user is not a driver.");
    }
    driver.driverInfo!.approved = true;
    driver.driverInfo!.suspended = false;
    await driver.save();

    return driver;
}
const suspendDriver = async (driverId: string, verifiedToken: JwtPayload) => {
    if (verifiedToken.role !== Role.ADMIN) {
        throw new AppError(httpStatus.FORBIDDEN, "Only admins can block users.");
    }
    const driver = await User.findById(driverId);
    if (!driver) {
        throw new AppError(httpStatus.NOT_FOUND, "Driver not found.");
    }
    if (driver.role !== Role.DRIVER) {
        throw new AppError(httpStatus.BAD_REQUEST, "The selected user is not a driver.");
    }
    driver.driverInfo!.suspended = true;
    driver.driverInfo!.approved = false;
    await driver.save();

    return driver;
}






export const DriverService = {
    onlineDriverStatus,
    offlineDriverStatus,
    driverEarnings,
    driverCompletedRides,
    approveDriver,
    suspendDriver
}