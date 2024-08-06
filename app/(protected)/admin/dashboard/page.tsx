"use client";

import fetchedCustomerActivity from "@/utils/data/customerActivity.json";
import { format, parseISO } from "date-fns";
import DatabaseService from "@/lib/services/database.service";
import environment from "@/environments/environment";
import Spinner from "@/components/Spinner";

// Charts cards and widgets
import StatisticsCard from "@/components/cards/Statistics";
import CustomerBarChart from "@/components/CustomerBarChart";
import CustomerDoughnutChart from "@/components/CustomerDoughnutChart";
import RatingsCard from "@/components/cards/Ratings";

import { FaPhoneAlt } from "react-icons/fa";

import { useState, useEffect } from "react";
import { DataPoint } from "@/components/CustomerBarChart";
import AuthenticationService from "@/lib/services/authentication.service";
import { Query } from "appwrite";
import { useRouter } from "next/navigation";

function Dashboard() {
  const [ratings, setRatings] = useState<any>([]);
  const [pendingRatings, setPendingRatings] = useState<any>([]);
  const [customerActivity, setCustomerActivity] = useState<DataPoint[]>([]);
  const [appointments, setAppointments] = useState<any>([]);
  const [totalCustomers, setTotalCustomers] = useState<number>(0);
  const [totalGarages, setTotalGarages] = useState<number>(0);
  const [totalVehicles, setTotalVehicles] = useState<number>(0);
  const [totalAppointments, setTotalAppointments] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const {
    appwriteDatabaseId,
    appwriteProfilesCollectionId,
    appwriteGarageCollectionId,
    appwriteVehiclesCollectionId,
    appwriteBookingsCollectionId,
    appwriteRatingsCollectionId,
  } = environment;

  const fetchTotalGarages = async () => {
    try {
      const garages = await DatabaseService.listDocuments(
        appwriteDatabaseId,
        appwriteGarageCollectionId
      );

      setTotalGarages(() => garages?.total);
    } catch (error: any) {
      console.log(JSON.stringify(error, null, 2));
    }
  };

  const fetchTotalVehicles = async () => {
    try {
      const vehicles = await DatabaseService.listDocuments(
        appwriteDatabaseId,
        appwriteVehiclesCollectionId
      );

      setTotalVehicles(vehicles.total);
    } catch (error: any) {
      console.log(JSON.stringify(error, null, 2));
    }
  };

  const fetchTotalCustomers = async () => {
    try {
      const session: any = await AuthenticationService.getSession();
      if (session) {
        const customers = await DatabaseService.listDocuments(
          appwriteDatabaseId,
          appwriteProfilesCollectionId,
          [Query.notEqual("userId", session.$id)]
        );

        setTotalCustomers(() => customers?.total);
      }
    } catch (error: any) {
      console.log(JSON.stringify(error, null, 2));
    }
  };

  const fetchTotalAppointments = async () => {
    try {
      const { total: totalAppointments, documents: appointments } =
        await DatabaseService.listDocuments(
          appwriteDatabaseId,
          appwriteBookingsCollectionId,
          [Query.orderDesc("$createdAt"), Query.limit(2), Query.offset(0)]
        );

      setAppointments(appointments);
      setTotalAppointments(totalAppointments);
    } catch (error: any) {
      console.log(JSON.stringify(error, null, 2));
    }
  };

  const fetchRatingsData = async () => {
    const { total: totalPendingRatings, documents: pendingRatings } =
      await DatabaseService.listDocuments(
        appwriteDatabaseId,
        appwriteRatingsCollectionId,
        [
          Query.equal("status", "submitted"),
          Query.orderDesc("$createdAt"),
          Query.limit(4),
          Query.offset(0),
        ]
      );

    const { total: totalReviwedRatings, documents: reviewedRatings } =
      await DatabaseService.listDocuments(
        appwriteDatabaseId,
        appwriteRatingsCollectionId,
        [Query.notEqual("status", "submitted")]
      );

    const ratingsData = [totalPendingRatings, totalReviwedRatings];
    setRatings((): any => ratingsData);
    setPendingRatings(() => pendingRatings);
  };

  const fetchData = async () => {
    setLoading(true);
    fetchTotalGarages();
    fetchTotalVehicles();
    fetchTotalAppointments();
    fetchTotalCustomers();
    fetchRatingsData();

    setCustomerActivity(fetchedCustomerActivity);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <section className="w-full bg-white text-sm py-5 relative">
      {loading && <Spinner loaderText="loading" />}
      <div className="flex flex-col gap-y-5 w-full">
        {/* Statistics summary section */}
        <section className="grid grid-cols-2 gap-y-2 gap-x-4 lg:grid-cols-4 sm:gap-y-5 md:gap-y-2">
          <StatisticsCard
            title={"Total Customers"}
            value={totalCustomers}
            percentage={"N/A"}
            type="success"
          />
          <StatisticsCard
            title={"Total Garages"}
            value={totalGarages}
            percentage={"N/A"}
            type="success"
          />
          <StatisticsCard
            title={"Total Vehicles"}
            value={totalVehicles}
            percentage={"N/A"}
            type="success"
          />
          <StatisticsCard
            title={"Total Appointments"}
            value={totalAppointments}
            percentage={"N/A"}
            type="success"
          />
        </section>
        {/* Customer Activity */}
        <div className="md:grid lg:grid-cols-6 md:gap-x-5">
          <div className="flex gap-y-5 flex-col lg:col-span-4 ">
            <section className="flex flex-col items-center lg:items-start">
              <h2 className="font-body text-lg font-bold py-2 w-full">
                Customer Activity
              </h2>
              <div className="h-80 w-full sm:w-4/5 lg:w-2/3 overflow-hidden">
                <CustomerBarChart dataset={customerActivity} />
              </div>
            </section>

            {/* Ratings */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:hidden">
              <div className="h-fit overflow-hidden py-2 px-2 flex justify-center lg:col-span-2">
                <CustomerDoughnutChart ratings={ratings} />
              </div>
              <div className="lg:col-span-2">
                <div className="flex justify-between py-2 ">
                  <h2 className="font-body text-lg font-bold py-1">
                    Recent Ratings
                  </h2>
                  <button
                    className="font-body text-lg font-regular text-primary-500"
                    onClick={(event) => {
                      event.preventDefault();
                      router.push("/admin/ratings");
                    }}
                  >
                    SEE ALL
                  </button>
                </div>
                <div className="flex flex-col gap-y-2 max-h-96 overflow-hidden">
                  {pendingRatings && pendingRatings?.length > 0 ? (
                    pendingRatings.map((rating: any, index: number) => {
                      const {
                        customer: { firstName, avatarUrl },
                        value,
                        comment,
                        $createdAt: date,
                        status,
                        id,
                      } = rating;

                      return (
                        <RatingsCard
                          key={index}
                          name={firstName ?? ""}
                          avatarUrl={avatarUrl}
                          value={value}
                          comment={comment}
                          date={date}
                          status={status}
                          id={id}
                        />
                      );
                    })
                  ) : (
                    <p className="text-start py-5 font-body text-base text-secondary-500">
                      No recent ratings
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Recent Appointments */}
            <section>
              <div className="flex justify-between pb-2 w-fu;;">
                <h2 className="font-body text-lg font-bold py-1">
                  Recent Appointments
                </h2>
                <button
                  className="font-body text-lg font-regular text-primary-500"
                  onClick={(event) => {
                    event.preventDefault();
                    router.push("/admin/appointments");
                  }}
                >
                  SEE ALL
                </button>
              </div>
              <div className="overflow-x-auto overflow-y-auto border border-gray-200 shadow-md h-fit rounded-lg">
                <table className="w-full border-collapse bg-white text-left text-sm">
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
                  <tbody className="divide-y divide-gray-100 border-t border-gray-100">
                    {
                      // map appointments here
                      appointments &&
                        appointments.length > 0 &&
                        appointments.map((appointment: any, index: number) => {
                          const dateFormat = "dd/MM/yyyy";
                          const timeFormat = "hh:mm aa";
                          return (
                            <tr
                              className="hover:bg-gray-50 cursor-pointer"
                              key={appointment.$id}
                              onClick={() => {
                                router.push("/admin/appointments");
                              }}
                            >
                              <td className="flex gap-3 px-6 py-4 font-body text-black font-medium">
                                <div className="text-sm">
                                  <div>
                                    {format(
                                      parseISO(appointment.bookingDate),
                                      dateFormat
                                    )}
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
                          );
                        })
                    }
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* Ratings */}
          <div className="lg:flex lg:items-center flex-col w-full hidden col-span-2">
            <div className="w-full overflow-hidden py-2 px-2 flex justify-center md:w-64 md:h-64 md:mt-10">
              <CustomerDoughnutChart ratings={ratings} />
            </div>
            <div className="w-full">
              <div className="flex justify-between py-2">
                <h2 className="font-body text-lg font-bold py-1">
                  Recent Ratings
                </h2>
                <button
                  className="font-body text-lg font-regular text-primary-500"
                  onClick={(event) => {
                    event.preventDefault();
                    router.push("/admin/ratings");
                  }}
                >
                  SEE ALL
                </button>
              </div>
              <div className="flex flex-col gap-y-2 max-h-96 overflow-hidden">
                {pendingRatings && pendingRatings?.length > 0 ? (
                  pendingRatings.map((rating: any, index: number) => {
                    const {
                      customer: { firstName, avatarUrl },
                      value,
                      comment,
                      $createdAt: date,
                      status,
                      id,
                    } = rating;

                    return (
                      <RatingsCard
                        key={index}
                        name={firstName ?? ""}
                        avatarUrl={avatarUrl}
                        value={value}
                        comment={comment}
                        date={date}
                        status={status}
                        id={id}
                      />
                    );
                  })
                ) : (
                  <p className="text-start py-5 font-body text-base text-secondary-500">
                    No recent ratings
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
