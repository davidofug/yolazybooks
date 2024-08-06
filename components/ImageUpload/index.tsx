import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

interface ImageUploadProps {
  inputStyles: string;
  urlRef: string;
  setFieldValue: any;
  fileRef: string;
  handleBlur?: any;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  inputStyles,
  urlRef,
  setFieldValue,
  fileRef,
  handleBlur,
}) => {
  const [selectedFile, setSelectedFile] = useState();

  useEffect(() => {
    if (!selectedFile) {
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setFieldValue(urlRef, objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile, urlRef, setFieldValue]);

  const onFileSelect = (event: any) => {
    if (!event.target.files[0] || event.target.files.length === 0) {
      setSelectedFile(undefined);
    } else {
      if (event.target.files[0].size > 3145728) {
        toast.error(() => (
          <div className="font-body font-light text-base w-full flex start">
            Image is too big
          </div>
        ));
      }

      setSelectedFile(event.target.files[0]);
      setFieldValue(fileRef, event.currentTarget.files[0]);
    }
  };

  return (
    <input
      type="file"
      accept=".png, .jpg, .jpeg"
      name={urlRef}
      id={urlRef}
      className={inputStyles}
      onChange={onFileSelect}
      onBlur={handleBlur}
    />
  );
};

export default ImageUpload;
