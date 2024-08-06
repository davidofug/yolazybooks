"use client";
import React, { Fragment, useEffect, useState } from "react";
import format from "date-fns/format";
import parseISO from "date-fns/parseISO";
import { BiSearch } from "react-icons/bi";
import TablePaginate from "@/components/Paginate";
import DatabaseService from "@/lib/services/database.service";
import environment from "@/environments/environment";
import Spinner from "@/components/Spinner";
import AppointmentModal from "@/components/modals/Appointment";
import { FaPhoneAlt } from "react-icons/fa";
import { Query } from "appwrite";
import { appwriteClient } from "@/appwrite/appwrite";

interface Appointment {
  $id: string;
}

function Vehicles() {
  const [itemsPerPage, setItemsPerPage] = useState<number>(8);
  const [loaderText, setLoaderText] = useState<string | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [show, setShow] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("");
  const [searchText, setSearchText] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [customerModal, setCustomerModal] = useState<boolean>(false);
  const [customerData, setCustomerData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalAppointments, setTotalAppointments] = useState<number>(0);
  const { appwriteDatabaseId, appwriteBookingsCollectionId } = environment;

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoaderText("Fetching Appointments");

      try {
        const { total: totalAppointments, documents: appointments } =
          await DatabaseService.listDocuments(
            appwriteDatabaseId,
            appwriteBookingsCollectionId,
            [
              Query.limit(itemsPerPage),
              Query.offset(itemsPerPage * (currentPage - 1)),
              Query.orderDesc("$createdAt"),
            ]
          );
        setTotalAppointments(() => totalAppointments);
        setAppointments(() => appointments);
      } catch (error) {
        console.log("Error: ", error);
      } finally {
        setLoading(() => false);
        setLoaderText(undefined);
      }
    };
    fetchAppointments();
    appwriteClient.subscribe(
      `databases.${appwriteDatabaseId}.collections.${appwriteBookingsCollectionId}.documents`,
      (response: any) => {
        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.create"
          )
        ) {
          setAppointments((previousAppointments: any[]) => {
            return [...previousAppointments, response.payload];
          });
          setTotalAppointments(
            (totalAppointments: number) => totalAppointments + 1
          );
        } else if (
          response.events.includes(
            "databases.*.collections.*.documents.*.update"
          )
        ) {
          setAppointments((previousAppointments: any[]) => {
            return previousAppointments.map((appointment: Appointment) => {
              return appointment.$id === response.payload.$id
                ? response.payload
                : appointment;
            });
          });
        } else if (
          response.events.includes(
            "databases.*.collections.*.documents.*.delete"
          )
        ) {
          setAppointments((previousGarages: any[]) => {
            return previousGarages.filter((appointment: Appointment) => {
              return appointment.$id !== response.payload.$id;
            });
          });
          setTotalAppointments(
            (totalAppointments: number) => totalAppointments - 1
          );
        }
      }
    );
  }, [itemsPerPage, currentPage]);

  let filteredAppointments: any = appointments;

  filteredAppointments = appointments?.filter((appointment) =>
    status === "all" || !status ? appointment : appointment.status === status
  );

  if (startDate) {
    filteredAppointments = filteredAppointments.filter(
      (appointment: any) => parseISO(appointment.bookingDate) >= startDate
    );
  }

  if (endDate) {
    filteredAppointments = filteredAppointments.filter(
      (appointment: any) => parseISO(appointment.bookingDate) <= endDate
    );
  }

  filteredAppointments =
    filteredAppointments && filteredAppointments.length > 0 && searchText
      ? filteredAppointments.filter(
          (appointment: any) =>
            appointment?.customer?.name &&
            appointment?.customer?.name
              .toLowerCase()
              .indexOf(searchText.toLowerCase()) > -1
        )
      : filteredAppointments;

  return (
    <div className="w-full h-full pb-5 pt-5 lg:pt-0 z-10 relative">
      {loading && <Spinner loaderText={loaderText} />}

      <h2 className="font-body text-lg font-bold py-1">Appointments</h2>
      {/* Filters */}
      <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 justify-between">
        <label
          className="flex w-fit relative justify-end items-center"
          htmlFor="search-input"
        >
          <input
            type="text"
            placeholder="Customer Name"
            id="search-input"
            className="w-full h-full py-2 pl-2 pr-10 rounded-md bg-white border-[0.5px] border-secondary-100/60 outline-none font-body text-sm font-light placeholder:text-secondary-100"
            onChange={(event) => {
              setSearchText(() => event.target.value);
            }}
          />
          <button className="absolute bg-secondary-50 px-1 h-full z-10 border-t-[0.5px] border-r-[0.5px] border-b-[0.5px] rounded-r-md border-secondary-100/60">
            <BiSearch size={20} />
          </button>
        </label>
        <div className="flex gap-x-5 gap-y-2 flex-wrap w-full md:w-fit">
          <div className="flex rounded-md border-[0.5px] border-secondary-100/60 overflow-hidden max-w-screen-sm">
            <input
              type="date"
              className="w-full px-2 py-1.5 bg-white outline-none  placeholder-secondary-200 text-sm font-light font-body"
            />
            <span className="px-4 text-secondary-600 bg-gray-100 h-full flex items-center justify-center">
              to
            </span>
            <input
              type="date"
              className="w-full px-2 py-1.5 bg-white outline-none placeholder-secondary-200 text-sm font-light font-body"
            />
          </div>
          <select
            name="status-input"
            id="status-input"
            className="block font-body text-sm font-light outline-none px-2 py-1.5 bg-white placeholder-secondary-200 border-[0.5px] border-secondary-100/60 rounded-md"
            onChange={(event) => {
              setStatus(() => event?.target.value);
            }}
          >
            <option disabled selected value="" className="font-secondary-200">
              Status
            </option>
            <option value="all">All</option>
            <option value="cancelled">Cancelled</option>
            <option value="honoured">Hornoured</option>
            <option value="pending">Pending</option>
          </select>
          <button
            className="px-2  text-primary-500 underline font-body text-base rounded outline-none"
            onClick={(event) => {
              event.preventDefault();
              setStatus(() => "");
              setStartDate(() => null);
              setEndDate(() => null);
              setSearchText(() => "");
              const searchInput = document.getElementById(
                "search-input"
              ) as HTMLInputElement;
              searchInput.value = "";
            }}
          >
            Reset All
          </button>
        </div>
      </div>
      <div className="py-5">
        {filteredAppointments && filteredAppointments?.length > 0 ? (
          <div className="overflow-x-scroll rounded-lg border border-gray-200 shadow-md">
            <table className="w-full border-collapse bg-white text-left text-sm text-gray-500 h-full">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-4 font-semibold text-secondary-900 uppercase font-body text-sm"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 font-semibold text-secondary-900 uppercase font-body text-sm"
                  >
                    Garage
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 font-semibold text-secondary-900 uppercase font-body text-sm"
                  >
                    Customer
                  </th>

                  <th
                    scope="col"
                    className="px-6 py-4 font-semibold text-secondary-900 uppercase font-body text-sm"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 border-t border-gray-100 ">
                {filteredAppointments?.map(
                  (appointment: any, index: number) => {
                    const dateFormat = "dd/MM/yyyy";
                    const timeFormat = "hh:mm aa";

                    return (
                      <Fragment key={appointment.$id}>
                        <tr
                          className="hover:bg-gray-50 cursor-pointer"
                          key={index}
                          onClick={(event) => {
                            event.preventDefault();
                            if (!show) {
                              setCustomerModal(() => true);
                              setCustomerData(() => appointment);
                              setActiveIndex(() => index);
                            } else {
                              event.stopPropagation();
                              setShow(() => false);
                              setCustomerModal(() => false);
                              setCustomerData(() => null);
                              setActiveIndex(() => null);
                            }
                          }}
                        >
                          <td className="flex gap-3 px-6 py-4 font-body text-black font-medium">
                            <div className="text-sm">
                              <div>
                                {appointment?.bookingDate
                                  ? format(
                                      parseISO(appointment.bookingDate),
                                      dateFormat
                                    )
                                  : "N/A"}
                              </div>
                              <div>
                                {appointment?.bookingTime
                                  ? format(
                                      new Date(
                                        `2000-01-01T${appointment.bookingTime}:00Z`
                                      ),
                                      timeFormat
                                    )
                                  : "N/A"}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-body flex flex-col gap-y-1">
                              <p className="font-medium text-black line-clamp-3">
                                {`${appointment?.garage?.name}`}
                              </p>
                              <div className="text-gray-400 flex gap-x-1 items-center">
                                <div>
                                  <FaPhoneAlt color="black" />
                                </div>
                                <div className="text-secondary-400">
                                  {appointment?.garage?.phone}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-body flex flex-col gap-y-1">
                              <p className="font-medium text-black line-clamp-3">
                                {appointment?.customer?.firstName}
                              </p>
                              <div className="text-gray-400 flex gap-x-1 items-center">
                                <div>
                                  <FaPhoneAlt color="black" />
                                </div>
                                <span className="text-secondary-400">
                                  {appointment?.customer?.phoneNumber}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold  capitalize ${
                                appointment?.status === "cancelled" ||
                                appointment?.status === "canceled"
                                  ? "bg-danger-50 text-danger-600"
                                  : appointment?.status === "honoured"
                                  ? "bg-success-50 text-success-600"
                                  : appointment?.status === "pending"
                                  ? "bg-warning-50 text-warning-500"
                                  : ""
                              }`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  appointment?.status === "cancelled" ||
                                  appointment?.status === "canceled"
                                    ? "bg-danger-600"
                                    : appointment?.status === "honoured"
                                    ? "bg-green-600"
                                    : appointment?.status === "pending"
                                    ? "bg-warning-500"
                                    : ""
                                }`}
                              ></span>
                              {appointment.status}
                            </span>
                          </td>
                        </tr>
                        {customerModal &&
                          customerData &&
                          activeIndex === index &&
                          !show && (
                            <AppointmentModal
                              setModalOpen={setCustomerModal}
                              data={customerData}
                              setData={setCustomerData}
                            />
                          )}
                      </Fragment>
                    );
                  }
                )}
              </tbody>
            </table>
            <div className="w-full bg-white px-3 flex justify-end h-fit items-center border-t-[0.5px] pb-5 border-secondary-50  ">
              <TablePaginate
                totalItems={totalAppointments}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
            </div>
          </div>
        ) : (
          !loading && (
            <div className="flex justify-center items-center flex-col absolute h-4/6 md:h-5/6 lg:h-5/6 w-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                data-name="Layer 1"
                className="h-24 w-24"
                viewBox="0 0 647.63626 632.17383"
              >
                <path
                  d="M687.3279,276.08691H512.81813a15.01828,15.01828,0,0,0-15,15v387.85l-2,.61005-42.81006,13.11a8.00676,8.00676,0,0,1-9.98974-5.31L315.678,271.39691a8.00313,8.00313,0,0,1,5.31006-9.99l65.97022-20.2,191.25-58.54,65.96972-20.2a7.98927,7.98927,0,0,1,9.99024,5.3l32.5498,106.32Z"
                  transform="translate(-276.18187 -133.91309)"
                  fill="#f2f2f2"
                />
                <path
                  d="M725.408,274.08691l-39.23-128.14a16.99368,16.99368,0,0,0-21.23-11.28l-92.75,28.39L380.95827,221.60693l-92.75,28.4a17.0152,17.0152,0,0,0-11.28028,21.23l134.08008,437.93a17.02661,17.02661,0,0,0,16.26026,12.03,16.78926,16.78926,0,0,0,4.96972-.75l63.58008-19.46,2-.62v-2.09l-2,.61-64.16992,19.65a15.01489,15.01489,0,0,1-18.73-9.95l-134.06983-437.94a14.97935,14.97935,0,0,1,9.94971-18.73l92.75-28.4,191.24024-58.54,92.75-28.4a15.15551,15.15551,0,0,1,4.40966-.66,15.01461,15.01461,0,0,1,14.32032,10.61l39.0498,127.56.62012,2h2.08008Z"
                  transform="translate(-276.18187 -133.91309)"
                  fill="#3f3d56"
                />
                <path
                  d="M398.86279,261.73389a9.0157,9.0157,0,0,1-8.61133-6.3667l-12.88037-42.07178a8.99884,8.99884,0,0,1,5.9712-11.24023l175.939-53.86377a9.00867,9.00867,0,0,1,11.24072,5.9707l12.88037,42.07227a9.01029,9.01029,0,0,1-5.9707,11.24072L401.49219,261.33887A8.976,8.976,0,0,1,398.86279,261.73389Z"
                  transform="translate(-276.18187 -133.91309)"
                  fill="#ef5427"
                />
                <circle cx="190.15351" cy="24.95465" r="20" fill="#ef5427" />
                <circle cx="190.15351" cy="24.95465" r="12.66462" fill="#fff" />
                <path
                  d="M878.81836,716.08691h-338a8.50981,8.50981,0,0,1-8.5-8.5v-405a8.50951,8.50951,0,0,1,8.5-8.5h338a8.50982,8.50982,0,0,1,8.5,8.5v405A8.51013,8.51013,0,0,1,878.81836,716.08691Z"
                  transform="translate(-276.18187 -133.91309)"
                  fill="#e6e6e6"
                />
                <path
                  d="M723.31813,274.08691h-210.5a17.02411,17.02411,0,0,0-17,17v407.8l2-.61v-407.19a15.01828,15.01828,0,0,1,15-15H723.93825Zm183.5,0h-394a17.02411,17.02411,0,0,0-17,17v458a17.0241,17.0241,0,0,0,17,17h394a17.0241,17.0241,0,0,0,17-17v-458A17.02411,17.02411,0,0,0,906.81813,274.08691Zm15,475a15.01828,15.01828,0,0,1-15,15h-394a15.01828,15.01828,0,0,1-15-15v-458a15.01828,15.01828,0,0,1,15-15h394a15.01828,15.01828,0,0,1,15,15Z"
                  transform="translate(-276.18187 -133.91309)"
                  fill="#3f3d56"
                />
                <path
                  d="M801.81836,318.08691h-184a9.01015,9.01015,0,0,1-9-9v-44a9.01016,9.01016,0,0,1,9-9h184a9.01016,9.01016,0,0,1,9,9v44A9.01015,9.01015,0,0,1,801.81836,318.08691Z"
                  transform="translate(-276.18187 -133.91309)"
                  fill="#ef5427"
                />
                <circle cx="433.63626" cy="105.17383" r="20" fill="#ef5427" />
                <circle
                  cx="433.63626"
                  cy="105.17383"
                  r="12.18187"
                  fill="#fff"
                />
              </svg>
              <span className="text-secondary-500 font-body font-semibold text-base mt-3 capitalize">
                {!appointments || appointments?.length === 0
                  ? "No appointments yet"
                  : "No appointments found"}
              </span>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default Vehicles;
