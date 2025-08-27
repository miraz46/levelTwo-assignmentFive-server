"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = require("express");
const validateRequest_1 = require("../../middlewares/validateRequest");
const user_validation_1 = require("./user.validation");
const user_controller_1 = require("./user.controller");
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("./user.interface");
const router = (0, express_1.Router)();
// All User can access
router.post("/register", (0, validateRequest_1.validateRequest)(user_validation_1.createUserZodSchema), user_controller_1.UserController.createUser);
router.patch("/:id", (0, validateRequest_1.validateRequest)(user_validation_1.updateUserZodSchema), (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), user_controller_1.UserController.updateUser);
router.get("/me", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), user_controller_1.UserController.getMe);
// Only ADMIN can access
router.get("/all-users", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), user_controller_1.UserController.getAllUser);
router.get("/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), user_controller_1.UserController.getSingleUser);
router.patch("/block/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), user_controller_1.UserController.blockedUser);
router.patch("/unblock/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), user_controller_1.UserController.unblockedUser);
exports.UserRoutes = router;
