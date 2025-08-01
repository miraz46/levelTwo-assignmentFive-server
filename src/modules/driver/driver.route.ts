import { Router } from "express";
import { Role } from "../user/user.interface";
import { checkAuth } from "../../middlewares/checkAuth";
import { DriverController } from "./driver.controller";

const router = Router();


// // Driver Only
router.patch("/online", checkAuth(Role.DRIVER), DriverController.onlineDriverStatus)
router.patch("/offline", checkAuth(Role.DRIVER), DriverController.offlineDriverStatus)
router.get("/earnings", checkAuth(Role.DRIVER), DriverController.driverEarnings)
router.get("/my-rides", checkAuth(Role.DRIVER), DriverController.driverCompletedRides)


// //Admin only
router.patch("/approve/:id", checkAuth(Role.ADMIN), DriverController.approveDriver)
router.patch("/suspend/:id",checkAuth(Role.ADMIN), DriverController.suspendDriver)





export const DriversRoutes = router;