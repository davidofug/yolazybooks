"useClient";
import { useRef } from "react";
import format from "date-fns/format";
import parseISO from "date-fns/parseISO";
import Image from "next/image";

interface VehicleModalProps {
  setModalOpen: (show: boolean) => void;
  setData: (data: any) => void;
  data?: any;
}

const VehicleModal: React.FC<VehicleModalProps> = ({
  data,
  setModalOpen,
  setData,
}) => {
  console.log("Vehicle: ", data)
  const dateFormat = "dd MMM yyyy";
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div className="h-screen w-screen bg-black/20 bg-opacity-40 fixed top-0 left-0 bottom-0 right-0 z-20 flex justify-center items-center overflow-hidden">
      <div
        className="bg-white rounded-md w-11/12 md:w-9/12 lg:w-6/12 h-fit overflow-x-hidden relative px-5 py-5 overflow-y-auto"
        onClick={(event) => event.stopPropagation()}
        ref={ref}
      >
        <div className="flex justify-end items-center">
          <button
            onClick={() => {
              setModalOpen(false);
              setData(null);
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
        {/* vehicle Details */}
        <div className="flex flex-col gap-x-2">
          <div
            className={`relative h-20 w-20  mb-2 rounded-md flex justify-center items-center font-body text-secondary-500 font-h3 text-h3 font-light`}
          >
            {data?.carType?.logoUrl ? (
              <Image
                src={data?.carType?.logoUrl}
                alt="logo"
                className="w-full object-cover object-center "
                height={50}
                width={50}
                quality={100}
              />
            ) : (
              data?.firstName?.[0] ?? "N/A"
            )}
          </div>
          <div className="text-sm flex flex-col gap-x-2 gap-y-2">
            <div className="text-sm inline-flex flex-col justify-center">
              <div className="font-medium text-gray-900">Vehicle Brand</div>
              <div className="text-gray-400 flex gap-x-1 items-center">
                <div className="text-secondary-400">
                  {data?.carType?.name ?? "Not specified yet"}
                </div>
              </div>
            </div>
            <div className="text-sm inline-flex flex-col justify-center">
              <div className="font-medium text-gray-900">License Plate No</div>
              <div className="text-gray-400 flex gap-x-1 items-center">
                <div className="text-secondary-400">{data?.licensePlate}</div>
              </div>
            </div>
          </div>
        </div>

        {/* vehicle Vehicles */}
        <div className="">
          <h2 className="mt-5 mb-2 font-body text-sm font-semibold text-secondary-900 uppercase">
            Third Party Details
          </h2>
          <div className="text-sm flex flex-col gap-x-2 gap-y-2">
            <div className="text-sm inline-flex flex-col justify-center">
              <div className="font-medium text-gray-900">Company Name</div>
              <div className="text-gray-400 flex gap-x-1 items-center">
                <div className="text-secondary-400">
                  {data?.third_party_details?.companyName ?? "N/A"}
                </div>
              </div>
            </div>
            <div className="text-sm inline-flex flex-col justify-center">
              <div className="font-medium text-gray-900">Purchase Date</div>
              <div className="text-gray-400 flex gap-x-1 items-center">
                <div className="text-secondary-400">
                  {data?.third_party_details?.purchaseDate
                    ? format(
                        parseISO(data?.third_party_details?.purchaseDate),
                        dateFormat
                      )
                    : "N/A"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleModal;
