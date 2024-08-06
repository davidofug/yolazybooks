"use client";
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import Link from "next/link";
import {
  SetPasswordFormValues,
  setPasswordFormSchema,
} from "@/utils/validators/setPasswordValidator";
import AuthForm from "@/components/AuthForm";
import PasswordInputField from "@/components/inputs/PasswordInputField";
import TextInputField from "@/components/inputs/TextInputField";
import { useRouter } from "next/navigation";
import AuthenticationService from "@/lib/services/authentication.service";
import AuthorizationService from "@/lib/services/authorization.service";
import Spinner from "@/components/Spinner";
import UsersService from "@/lib/services/users.service";

const SetPassword: React.FC<{}> = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  async function setPassword(
    data: SetPasswordFormValues,
    actions: any
  ): Promise<void> {
    const phone = localStorage.getItem("phone");

    try {
      setLoading(true);
      const response = await UsersService.createUser({
        phone: `${phone}@autofore.co`,
        password: data.password,
        firstName: data.firstName,
      });

      if (response?.ok === true && response?.userId) {
        try {
          const session = await AuthenticationService.createSession({
            phone: `${phone}@autofore.co`,
            password: data.password,
          });

          if (session) {
            const isCustomer = await AuthorizationService.checkIsCustomer();
            const isAdmin = await AuthorizationService.checkIsAdmin();

            if (isCustomer) {
              setLoading(false);
              toast.success(() => (
                <div className="font-body font-light text-base w-full flex start">
                  Successfully logged in
                </div>
              ));
              router.push("customer/dashboard");
            } else if (isAdmin) {
              setLoading(false);
              toast.success(() => (
                <div className="font-body font-light text-base w-full flex start">
                  Successfully logged in
                </div>
              ));
              router.push("/admin/dashboard");
            }
          }
        } catch (error: any) {
          setLoading(false);
          toast.error(() => (
            <div className="font-body font-light text-base w-full flex start">
              {error.message}
            </div>
          ));
        }
      } else if (response?.ok === false) {
        setLoading(false);
        toast.error(() => (
          <div className="font-body font-light text-base w-full flex start">
            {response.message}
          </div>
        ));
      }
    } catch (error) {
      setLoading(false);
      toast.error(() => (
        <div className="font-body font-light text-base w-full flex start">
          There was an error creating the user
        </div>
      ));
    } finally {
      setLoading(false);
      actions.resetForm({
        values: {
          firstName: "",
          password: "",
          confirm: "",
        },
      });
    }
  }

  return (
    <div className="flex items-center justify-center w-screen h-screen overflow-hidden bg-white">
      {loading && <Spinner />}
      <AuthForm
        onSubmit={setPassword}
        title="Enter details"
        initialValues={{ firstName: "", password: "", confirm: "" }}
        validationSchema={setPasswordFormSchema}
      >
        <TextInputField
          name="firstName"
          placeholder="Enter First Name"
          className="border rounded w-full py-1.5 px-2 text-body-500 focus:outline-none text-base text-regular font-light flex items-center"
        />
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
        <div className="flex justify-between w-full my-3">
          <Link
            href="/login"
            className="block text-base font-light cursor-pointer font-body"
          >
            Remember Password?{" "}
            <span className="font-medium text-primary-500">Login</span>
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

export default SetPassword;
