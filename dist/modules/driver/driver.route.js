"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriversRoutes = void 0;
const express_1 = require("express");
const user_interface_1 = require("../user/user.interface");
const checkAuth_1 = require("../../middlewares/checkAuth");
const driver_controller_1 = require("./driver.controller");
const router = (0, express_1.Router)();
// // Driver Only
router.patch("/online", (0, checkAuth_1.checkAuth)(user_interface_1.Role.DRIVER), driver_controller_1.DriverController.onlineDriverStatus);
router.patch("/offline", (0, checkAuth_1.checkAuth)(user_interface_1.Role.DRIVER), driver_controller_1.DriverController.offlineDriverStatus);
router.get("/earnings", (0, checkAuth_1.checkAuth)(user_interface_1.Role.DRIVER), driver_controller_1.DriverController.driverEarnings);
router.get("/my-rides", (0, checkAuth_1.checkAuth)(user_interface_1.Role.DRIVER), driver_controller_1.DriverController.driverCompletedRides);
// //Admin only
router.patch("/approve/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), driver_controller_1.DriverController.approveDriver);
router.patch("/suspend/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), driver_controller_1.DriverController.suspendDriver);
exports.DriversRoutes = router;
