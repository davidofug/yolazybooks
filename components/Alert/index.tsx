import React from "react";
import toast from "react-hot-toast";
import {
  AiOutlineCheckCircle,
  AiOutlineClose,
  AiOutlineCloseCircle,
} from "react-icons/ai";

interface AlertProps {
  type: "success" | "failed";
  message: string;
  toastEvent: any;
}
const Alert: React.FC<AlertProps> = ({ type, message, toastEvent }) => {
  return (
    <main
      className={`w-64 flex flex-col justify-between cursor-pointer rounded pt-4 ${
        type === "success" ? "bg-success-50" : "bg-danger-600"
      }`}
    >
      <div className="w-full flex justify-end pr-2 ">
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            toast.dismiss(toastEvent.id);
          }}
        >
          <AiOutlineClose
            className={`w-4 h-4  ${
              type === "success" ? "text-secondary-700" : "text-white"
            }`}
          />
        </button>
      </div>
      <div className="w-full flex flex-col gap-5 justify-start items-center">
        <div className="w-full flex flex-col items-center">
          <h1
            className={`font-light text-h2 font-body ${
              type === "success" ? "text-success-700" : "text-white"
            }  py-5`}
          >
            {type === "success" ? "Success!" : "Failed"}
          </h1>
          <p
            className={`text-center font-regular font-body text-sm ${
              type === "success" ? "text-success-700" : "text-white"
            }`}
          >
            {message}
          </p>
        </div>
        <div>
          {type === "success" ? (
            <svg
              className="w-28 h-28 stroke-cuurent stroke-success-700 fill-none"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              strokeWidth="0.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ) : (
            <svg
              className="w-28 h-28 stroke-cuurent stroke-white fill-none"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="0.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          )}
        </div>
        <button
          className={`${
            type === "success" ? "bg-success-700" : "bg-danger-700"
          }  w-fit h-fit py-2 px-3 rounded-2xl text-white text-sm font-body font-regular mb-5`}
          onClick={(event) => {
            event.preventDefault();
            toast.dismiss(toastEvent.id);
          }}
        >
          {type === "success" ? "Continue" : "Try again"}
        </button>
      </div>
    </main>
  );
};

export default Alert;
