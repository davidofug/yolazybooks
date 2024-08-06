import React from "react";
import { useField } from "formik";

interface TextInputFieldProps {
  name: string;
  className?: string;
  label?: string;
  placeholder: string;
}

const TextInputField: React.FC<TextInputFieldProps> = ({
  label,
  name,
  className,
  ...props
}) => {
  const [field, meta] = useField(name);
  const styles = `${
    meta?.error && meta?.touched ? "border-danger-600" : "border-secondary-50"
  } ${className}`;
  return (
    <div className="flex flex-col w-full mb-1">
      <label htmlFor={field.name}>{label}</label>
      <div className="w-full h-fit relative flex justify-end items-center">
        <input {...field} {...props} type="text" className={styles} />
      </div>
      <div className="h-5 py-0.5 flex flex-col justify-center flex-grow">
        <div className="text-sm font-body font-light text-danger-600">
          {meta.touched && meta.error ? meta.error : null}
        </div>
      </div>
    </div>
  );
};

export default TextInputField;
