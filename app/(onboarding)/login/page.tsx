"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  AuthFormValues,
  authFormSchema,
} from "@/utils/validators/loginValidator";
import AuthForm from "@/components/AuthForm";
import PasswordInputField from "@/components/inputs/PasswordInputField";
import TextInputField from "@/components/inputs/TextInputField";
import AuthorizationService from "@/lib/services/authorization.service";
import AuthenticationService from "@/lib/services/authentication.service";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import Spinner from "@/components/Spinner";

const Login: React.FC<{}> = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  async function login(data: AuthFormValues, actions: any): Promise<void> {
    try {
      const session = await AuthenticationService.createSession({
        phone: `${data.phone}@autofore.co`,
        password: data.password,
      });

      setLoading(true);

      if (session) {
        const isCustomer = await AuthorizationService.checkIsCustomer();
        const isAdmin = await AuthorizationService.checkIsAdmin();

        if (isCustomer) {
          router.push("/customer/dashboard");
        } else if (isAdmin) {
          router.push("/admin/dashboard");
        }
      }
    } catch (error: any) {
      toast.error(() => (
        <div className="font-body font-light text-base w-full flex start">
          {error.message}
        </div>
      ));
      setLoading(false);
    } finally {
      actions.resetForm({
        values: {
          phone: "",
          password: "",
        },
      });
    }
  }
  return (
    <div className="flex items-center justify-center w-screen h-screen overflow-hidden bg-white">
      {loading ? (
        <Spinner />
      ) : (
        <AuthForm
          onSubmit={login}
          title="login"
          initialValues={{ phone: "", password: "" }}
          validationSchema={authFormSchema}
        >
          <TextInputField
            name="phone"
            placeholder="Enter Phone Number"
            className="border border-secondary-50 rounded w-full py-1.5 px-2 text-black focus:outline-none text-base text-regular font-light flex items-center"
          />
          <PasswordInputField
            name="password"
            placeholder="Enter Password"
            className="border border-secondary-50 rounded w-full py-1.5 px-2 text-black focus:outline-none text-base text-regular font-light flex items-center"
          />
          <input
            type="submit"
            value="Login"
            className="text-lg font-medium text-white font-body text-center py-1.5 px-2 bg-primary-500 rounded w-full capitalize cursor-pointer"
          />
          <div className="flex flex-col py-2 text-center gap-y-1">
            <Link
              href="/forgot-password"
              className="text-base font-medium cursor-pointer font-body text-primary-500"
            >
              Forgot Password?
            </Link>
            <Link
              href="/sign-up"
              className="block text-base font-light font-body"
            >
              Do have an account?{" "}
              <span className="font-medium text-primary-500">Sign Up</span>
            </Link>
          </div>
        </AuthForm>
      )}
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

export default Login;
