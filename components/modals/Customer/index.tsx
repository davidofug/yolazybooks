"useClient";
import { useRef, useState, Fragment } from "react";
import { FaPhoneAlt } from "react-icons/fa";
import TablePaginate from "@/components/Paginate";
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
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const indexOfLastVehicle = currentPage * itemsPerPage;
  const indexOfFirstVehicle = indexOfLastVehicle - itemsPerPage;
  const currentVehicles =
    data.vehicles && data.vehicles.length > 0
      ? data.vehicles.slice(indexOfFirstVehicle, indexOfLastVehicle)
      : null;

  const dateFormat = "dd MMM yyyy";
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 z-20 flex items-center justify-center w-screen h-screen overflow-hidden bg-black/20 bg-opacity-40">
      <div
        className="relative w-11/12 px-5 py-5 overflow-x-hidden overflow-y-auto bg-white rounded-md md:w-9/12 lg:w-6/12 h-5/6"
        onClick={(event) => event.stopPropagation()}
        ref={ref}
      >
        <div className="flex items-center justify-end">
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
        <div className="flex gap-x-2">
          <div
            className={`relative h-32 w-32 rounded-full border-[0.5px] shadow flex justify-center items-center font-body text-secondary-500 font-h3 text-h3 font-light ${
              data?.status === "active"
                ? "border-success-400"
                : data?.status === "suspended"
                ? "border-danger-400"
                : "border-warning-400"
            }`}
          >
            {data?.avatarUrl ? (
              <Image
                src={data?.avatarUrl}
                alt="logo"
                className="object-cover object-center w-full h-full border border-red-500 rounded-full"
                height={50}
                width={50}
                quality={100}
              />
            ) : (
              data?.firstName?.[0] ?? "N/A"
            )}
          </div>
          <div className="flex flex-col justify-end text-sm gap-x-2 gap-y-2">
            <div className="flex flex-col h-fit">
              <p className="text-lg font-medium text-secondary-700">
                {data?.firstName ?? "Not specified yet"}
              </p>
              <div className="flex items-center text-gray-400 cursor-pointer gap-x-1 font-body">
                <div>
                  <FaPhoneAlt color="black" />
                </div>
                <div className="text-base text-secondary-400 font-body">
                  {data?.phoneNumber ?? ""}
                </div>
              </div>
            </div>
            <div className="flex gap-x-2">
              {data?.email && (
                <div className="flex flex-col">
                  <p className="text-sm font-semibold text-secondary-900 font-body">
                    Email
                  </p>
                  <p className="text-sm font-body text-secondary-700">
                    {data?.email ?? ""}
                  </p>
                </div>
              )}
              {data?.address && (
                <div className="flex flex-col">
                  <p className="text-sm font-semibold text-secondary-900 font-body">
                    Address
                  </p>
                  <p className="text-sm font-body text-secondary-700">
                    {data?.address ?? ""}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex mt-5 gap-x-2"></div>

        {/* vehicle Vehicles */}
        <div className="">
          <h2 className="my-2 text-sm font-semibold uppercase font-body text-secondary-900">
            Customer Vehicles
          </h2>
          {data?.vehicles && data?.vehicles?.length > 0 ? (
            <div className="overflow-x-scroll border border-gray-200 rounded-lg shadow-md">
              <table className="w-full h-full text-sm text-left text-gray-500 bg-white border-collapse">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-4 text-sm font-semibold uppercase text-secondary-900 font-body"
                    >
                      vehicle
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-sm font-semibold uppercase text-secondary-900 font-body"
                    >
                      Model
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-sm font-semibold uppercase text-secondary-900 font-body"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-sm font-semibold uppercase text-secondary-900 font-body"
                    >
                      Licence plate
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-sm font-semibold uppercase text-secondary-900 font-body"
                    >
                      Mileage
                    </th>
                  </tr>
                </thead>
                <tbody className="border-t border-gray-100 divide-y divide-gray-100 ">
                  {currentVehicles &&
                    currentVehicles?.length > 0 &&
                    currentVehicles.map((vehicle: any, index: number) => {
                      return (
                        <Fragment key={index}>
                          <tr
                            className="cursor-pointer hover:bg-gray-50"
                            onClick={(event) => {
                              event.preventDefault();
                            }}
                          >
                            <td className="px-6 py-4 font-normal text-gray-900">
                              <div className="flex gap-x-2">
                                <div className="relative w-16 h-16 overflow-hidden">
                                  <Image
                                    className="object-cover object-center w-full h-full rounded"
                                    src={vehicle?.carType?.logoUrl}
                                    width={64}
                                    height={64}
                                    alt="N/A"
                                  />
                                </div>
                                <div className="inline-flex flex-col justify-center text-sm">
                                  <div className="font-medium text-gray-700">
                                    {vehicle?.name}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="font-medium text-black font-body">
                                {vehicle?.model}
                              </span>
                            </td>
                            <td className="px-6 py-4 font-medium text-black font-body">
                              <span className="text-sm">
                                {format(
                                  parseISO(vehicle.$createdAt),
                                  dateFormat
                                )}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="font-medium text-black font-body">
                                {vehicle?.licensePlate}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="font-medium text-black font-body">
                                {`${
                                  vehicle?.mileage
                                    ? `${vehicle?.mileage} mi`
                                    : "N/A"
                                }`}
                              </span>
                            </td>
                          </tr>
                        </Fragment>
                      );
                    })}
                </tbody>
              </table>
              <div className="w-full bg-white px-3 flex justify-end h-fit items-center border-t-[0.5px] pb-5 border-secondary-50  ">
                <TablePaginate
                  totalItems={data?.vehicles?.length ?? 0}
                  itemsPerPage={itemsPerPage}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                />
              </div>
            </div>
          ) : <span className="text-sm font-body text-secondary-500">No vechicles added yet</span>}
        </div>
      </div>
    </div>
  );
};

export default VehicleModal;
