import { z } from "zod";

export const createRestaurantSchema = z.object({
  name: z.string().trim().min(1, "Restaurant name is required"),
  cuisine: z.string().trim().min(1, "Cuisine is required"),
  address: z.string().trim().min(1, "Address is required"),
  city: z.string().trim().optional(),
  location: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  timing: z.string().trim().optional(),
  capacity: z.union([z.number(), z.string()]).optional(),
  description: z.string().trim().optional(),
  image: z.string().trim().optional(),
  owner_id: z.union([z.number(), z.string()]).optional(),
});

export const updateRestaurantSchema = z.object({
  name: z.string().trim().min(1, "Restaurant name cannot be empty").optional(),
  cuisine: z.string().trim().min(1, "Cuisine cannot be empty").optional(),
  address: z.string().trim().min(1, "Address cannot be empty").optional(),
  city: z.string().trim().optional(),
  location: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  timing: z.string().trim().optional(),
  capacity: z.union([z.number(), z.string()]).optional(),
  description: z.string().trim().optional(),
  image: z.string().trim().optional(),
});
