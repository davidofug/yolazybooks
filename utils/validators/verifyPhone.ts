import { z } from "zod";

export const verifyPhoneSchema = z.object({
  otp: z.string().array().length(6, {
    message: "Should be 6 digits",
  }),
});

export type VerifyPhoneFormValues = z.infer<typeof verifyPhoneSchema>;
