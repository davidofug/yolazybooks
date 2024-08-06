"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
	RegistrationFormValues,
	registrationFormSchema,
} from "@/utils/validators/registraionValidator";
import AuthForm from "@/forms/AuthForm";
import TextInputField from "@/components/inputs/TextInputField";
import PasswordInputField from "@/components/inputs/PasswordInputField";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import Spinner from "@/components/Spinner";
import { registerUser } from "@/lib/actions/newUser";
import { account } from "@/appwrite/appwrite";
import uniqueId from "lodash/uniqueId";

const SignUp: React.FC<{}> = () => {
	const router = useRouter();
	const [loading, setLoading] = useState<boolean>(false);

	const handleSubmit = async (
		data: RegistrationFormValues,
		// event: React.FormEvent<HTMLFormElement>,
		actions: any
	): Promise<any> => {
		/**
		 * Algorithm
		 * Check if the user exists in the database.
		 * If the user exists in the system, give them an altert that the user already exists in the system.
		 * If the user does not exist in the system, store their phone number and send them an OTP.
		 */
		// event.preventDefault();
		// const formData = new FormData(event.target);
		// const { email, password } = data;
		// console.log(formData);
		try {
			setLoading(true);

			const result = await account.create(
				uniqueId(),
				data.email,
				data.password
			);

			console.log(result);

			// const response = await registerUser({
			// 	email: email,
			// 	password: password,
			// });
			// console.log(response);
			// setLoading(false);
			// const response = await UsersService.isUserRegistered({
			// 	phone: data.phone,
			// // });
			// if (response?.userExists) {
			// 	setLoading(false);
			// 	toast.error(() => (
			// 		<div className="font-body font-light text-base w-full flex start">
			// 			{response.message}
			// 		</div>
			// 	));

			// actions.resetForm({ values: { email: "" } });
			// } else {
			// localStorage.setItem("phone", data.phone);
			// const response = await OtpService.getOtp({
			// 	phone: data.phone,
			// 	type: "VERIFICATION",
			// });
			// localStorage.setItem("token", response.token);
			actions.resetForm({
				values: { email: "", password: "", password2: "" },
			});
			router.push(`/categories`);
			//}
		} catch (error: any) {
			console.log(error);
			toast.error(() => (
				<div className="font-body font-light text-base w-full flex start">
					{error.message}
				</div>
			));
			actions.resetForm({
				values: { email: "", password: "", password2: "" },
			});
			setLoading(false);
		}
	};

	return (
		<div className="flex justify-center items-center h-screen w-screen bg-white overflow-hidden relative">
			{loading && <Spinner />}
			<AuthForm
				onSubmit={handleSubmit}
				initialValues={{ email: "", password: "", password2: "" }}
				validationSchema={registrationFormSchema}>
				<h1 className="text-base font-medium text-body-500 font-body my-3">
					Provide Details to Create Account
				</h1>
				<TextInputField
					name="email"
					placeholder="Enter Email"
					className="border rounded w-full py-1.5 px-2 text-body-500 focus:outline-none text-base text-regular font-light flex items-center"
				/>

				<PasswordInputField
					name="password"
					placeholder="Enter Password"
					className="border rounded w-full py-1.5 px-2 text-body-500 focus:outline-none text-base text-regular font-light flex items-center"
				/>
				<PasswordInputField
					name="password2"
					placeholder="Confirm Password"
					className="border rounded w-full py-1.5 px-2 text-body-500 focus:outline-none text-base text-regular font-light flex items-center"
				/>
				<input
					type="submit"
					value="Submit"
					className="text-lg text-bold text-white font-body text-center py-1.5 px-2 bg-primary-500 rounded w-full mt-1 capitalize cursor-pointer"
				/>
				<div className="text-center mt-1">
					<Link
						href="/login"
						className="cursor-pointer font-body text-base font-light">
						Already have an account?{" "}
						<span className="text-primary-500 font-medium">
							Login
						</span>
					</Link>
				</div>
			</AuthForm>

			<ToastContainer
				position="top-center"
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop
				closeOnClick
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="light"
			/>
		</div>
	);
};

export default SignUp;
