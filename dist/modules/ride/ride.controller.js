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
exports.RidesController = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
const catchAsync_1 = require("../../utils/catchAsync");
const ride_service_1 = require("./ride.service");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const sendResponse_1 = require("../../utils/sendResponse");
const requestRides = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodeToken = req.user;
    console.log(req.body, decodeToken);
    const user = yield ride_service_1.RidesService.requestRides(req.body, decodeToken.userId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        success: true,
        message: "User Created Successfully",
        data: user
    });
}));
const cancelRides = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodeToken = req.user;
    const { id } = req.params;
    yield ride_service_1.RidesService.cancelRides(id, decodeToken.userId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Ride deleted Successfully",
        data: null
    });
}));
const getRideHistory = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const rides = yield ride_service_1.RidesService.getRideHistory(user.userId, user.role);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Rides History",
        data: rides,
    });
}));
const acceptRides = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const rideId = req.params.id;
    const verifiedToken = req.user;
    const user = yield ride_service_1.RidesService.acceptRides(rideId, verifiedToken);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        success: true,
        message: "Ride Accepted Successfully",
        data: user
    });
}));
const rejectRides = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const rideId = req.params.id;
    const verifiedToken = req.user;
    const user = yield ride_service_1.RidesService.rejectRides(rideId, verifiedToken);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        success: true,
        message: "Ride Rejected Successfully",
        data: user
    });
}));
const changeRideStatus = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const rideId = req.params.id;
    const verifiedToken = req.user;
    const payload = req.body;
    const user = yield ride_service_1.RidesService.changeRideStatus(rideId, payload, verifiedToken);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        success: true,
        message: "Ride Status Changed Successfully",
        data: user
    });
}));
const getAllRides = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield ride_service_1.RidesService.getAllRides();
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Get all rides Successfully",
        data: result.data,
        meta: result.meta
    });
}));
exports.RidesController = {
    requestRides,
    cancelRides,
    getRideHistory,
    acceptRides,
    rejectRides,
    changeRideStatus,
    getAllRides
};
