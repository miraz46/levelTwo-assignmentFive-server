import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { UserController } from "./user.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";

const router = Router();

// All User can access
router.post("/register", validateRequest(createUserZodSchema), UserController.createUser);
router.patch("/:id", validateRequest(updateUserZodSchema), checkAuth(...Object.values(Role)), UserController.updateUser);

// Only ADMIN can access
router.get("/all-users", checkAuth(Role.ADMIN), UserController.getAllUser);
router.get("/:id", checkAuth(Role.ADMIN), UserController.getSingleUser)
router.patch("/block/:id", checkAuth(Role.ADMIN), UserController.blockedUser)
router.patch("/unblock/:id", checkAuth(Role.ADMIN), UserController.unblockedUser)


export const UserRoutes = router;