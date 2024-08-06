import React from "react";
import { Accept, useDropzone } from "react-dropzone";
import Image from "next/image";
import dataURLToFile from "@/utils/functions/dataURLToFile";

function PictureUpload(
  { selected,
    setSelected,
    outterContainer,
    innerContainer,
    uploadMessage,
  }:
    {
      selected: any,
      setSelected: (data: any) => void,
      outterContainer: string,
      innerContainer: string,
      uploadMessage: string,
    }) {
  const onDrop = (acceptedFiles: any) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    if (file) {
      reader.onload = (e) => {
        setSelected(e.target?.result)
        // console.log(typeof dataURLToFile(e.target?.result, "image-vehile.png"))
        // console.log(e.target?.result);
      }
      // console.log(file);
      reader.readAsDataURL(file);
    } else {
      setSelected(null);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*" as unknown as Accept,
    onDrop,
  });

  return (
    <div className={`flex flex-col items-center ${outterContainer}`}>
      <div
        {...getRootProps()}
        className={`relative overflow-hidden bg-gray-300 ${innerContainer} cursor-pointer `}
      >
        {selected ? (
          <Image
            src={selected}
            alt="Profile"
            width={100}
            height={100}
            priority
            className="w-full h-full"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <span className="text-xs text-center text-secondary-300 font-body">{uploadMessage}</span>
          </div>
        )}
        <input {...getInputProps()} />
      </div>
    </div>
  );
}

export default PictureUpload;
