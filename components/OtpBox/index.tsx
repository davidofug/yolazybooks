import React from "react";
import { useFormikContext, FormikContextType } from "formik";

interface OtpBoxProps {
  values: any;
  setFieldValue: any;
  setFieldError: any;
  resetForm?: any;
}
function OtpBox() {
  const { values, setFieldValue, setFieldError }: OtpBoxProps =
    useFormikContext<FormikContextType<OtpBoxProps>>();

  return (
    <div className="text-center">
      <div className="flex gap-x-1 pt-1">
        {Array.from({ length: 6 }, (_, i) => (
          <input
            key={i}
            id={`otp-${i}`}
            name={`otp[${i}]`}
            className={`w-10 h-10 font-body text-h5  text-center outline-none  
            ${
              values?.otp[i]
                ? "border-b border-primary-500 focus:border-primary-500"
                : "border-b border-secondary-900 focus:border-primary-500"
            }
            `}
            type="text"
            maxLength={1}
            onChange={(event) => {
              if (event.target.value === "") {
                return;
              } else if (isNaN(Number(event.target.value))) {
                event.target.value = "";
                setFieldValue(`otp[${i}]`, "");
                return;
              }
              setFieldValue(`otp[${i}]`, event.target.value);
              if (i < 5) {
                (
                  event.currentTarget.nextElementSibling as HTMLInputElement
                )?.focus();
              }
            }}
            value={values?.otp[i]}
            onKeyDown={(event) => {
              if (event.key === "Backspace") {
                event.preventDefault();
                setFieldValue(`otp[${i}]`, "");
                event.currentTarget.value = "";
                if (i > 0) {
                  (
                    event.currentTarget
                      .previousElementSibling as HTMLInputElement
                  )?.focus();
                }
              }
            }}
            onPaste={(event) => {
              const value = event.clipboardData.getData("text/plain");
              if (isNaN(Number(value))) {
                event.preventDefault();
                setFieldError(`otp[${i}]`, "Digits only");
                return;
              }
              const characters =
                value.length > 6
                  ? value.slice(0, 6).split("")
                  : value.split("");
              characters.forEach((character, index) => {
                setFieldValue(`otp[${index}]`, character);
                const element = document.getElementById(`otp-${index}`);
                element?.focus();
              });
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default OtpBox;
