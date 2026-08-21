import { z } from "zod";

export const loginFormSchema = z.object({
    email: z
        .string()
        .min(1, "Email address is required")
        .email("Please enter a valid email address"),
    password: z
        .string()
        .min(1, "Password is required"),
});

export const registerFormSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Name must be at least 2 characters"),
    email: z
        .string()
        .trim()
        .min(1, "Email address is required")
        .email("Please enter a valid email address"),
    password: z
        .string()
        .min(6, "Password must be at least 6 characters"),
    phone: z
        .string()
        .trim()
        .optional()
        .refine((val) => !val || /^[+]*[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/.test(val), {
            message: "Invalid phone number format",
        }),
    role: z.enum(["user", "owner"]).default("user"),
});

export const guestDetailsSchema = z.object({
    name: z.string().trim().min(2, "Full name must be at least 2 characters"),
    email: z.string().trim().email("Please enter a valid email address"),
    phone: z.string().trim().min(7, "Please enter a valid phone number"),
    occasion: z.string().optional(),
    specialRequests: z.string().optional(),
});

export const bookingFormSchema = z.object({
    date: z.string().min(1, "Please select a booking date"),
    time: z.string().min(1, "Please select a booking time"),
    guests: z
        .number({ invalid_type_error: "Guests must be a number" })
        .min(1, "At least 1 guest is required")
        .max(20, "Maximum guest limit is 20"),
    restaurantId: z.string().or(z.number()),
    specialRequests: z.string().optional(),
});

export type LoginFormData = z.infer<typeof loginFormSchema>;
export type RegisterFormData = z.infer<typeof registerFormSchema>;
export type GuestDetailsFormData = z.infer<typeof guestDetailsSchema>;
export type BookingFormData = z.infer<typeof bookingFormSchema>;
