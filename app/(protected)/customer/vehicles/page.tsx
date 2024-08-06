"use client";

import React from "react";

import Image from "next/image";
import Link from "next/link";

import DeleteModal from "@/components/modals/DeleteModal";
import EditVehicleInformation from "@/components/modals/EditVehicle";
import Spinner from "@/components/Spinner";

import vehicleLogo from "@/assets/images/vehicle-logos/car_avator.jpg";

import { AiFillPlayCircle } from "react-icons/ai";
import { BiSolidCheckShield } from "react-icons/bi";
import { VscEmptyWindow } from "react-icons/vsc";
import { AiFillCar } from "react-icons/ai";

import { database, storage } from "@/appwrite/appwrite";
import environment from "@/environments/environment";
import { toast, ToastContainer } from "react-toastify";

import { format, parseISO, isValid } from "date-fns";
import { Query } from "appwrite";

// Regular expression function for getting the FileID.
function extractFileIdFromUrl(url: string) {
  const pattern = /\/([0-9a-fA-F]+)\/view/;

  const match = url.match(pattern);

  if (match && match[1]) {
    return match[1];
  }

  return null;
}

export default function Page() {
  const [isEdit, setisEdit] = React.useState<boolean>(false);
  const [vehicles, setVehicles] = React.useState<any>([]);
  const [vehiclePosition, setVehiclePosition] = React.useState<number | null>(
    null
  );
  const [carTypes, setCarTypes] = React.useState<any>(null);
  const [garageData, setGarageData] = React.useState<any>(null);
  const [services, setServices] = React.useState<any>(null);
  const [deleteModal, setDeleteModal] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const fetchData = async () => {
    setIsLoading(true);
    let data;
    let garages;
    let carTypes;
    let services;

    try {
      const { total: limit } = await database.listDocuments(
        environment.appwriteDatabaseId,
        environment.appwriteVehiclesCollectionId
      );

      data = (
        await database.listDocuments(
          environment.appwriteDatabaseId,
          environment.appwriteVehiclesCollectionId,
          [Query.limit(limit), Query.orderDesc("$createdAt"), Query.offset(0)]
        )
      ).documents;
    } catch (error: any) {
      console.log("Error listing vehicles: ", error.message);
    }
    try {
      garages = (
        await database.listDocuments(
          environment.appwriteDatabaseId,
          environment.appwriteGarageCollectionId
        )
      ).documents;
    } catch (error: any) {
      console.log("Error listing garages: ", error.message);
    }
    try {
      carTypes = (
        await database.listDocuments(
          environment.appwriteDatabaseId,
          environment.appwriteCarTypesCollectionId
        )
      ).documents;
    } catch (error: any) {
      console.log("Error listing cartypes: ", error.message);
    }
    try {
      services = (
        await database.listDocuments(
          environment.appwriteDatabaseId,
          environment.appwriteServicesCollectionId
        )
      ).documents;
    } catch (error: any) {
      console.log("Error listing services: ", error.message);
    }

    setCarTypes(carTypes);
    setServices(services);
    setGarageData(garages);

    if (data && data.length > 0) {
      setVehicles(data);
      setVehiclePosition(0);
    }
    setIsLoading(false);
  };

  // useEffect hook to fetch data on render
  React.useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteModal = () => {
    setDeleteModal(!deleteModal);
  };
  const handleIsEdit = () => {
    setisEdit(!isEdit);
  };

  // Function to delete a vehicle
  const deleteVehicle = async () => {
    setIsLoading(true);
    try {
      const vehicle = vehicles[vehiclePosition as number];
      const files: string[] = vehicle.vehicleImages;

      // third party details
      const thirdPartyId = vehicle?.third_party_details;
      // console.log(thirdPartyId)
      // Delete the vehicle document from the database
      const statusCode = await database.deleteDocument(
        vehicle.$databaseId,
        vehicle.$collectionId,
        vehicle?.$id
      );

      if (statusCode) {
        // If the document has been deleted successfully,
        // also delete the images from storage.
        for (const file of files) {
          const fileID: string = extractFileIdFromUrl(file as string) ?? "";
          if (fileID) {
            await storage.deleteFile(
              environment.appwriteVehicleBucketId,
              fileID
            );
          }
        }

        // delete the third party-details.
        const deleteThirdPartyDelete = await database
          .deleteDocument(
            thirdPartyId?.$databaseId,
            thirdPartyId?.$collectionId,
            thirdPartyId?.$id
          )
          .then((res) => {
            console.log("Deleted the third party also", res);
            return res;
          });

        // Update the state to remove the deleted vehicle
        const updatedVehicles = [...vehicles];
        updatedVehicles.splice(vehiclePosition as number, 1);
        setVehicles(updatedVehicles);

        // Reset the vehicle position to show the next vehicle if available
        if (updatedVehicles.length > 0) {
          const newPosition = Math.min(
            vehiclePosition as number,
            updatedVehicles.length - 1
          );
          setVehiclePosition(newPosition);
        }
        setIsLoading(false);
      } else {
        setIsLoading(false);
        toast.error(() => (
          <div className="font-body font-light text-base w-full flex start">
            Network error
          </div>
        ));
      }
    } catch (error) {
      setIsLoading(false);
      toast.error(() => (
        <div className="font-body font-light text-base w-full flex start">
          Network error
        </div>
      ));
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-full relative">
        <Spinner loaderText="Fetching vehicles" />
      </div>
    );
  } else if (vehicles.length) {
    return (
      <div className="flex flex-col items-center justify-center relative">
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
        <div className="flex justify-between w-full p-2 md:w-3/4">
          <div className="flex items-center justify-between w-full font-body  text-base font-medium mt-2 md:mt-0">
            <h3 className="text-lg font-body">
              {`${vehicles?.length ?? ""} ${
                vehicles?.length > 1 ? "vehicles" : "vehicle"
              }`}{" "}
            </h3>
            <Link href="/customer/vehicles/addVehicle" className="">
              <p className="py-1 px-2 text-sm text-white rounded font-body bg-primary-500 font-medium">
                ADD NEW
              </p>
            </Link>
          </div>
        </div>

        {/* Vehicle information */}
        <div className="flex flex-col justify-center w-full gap-2 p-2 border rounded-md md:flex-row md:w-3/4 h-fit md:h-80 overflow-y-hidden">
          <Image
            src={
              vehicles[vehiclePosition as number]?.vehicleImages[0] ||
              vehicleLogo
            }
            alt="car-Image"
            width={80}
            height={80}
            quality={75}
            priority
            className="w-full h-64 md:h-full  object-cover object-center rounded-sm "
            onError={(e) => {
              console.log("An error has occured,", e);
            }}
          />
          <div className="flex flex-col w-full">
            <div className="flex justify-between">
              <div></div>
              <div className="flex gap-3">
                {/* Edit button  */}
                <button
                  className="p-1 text-sm underline font-body text-primary-500"
                  onClick={handleIsEdit}
                >
                  EDIT
                </button>
                {/* Delete button  */}
                <button
                  className="text-sm underline font-body text-primary-500"
                  onClick={handleDeleteModal}
                >
                  DELETE
                </button>
              </div>
            </div>
            <table className="w-full rounded-md">
              <tbody>
                <tr>
                  <th className="py-1 pl-2 pr-4 font-light text-left font-body text-base">
                    {vehicles[vehiclePosition as number]?.carType?.name ??
                      "Not provided"}
                  </th>
                  <td className="py-1 pr-4 font-light text-left font-body text-base">
                    {vehicles[vehiclePosition as number]?.licensePlate ??
                      "Not provided"}
                  </td>
                </tr>
                <tr>
                  <th className="py-1 pl-2 pr-4 font-light text-left font-body text-base">
                    Mileage
                  </th>
                  <td className="py-1 pr-4 font-light text-left font-body text-base">
                    {vehicles[vehiclePosition as number]?.currentMileage ??
                      "Not provided"}
                  </td>
                </tr>
                <tr>
                  <th className="py-1 pl-2 pr-4 font-light text-left font-body text-base">
                    Chassis NO.
                  </th>
                  <td className="py-1 pr-4 font-light text-left font-body text-base">
                    {vehicles[vehiclePosition as number]?.chassisNumber ??
                      "Not provided"}
                  </td>
                </tr>
                <tr className="border-b">
                  <th
                    className="py-2 pl-2 pr-4 text-left font-body text-base font-medium"
                    colSpan={2}
                  >
                    Third party detail
                  </th>
                </tr>
                <tr>
                  <td className="py-1 pl-2 pr-4 font-light text-left font-body">
                    <div className="flex flex-col">
                      <span className="font-medium text-base">
                        Campany name
                      </span>
                      <span className="font-light text-base">
                        {vehicles[vehiclePosition as number]
                          ?.third_party_details?.companyName ?? "Not provided"}
                      </span>
                    </div>
                  </td>
                  <td className="py-1 pr-4 font-light text-left font-body">
                    <div className="flex flex-col">
                      <span className="font-medium text-base font-body">
                        Purchase date
                      </span>
                      <span className="font-light text-base">
                        {vehicles[vehiclePosition as number]
                          ?.third_party_details?.purchaseDate
                          ? format(
                              parseISO(
                                vehicles[vehiclePosition as number]
                                  ?.third_party_details?.purchaseDate
                              ),
                              "yyyy-MM-dd"
                            )
                          : "N/A"}
                      </span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* moving between the vehicles  */}
        <div className="flex items-center w-full gap-2 p-1 md:w-3/4">
          {/* traverse vehicles left  */}
          <button
            className="p-1 text-sm text-white bg-black rounded-sm cursor-pointer font-body"
            disabled={(vehiclePosition as number) > 0 ? false : true}
            onClick={() => {
              if ((vehiclePosition as number) > 0) {
                setVehiclePosition((vehiclePosition as number) - 1);
              }
            }}
          >
            PREV
          </button>
          <h5>{(vehiclePosition as number) + 1}</h5>
          {/* Traverse vehilces right  */}
          <button
            className="p-1 text-sm text-white bg-black rounded-sm cursor-pointer font-body"
            // disabled={vehiclePosition as number <= vehicles.length - 2 ? true : false}
            onClick={() => {
              if ((vehiclePosition as number) <= vehicles.length - 2) {
                setVehiclePosition((vehiclePosition as number) + 1);
              }
            }}
          >
            NEXT
          </button>
        </div>
        {/* Vehicle history  */}
        <div className="w-full md:w-3/4 mt-5">
          <div className="flex flex-row items-center justify-between w-full gap-5 pl-3 pr-3 mb-2 md:w-2/4">
            <h3 className="text-base font-body font-medium">
              Status and history
            </h3>
            <div className="p-1 pl-2 pr-2 rounded-md bg-success-100">
              <h5 className="text-xs font-bold uppercase md:text-sm font-body">
                Final check
              </h5>
            </div>
          </div>
          <div className=" w-full md:w-2/4 border rounded py-4 font-body">
            <table className="w-full">
              <tbody>
                <tr>
                  <td className="flex flex-col items-center justify-center h-fit">
                    <AiFillPlayCircle size={10} className=" fill-primary-500" />
                    <span className="h-5 border-l border-dotted border-primary-500"></span>
                  </td>
                  <td className="w-3/5 text-xs">
                    <h2>Last Service offered</h2>
                    <p className="opacity-50 ">
                      {vehicles[vehiclePosition as number]?.lastServiceOffered
                        ?.name ?? "Not provided"}
                    </p>
                  </td>
                  <td className="flex justify-center text-sm opacity-50">
                    <BiSolidCheckShield
                      size={15}
                      className=" fill-success-600"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="flex flex-col items-center h-fit">
                    <AiFillPlayCircle size={10} className=" fill-primary-500" />
                    <span className="h-5 border-l border-dotted border-primary-500"></span>
                  </td>
                  <td className="w-3/5 text-xs">
                    <h2>Garage name</h2>
                    <p className="opacity-50 ">
                      {vehiclePosition !== null
                        ? vehicles[vehiclePosition]?.lastServiceGarageName
                        : "Not provided"}
                    </p>
                  </td>
                  <td className="flex justify-center text-sm opacity-50">
                    <BiSolidCheckShield
                      size={15}
                      className=" fill-success-600"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="flex flex-col items-center justify-center h-fit">
                    <AiFillPlayCircle size={10} className=" fill-primary-500" />
                    <span className="h-5 border-l border-dotted border-primary-500"></span>
                  </td>
                  <td className="w-3/5 text-xs">
                    <h2>Last service date</h2>
                    <p className="opacity-50 ">
                      {isValid(
                        vehicles[vehiclePosition as number]?.lastServiceDate
                      )
                        ? format(
                            parseISO(
                              vehicles[vehiclePosition as number]
                                ?.lastServiceDate
                            ),
                            "yyyy-MM-dd"
                          )
                        : "Not stated"}
                    </p>
                  </td>
                  <td className="flex justify-center text-sm opacity-50">
                    <BiSolidCheckShield
                      size={15}
                      className=" fill-success-600"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="flex items-center justify-center h-fit">
                    <AiFillPlayCircle size={10} className=" fill-primary-500" />
                  </td>
                  <td className="w-3/5 text-xs">
                    <h2>Final check</h2>
                  </td>
                  <td className="flex justify-center text-sm opacity-50">
                    <BiSolidCheckShield
                      size={15}
                      className=" fill-success-600"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal for editting the vehicle  */}
        <EditVehicleInformation
          isEdit={isEdit}
          handleIsEdit={handleIsEdit}
          vehicle={vehicles[vehiclePosition as number]}
          // setVehicles={setVehicles}
          carTypes={carTypes}
          services={services}
          garageData={garageData}
          // vehicles={vehicles}
          fetch={fetchData}
        />

        {/* The spinner modal */}
        {/* <Spinner
          isVisible={isSpinnerVisible}
        /> */}

        {/* The delete modal  */}
        <DeleteModal
          isVisible={deleteModal}
          setVisible={setDeleteModal}
          handleDelete={deleteVehicle}
        />
        {/* This loads when the edit vehicle is open  */}
        <div
          className={`${
            isEdit || deleteModal
              ? "absolute bg-secondary-500 opacity-50 z-0 w-screen h-full top-0 left-0"
              : "hidden"
          }`}
          onClick={() => {
            if (isEdit) {
              handleIsEdit();
            } else if (deleteModal) {
              handleDeleteModal();
            }
          }}
        ></div>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col items-center justify-center h-full p-2 pt-5">
        <div className="flex justify-between w-full p-2 md:w-3/4 h-1/6">
          <div className="flex items-center w-2/4 gap-2 font-body">
            <h3 className="text-xl font-body">
              <span className="text-primary-500">{vehicles?.length}</span>{" "}
              vehicles
            </h3>
            <Link href="/customer/vehicles/addVehicle" className="">
              <p className="p-1 text-sm text-white rounded-sm font-body bg-primary-500">
                ADD NEW
              </p>
            </Link>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center w-full gap-2 p-2 border rounded-md md:flex-row md:w-3/4 h-4/5">
          <Link
            href="/customer/vehicles/addVehicle"
            className="flex flex-col items-center"
          >
            {/* <VscEmptyWindow size={50} className="opacity-50 " /> */}
            <div className="relative">
              <svg
                className="absolute w-4 h-4 bottom-5 -left-1 "
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              <AiFillCar
                size={30}
                className="absolute bottom-0 fill-primary-500"
              />
            </div>
            <h3 className="mt-2 opacity-50 ">Click to add vehicle</h3>
          </Link>
        </div>
      </div>
    );
  }
}
