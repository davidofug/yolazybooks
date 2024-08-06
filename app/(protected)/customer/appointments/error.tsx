'use client'
import React from "react"
import { BiError } from "react-icons/bi";

export default function Error({ error, reset }: { error: Error, reset: () => void }) {
  React.useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className=" w-full h-full flex justify-center items-center">
      <div className=" w-1/2 h-1/2 rounded-md p-5">
        <div className=" flex flex-col items-center justify-center">
          <BiError size={50} className=" fill-primary-500" />
          <h1 className=" font-heading text-2xl text-primary-500 mb-2">OOPS!</h1>
          <p className="font-body text-center">Something went wrong, check your network connection and try again</p>
          <button className="font-heading border border-primary-500 p-2 rounded-lg text-primary-500 mt-2" onClick={reset}>Try again</button>
        </div>
      </div>
    </div>
  )
}