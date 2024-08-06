"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import authenticationService from "@/lib/services/authentication.service";
import AuthorizationService from "@/lib/services/authorization.service";

interface OnboardingLayoutProps {
	children: React.ReactNode;
}

const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({ children }) => {
	const router = useRouter();

	const checkUser = async () => {
		try {
			const session = await authenticationService.getSession();
			if (session) {
				// const isUserAdmin: boolean = await AuthorizationService.checkIsAdmin();
				// const isUserCustomer: boolean =
				//   await AuthorizationService.checkIsCustomer();
				// if (isUserAdmin) {
				//   router.push("/admin/dashboard");
				// } else if (isUserCustomer) {
				//   router.push("/customer/dashboard");
				// }
				router.push("/categories");
			}
		} catch (error: any) {
			console.log("Error Message: ", error.message);
		}
	};

	useEffect(() => {
		checkUser();
	}, []);

	return <main className="h-screen w-screen">{children}</main>;
};

export default OnboardingLayout;
