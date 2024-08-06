import { z } from "zod";


export const bookingSchema = z.object({
  bookingDate: z.string(),
  vehicle: z.array(z.string()),
  status: z.string().optional(),
});
