import z from "zod";
import { BlockedStatus, Role } from "./user.interface";

export const createUserZodSchema = z.object({
    name: z
        .string({ invalid_type_error: "Name must be a string." })
        .min(2, { message: "Name must be at least 2 characters." })
        .max(50, { message: "Name cannot exceed 50 characters." }),

    email: z
        .string({ invalid_type_error: "Email must be a string." })
        .email({ message: "Invalid email format." }),

    password: z
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

    role: z.enum([Role.RIDER, Role.DRIVER]),

    phone: z
        .string({
            invalid_type_error: "Phone number must be a string.",
        })
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
            message: "Phone must match Bangladeshi format (+8801XXXXXXXXX or 01XXXXXXXXX).",
        })
        .optional(),

    blockedStatus: z
        .enum(Object.values(BlockedStatus) as [string])
        .optional(),

    driverInfo: z
        .object({
            approved: z.boolean().optional(),
            suspended: z.boolean().optional(),
            online: z.boolean().optional(),
            vehicleType: z.string().optional(),
            licenseNumber: z.string().optional(),
        })
        .optional(),
});

export const updateUserZodSchema = z.object({
    name: z
        .string({ invalid_type_error: "Name must be a string." })
        .min(2, { message: "Name must be at least 2 characters." })
        .max(50, { message: "Name cannot exceed 50 characters." })
        .optional(),

    email: z
        .string({ invalid_type_error: "Email must be a string." })
        .email({ message: "Invalid email format." })
        .optional(),

    password: z
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

    role: z.enum([Role.RIDER, Role.DRIVER]).optional(),

    phone: z
        .string({
            invalid_type_error: "Phone number must be a string.",
        })
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
            message: "Phone must match Bangladeshi format (+8801XXXXXXXXX or 01XXXXXXXXX).",
        })
        .optional(),

    blockedStatus: z
        .enum(Object.values(BlockedStatus) as [string])
        .optional(),

    driverInfo: z
        .object({
            approved: z.boolean().optional(),
            suspended: z.boolean().optional(),
            online: z.boolean().optional(),
            vehicleType: z.string().optional(),
            licenseNumber: z.string().optional(),
        })
        .optional(),
}); 