"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
	ResetPasswordFormValues,
	resetPasswordFormSchema,
} from "../../../utils/validators/setPasswordValidator";
import AuthForm from "@/forms/AuthForm";
import PasswordInputField from "@/components/inputs/PasswordInputField";
import { useRouter } from "next/navigation";
import Spinner from "@/components/Spinner";
import { toast, ToastContainer } from "react-toastify";
import UsersService from "@/lib/services/users.service";

const ResetPassword: React.FC<{}> = () => {
	const router = useRouter();
	const [loading, setLoading] = useState<boolean>(false);

	async function resetPassword(
		data: ResetPasswordFormValues,
		actions: any
	): Promise<void> {
		console.log("Form actions: ", actions);
		console.log("Form Values: ", data);

		setLoading(true);
		try {
			const phone = localStorage.getItem("phone");
			if (phone) {
				const response = await UsersService.updatePassword({
					phone: phone,
					password: data.password,
				});
				if (response?.ok === true) {
					setLoading(false);
					toast.success(() => (
						<div className="font-body font-light text-base w-full flex start">
							{response.message}
						</div>
					));
				}
				console.log("Response: ", response);
				setLoading(false);
				router.push("/login");
			}
		} catch (error) {
			console.log(error);
			setLoading(false);
		} finally {
			actions.resetForm({
				values: {
					password: "",
					confirm: "",
				},
			});
		}
	}

	return (
		<div className="flex justify-center items-center h-screen w-screen bg-white overflow-hidden relative">
			{loading && <Spinner />}
			<AuthForm
				onSubmit={resetPassword}
				title="Reset Passwords"
				initialValues={{ password: "", confirm: "" }}
				validationSchema={resetPasswordFormSchema}>
				<PasswordInputField
					name="password"
					placeholder="Enter Password"
					className="border rounded w-full py-1.5 px-2 text-black focus:outline-none text-base text-regular font-light flex items-center"
				/>
				<PasswordInputField
					name="confirm"
					placeholder="Retype Password"
					className="border rounded w-full py-1.5 px-2 text-black focus:outline-none text-base text-regular font-light flex items-center"
				/>
				<input
					type="submit"
					value="Submit"
					className="text-lg text-bold text-white font-body text-center py-1.5 px-2 bg-primary-500 rounded w-full mt-2 capitalize cursor-pointer"
				/>
				<div className="my-3 flex justify-between w-full">
					<Link
						href="/login"
						className="font-body text-base font-light block cursor-pointer">
						Remember Password?{" "}
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

export default ResetPassword;
