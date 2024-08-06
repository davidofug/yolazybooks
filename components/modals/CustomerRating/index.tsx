"useClient";
import { useRef } from "react";
import { BsStarFill, BsStar } from "react-icons/bs";

interface AppointmentsRatingModalProps {
  setModalOpen: (show: boolean) => void;
  setData: (data: any) => void;
  data: any;
}

const AppointmentRatingModal: React.FC<AppointmentsRatingModalProps> = ({
  data,
  setModalOpen,
  setData,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div className="h-screen w-screen bg-black/20 bg-opacity-40 fixed top-0 left-0 bottom-0 right-0 z-20 flex justify-center items-center overflow-hidden">
      <div
        className="bg-white rounded-md w-11/12 md:w-9/12 lg:w-6/12 h-3/4 md:h-fit overflow-x-hidden relative px-5 py-5 overflow-y-auto"
        onClick={(event) => event.stopPropagation()}
        ref={ref}
      >
        <div className="flex justify-end items-center">
          <button
            onClick={() => {
              setModalOpen(false);
              // setData(null);
            }}
            className="text-secondary-black font-body"
          >
            <span className="sr-only">Close</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="flex flex-col gap-y-5">
          <h2 className="font-semibold text-secondary-800 uppercase text-sm">
            Feedback
          </h2>
          <div className="flex flex-col gap-y-1">
            <h3 className="font-semibold text-secondary-800 font-body text-sm">
              Rating
            </h3>
            <div className="flex gap-x-1">
              {Array(5)
                .fill(0)
                .map((_, index) =>
                  index < data.value ?? 0 ? (
                    <BsStarFill
                      className="text-warning-500"
                      size={15}
                      key={index}
                    />
                  ) : (
                    <BsStar
                      className="text-warning-500"
                      size={15}
                      key={index}
                    />
                  )
                )}
            </div>
          </div>

          <div className="flex flex-col gap-y-1">
            <h3 className="font-semibold text-secondary-800 font-body text-sm">
              Comment
            </h3>
            <p className="w-full rounded-md outline-none font-body text-sm text-secondary-800 resize-none">
              {data.comment}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentRatingModal;
