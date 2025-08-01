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
exports.DriverController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const driver_service_1 = require("./driver.service");
const sendResponse_1 = require("../../utils/sendResponse");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const onlineDriverStatus = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const driverOnlineStatus = yield driver_service_1.DriverService.onlineDriverStatus(user.userId, user.role);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        success: true,
        message: "Online Status Updated",
        data: driverOnlineStatus,
    });
}));
const offlineDriverStatus = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const driverOnlineStatus = yield driver_service_1.DriverService.offlineDriverStatus(user.userId, user.role);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        success: true,
        message: "Online Status Updated",
        data: driverOnlineStatus,
    });
}));
const driverEarnings = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const driverOnlineStatus = yield driver_service_1.DriverService.driverEarnings(user.userId, user.role);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        success: true,
        message: "Drivers Total Earnings",
        data: driverOnlineStatus,
    });
}));
const driverCompletedRides = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const driverOnlineStatus = yield driver_service_1.DriverService.driverCompletedRides(user.userId, user.role);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        success: true,
        message: "Drivers Total Earnings",
        data: driverOnlineStatus,
    });
}));
const approveDriver = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const driverId = req.params.id;
    const verifiedToken = req.user;
    const user = yield driver_service_1.DriverService.approveDriver(driverId, verifiedToken);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        success: true,
        message: "Driver Approve Successfully",
        data: user
    });
}));
const suspendDriver = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const driverId = req.params.id;
    const verifiedToken = req.user;
    const user = yield driver_service_1.DriverService.suspendDriver(driverId, verifiedToken);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        success: true,
        message: "Driver Suspend Successfully",
        data: user
    });
}));
exports.DriverController = {
    onlineDriverStatus,
    offlineDriverStatus,
    driverEarnings,
    driverCompletedRides,
    approveDriver,
    suspendDriver
};
