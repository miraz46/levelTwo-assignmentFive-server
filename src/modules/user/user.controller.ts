/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes"
import { UserServices } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";
import { catchAsync } from "../../utils/catchAsync";


const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.createUser(req.body);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "User Created Successfully",
        data: user
    })
})
const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const verifiedToken = req.user;
    const payload = req.body;
    const user = await UserServices.updateUser(userId, payload, verifiedToken as JwtPayload);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "User Updated Successfully",
        data: user
    })
})

const getSingleUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const result = await UserServices.getSingleUser(userId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User Get Successfully",
        data: result.data,
    })
})

const getAllUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserServices.getAllUsers();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Get all users Successfully",
        data: result.data,
        meta: result.meta
    })
})



const blockedUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const verifiedToken = req.user;
    const user = await UserServices.blockedUser(userId, verifiedToken as JwtPayload);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "User Blocked Successfully",
        data: user
    })
})
const unblockedUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const verifiedToken = req.user;
    const user = await UserServices.unblockedUser(userId, verifiedToken as JwtPayload);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "User Unblocked Successfully",
        data: user
    })
})


export const UserController = {
    createUser,
    updateUser,
    getAllUser,
    getSingleUser,
    blockedUser,
    unblockedUser
}