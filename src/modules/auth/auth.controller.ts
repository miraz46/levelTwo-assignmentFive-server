/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { AuthService } from "./auth.service";
import AppError from "../../errorHelpers/AppError";

import { JwtPayload } from "jsonwebtoken";
import { createUserTokens } from "../../utils/userToken";
import { envVars } from "../../config/env";
import passport from "passport";
import { setAuthCookie } from "../../utils/setCookie";



const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    passport.authenticate("local", async (err: any, user: any, info: any) => {

        if (err) {
            return next(new AppError(401, err))
        }
        if (!user) {
            return next(new AppError(401, info.message))
        }

        const userTokens = await createUserTokens(user);

        const { password: pass, ...rest } = user.toObject();

        setAuthCookie(res, userTokens)
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "User Logged In Successfully",
            data: {
                accessToken: userTokens.accessToken,
                refreshToken: userTokens.refreshToken,
                user: rest
            }
        })
    })(req, res, next)

})

const getNewAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        throw new AppError(httpStatus.BAD_GATEWAY, "No refresh token received from cookies")
    }
    const tokenInfo = await AuthService.getNewAccessToken(refreshToken as string);
    setAuthCookie(res, tokenInfo)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "New Access Token Retrived Successfully",
        data: tokenInfo
    })
})
const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User Logged Out Successfully",
        data: null
    })
})
const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    const decodedToken = req.user;
    await AuthService.resetPassword(oldPassword, newPassword, decodedToken as JwtPayload);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Password Changed Successfully",
        data: null
    })
})

export const AuthControllers = {
    credentialsLogin,
    getNewAccessToken,
    logout,
    resetPassword,
}