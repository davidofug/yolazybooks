import React from "react";

//   &:after {
//         width: 4vmax;
//         height: 4vmax;
//         top: calc(50 % - 2vmax);
//         left: calc(50 % - 2vmax);
//         border: 0;
//         border - right: 2px solid #ffffff;
//         animation: none;
//     }
// }
interface ModalProps {
  isVisible: boolean;
}

const Spinner: React.FC<ModalProps> = ({ isVisible }) => {
  return (
    <div
      className={`${
        isVisible
          ? "w-screen h-screen absolute bg-transparent flex justify-center items-center"
          : "hidden"
      }`}
    >
      <div className="absolute flex flex-col items-center justify-center w-40 h-40 bg-white rounded-md shadow ">
        <div className="absolute w-8 h-8 transform -translate-x-1/2 -translate-y-1/2 border-l-2 rounded-full border-primary-500 animate-spinLeft"></div>
      </div>
    </div>
  );
};

export default Spinner;
