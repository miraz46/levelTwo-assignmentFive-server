/* eslint-disable @typescript-eslint/no-unused-vars */
import { catchAsync } from "../../utils/catchAsync"
import { NextFunction, Request, Response } from "express";
import { RidesService } from "./ride.service";
import httpStatus from "http-status-codes"
import { sendResponse } from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";


const requestRides = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodeToken = req.user as JwtPayload
    console.log(req.body, decodeToken);
    const user = await RidesService.requestRides(req.body, decodeToken.userId);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "User Created Successfully",
        data: user
    })
})
const cancelRides = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodeToken = req.user as JwtPayload
    const { id } = req.params;
    await RidesService.cancelRides(id, decodeToken.userId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Ride deleted Successfully",
        data: null
    })
})

const getRideHistory = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as JwtPayload;
    const rides = await RidesService.getRideHistory(user.userId, user.role);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Rides History",
        data: rides,
    });
});


const acceptRides = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const rideId = req.params.id;
    const verifiedToken = req.user;
    const user = await RidesService.acceptRides(rideId, verifiedToken as JwtPayload);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Ride Accepted Successfully",
        data: user
    })
})

const rejectRides = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const rideId = req.params.id;
    const verifiedToken = req.user;
    const user = await RidesService.rejectRides(rideId, verifiedToken as JwtPayload);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Ride Rejected Successfully",
        data: user
    })
})
const changeRideStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const rideId = req.params.id;
    const verifiedToken = req.user;
    const payload = req.body;
    const user = await RidesService.changeRideStatus(rideId, payload, verifiedToken as JwtPayload);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Ride Status Changed Successfully",
        data: user
    })
})

const getAllRides = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await RidesService.getAllRides();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Get all rides Successfully",
        data: result.data,
        meta: result.meta
    })
})



export const RidesController = {
    requestRides,
    cancelRides,
    getRideHistory,
    acceptRides,
    rejectRides,
    changeRideStatus,
    getAllRides
}