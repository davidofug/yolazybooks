import { z } from "zod";

export const authFormSchema = z.object({
  phone: z
    .string({
      required_error: "Phone number is required",
    })
    .length(10, {
      message: "Should be 10 digits",
    }),
  password: z.string({ required_error: "Password is required" }).min(8, {
    message: "Should be at least 8 characters",
  }),
});

export type AuthFormValues = z.infer<typeof authFormSchema>;
