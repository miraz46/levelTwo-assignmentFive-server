import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { createRideZodSchema } from "./ride.validation";
import { RidesController } from "./ride.controller";

const router = Router();

router.get("/", checkAuth(Role.ADMIN), RidesController.getAllRides)
router.post("/request", checkAuth(Role.RIDER), validateRequest(createRideZodSchema), RidesController.requestRides)
router.delete("/cancel/:id", checkAuth(Role.RIDER), RidesController.cancelRides)
router.get("/history", checkAuth(Role.RIDER, Role.DRIVER), RidesController.getRideHistory)
router.patch("/accept/:id", checkAuth(Role.DRIVER), RidesController.acceptRides)
router.patch("/reject/:id", checkAuth(Role.DRIVER), RidesController.rejectRides)
router.patch("/status/:id", checkAuth(Role.DRIVER), RidesController.changeRideStatus)




export const RidesRoutes = router;