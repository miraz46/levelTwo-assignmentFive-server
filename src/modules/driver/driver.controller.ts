/* eslint-disable @typescript-eslint/no-unused-vars */
import { JwtPayload } from "jsonwebtoken";
import { catchAsync } from "../../utils/catchAsync";
import { NextFunction, Request, Response } from "express";
import { DriverService } from "./driver.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes"



const onlineDriverStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as JwtPayload;
    const driverOnlineStatus = await DriverService.onlineDriverStatus(user.userId, user.role);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Online Status Updated",
        data: driverOnlineStatus,
    });
});
const offlineDriverStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as JwtPayload;
    const driverOnlineStatus = await DriverService.offlineDriverStatus(user.userId, user.role);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Online Status Updated",
        data: driverOnlineStatus,
    });
});

const driverEarnings = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as JwtPayload;
    const driverOnlineStatus = await DriverService.driverEarnings(user.userId, user.role);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Drivers Total Earnings",
        data: driverOnlineStatus,
    });
});
const driverCompletedRides = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as JwtPayload;
    const driverOnlineStatus = await DriverService.driverCompletedRides(user.userId, user.role);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Drivers Total Earnings",
        data: driverOnlineStatus,
    });
});

const approveDriver = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const driverId = req.params.id;
    const verifiedToken = req.user;
    const user = await DriverService.approveDriver(driverId, verifiedToken as JwtPayload);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Driver Approve Successfully",
        data: user
    })
})
const suspendDriver = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const driverId = req.params.id;
    const verifiedToken = req.user;
    const user = await DriverService.suspendDriver(driverId, verifiedToken as JwtPayload);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Driver Suspend Successfully",
        data: user
    })
})






export const DriverController = {
    onlineDriverStatus,
    offlineDriverStatus,
    driverEarnings,
    driverCompletedRides,
    approveDriver,
    suspendDriver
}