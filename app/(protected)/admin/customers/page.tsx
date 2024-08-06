"use client";
import React, { Fragment, useEffect, useState } from "react";
import format from "date-fns/format";
import parseISO from "date-fns/parseISO";
import { FaPhoneAlt } from "react-icons/fa";
import { LiaUnlockAltSolid, LiaUserLockSolid } from "react-icons/lia";
import { BiSearch } from "react-icons/bi";
import TablePaginate from "@/components/Paginate";
import CustomerModal from "@/components/modals/Customer";
import DatabaseService from "@/lib/services/database.service";
import environment from "@/environments/environment";
import AuthenticationService from "@/lib/services/authentication.service";
import Image from "next/image";
import { Query } from "appwrite";
import Spinner from "@/components/Spinner";
import { appwriteClient } from "@/appwrite/appwrite";

interface Customer {
  $id: string;
}
function Customers() {
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [customers, setCustomers] = useState<any[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [customerModal, setCustomerModal] = useState<boolean>(false);
  const [customerData, setCustomerData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalCustomers, setTotalCustomers] = useState<number>(0);
  const { appwriteDatabaseId, appwriteProfilesCollectionId } = environment;

  const dateFormat = "dd MMM yyyy";

  useEffect(() => {
    const fetchCustomers = async () => {
      console.log("Offset: ", itemsPerPage * (currentPage - 1));
      const session: any = await AuthenticationService.getSession();
      if (session) {
        const customers = await DatabaseService.listDocuments(
          appwriteDatabaseId,
          appwriteProfilesCollectionId,
          [
            Query.notEqual("userId", session.$id),
            Query.limit(itemsPerPage),
            Query.offset(itemsPerPage * (currentPage - 1)),
            Query.orderDesc("$createdAt"),
          ]
        );
        setCustomers(() => customers.documents);
        setTotalCustomers(() => customers.total);
        setLoading(false);
      }
    };

    fetchCustomers();
    appwriteClient.subscribe(
      `databases.${appwriteDatabaseId}.collections.${appwriteProfilesCollectionId}.documents`,
      (response: any) => {
        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.create"
          )
        ) {
          setCustomers((previousCustomers: any[]) => {
            return [...previousCustomers, response.payload];
          });
          setTotalCustomers((totalCustomers: number) => totalCustomers + 1);
        } else if (
          response.events.includes(
            "databases.*.collections.*.documents.*.update"
          )
        ) {
          setCustomers((previousCustomers: any[]) => {
            return previousCustomers.map((customer: Customer) => {
              return customer.$id === response.payload.$id
                ? response.payload
                : customer;
            });
          });
        } else if (
          response.events.includes(
            "databases.*.collections.*.documents.*.delete"
          )
        ) {
          setCustomers((previousCustomers: any[]) => {
            return previousCustomers.filter((customer: Customer) => {
              return customer.$id !== response.payload.$id;
            });
          });
          setTotalCustomers((totalCustomers: number) => totalCustomers - 1);
        }
      }
    );
  }, [currentPage, itemsPerPage]);

  let filteredCustomers: any = customers;

  filteredCustomers = customers?.filter((customer) =>
    status === "all" || !status ? customer : customer.status === status
  );

  if (startDate) {
    filteredCustomers = filteredCustomers.filter(
      (customer: any) => parseISO(customer.$createdAt) >= startDate
    );
  }

  if (endDate) {
    filteredCustomers = filteredCustomers.filter(
      (customer: any) => parseISO(customer.$createdAt) <= endDate
    );
  }

  filteredCustomers =
    filteredCustomers && filteredCustomers.length > 0 && searchText
      ? filteredCustomers.filter((customer: any) => {
          return (
            (customer.firstName &&
              customer.firstName
                .toLowerCase()
                .indexOf(searchText.toLowerCase()) > -1) ||
            (customer.LastName &&
              customer.lastName.tolowerCase().indexOf(searchText.toLowerCase()))
          );
        })
      : filteredCustomers;

  return (
    <div className="w-full h-full pb-5 pt-5 lg:pt-0 z-10 relative">
      <h2 className="font-body text-lg font-bold py-1">Customers</h2>
      {/* Filters */}
      <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 justify-between h-fit">
        <label
          className="flex w-fit relative justify-end items-center"
          htmlFor="search-input"
        >
          <input
            type="text"
            placeholder="Search by name"
            id="search-input"
            className="w-full py-2 pl-2 pr-10 rounded-md bg-white border-[0.5px] border-secondary-100/60 outline-none font-body text-sm font-light placeholder:text-secondary-100"
            onChange={(event) => {
              setSearchText(() => event.target.value);
            }}
          />
          <button className="absolute bg-secondary-50 px-1 h-full z-10 border-t-[0.5px] border-r-[0.5px] border-b-[0.5px] rounded-r-md border-secondary-100/60">
            <BiSearch size={20} />
          </button>
        </label>
        <div className="flex gap-x-5 gap-y-2 flex-wrap w-full md:w-fit">
          <div className="flex rounded-md border border-secondary-50 overflow-hidden max-w-screen-sm">
            <input
              type="date"
              className="w-full px-2 py-1.5 bg-white outline-none  placeholder-secondary-200 text-sm font-light font-body"
            />
            <span className="px-4 text-secondary-600 bg-gray-100">to</span>
            <input
              type="date"
              className="w-full px-2 py-1.5 bg-white outline-none placeholder-secondary-200 text-sm font-light font-body"
            />
          </div>
          <select
            name="status-input"
            id="status-input"
            className="block font-body text-sm outline-none px-2 py-1.5 bg-white placeholder-secondary-200 border-[0.5px] border-secondary-100/60 rounded-md font-light"
            onChange={(event) => {
              setStatus(() => event?.target.value);
            }}
          >
            <option disabled selected value="" className="font-secondary-200">
              Status
            </option>
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
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
      {loading ? (
        <Spinner loaderText="Fetching customers" />
      ) : (
        <div className="py-5">
          {filteredCustomers && filteredCustomers?.length > 0 ? (
            <div className="overflow-x-scroll rounded-lg border border-gray-200 shadow-md">
              <table className="w-full border-collapse bg-white text-left text-sm text-gray-500 h-full">
                <thead className="bg-gray-50">
                  <tr>
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
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 font-semibold text-secondary-900 uppercase font-body text-sm"
                    >
                      Vehicles
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 font-semibold text-secondary-900 uppercase font-body text-sm"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 font-semibold text-secondary-900 uppercase font-body text-sm"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 border-t border-gray-100 ">
                  {filteredCustomers?.map((customer: any, index: number) => {
                    return (
                      <Fragment key={index}>
                        <tr
                          className="hover:bg-gray-50 cursor-pointer"
                          onClick={(event) => {
                            event.preventDefault();
                            setCustomerModal(() => true);
                            setCustomerData(() => customer);
                          }}
                        >
                          <td className="px-6 py-4 font-normal text-gray-900">
                            <div className="flex gap-x-2">
                              <div className="relative h-10 w-10 flex justify-center items-center border-[0.5px] border-secondary-300 rounded-full font-body font-light text-secondary-500">
                                {customer?.avatarUrl ? (
                                  <Image
                                    src={customer?.avatarUrl}
                                    alt="logo"
                                    className="w-full h-full rounded-full object-cover object-center border border-red-500"
                                    height={50}
                                    width={50}
                                    quality={100}
                                  />
                                ) : (
                                  customer?.firstName?.[0] ?? "N/A"
                                )}
                                <span
                                  className={`absolute right-0 bottom-0 h-2 w-2 rounded-full ${
                                    customer?.status === "active"
                                      ? "bg-success-400"
                                      : customer?.status === "suspended"
                                      ? "bg-danger-400"
                                      : "bg-warning-400"
                                  } ring ring-white`}
                                ></span>
                              </div>
                              <div className="text-sm inline-flex flex-col justify-center">
                                <div className="font-medium text-gray-700">
                                  {customer.firstName ?? "Not specified yet"}
                                </div>
                                <div className="text-gray-400 flex gap-x-1 items-center">
                                  <div>
                                    <FaPhoneAlt color="black" />
                                  </div>
                                  <div className="text-secondary-400">
                                    {customer.phoneNumber}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-body text-black font-medium">
                            <span className="text-sm">
                              {format(
                                parseISO(customer.$createdAt),
                                dateFormat
                              )}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-body text-black font-medium">
                              {customer?.vehicles &&
                              customer?.vehicles?.length > 0
                                ? customer.vehicles.length
                                : "No"}{" "}
                              Vehicles
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold capitalize font-body ${
                                customer.status === "active"
                                  ? "text-success-700 bg-green-50"
                                  : customer.status === "suspended"
                                  ? "text-danger-700 bg-danger-50"
                                  : ""
                              }`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  customer.status === "active"
                                    ? "bg-success-700"
                                    : customer.status === "suspended"
                                    ? "bg-danger-700"
                                    : ""
                                }`}
                              ></span>
                              {customer.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              className={`inline-flex justify-center group items-end gap-x-1 px-2 border rounded-md py-1 ${
                                customer?.status === "active"
                                  ? "bg-danger-50 border-danger-700 hover:bg-danger-700 text-danger-700"
                                  : customer?.status === "suspended"
                                  ? "bg-success-50 border-success-800 hover:bg-success-800 text-success-800"
                                  : ""
                              }   hover:text-white cursor-pointer font-body duration-200 transition-all`}
                            >
                              {customer?.status === "active" ? (
                                <LiaUserLockSolid
                                  size={22}
                                  className="fill-danger-700 group-hover:fill-white group-hover:cursor-pointer"
                                />
                              ) : (
                                <LiaUnlockAltSolid
                                  className="fill-success-800 group-hover:fill-white group-hover:cursor-pointer"
                                  size={22}
                                />
                              )}
                              <span className="capitalize">
                                {customer?.status === "active"
                                  ? "suspend"
                                  : customer?.status === "suspended"
                                  ? "unsuspend"
                                  : ""}
                              </span>
                            </button>
                          </td>
                        </tr>
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
              <div className="w-full bg-white px-3 flex justify-end h-fit items-center border-t-[0.5px] pb-5 border-secondary-50  ">
                <TablePaginate
                  totalItems={totalCustomers}
                  itemsPerPage={itemsPerPage}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                />
              </div>
              {customerModal && (
                <CustomerModal
                  setModalOpen={setCustomerModal}
                  data={customerData}
                  setData={setCustomerData}
                />
              )}
            </div>
          ) : (
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
                {!customers || customers?.length === 0
                  ? "No Customers yet"
                  : "No customers found"}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Customers;
