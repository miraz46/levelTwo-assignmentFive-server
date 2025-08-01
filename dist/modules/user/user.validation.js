"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserZodSchema = exports.createUserZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const user_interface_1 = require("./user.interface");
exports.createUserZodSchema = zod_1.default.object({
    name: zod_1.default
        .string({ invalid_type_error: "Name must be a string." })
        .min(2, { message: "Name must be at least 2 characters." })
        .max(50, { message: "Name cannot exceed 50 characters." }),
    email: zod_1.default
        .string({ invalid_type_error: "Email must be a string." })
        .email({ message: "Invalid email format." }),
    password: zod_1.default
        .string({ invalid_type_error: "Password must be a string." })
        .min(8, { message: "Password must be at least 8 characters." })
        .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter.",
    })
        .regex(/[!@#$%^&*]/, {
        message: "Password must contain at least one special character (!@#$%^&*).",
    })
        .regex(/\d/, {
        message: "Password must contain at least one number.",
    }),
    role: zod_1.default.enum([user_interface_1.Role.RIDER, user_interface_1.Role.DRIVER]),
    phone: zod_1.default
        .string({
        invalid_type_error: "Phone number must be a string.",
    })
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
        message: "Phone must match Bangladeshi format (+8801XXXXXXXXX or 01XXXXXXXXX).",
    })
        .optional(),
    blockedStatus: zod_1.default
        .enum(Object.values(user_interface_1.BlockedStatus))
        .optional(),
    driverInfo: zod_1.default
        .object({
        approved: zod_1.default.boolean().optional(),
        suspended: zod_1.default.boolean().optional(),
        online: zod_1.default.boolean().optional(),
        vehicleType: zod_1.default.string().optional(),
        licenseNumber: zod_1.default.string().optional(),
    })
        .optional(),
});
exports.updateUserZodSchema = zod_1.default.object({
    name: zod_1.default
        .string({ invalid_type_error: "Name must be a string." })
        .min(2, { message: "Name must be at least 2 characters." })
        .max(50, { message: "Name cannot exceed 50 characters." })
        .optional(),
    email: zod_1.default
        .string({ invalid_type_error: "Email must be a string." })
        .email({ message: "Invalid email format." })
        .optional(),
    password: zod_1.default
        .string({ invalid_type_error: "Password must be a string." })
        .min(8, { message: "Password must be at least 8 characters." })
        .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter.",
    })
        .regex(/[!@#$%^&*]/, {
        message: "Password must contain at least one special character (!@#$%^&*).",
    })
        .regex(/\d/, {
        message: "Password must contain at least one number.",
    })
        .optional(),
    role: zod_1.default.enum([user_interface_1.Role.RIDER, user_interface_1.Role.DRIVER]).optional(),
    phone: zod_1.default
        .string({
        invalid_type_error: "Phone number must be a string.",
    })
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
        message: "Phone must match Bangladeshi format (+8801XXXXXXXXX or 01XXXXXXXXX).",
    })
        .optional(),
    blockedStatus: zod_1.default
        .enum(Object.values(user_interface_1.BlockedStatus))
        .optional(),
    driverInfo: zod_1.default
        .object({
        approved: zod_1.default.boolean().optional(),
        suspended: zod_1.default.boolean().optional(),
        online: zod_1.default.boolean().optional(),
        vehicleType: zod_1.default.string().optional(),
        licenseNumber: zod_1.default.string().optional(),
    })
        .optional(),
});
