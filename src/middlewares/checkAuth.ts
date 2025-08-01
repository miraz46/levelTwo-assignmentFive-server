import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/AppError";
import { verifyToken } from "../utils/jwt";
import { envVars } from "../config/env";
import { JwtPayload } from "jsonwebtoken";
import httpStatus from "http-status-codes"
import { User } from "../modules/user/user.model";
import { BlockedStatus } from "../modules/user/user.interface";

export const checkAuth = (...authRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.headers.authorization;

        if (!accessToken) {
            throw new AppError(403, "No Token Received")
        }

        const verifiedToken = verifyToken(accessToken, envVars.JWT_ACCESS_SECRET) as JwtPayload;

        const isUserExist = await User.findOne({ email: verifiedToken.email })
        if (!isUserExist) {
            throw new AppError(httpStatus.BAD_REQUEST, "User does not exist.")
        }
        if (isUserExist.blockedStatus === BlockedStatus.BLOCKED) {
            throw new AppError(httpStatus.BAD_REQUEST, `User is ${isUserExist.blockedStatus}`)
        }
        if (isUserExist.driverInfo?.suspended === true) {
            throw new AppError(httpStatus.BAD_REQUEST, "Driver account is suspended.");
        }
        if (!authRoles.includes(verifiedToken.role)) {
            throw new AppError(403, "You are not permitted to view this route!!")
        }
        req.user = verifiedToken;
        next()
    } catch (error) {
        next(error);
    }
}