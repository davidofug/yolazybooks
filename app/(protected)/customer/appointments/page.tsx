"use client";

import React from "react";
import { RiHonorOfKingsFill } from "react-icons/ri";
import { FaPhoneAlt } from "react-icons/fa";
import { TiCancel } from "react-icons/ti";
import Image from "next/image";
import { format, parseISO } from "date-fns";
import { database } from "@/appwrite/appwrite";
import environment from "@/environments/environment";
import { BsStar, BsStarFill } from "react-icons/bs";
import RatingsFeedbackModal from "@/components/modals/AppointmentFeedback";
import { appwriteClient } from "@/appwrite/appwrite";
import { Query } from "appwrite";
import TablePaginate from "@/components/Paginate";

interface Appointment {
  $id: string;
}

export default function Page(): JSX.Element {
  const { appwriteDatabaseId, appwriteBookingsCollectionId } = environment;
  const [pendingAppointments, setPendingAppointments] =
    React.useState<number>(0);
  const [cancelledAppointments, setCancelledAppointments] =
    React.useState<number>(0);
  const [honouredAppointments, setHonouredAppointments] =
    React.useState<number>(0);
  const [appointments, setAppointments] = React.useState<any>([]);
  const [selectedAppointment, setSelectedAppointment] = React.useState<any>();
  const [totalAppointments, setTotalAppointments] = React.useState<number>(0);
  const [itemsPerPage, setItemsPerPage] = React.useState<number>(5);
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [showFeedbackModal, setShowFeedbackModal] =
    React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [loaderText, setLoaderText] = React.useState<string>("");
  const dateFormat = "dd MMM yyyy";
  const timeFormat = "hh:mm aa";

  const fetchPendingAppointments = async () => {
    try {
      const { total: totalPendingAppointments } = await database.listDocuments(
        appwriteDatabaseId,
        appwriteBookingsCollectionId,
        [Query.equal("status", "pending")]
      );
      setPendingAppointments(totalPendingAppointments);
    } catch (error: any) {
      console.log(JSON.stringify(error, null, 2));
    }
  };

  const fetchCancelledAppointments = async () => {
    try {
      const { total: totalCancelledAppointments } =
        await database.listDocuments(
          appwriteDatabaseId,
          appwriteBookingsCollectionId,
          [Query.equal("status", "cancelled")]
        );
      setCancelledAppointments(totalCancelledAppointments);
    } catch (error: any) {
      console.log(JSON.stringify(error, null, 2));
    }
  };

  const fetchHonouredAppointments = async () => {
    try {
      const { total: totalHonouredAppointments } = await database.listDocuments(
        appwriteDatabaseId,
        appwriteBookingsCollectionId,
        [Query.equal("status", "honoured")]
      );

      setHonouredAppointments(totalHonouredAppointments);
    } catch (error: any) {
      console.log(JSON.stringify(error, null, 2));
    }
  };

  const fetchLatestAppointment = async () => {
    const { documents } = await database.listDocuments(
      appwriteDatabaseId,
      appwriteBookingsCollectionId,
      [Query.limit(1), Query.offset(0), Query.orderDesc("$createdAt")]
    );
    setSelectedAppointment(documents[0]);
  };

  // const { appwrite } = environment;
  const fetchAppointmentData = async () => {
    try {
      const { total, documents } = await database.listDocuments(
        appwriteDatabaseId,
        appwriteBookingsCollectionId,
        [
          Query.limit(itemsPerPage),
          Query.offset(itemsPerPage * (currentPage - 1)),
          Query.orderDesc("$createdAt"),
        ]
      );

      setAppointments(documents);
      setTotalAppointments(total);
    } catch (error) {
      console.log(JSON.stringify(error, null, 2));
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    setLoading(true);
    fetchPendingAppointments();
    fetchCancelledAppointments();
    fetchHonouredAppointments();
    fetchAppointmentData();
    if (!selectedAppointment) {
      fetchLatestAppointment();
    }
    appwriteClient.subscribe(
      `databases.${appwriteDatabaseId}.collections.${appwriteBookingsCollectionId}.documents`,
      (response: any) => {
        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.create"
          )
        ) {
          console.log("A new garage was created");
          setAppointments((previousAppointments: any[]) => {
            return [...previousAppointments, response.payload];
          });
          setSelectedAppointment(response.payload);
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
          if (response.payload.$id === selectedAppointment.$id) {
            setSelectedAppointment((currentAppointment: Appointment) => ({
              ...currentAppointment,
              ...response.payload,
            }));
          }
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
        }
      }
    );
  }, [itemsPerPage, currentPage]);

  return (
    <div className="flex flex-col w-full gap-y-5 mt-5">
      {/* The tree appointments card displaying numbers of appointments  */}
      {showFeedbackModal && (
        <RatingsFeedbackModal
          data={selectedAppointment}
          setModalOpen={setShowFeedbackModal}
          setData={setSelectedAppointment}
        />
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 w-full gap-5 lg:items-center">
        <div className="flex justify-center p-2 border rounded-md border-secondary-50 h-28 w-full">
          <div className="flex flex-col items-center justify-around">
            <h1 className="text-3xl font-body text-primary-500">
              {totalAppointments}
            </h1>
            <h3 className="text-sm font-bold text-center font-body text-primary-500">
              Total Appointments
            </h3>
          </div>
        </div>
        <div className="flex justify-center p-2 border rounded-md border-secondary-50 h-28 w-full">
          <div className="flex flex-col items-center justify-around">
            <h1 className="text-3xl font-body text-warning-500">
              {pendingAppointments}
            </h1>
            <h3 className="text-sm font-bold text-center font-body text-warning-500 px-10 capitalize">
              Pending Appointments
            </h3>
          </div>
        </div>
        <div className="hidden w-full rounded-lg shadow md:flex h-28">
          <div className="flex items-center justify-center w-2/5 bg-success-600">
            <RiHonorOfKingsFill className="w-12 h-12 fill-white" />
          </div>
          <div className="flex flex-col items-center justify-around w-3/5">
            <h1 className="text-3xl font-body">{honouredAppointments}</h1>
            <h3 className="text-xs text-center font-body opacity-40 px-5 capitalize">
              honoured Appointments
            </h3>
          </div>
        </div>
        <div className="hidden w-full rounded-md shadow md:flex h-28">
          <div className="flex items-center justify-center w-2/5 bg-danger-500">
            <TiCancel className="w-12 h-12 fill-white" />
          </div>
          <div className="flex flex-col items-center justify-around w-3/5">
            <h1 className="text-3xl font-body">{cancelledAppointments}</h1>
            <h3 className="text-xs text-center opacity-50 font-body px-5 capitalize">
              Canceled Appointments
            </h3>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6 md:flex-row">
        {/* Appointment display section  */}
        <div
          className={`w-full p-2 border border-secondary-50 rounded-md md:w-1/2 divide-y-[0.5px] ${
            selectedAppointment?.status === "rejected"
              ? "divide-danger-600"
              : selectedAppointment?.status === "honoured"
              ? "divide-success-600"
              : selectedAppointment?.status === "pending"
              ? "divide-warning-600"
              : ""
          }`}
        >
          <div className={` flex items-center justify-between w-full `}>
            <h2 className="font-body text-sm font-semibold uppercase py-4">
              Appointment details
            </h2>
            <div className="flex items-center gap-1">
              <p className="text-sm font-body font-semibold">Status</p>
              <span
                className={`${
                  selectedAppointment?.status === "rejected"
                    ? "bg-danger-600"
                    : selectedAppointment?.status === "honoured"
                    ? "bg-success-600"
                    : selectedAppointment?.status === "pending"
                    ? "bg-warning-600"
                    : ""
                } w-2 h-2 rounded-full`}
              ></span>
            </div>
          </div>

          {/* Garage and car information  */}
          <div className="flex flex-col">
            <div className="flex flex-col gap-x-2 ">
              <h2 className="font-body font-semibold text-sm uppercase text-secondary-800 pt-2 py-1">
                garage details
              </h2>
              <div
                className={`relative h-20 w-20  mb-2 rounded-md flex justify-center items-center font-body text-secondary-500 font-h3 text-h3 font-light`}
              >
                {selectedAppointment?.garage?.logoUrl ? (
                  <Image
                    src={selectedAppointment?.garage?.logoUrl}
                    alt="logo"
                    className="w-full object-cover object-center "
                    height={50}
                    width={50}
                    quality={100}
                  />
                ) : (
                  selectedAppointment?.garage?.name?.[0] ?? "N/A"
                )}
              </div>
              <div className="text-sm font-body flex flex-col gap-y-1">
                <p className="font-medium text-black line-clamp-3">
                  {`${selectedAppointment?.garage?.name}`}
                </p>
                <div className="text-gray-400 flex gap-x-1 items-center">
                  <div>
                    <FaPhoneAlt color="black" />
                  </div>
                  <div className="text-secondary-400">
                    {selectedAppointment?.garage?.phone}
                  </div>
                </div>
              </div>
            </div>

            <div className="text-sm font-body flex flex-col gap-x-1 gap-y-2 ">
              <h3 className="font-semibold text-secondary-800">Date & Time</h3>
              <div className="text-sm flex gap-x-2 uppercase ">
                <p className="text-secondary-400">
                  {selectedAppointment?.bookingDate
                    ? format(
                        parseISO(selectedAppointment.bookingDate),
                        dateFormat
                      )
                    : "N/A"}
                </p>
                <span className="font-semibold text-secondary-800">at</span>
              </div>
            </div>
            <div className="text-sm font-body flex flex-col gap-x-1 gap-y-2 ">
              <h3 className="font-semibold text-secondary-800">Vehicles</h3>
              <div className="text-sm flex gap-x-2 uppercase w-full overflow-x-auto overflow-y-hidden">
                {selectedAppointment?.vehicles &&
                  selectedAppointment.vehicles.map((vehicle: any) => {
                    return (
                      <div
                        className="flex gap-x-2 flex-col gap-y-1 justify-between"
                        key={vehicle.$id}
                      >
                        <div className="relative w-16 overflow-hidden">
                          <Image
                            className="h-full w-full object-cover object-center"
                            src={`${vehicle.carType.logoUrl}`}
                            width={50}
                            height={20}
                            alt=""
                            key={vehicle?.carType?.logoField}
                          />
                        </div>
                        <p className="font-medium text-gray-700 text-center font-body capitalize object-contain">
                          {vehicle?.licensePlate}
                        </p>
                      </div>
                    );
                  })}
              </div>
            </div>
            {selectedAppointment?.status !== "pending" && (
              <div className="py-1 flex flex-col justify-end gap-y-1">
                <h2 className="text-sm font-body font-semibold">Feedback</h2>
                <div className="flex gap-x-1">
                  {selectedAppointment?.rating?.value ? (
                    Array(5)
                      .fill(0)
                      .map((_, index) => (
                        <>
                          {index < selectedAppointment.rating.value ? (
                            <BsStarFill
                              className="text-warning-500"
                              size={15}
                            />
                          ) : (
                            <BsStar className="text-warning-500" size={15} />
                          )}
                        </>
                      ))
                  ) : (
                    <div className="flex gap-x-1 flex-wrap">
                      <p className="font-body font-light text-sm">
                        Do you have any feedback about the appointment?
                      </p>

                      <button
                        type="button"
                        className="font-body text-secondary text-sm text-primary-500 cursor-pointer rounded"
                        onClick={(
                          event: React.MouseEvent<HTMLButtonElement>
                        ) => {
                          event.preventDefault();
                          setShowFeedbackModal(true);
                        }}
                      >
                        Provide Feedback
                      </button>
                    </div>
                  )}
                </div>
                <p className="font-body font-light text-sm line-clamp-3 h-14 overflow-hidden">
                  {selectedAppointment?.rating?.comment}
                </p>
              </div>
            )}
          </div>
        </div>
        {/* List of appointments  */}
        <div className="p-2 border border-secondary-50 rounded-md md:w-1/2">
          <div className="overflow-y-auto h-full">
            <table className="w-full divide-y divide-gray-100 ">
              <thead className="sticky top-0 border-gray-50">
                <tr className="px-2">
                  <th className="py-4 px-2 text-left font-body text-sm uppercase">
                    Date
                  </th>
                  <th className="py-4 pr-1 text-left font-body text-sm uppercase">
                    Garage
                  </th>
                  <th className="py-4 pr-1 text-left font-body text-sm uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {appointments && appointments.length > 0 ? (
                  appointments.map((appointment: any, index: number) => {
                    const dateFormat = "dd/MM/yyyy";
                    const timeFormat = "hh:mm aa";
                    return (
                      <tr
                        className="cursor-pointer hover:bg-gray-50 px-2"
                        key={index}
                        onClick={() =>
                          setSelectedAppointment(appointments[index])
                        }
                      >
                        <td className="gap-3 py-4 pr-1 font-medium text-black font-body md:flex md:text-left">
                          <div className="text-sm px-2">
                            <div>
                              {format(
                                parseISO(appointment.bookingDate),
                                dateFormat
                              )}
                            </div>
                            <div>
                              {format(
                                parseISO(appointment.bookingDate),
                                timeFormat
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 pr-1 text-left">
                          <div className="flex flex-col text-sm font-body gap-y-1">
                            <p className="font-medium text-black line-clamp-3">
                              {`${appointment?.garage?.name}, ${appointment.garage?.garageAddress?.name}`}
                            </p>
                            <div className="flex items-center text-gray-400 gap-x-1">
                              <div>
                                <FaPhoneAlt color="black" />
                              </div>
                              <div className="text-secondary-400">
                                {appointment.garage?.contactPerson?.phone ??
                                  "N/A"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 pr-1">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${
                              appointment.status == "rejected"
                                ? "text-danger-600 bg-danger-50"
                                : appointment.status == "honoured"
                                ? " text-success-600 bg-success-50"
                                : appointment?.status === "pending"
                                ? "text-warning-600 bg-warning-50"
                                : ""
                            } capitalize`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                appointment.status == "rejected"
                                  ? " bg-danger-600"
                                  : appointment.status == "honoured"
                                  ? " bg-success-600"
                                  : appointment.status === "pending"
                                  ? "bg-warning-600"
                                  : ""
                              }`}
                            ></span>
                            {appointment.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <div className="text-base font-light font-body text-secondary-700">
                    No appointment
                  </div>
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
        </div>
      </div>
    </div>
  );
}
