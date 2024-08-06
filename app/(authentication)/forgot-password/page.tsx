"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
	RegistrationFormValues,
	registrationFormSchema,
} from "@/utils/validators/registraionValidator";
import AuthForm from "@/forms/AuthForm";
import Spinner from "@/components/Spinner";

import { useRouter } from "next/navigation";
import TextInputField from "@/components/inputs/TextInputField";

import { toast, ToastContainer } from "react-toastify";

import UsersService from "@/lib/services/users.service";

const SignUp: React.FC<{}> = () => {
	const router = useRouter();
	const [loading, setLoading] = useState<boolean>(false);

	const verifyPhone = async (
		data: RegistrationFormValues,
		actions: any
	): Promise<any> => {
		setLoading(true);

		try {
			/**
			 * TODO:
			 * 1. Invoke a function that is responsible for sending a verification code to the user's phone number.
			 * 2. Save the response returned to the function that
			 *  */

			const response = await UsersService.isUserRegistered({
				phone: data.email,
			});
			if (response?.userExists) {
				localStorage.setItem("phone", data.email);
				const response = await console.log("Response: ", response);
				localStorage.setItem("token", response.token);
				actions.resetForm({ values: { phone: "" } });
				router.push("/verify-phone?type=forgot-password");
			} else if (!response.userExists) {
				actions.resetForm({ values: { phone: "" } });
				setLoading(false);
				toast.error(() => (
					<div className="font-body font-light text-base w-full flex start">
						User not found
					</div>
				));
			}
		} catch (error: any) {
			console.log(JSON.stringify(error, null, 2));
			toast.error(() => (
				<div className="font-body font-light text-base w-full flex start">
					{error.message}
				</div>
			));

			setLoading(false);
		}
	};

	return (
		<div className="flex justify-center items-center h-screen w-screen bg-white overflow-hidden relative">
			{loading && <Spinner />}
			<AuthForm
				onSubmit={verifyPhone}
				title=""
				initialValues={{ phone: "" }}
				validationSchema={registrationFormSchema}>
				<p className="text-base font-medium text-secondar-900 font-body py-2">
					Enter phone number to reset password
				</p>
				<TextInputField
					name="phone"
					placeholder="Enter Phone Number"
					className="border border-secondary-50 rounded w-full py-1.5 px-2 text-black focus:outline-none text-base text-regular font-light flex items-center"
				/>
				<input
					type="submit"
					value="Submit"
					className="text-lg font-medium text-white font-body text-center py-1.5 px-2 bg-primary-500 rounded w-full capitalize cursor-pointer"
				/>
				<div className="text-center py-1">
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
