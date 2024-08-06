import { z } from "zod";

export const registrationFormSchema = z.object({
  phone: z
    .string({
      required_error: "Phone number is required",
    })
    .length(10, {
      message: "Should be 10 digits",
    })
});

export type RegistrationFormValues = z.infer<typeof registrationFormSchema>;