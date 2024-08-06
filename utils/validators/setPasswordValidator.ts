import { z } from "zod";

export const setPasswordFormSchema = z
  .object({
    firstName: z.string({ required_error: "First name is required" }),
    password: z.string({ required_error: "Password is required" }).min(8, {
      message: "Should be at least 8 characters",
    }),
    confirm: z
      .string({ required_error: "Password confirmation is required" })
      .min(8, {
        message: "Should be at least 8 characters",
      }),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

export const resetPasswordFormSchema = z
  .object({
    password: z.string({ required_error: "Password is required" }).min(8, {
      message: "Should be at least 8 characters",
    }),
    confirm: z
      .string({ required_error: "Password confirmation is required" })
      .min(8, {
        message: "Should be at least 8 characters",
      }),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

export type SetPasswordFormValues = z.infer<typeof setPasswordFormSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordFormSchema>;
