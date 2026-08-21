import { z } from "zod";

export const createTableSchema = z.object({
  restaurant_id: z.union([z.number(), z.string()]).refine((val) => val !== undefined && val !== null && val !== "", {
    message: "restaurant_id is required",
  }),
  table_number: z.union([z.number(), z.string()]).refine((val) => val !== undefined && val !== null && val !== "", {
    message: "table_number is required",
  }),
  capacity: z.union([z.number(), z.string()]).refine((val) => val !== undefined && val !== null && val !== "", {
    message: "capacity is required",
  }),
  status: z.enum(["available", "booked", "reserved", "occupied", "maintenance"]).optional(),
});

export const updateTableSchema = z.object({
  table_number: z.union([z.number(), z.string()]).optional(),
  capacity: z.union([z.number(), z.string()]).optional(),
  status: z.enum(["available", "booked", "reserved", "occupied", "maintenance"]).optional(),
});
