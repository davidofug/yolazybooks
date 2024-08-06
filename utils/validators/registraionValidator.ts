import { z } from "zod";

export const registrationFormSchema = z
	.object({
		email: z
			.string({
				required_error: "Email address is required",
			})
			.email({ message: "Invalid email address" }),

		password: z
			.string({
				required_error: "Password is required",
			})
			.min(8, {
				message: "Password must be 8 characters or longer.",
			}),
		password2: z
			.string({
				required_error: "Password is required",
			})
			.min(8, {
				message: "Confirm Password must be 8 characters or longer.",
			}),
	})
	.refine((data) => data.password === data.password2, {
		message: "Passwords don't match",
		path: ["password2"], // path of error
	});

export type RegistrationFormValues = z.infer<typeof registrationFormSchema>;
