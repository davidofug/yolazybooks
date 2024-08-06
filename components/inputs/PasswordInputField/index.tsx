import React, { useState } from "react";
import { useField } from "formik";
import { BsEye, BsEyeSlash } from "react-icons/bs";

interface PasswordInputFieldProps {
  name: string;
  className?: string;
  label?: string;
  placeholder: string;
}

const PasswordInputField: React.FC<PasswordInputFieldProps> = ({
  label,
  name,
  className,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [field, meta] = useField(name);
  const styles = `${
    meta?.error && meta?.touched ? "border-danger-600" : "border-secondary-50"
  } ${className}`;

  return (
    <div className="flex flex-col w-full mb-1">
      {label && <label htmlFor={field.name}>{label}</label>}
      <div className="w-full h-fit relative flex justify-end items-center">
        <input
          {...field}
          {...props}
          type={showPassword ? "text" : "password"}
          className={styles}
        />
        <button
          className={`absolute pr-2 ${!field.value ? "hidden" : ""}`}
          type="button"
          onClick={(event) => {
            event.preventDefault();
            setShowPassword((prev) => !prev);
          }}
        >
          {showPassword ? <BsEyeSlash /> : <BsEye />}
        </button>
      </div>
      <div className="h-5 py-0.5 flex flex-col justify-center flex-grow">
        <p className="text-sm font-body font-light text-danger-600">
          {meta.touched && meta.error ? meta.error : null}
        </p>
      </div>
    </div>
  );
};

export default PasswordInputField;
