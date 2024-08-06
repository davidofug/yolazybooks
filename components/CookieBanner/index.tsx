"use client";

import Link from "next/link";
import { getLocalStorage, setLocalStorage } from "@/lib/helpers/storageHelpers";
import { useState, useEffect, useCallback } from "react";

const CookieBanner = () => {
  const [cookieConsent, setCookieConsent] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const storedConsent = getLocalStorage("cookie_consent", null);
    console.log("Stored Consent: ", storedConsent);
    setShowBanner(() => storedConsent === null);
    if (cookieConsent !== null) {
      setLocalStorage("cookie_consent", cookieConsent);
      setShowBanner(false);
    }
    const newValue = storedConsent || cookieConsent ? "granted" : "denied";
    window.gtag("consent", "update", {
      analytics_storage: newValue,
    });
  }, [cookieConsent]);

  return (
    <div
      className={`my-10 sm:mx-auto max-w-max md:max-w-screen-sm fixed bottom-0 left-0 right-0 mx-2 px-3 md:px-6 py-5 justify-between items-center flex-col gap-2  
        bg-white rounded-lg shadow font-body font-light z-30 leading-5 text-sm ${
          showBanner ? "flex" : "hidden"
        } 
        `}
    >
      <div className="flex justify-end w-full">
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
          }}
          className="w-fit"
        >
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 1024 1024"
            fillRule="evenodd"
            className="w-4 h-4"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M799.855 166.312c.023.007.043.018.084.059l57.69 57.69c.041.041.052.06.059.084a.118.118 0 0 1 0 .069c-.007.023-.018.042-.059.083L569.926 512l287.703 287.703c.041.04.052.06.059.083a.118.118 0 0 1 0 .07c-.007.022-.018.042-.059.083l-57.69 57.69c-.041.041-.06.052-.084.059a.118.118 0 0 1-.069 0c-.023-.007-.042-.018-.083-.059L512 569.926 224.297 857.629c-.04.041-.06.052-.083.059a.118.118 0 0 1-.07 0c-.022-.007-.042-.018-.083-.059l-57.69-57.69c-.041-.041-.052-.06-.059-.084a.118.118 0 0 1 0-.069c.007-.023.018-.042.059-.083L454.073 512 166.371 224.297c-.041-.04-.052-.06-.059-.083a.118.118 0 0 1 0-.07c.007-.022.018-.042.059-.083l57.69-57.69c.041-.041.06-.052.084-.059a.118.118 0 0 1 .069 0c.023.007.042.018.083.059L512 454.073l287.703-287.702c.04-.041.06-.052.083-.059a.118.118 0 0 1 .07 0Z"></path>
          </svg>
        </button>
      </div>
      <p className="text-start">
        We use thirdparty{" "}
        <span className="text-primary-500 font-semibold">cookies</span> on our
        site to provide you with the best possible user experience. They also
        allow us to analyse user behaviour in order to constantly improve the
        website for you.{" "}
        <Link
          href="#"
          className="underline text-primary-500 capitalize font-regular cursor-pointer font-medium"
        >
          Privacy policy
        </Link>
      </p>

      <div className="flex gap-2 w-full justify-start">
        <button
          id="accept-cookies-cta"
          className="bg-primary-500 px-4 py-2 text-white rounded-full font-body cursro-pointer font-normal"
          type="button"
          onClick={(event) => {
            event.preventDefault();
            setCookieConsent(true);
          }}
        >
          Accept All
        </button>
        <button
          id="decline-cookies-cta"
          className="bg-secondary-900 px-4 py-2 text-white rounded-full font-body cursor-pointer font-normal"
          type="button"
          onClick={(event) => {
            event.preventDefault();
            setCookieConsent(false);
          }}
        >
          Decline All
        </button>
      </div>
    </div>
  );
};

export default CookieBanner;
