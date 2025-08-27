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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const user_interface_1 = require("./user.interface");
const user_model_1 = require("./user.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const env_1 = require("../../config/env");
// import { JwtPayload } from "jsonwebtoken";
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { email, password, role } = payload, rest = __rest(payload, ["email", "password", "role"]);
    const isUserExist = yield user_model_1.User.findOne({ email });
    if (isUserExist) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User already exist.");
    }
    const hashedPassword = yield bcryptjs_1.default.hash(password, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    const userData = Object.assign({ email, password: hashedPassword, role }, rest);
    if (role === user_interface_1.Role.DRIVER) {
        userData.driverInfo = {
            approved: true,
            online: true,
            suspended: false,
            vehicleType: ((_a = rest.driverInfo) === null || _a === void 0 ? void 0 : _a.vehicleType) || " ",
            licenseNumber: ((_b = rest.driverInfo) === null || _b === void 0 ? void 0 : _b.licenseNumber) || " ",
        };
    }
    const user = yield user_model_1.User.create(userData);
    return user;
});
const updateUser = (userId, payload, verifiedToken) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const ifUserExist = yield user_model_1.User.findById(userId);
    if (!ifUserExist) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User Not Found");
    }
    if (payload.role && verifiedToken.role !== user_interface_1.Role.ADMIN) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "Only admins can change user roles.");
    }
    if (payload.blockedStatus || ((_a = payload.driverInfo) === null || _a === void 0 ? void 0 : _a.approved) || ((_b = payload.driverInfo) === null || _b === void 0 ? void 0 : _b.suspended)) {
        if (verifiedToken.role === user_interface_1.Role.RIDER || verifiedToken.role === user_interface_1.Role.DRIVER) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized");
        }
    }
    if (payload.password) {
        payload.password = yield bcryptjs_1.default.hash(payload.password, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    }
    const newUpdatedUser = yield user_model_1.User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true });
    return newUpdatedUser;
});
const getMe = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId).select("-password");
    return {
        data: user
    };
});
const getSingleUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.User.findById(userId);
    return {
        data: users
    };
});
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.User.find({});
    const totalUsers = yield user_model_1.User.countDocuments();
    return {
        data: users,
        meta: {
            total: totalUsers
        }
    };
});
const blockedUser = (userId, verifiedToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (verifiedToken.role !== user_interface_1.Role.ADMIN) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "Only admins can block users.");
    }
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found.");
    }
    if (user.role !== user_interface_1.Role.RIDER) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "The selected user is not a rider.");
    }
    user.blockedStatus = user_interface_1.BlockedStatus.BLOCKED;
    yield user.save();
    return user;
});
const unblockedUser = (userId, verifiedToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (verifiedToken.role !== user_interface_1.Role.ADMIN) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "Only admins can unblock users.");
    }
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found.");
    }
    if (user.role !== user_interface_1.Role.RIDER) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "The selected user is not a rider.");
    }
    user.blockedStatus = user_interface_1.BlockedStatus.UNBLOCKED;
    yield user.save();
    return user;
});
exports.UserServices = {
    createUser,
    updateUser,
    getAllUsers,
    getMe,
    getSingleUser,
    blockedUser,
    unblockedUser
};
