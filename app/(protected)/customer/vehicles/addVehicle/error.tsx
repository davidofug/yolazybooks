'use client'
import React from "react"
// import { BiLeftArrow } from "react-icons/bi";

export default function Error({ error, reset }: { error: Error, reset: () => void }) {
  React.useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className=" w-full h-full flex content-center items-center">
      <div className=" w-1/2 h-1/2 rounded-md p-5">
        {/* <div className=" flex items-center">
          <BiLeftArrow size={25} onClick={reset} />
          <div></div>
        </div> */}
        <div>
          <h1 className=" font-heading text-lg">OOPS!</h1>
          <p>Something went wrong, check your network connect and try again</p>
          <button onClick={reset}></button>
        </div>
      </div>
    </div>
  )
}