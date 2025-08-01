/* eslint-disable @typescript-eslint/no-explicit-any */
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/AppError";
import { calculateDistanceKm } from "../../utils/calculateFare";
import { BlockedStatus, Role } from "../user/user.interface";
import { User } from "../user/user.model";
import { IRide, RideStatus } from "./ride.interface";
import { Ride } from "./ride.model";
import httpStatus from "http-status-codes"



const requestRides = async (payload: Partial<IRide>, userId: string) => {

    const user = await User.findById(userId)
    if (user?.role !== Role.RIDER) {
        throw new AppError(httpStatus.BAD_REQUEST, "You are not a Rider")
    }
    if (user.blockedStatus === BlockedStatus.BLOCKED) {
        throw new AppError(httpStatus.FORBIDDEN, "You are blocked from requesting rides");
    }

    const activeStatuses = [
        RideStatus.REQUESTED,
        RideStatus.ACCEPTED,
        RideStatus.PICKED_UP,
        RideStatus.IN_TRANSIT,
    ];

    const existingRide = await Ride.findOne({
        rider: userId,
        status: { $in: activeStatuses },
    });

    if (existingRide) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `You already have an active ride (${existingRide.status})`
        );
    }


    if (!payload.pickupLocation?.coordinates || !payload.destinationLocation?.coordinates) {
        throw new AppError(httpStatus.BAD_REQUEST, "Pickup and destination coordinates are required");
    }

    const pickupCoords = payload.pickupLocation.coordinates;
    const destinationCoords = payload.destinationLocation.coordinates;

    const distanceKm = calculateDistanceKm(pickupCoords, destinationCoords);

    const fare = Math.round(distanceKm * 30);


    const ride = await Ride.create({
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

}

const cancelRides = async (id: string, userId: string) => {
    const existingRide = await Ride.findById(id);

    if (!existingRide) {
        throw new Error("Ride not found.");
    }

    if (existingRide.rider?.toString() !== userId) {
        throw new AppError(httpStatus.FORBIDDEN, "You are not allowed to cancel this ride");
    }

    const restrictedStatuses = [
        RideStatus.ACCEPTED,
        RideStatus.PICKED_UP,
        RideStatus.IN_TRANSIT,
        RideStatus.COMPLETED,
    ];
    if (!existingRide.status) {
        throw new AppError(httpStatus.BAD_REQUEST, "Ride status is missing");
    }

    if (restrictedStatuses.includes(existingRide.status)) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `Cannot cancel a ride that is ${existingRide.status}`
        );
    }
    return await Ride.findByIdAndDelete(id);
};

const getRideHistory = async (userId: string, role: Role) => {
    const filter: any = {
        status: RideStatus.COMPLETED
    };

    if (role === Role.RIDER) {
        filter.rider = userId;
    } else if (role === Role.DRIVER) {
        filter.driver = userId;
    } else {
        throw new AppError(httpStatus.FORBIDDEN, "Only riders and drivers can view ride history");
    }

    const rides = await Ride.find(filter).sort({ createdAt: -1 });

    return rides;
};

const acceptRides = async (rideId: string, verifiedToken: JwtPayload) => {

    if (verifiedToken.role !== Role.DRIVER) {
        throw new AppError(httpStatus.FORBIDDEN, "Only driver can accept rides.");
    }

    const ride = await Ride.findById(rideId);
    if (!ride) {
        throw new AppError(httpStatus.NOT_FOUND, "Ride not found.");
    }

    if (ride.status !== RideStatus.REQUESTED) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `Ride can't be accepted as its current status is '${ride.status}'.`
        );
    }
    ride.status = RideStatus.ACCEPTED;
    ride.driver = verifiedToken.userId;
    ride.statusHistory = {
        status: RideStatus.ACCEPTED,
        timestamp: new Date(),
    };

    await ride.save();

    return ride;
}

const rejectRides = async (rideId: string, verifiedToken: JwtPayload) => {

    if (verifiedToken.role !== Role.DRIVER) {
        throw new AppError(httpStatus.FORBIDDEN, "Only driver can reject rides.");
    }

    const ride = await Ride.findById(rideId);
    if (!ride) {
        throw new AppError(httpStatus.NOT_FOUND, "Ride not found.");
    }

    const notRejectableStatuses = [
        RideStatus.ACCEPTED,
        RideStatus.PICKED_UP,
        RideStatus.IN_TRANSIT,
        RideStatus.COMPLETED,
        RideStatus.CANCELED,
    ];

    if (!ride.status || notRejectableStatuses.includes(ride.status)) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `You can't reject a ride that is '${ride.status}'.`
        );
    }

    // Set ride as FAILED if rejected
    ride.status = RideStatus.REJECTED;
    ride.statusHistory = {
        status: RideStatus.REJECTED,
        timestamp: new Date(),
    };
    ride.driver = verifiedToken.userId;

    await ride.save();

    return ride;
}

const changeRideStatus = async (rideId: string, payload: Partial<IRide>, verifiedToken: JwtPayload) => {

    if (verifiedToken.role !== Role.DRIVER) {
        throw new AppError(httpStatus.FORBIDDEN, "Only drivers can change ride status.");
    }

    const ride = await Ride.findById(rideId);
    if (!ride) {
        throw new AppError(httpStatus.NOT_FOUND, "Ride not found.");
    }

    const newStatus = payload.status;

    const allowedStatuses: RideStatus[] = [
        RideStatus.PICKED_UP,
        RideStatus.IN_TRANSIT,
        RideStatus.COMPLETED,
    ];
    if (!newStatus) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `Give status: ${allowedStatuses.join("/ ")}`
        );
    }
    if (!allowedStatuses.includes(newStatus)) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `Drivers can only update status to: ${allowedStatuses.join("/ ")}.`
        );
    }

    if (ride.driver?.toString() !== verifiedToken.userId) {
        throw new AppError(
            httpStatus.FORBIDDEN,
            "You are not the assigned driver for this ride."
        );
    }

    ride.status = newStatus;
    ride.statusHistory = {
        status: newStatus,
        timestamp: new Date(),
    };

    await ride.save();

    return ride;
}

const getAllRides = async () => {
    const rides = await Ride.find({});

    const totalRides = await Ride.countDocuments()
    return {
        data: rides,
        meta: {
            total: totalRides
        }
    }
}


export const RidesService = {
    requestRides,
    cancelRides,
    getRideHistory,
    acceptRides,
    rejectRides,
    changeRideStatus,
    getAllRides
}