import React from "react";
import { Formik, Form } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import Image from "next/image";
import logo from "@/assets/images/logo.png";

interface AuthFormProps {
	title?: string;
	onSubmit: (values: any, actions: any) => void;
	children?: React.ReactNode;
	initialValues: any;
	validationSchema: any;
}

const AuthForm: React.FC<AuthFormProps> = ({
	onSubmit,
	title = "",
	children,
	initialValues,
	validationSchema,
}) => {
	return (
		<Formik
			onSubmit={onSubmit}
			validationSchema={toFormikValidationSchema(validationSchema)}
			initialValues={initialValues}>
			{() => {
				return (
					<Form className="flex flex-col justify-center items-center w-11/12 sm:w-80 px-4 rounded-md py-4 shadow-md">
						<div className="flex flex-col justify-center items-center w-fit gap-y-2 mb-3">
							<Image
								src={logo}
								alt="logo"
								width={146}
								height={51}
							/>
							{title && (
								<h1 className="text-h3 font-body text-body-700 text-semibold uppercase text-center">
									{title}
								</h1>
							)}
						</div>
						{children}
					</Form>
				);
			}}
		</Formik>
	);
};

export default AuthForm;
