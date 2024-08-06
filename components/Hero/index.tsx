"use client";
import React from "react";
import { useRouter } from "next/navigation";
import AuthenticationService from "@/lib/services/authentication.service";
import AuthorizationService from "@/lib/services/authorization.service";

interface Props {
  className?: string;
  handleRef: any;
}

const Hero: React.FC<Props> = ({ className, handleRef }) => {
  const router = useRouter();
  return (
    <section
      ref={handleRef}
      className={`flex flex-col justify-center items-center ${className}`}
    >
      <header className="flex flex-col items-center px-5 gap-y-10 md:px-0">
        <h2
          className="mt-20 text-2xl font-semibold text-center text-secondary-700 font-body"
          id="hero"
        >
          UNBEATABLE CAR SERVICING PRICES.
        </h2>
        <h3 className="text-2xl font-bold text-center font-body text-primary-500">
          GET A QUOTE
        </h3>
        <div className="flex flex-col items-center gap-y-2">
          <p className="text-lg font-light text-center font-body">
            Precision Repairs, One Click Away
            <span className="ml-1 font-medium cursor-pointer font-body text-primary-500">
              Discover Now!
            </span>
          </p>
          <p className="font-light text-center text-md font-body">
            Car Troubles?{" "}
            <button
              className="mr-1 font-medium cursor-pointer font-body text-md hover:underline text-primary-500"
              onClick={(event) => {
                event.preventDefault();
                router.push("/sign-up");
              }}
              type="button"
            >
              Sign up
            </button>
            and get a free check!
          </p>
        </div>
      </header>
      <div className="mt-5 mb-20 text-center md:mb-5">
        <button
          className="p-2 text-base text-white uppercase rounded-md bg-primary-500 font-body"
          id="book-now-cta"
          onClick={async (event) => {
            event.preventDefault();
            try {
              const session = await AuthenticationService.getSession();

              if (session) {
                const isCustomer = await AuthorizationService.checkIsCustomer();
                console.log("Is Customer", isCustomer);
                isCustomer
                  ? router.push("/customer/dashboard")
                  : router.push("/login");
              } else {
                router.push("/login");
              }
            } catch (error: any) {
              if (error.code === 401) {
                router.push("/login");
              }
            }
          }}
        >
          book now
        </button>
      </div>
    </section>
  );
};

export default Hero;
