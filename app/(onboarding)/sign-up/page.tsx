"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  RegistrationFormValues,
  registrationFormSchema,
} from "@/utils/validators/registraionValidator";
import AuthForm from "@/components/AuthForm";
import TextInputField from "@/components/inputs/TextInputField";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import Spinner from "@/components/Spinner";
import UsersService from "@/lib/services/users.service";
import OtpService from "@/lib/services/otp.service";

const SignUp: React.FC<{}> = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const signup = async (
    data: RegistrationFormValues,
    actions: any
  ): Promise<any> => {
    /**
     * Algorithm
     * Check if the user exists in the database.
     * If the user exists in the system, give them an altert that the user already exists in the system.
     * If the user does not exist in the system, store their phone number and send them an OTP.
     */
    try {
      setLoading(true);
      const response = await UsersService.isUserRegistered({
        phone: data.phone,
      });
      if (response?.userExists) {
        setLoading(false);
        toast.error(() => (
          <div className="font-body font-light text-base w-full flex start">
            {response.message}
          </div>
        ));

        actions.resetForm({ values: { phone: "" } });
      } else {
        localStorage.setItem("phone", data.phone);
        const response = await OtpService.getOtp({
          phone: data.phone,
          type: "VERIFICATION",
        });
        localStorage.setItem("token", response.token);
        actions.resetForm({ values: { phone: "" } });
        router.push(`/verify-phone?type=sign-up`);
      }
    } catch (error: any) {
      console.log(error);
      toast.error(() => (
        <div className="font-body font-light text-base w-full flex start">
          {error.message}
        </div>
      ));
      actions.resetForm({ values: { phone: "" } });
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen w-screen bg-white overflow-hidden relative">
      {loading && <Spinner />}
      <AuthForm
        onSubmit={signup}
        initialValues={{ phone: "" }}
        validationSchema={registrationFormSchema}
      >
        <p className="text-base font-medium text-body-500 font-body my-3">
          Enter phone number to register
        </p>
        <TextInputField
          name="phone"
          placeholder="Enter Phone Number"
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
            className="cursor-pointer font-body text-base font-light"
          >
            Already have an account?{" "}
            <span className="text-primary-500 font-medium">Login</span>
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
