import AppError from "../../errorHelpers/AppError";
import { BlockedStatus, IUser, Role, } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes"
import bcrypt from "bcryptjs";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
// import { JwtPayload } from "jsonwebtoken";

const createUser = async (payload: Partial<IUser>) => {

    const { email, password, role, ...rest } = payload;
    const isUserExist = await User.findOne({ email })

    if (isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User already exist.")
    }

    const hashedPassword = await bcrypt.hash(password as string, Number(envVars.BCRYPT_SALT_ROUND));


    const userData: Partial<IUser> = {
        email,
        password: hashedPassword,
        role,
        ...rest,
    };
    if (role === Role.DRIVER) {
        userData.driverInfo = {
            approved: true,
            online: true,
            suspended: false,
            vehicleType: rest.driverInfo?.vehicleType || " ",
            licenseNumber: rest.driverInfo?.licenseNumber || " ",
        };
    }
    const user = await User.create(userData);
    return user;
}

const updateUser = async (userId: string, payload: Partial<IUser>, verifiedToken: JwtPayload) => {

    const ifUserExist = await User.findById(userId);
    if (!ifUserExist) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found")
    }

    if (payload.role && verifiedToken.role !== Role.ADMIN) {
        throw new AppError(httpStatus.FORBIDDEN, "Only admins can change user roles.");
    }

    if (payload.blockedStatus || payload.driverInfo?.approved || payload.driverInfo?.suspended) {
        if (verifiedToken.role === Role.RIDER || verifiedToken.role === Role.DRIVER) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized")
        }
    }
    if (payload.password) {
        payload.password = await bcrypt.hash(payload.password, Number(envVars.BCRYPT_SALT_ROUND))
    }

    const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true });

    return newUpdatedUser

}

const getMe = async (userId: string) => {
    const user = await User.findById(userId).select("-password");
    return {
        data: user
    }
};

const getSingleUser = async (userId: string) => {
    const users = await User.findById(userId);

    return {
        data: users
    }
}
const getAllUsers = async () => {
    const users = await User.find({});

    const totalUsers = await User.countDocuments()
    return {
        data: users,
        meta: {
            total: totalUsers
        }
    }
}

const blockedUser = async (userId: string, verifiedToken: JwtPayload) => {

    if (verifiedToken.role !== Role.ADMIN) {
        throw new AppError(httpStatus.FORBIDDEN, "Only admins can block users.");
    }

    const user = await User.findById(userId);

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found.");
    }

    if (user.role !== Role.RIDER) {
        throw new AppError(httpStatus.BAD_REQUEST, "The selected user is not a rider.");
    }

    user.blockedStatus = BlockedStatus.BLOCKED;
    await user.save();

    return user;

}
const unblockedUser = async (userId: string, verifiedToken: JwtPayload) => {

    if (verifiedToken.role !== Role.ADMIN) {
        throw new AppError(httpStatus.FORBIDDEN, "Only admins can unblock users.");
    }
    const user = await User.findById(userId);

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found.");
    }

    if (user.role !== Role.RIDER) {
        throw new AppError(httpStatus.BAD_REQUEST, "The selected user is not a rider.");
    }

    user.blockedStatus = BlockedStatus.UNBLOCKED;
    await user.save();

    return user;
}


export const UserServices = {
    createUser,
    updateUser,
    getAllUsers,
    getMe,
    getSingleUser,
    blockedUser,
    unblockedUser
}