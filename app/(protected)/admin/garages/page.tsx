"use client";
import React, { Fragment, useEffect, useState } from "react";
import { format, parseISO, startOfDay } from "date-fns";
import { LiaUnlockAltSolid, LiaUserLockSolid } from "react-icons/lia";
import { BiSearch } from "react-icons/bi";
import TablePaginate from "@/components/Paginate";
import GarageModal from "@/components/modals/Garage";
import { BsStar, BsStarFill } from "react-icons/bs";
import Image from "next/image";
import { FaPhoneAlt } from "react-icons/fa";
import { HiLocationMarker } from "react-icons/hi";
import { FaEllipsisVertical } from "react-icons/fa6";
import { MdModeEditOutline, MdDelete } from "react-icons/md";
import { useRouter } from "next/navigation";
import DatabaseService from "@/lib/services/database.service";
import environment from "@/environments/environment";
import Spinner from "@/components/Spinner";
import Modal from "@/components/modals/Modal";
import { toast, ToastContainer } from "react-toastify";
import StorageService from "@/lib/services/storage.service";
import { appwriteClient } from "@/appwrite/appwrite";
import { Query } from "appwrite";
interface Garage {
  $id: string;
  status: string;
}
function Garages() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  const [garages, setGarages] = useState<any[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [garageModal, setGarageModal] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [status, setStatus] = useState<string>("");
  const [show, setShow] = useState<boolean>(false);
  const [garageData, setGarageData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const { appwriteDatabaseId, appwriteGarageCollectionId } = environment;
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [loaderText, setLoaderText] = useState<string>("");
  const [totalGarages, setTotalGarages] = useState<number>(0);

  const dateFormat = "dd MMM yyyy";

  useEffect(() => {
    const fetchGarages = async () => {
      setLoaderText("Fetching garages");
      const { documents: garages, total: totalGarages } =
        await DatabaseService.listDocuments(
          appwriteDatabaseId,
          appwriteGarageCollectionId,
          [
            Query.limit(itemsPerPage),
            Query.offset(itemsPerPage * (currentPage - 1)),
            Query.orderDesc("$createdAt"),
          ]
        );
      setGarages(garages);
      setTotalGarages(totalGarages);
      setLoading(false);
    };

    fetchGarages();

    appwriteClient.subscribe(
      `databases.${appwriteDatabaseId}.collections.${appwriteGarageCollectionId}.documents`,
      (response: any) => {
        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.create"
          )
        ) {
          setGarages((previousGarages: any[]) => {
            return [...previousGarages, response.payload];
          });
          setTotalGarages((totalGarages: number) => totalGarages + 1);
        } else if (
          response.events.includes(
            "databases.*.collections.*.documents.*.update"
          )
        ) {
          setGarages((previousGarages: any[]) => {
            return previousGarages.map((garage: Garage) => {
              return garage.$id === response.payload.$id
                ? response.payload
                : garage;
            });
          });
        } else if (
          response.events.includes(
            "databases.*.collections.*.documents.*.delete"
          )
        ) {
          setGarages((previousGarages: any[]) => {
            return previousGarages.filter((garage: Garage) => {
              return garage.$id !== response.payload.$id;
            });
          });
          setTotalGarages((totalGarages: number) => totalGarages - 1);
        }
      }
    );
  }, [itemsPerPage, currentPage]);

  let filteredGarages: any = garages;

  filteredGarages = garages?.filter((garage) =>
    status === "all" || !status ? garage : garage?.status === status
  );

  if (startDate) {
    filteredGarages = filteredGarages.filter((garage: any) => {
      const garageDateWithoutTime = startOfDay(parseISO(garage.$createdAt));
      const startDateWithoutTime = startOfDay(startDate);
      return garageDateWithoutTime >= startDateWithoutTime;
    });
  }

  if (endDate) {
    filteredGarages = filteredGarages.filter((garage: any) => {
      const garageDateWithoutTime = startOfDay(parseISO(garage.$createdAt));
      const endDateWithoutTime = startOfDay(endDate);
      return garageDateWithoutTime <= endDateWithoutTime;
    });
  }

  filteredGarages =
    filteredGarages && filteredGarages.length > 0 && searchText
      ? filteredGarages.filter(
          (garage: any) =>
            garage.name &&
            garage.name.toLowerCase().indexOf(searchText.toLowerCase()) > -1
        )
      : filteredGarages;

  return (
    <div className="w-full h-full pb-5 pt-5 lg:pt-0 z-10 relative">
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {loading && <Spinner loaderText={loaderText} />}
      {deleteModal && (
        <Modal setModalOpen={setDeleteModal}>
          <div className="flex flex-col justify-between">
            <p className="font-body text-base font-light mb-1">
              Are you sure you want to delete{" "}
              <span className="font-medium">{garageData?.name}</span>?
            </p>
            <p className="font-body text-base font-light mb-5">
              This action is{" "}
              <span className="font-medium uppercase">irreversible</span>
            </p>
            <div className="flex justify-between">
              <button
                className=" items-center gap-x-1 px-2  rounded-md py-1 bg-black text-base font-light  text-white cursor-pointer font-body duration-200 transition-all"
                onClick={(event) => {
                  event.preventDefault();
                  setDeleteModal(false);
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className=" items-center gap-x-1 px-2  rounded-md py-1 bg-danger-700 text-base font-light text-white cursor-pointer font-body duration-200 transition-all"
                onClick={async (event) => {
                  setDeleteModal(false);
                  setLoaderText(`Deleting ${garageData.name}`);
                  setLoading(true);

                  event.preventDefault();

                  const {
                    appwriteGarageServicesCollectionId,
                    appwriteContactPersonsCollectionId,
                    appwritePlacesCollectionId,
                    appwriteDatabaseId,
                    appwriteGarageLogosBucketId,
                  } = environment;

                  try {
                    const response = await StorageService.deleteFile(
                      appwriteGarageLogosBucketId,
                      garageData.logoField
                    );

                    const garageServices = garageData.garageServices;
                    const contactPerson = garageData.contactPerson;
                    const garageAddress = garageData.garageAddress;

                    // Delete the garage address
                    const response1 = await DatabaseService.updateDocument(
                      appwriteDatabaseId,
                      appwriteGarageCollectionId,
                      garageData.$id,
                      {
                        garageServices: [],
                        primaryCarTypes: [],
                        garageAddress: null,
                        contactPerson: null,
                      }
                    );

                    if (response1) {
                      if (garageAddress && garageAddress?.$id) {
                        const deletedGarageAddress =
                          await DatabaseService.deleteDocument(
                            appwriteDatabaseId,
                            appwritePlacesCollectionId,
                            garageAddress.$id
                          );

                        console.log(
                          "Deleted Garage Address: ",
                          deletedGarageAddress
                        );
                      }

                      if (contactPerson && contactPerson?.$id) {
                        const deletedContactPerson =
                          await DatabaseService.deleteDocument(
                            appwriteDatabaseId,
                            appwriteContactPersonsCollectionId,
                            contactPerson.$id
                          );

                        console.log(
                          "Deleted Contact Person: ",
                          deletedContactPerson
                        );
                      }

                      for (const garageService of garageServices) {
                        const result = await DatabaseService.deleteDocument(
                          appwriteDatabaseId,
                          appwriteGarageServicesCollectionId,
                          garageService.$id
                        );
                      }

                      const deletedGarage =
                        await DatabaseService.deleteDocument(
                          appwriteDatabaseId,
                          appwriteGarageCollectionId,
                          garageData.$id
                        );

                      setLoading(false);
                      setGarageData(() => null);
                      toast.success(() => (
                        <div className="font-body font-light text-base w-full flex start">
                          Garage has been successfully deleted
                        </div>
                      ));
                    }
                  } catch (error: any) {
                    setLoading(false);
                    setGarageData(() => null);
                    toast.error(() => (
                      <div className="font-body font-light text-base w-full flex start">
                        {error.message}
                      </div>
                    ));
                  }
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
      <div className="flex gap-x-2">
        <h2 className="font-body text-lg font-bold py-1">Garages</h2>
        <button
          className={`inline-flex justify-center group items-end gap-x-1 px-2 rounded py-1.5 bg-primary-500 text-white cursor-pointer font-body duration-200 transition-all text-base w-fit`}
          type="button"
          onClick={(event) => {
            event.preventDefault();
            router.push("/admin/garages/add");
          }}
        >
          Add Garage
        </button>
      </div>
      {/* Filters */}
      <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 justify-between">
        <label
          className="flex w-fit h-fit relative justify-end items-center"
          htmlFor="search-input"
        >
          <input
            type="text"
            placeholder="Search by name"
            id="search-input"
            className="w-full py-2 pl-2 pr-10 rounded-md bg-white border-[0.5px] border-secondary-100/60 outline-none font-body text-sm font-light font-regular placeholder:text-secondary-100"
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
              id="start-date-input"
              type="date"
              className="w-full px-2 py-1.5 bg-white outline-none  placeholder-secondary-200 text-sm font-light font-body"
              max={
                endDate ? format(new Date(endDate), "yyyy-MM-dd") : undefined
              }
              onChange={(event) =>
                setStartDate(() => new Date(event.target.value))
              }
            />
            <span className="px-4 text-secondary-600 bg-gray-100 flex justify-center items-center">
              to
            </span>
            <input
              type="date"
              id="end-date-input"
              className="w-full px-2 py-1.5 bg-white outline-none placeholder-secondary-200 text-sm font-light font-body"
              min={
                startDate
                  ? format(new Date(startDate), "yyyy-MM-dd")
                  : undefined
              }
              onChange={(event) =>
                setEndDate(() => new Date(event.target.value))
              }
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

      <div className="py-5 relative h-full">
        {filteredGarages && filteredGarages?.length > 0 ? (
          <div className="overflow-x-scroll rounded-lg border border-gray-200 shadow-md">
            <table className="w-full border-collapse bg-white text-left text-sm text-gray-500 h-full">
              <thead className="bg-gray-50">
                <tr>
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
                    Contact Person
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 font-semibold text-secondary-900 uppercase font-body text-sm"
                  >
                    status
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
                    Appointments
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
                {filteredGarages?.map((garage: any, index: number) => {
                  const averageRating = garage?.averageRating ?? null;
                  return (
                    <Fragment key={index}>
                      <tr
                        className="bg-white hover:bg-gray-50 rounded-lg cursor-pointer"
                        onClick={(event) => {
                          event.preventDefault();
                          if (!show) {
                            setGarageModal(() => true);
                            setGarageData(() => garage);
                            setActiveIndex(() => index);
                          } else {
                            event.stopPropagation();
                            setShow(() => false);
                            setGarageModal(() => false);
                            setGarageData(() => null);
                            setActiveIndex(() => null);
                          }
                        }}
                      >
                        <td className="px-6 py-4 font-base font-body text-gray-900">
                          <div className="inline-flex gap-x-1.5">
                            <div className="h-20 w-20 rounded-sm overflow-hidden flex justify-center items-center font-body text-h2 bg-secondary-50 text-secondary-600">
                              {garage?.logoUrl ? (
                                <Image
                                  src={garage.logoUrl}
                                  alt="logo"
                                  width={50}
                                  height={50}
                                  className="w-full h-full"
                                  quality={100}
                                  key={garage.logoField}
                                />
                              ) : (
                                garage?.name?.[0] ?? ""
                              )}
                            </div>
                            <div className="py-1 flex flex-col justify-end gap-y-1 rounded">
                              <h2 className="text-base font-body font-medium">
                                {garage?.name}
                              </h2>
                              <div className="flex gap-x-1">
                                {averageRating ? (
                                  Array(5)
                                    .fill(0)
                                    .map((_, index) => (
                                      <>
                                        {index < averageRating ? (
                                          <BsStarFill
                                            className="text-warning-500"
                                            size={15}
                                          />
                                        ) : (
                                          <BsStar
                                            className="text-warning-500"
                                            size={15}
                                          />
                                        )}
                                      </>
                                    ))
                                ) : (
                                  <span className="font-body text-sm font-light">
                                    No Reviews Yet
                                  </span>
                                )}
                              </div>
                              <div className="inline-flex gap-x-1 items-center">
                                <HiLocationMarker className="text-primary-500 w-5 h-5" />
                                <span className="font-body font-regualar text-black w-32">
                                  {garage?.garageAddress?.name ??
                                    "Not specified"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="inline-flex flex-col gap-y-1">
                            <div className="text-sm flex flex-col justify-center">
                              <div className="font-medium text-gray-700 font-body capitalize">
                                <span className="capitalize">
                                  {garage?.contactPerson?.salutation ?? ""}
                                </span>{" "}
                                {garage?.contactPerson?.name}
                              </div>
                              <div className="text-gray-400 flex gap-x-1 items-center">
                                <div>
                                  <FaPhoneAlt color="black" />
                                </div>
                                <div className="text-secondary-400">
                                  {garage?.contactPerson?.phone}
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col gap-y-1 lg:flex-row gap-x-2">
                              {garage?.contactPerson?.email && (
                                <div className="flex flex-col">
                                  <p className="text-sm font-semibold text-secondary-900 font-body">
                                    Email
                                  </p>
                                  <p className="text-sm font-body text-secondary-700">
                                    {garage?.contactPerson?.email ?? ""}
                                  </p>
                                </div>
                              )}
                              {garage?.contactPerson?.role && (
                                <div className="flex flex-col">
                                  <p className="text-sm font-semibold text-secondary-900 font-body">
                                    Role
                                  </p>
                                  <p className="text-sm font-body text-secondary-700 capitalize">
                                    {garage?.contactPerson?.role ?? ""}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold capitalize font-body ${
                              garage?.status === "active"
                                ? "text-success-700 bg-green-50"
                                : garage?.status === "suspended"
                                ? "text-danger-700 bg-danger-50"
                                : ""
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                garage?.status === "active"
                                  ? "bg-success-700"
                                  : garage?.status === "suspended"
                                  ? "bg-danger-700"
                                  : ""
                              }`}
                            ></span>
                            {garage?.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-body text-black font-medium">
                          <span className="text-sm">
                            {format(parseISO(garage.$createdAt), dateFormat)}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-body text-black font-medium">
                          <span className="text-sm">
                            {garage?.appointments?.length ?? "No"} Appointments
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="relative">
                            <button
                              className="inline-flex outline-none"
                              onClick={(event) => {
                                event.stopPropagation();
                                setActiveIndex(() => index);
                                setGarageModal(() => false);
                                setShow(() => !show);
                              }}
                            >
                              <FaEllipsisVertical className="text-black" />
                            </button>
                            <ul
                              // ref={actionsRef}
                              className={`${
                                activeIndex === index && show
                                  ? "flex flex-col"
                                  : "hidden"
                              } rounded-sm p-4 absolute right-0 bg-white  gap-y-2 shadow-md z-20 w-fit`}
                              // ref={actionsRef}
                              onClick={(event) => {
                                event.stopPropagation();
                                event.preventDefault();
                              }}
                            >
                              {/* Make  */}
                              <li className="cursor-pointer">
                                <button
                                  className={`w-full inline-flex justify-start group items-center gap-x-1 px-2 border rounded-md py-1 bg-black/10 border-black hover:bg-black text-black hover:text-white cursor-pointer font-body duration-200 transition-all`}
                                  type="button"
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    event.preventDefault();
                                    // setGarageModal(() => true);
                                    // setGarageData(() => garage);
                                    router.push(
                                      `/admin/garages/edit/${garage.$id}`
                                    );
                                    setActiveIndex(() => index);
                                    setShow(() => false);
                                  }}
                                >
                                  <MdModeEditOutline
                                    size={22}
                                    className="fill-black group-hover:fill-white group-hover:cursor-pointer"
                                  />
                                  <span className="capitalize">edit</span>
                                </button>
                              </li>
                              <li className="cursor-pointer">
                                <button
                                  className={`inline-flex w-full justify-center group items-end gap-x-1 px-2 border rounded-md py-1 ${
                                    garage?.status === "active"
                                      ? "bg-danger-50 border-danger-700 hover:bg-danger-700 text-danger-700"
                                      : garage?.status === "suspended"
                                      ? "bg-success-50 border-success-800 hover:bg-success-800 text-success-800"
                                      : ""
                                  }   hover:text-white cursor-pointer font-body duration-200 transition-all`}
                                  type="button"
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    event.preventDefault();
                                    setShow(() => false);
                                    // setGarageModal(() => false);
                                    // setGarageData(() => null);
                                    setActiveIndex(() => null);
                                  }}
                                >
                                  {garage?.status === "active" ? (
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
                                    {garage?.status === "active"
                                      ? "suspend"
                                      : garage?.status === "suspended"
                                      ? "unsuspend"
                                      : ""}
                                  </span>
                                </button>
                              </li>
                              <li className="cursor-pointer">
                                <button
                                  className={`inline-flex w-full justify-start group items-center gap-x-1 px-2 border rounded-md py-1 bg-danger-50 border-danger-700 hover:bg-danger-700 text-danger-700 hover:text-white cursor-pointer font-body duration-200 transition-all`}
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    event.preventDefault();
                                    setShow(() => false);
                                    setGarageData(() => garage);
                                    setDeleteModal(() => true);
                                    setActiveIndex(() => null);
                                  }}
                                >
                                  <MdDelete
                                    size={22}
                                    className="fill-danger-700 group-hover:fill-white group-hover:cursor-pointer"
                                  />
                                  <span className="capitalize">Delete</span>
                                </button>
                              </li>
                            </ul>
                          </div>
                        </td>
                      </tr>
                      {garageModal &&
                        garageData &&
                        activeIndex === index &&
                        !show && (
                          <GarageModal
                            setModalOpen={setGarageModal}
                            data={garageData}
                            setData={setGarageData}
                          />
                        )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
            <div className="w-full bg-white px-3 flex justify-end h-fit items-center border-t-[0.5px] pb-5 border-secondary-50  ">
              <TablePaginate
                totalItems={totalGarages}
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
                {!garages || garages?.length === 0
                  ? "No Garages Yet"
                  : "No Garages Found"}
              </span>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default Garages;
