"use client";
import React, { useState, useRef } from "react";
import AuthForm from "@/components/AuthForm";
import { verifyPhoneSchema } from "../../../utils/validators/verifyPhone";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import OtpBox from "@/components/OtpBox";
import { ErrorMessage } from "formik";
import { toast, ToastContainer } from "react-toastify";
import Spinner from "@/components/Spinner";
import OtpService from "@/lib/services/otp.service";

function VerifyPhone() {
  const router = useRouter();
  const params = useSearchParams();
  const type = params.get("type");
  const [loading, setLoading] = useState<boolean>(false);

  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const verifyPhone = async (data: any, actions: any) => {
    const otp = data.otp.join("");
    setLoading(true);

    try {
      const phone = localStorage.getItem("phone");
      const verificationKey = localStorage.getItem("token");
      if (phone && verificationKey) {
        const response = await OtpService.verifyOtp({
          verificationKey: verificationKey,
          otp: otp,
          check: phone,
        });

        if (response.ok === false) {
          setLoading(false);

          toast.error(() => (
            <div className="font-body font-light text-base w-full flex start">
              {response.message}
            </div>
          ));
        } else if (response.ok === true) {
          console.log("Response: ", response);
          toast.success(() => (
            <div className="font-body font-light text-base w-full flex start">
              {response.message}
            </div>
          ));
          if (type === "sign-up") {
            router.push(`/set-password`);
          }
          if (type === "forgot-password") {
            router.push(`/reset-password`);
          }
        }
      }
    } catch (error: any) {
      setLoading(false);
      toast.error(() => (
        <div className="font-body font-light text-base w-full flex start">
          {error.message}
        </div>
      ));
    } finally {
      actions.resetForm({
        values: {
          otp: ["", "", "", "", "", ""],
        },
      });
    }
  };
  return (
    <div className="flex h-screen w-screen bg-white overflow-hidden justify-center items-center relative">
      {loading && <Spinner />}
      <AuthForm
        onSubmit={verifyPhone}
        initialValues={{ otp: ["", "", "", "", "", ""] }}
        validationSchema={verifyPhoneSchema}
      >
        <p className="text-base font-light font-body pt-2 text-center">
          An OTP has been sent to{" "}
          <span className="font-medium text-base">
            {localStorage.getItem("phone") ?? ""}
          </span>
        </p>
        {<OtpBox />}
        <div className="h-5">
          <ErrorMessage
            name="otp"
            component="div"
            className="text-xs font-light text-red-700"
          />
        </div>
        <input
          type="submit"
          value="Submit"
          className="cursor-pointer text-lg text-bold text-white font-body text-center py-1.5 px-2 bg-primary-500 rounded w-full mt-2 capitalize"
        />
        <div className="py-3 flex justify-between w-full">
          <button
            type="button"
            ref={buttonRef}
            onClick={async (event) => {
              event.preventDefault();
              const phone = localStorage.getItem("phone");
              if (phone && buttonRef.current && !buttonRef.current.disabled) {
                buttonRef.current.disabled = true;
                const response = await OtpService.getOtp({
                  phone: phone,
                  type: "VERIFICATION",
                });
                localStorage.setItem("token", response.token);
                buttonRef.current.disabled = false;
              }
            }}
            className="font-body text-base font-medium block text-primary-500 cursor-pointer"
          >
            Resend Code
          </button>
          <Link
            href={type === "sign-up" ? "/sign-up" : "/forgot-password"}
            className="font-body text-base font-regular font-medium block text-primary-500 cursor-pointer"
          >
            Change Phone Number
          </Link>
        </div>

        <Link
          href="/sign-up"
          className="font-body text-base font-light block w-full text-center"
        >
          Already have an account?{" "}
          <span className="text-primary-500 font-medium">Sign Up</span>
        </Link>
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
}

export default VerifyPhone;
