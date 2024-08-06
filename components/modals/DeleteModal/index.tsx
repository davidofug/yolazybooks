import React from "react";

import { CiWarning } from "react-icons/ci";
interface DeleteProps {
  isVisible: boolean;
  setVisible: (data: boolean) => void;
  handleDelete: () => void;
}

const Index: React.FC<DeleteProps> = ({
  isVisible,
  setVisible,
  handleDelete,
}) => {
  const modelTrue =
    "top-12 visible transform -translate-x-2/4 -trnaslate-y-2/4 scale-100";
  const modelFalse =
    "top-0 invisible transform -translate-x-2/4 -trnaslate-y-2/4 scale-50";

  return (
    <div className={`absolute w-4/5 p-1 top-20 md:top-1/4 md:w-1/4 bg-white rounded-md left-2/4 pl-5 pr-5 ${isVisible ? modelTrue : modelFalse} z-20 h-fit`}>
      <div className="flex flex-col items-center pt-1 bg-white rounded-lg h-fit">
        <div className="flex items-center justify-center p-2 rounded-full h-14 w-14 bg-danger-100 mb-2">
          <CiWarning size={50} className=" fill-danger-500" />
        </div>
        <h1 className="font-semibold text-center font-body mb-2">Are you sure?</h1>
        <div className="border-b border-secondary-100">
          <p className="text-center opacity-50 font-body mb-2" >
            This action cannot be undone.
            All information associated with this vehicle will be lost.
          </p>
        </div>
        <div className="flex w-full items-center justify-between pt-2 pb-2">
          <button
            className="w-1/5 rounded-md text-danger-500 font-body "
            onClick={() => {
              handleDelete();
              setVisible(!isVisible);
            }}
          >
            Delete
          </button>
          <button
            className="w-1/5  rounded-md text-danger-500 font-body"
            onClick={() => {
              setVisible(!isVisible);
            }}
          >
            Cancel
          </button>
        </div>
      </div>

    </div>
  );
};

export default Index;
