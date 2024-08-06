"use client";

import React, { useState } from "react";

import Link from "next/link";

import { Formik, Form, Field, ErrorMessage, FormikProps } from "formik";

import { ID, Permission, Role } from "appwrite";
import { account, database, storage } from "@/appwrite/appwrite";
import environment from "@/environments/environment";

import { vehicleSchema } from "@/utils/validators/vehicleValidator";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { MdOutlineCancel } from "react-icons/md";

import Select from "react-select";
import CustomOption from "@/components/CustomSelect";
import Creatable from "react-select/creatable";
import Spinner from "@/components/Spinner";
import { toast, ToastContainer } from "react-toastify";

import Error from "./error";
import ErrorBoundary from "@/components/ErrorBoundary";
import PictureUpload from "@/components/PictureUpload";
import dataURLToFile from "@/utils/functions/dataURLToFile";

// Define initial form values
const initialValues = {
  selectedCarType: "",
  vehicleImage: null,
  licensePlate: "",
  chassisNumber: "",
  currentMileage: "",
  lastServiceDate: "",
  lastServiceGarageName: "",
  purchaseDate: "",
  companyName: "",
  lastServicesOffered: "",
};

const Index: React.FC = () => {
  const [images, setImages] = useState<string | null>(null);
  const [isSpinnerVisible, setIsSpinnerVisible] = useState<boolean>(false);

  const [carTypes, setCarTypes] = useState<any>([]);
  const [garageData, setGarageData] = useState<any>([]);
  const [services, setServices] = useState<any>([]);
  const [error, setError] = useState<Error | null>(null);
  const [profile, setProfile] = useState<any>(null);

  React.useEffect(() => {
    // Fetch data from the database
    const fetchData = async () => {
      try {
        // Fetch car data
        const carData = (
          await database.listDocuments(
            environment.appwriteDatabaseId,
            environment.appwriteCarTypesCollectionId
          )
        ).documents;

        // Fetch garage data
        const garageData = (
          await database.listDocuments(
            environment.appwriteDatabaseId,
            environment.appwriteGarageCollectionId
          )
        ).documents;

        // Fetch services offered data
        const servicesOffered = (
          await database.listDocuments(
            environment.appwriteDatabaseId,
            environment.appwriteServicesCollectionId
          )
        ).documents;

        // Fetch profileData
        const profileData = (
          await database.listDocuments(
            environment.appwriteDatabaseId,
            environment.appwriteProfilesCollectionId
          )
        ).documents;

        // Set states for fetched data
        setGarageData(garageData || []);
        setCarTypes(carData || []);
        setServices(servicesOffered || []);
        if (profileData) {
          setProfile(profileData[0]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error as Error);
      }
    };

    fetchData();
  }, []); // The empty dependency array ensures this effect runs only once

  return (
    <ErrorBoundary
      fallback={
        <Error error={error as Error} reset={() => console.log(error)} />
      }
    >
      <div className="flex items-center justify-center w-full h-full">
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
        <div className="flex flex-col items-center w-4/5 h-full bg-white rounded-md pb-7 ">
          <div className="flex flex-row items-center w-full gap-5 mb-5">
            <Link href="/customer/vehicles">
              <AiOutlineArrowLeft size={20} className="" />
            </Link>
            <h1 className="text-xl font-body font-regular ">Add a Vehicle</h1>
          </div>

          <div className="flex flex-col items-center justify-center w-full gap-5 md:flex-row">
            <div className="relative flex items-center justify-center w-80 md:w-1/3">
              {images && (
                <div className="absolute z-10 text-xl rounded-sm cursor-pointer right-1 -top-4">
                  <MdOutlineCancel
                    size={25}
                    className=" fill-primary-500"
                    onClick={() => setImages(null)}
                  />
                </div>
              )}
              <PictureUpload
                uploadMessage="Click to add vehicle image"
                innerContainer="w-80 h-60"
                outterContainer="rounded-md"
                selected={images}
                setSelected={setImages}
              />
            </div>
            <div className="flex items-center justify-center p-2 border rounded-md w-80 md:w-2/3">
              <div className="flex flex-col items-center justify-center w-full">
                <Formik
                  initialValues={initialValues}
                  onSubmit={async (
                    {
                      licensePlate,
                      selectedCarType,
                      chassisNumber,
                      currentMileage,
                      lastServiceDate,
                      lastServicesOffered,
                      purchaseDate,
                      companyName,
                      lastServiceGarageName,
                    },
                    { setSubmitting, resetForm }
                  ) => {
                    setIsSpinnerVisible(true);
                    // Simulate an API request
                    if (profile) {
                      setTimeout(async () => {
                        try {
                          const currentUserId = (await account.get()).$id;

                          if (images) {
                            // Upload vehicle image
                            const uploadFile = await storage
                              .createFile(
                                environment.appwriteVehicleBucketId,
                                ID.unique(),
                                dataURLToFile(images, "vehicle") as File,
                                [
                                  Permission.read(Role.user(currentUserId)),
                                  Permission.delete(Role.user(currentUserId)),
                                  Permission.update(Role.user(currentUserId)),
                                ]
                              )
                              .then((res) => res)
                              .catch((error) => {
                                console.log(error);
                              });
                            if (uploadFile) {
                              const imageUrl = await storage.getFileView(
                                environment.appwriteVehicleBucketId,
                                uploadFile.$id
                              ).href;

                              const garage = garageData.find(
                                (garage: any) =>
                                  garage.name === lastServiceGarageName
                              );
                              // console.log(garage);
                              const objectData = {
                                licensePlate,
                                chassisNumber,
                                currentMileage,
                                lastServiceDate,
                                lastServicesOffered: services.find(
                                  (service: any) =>
                                    service.name === lastServicesOffered
                                )?.$id,
                                lastServiceGarageName: garage
                                  ? garage?.name
                                  : lastServiceGarageName,
                                garage: garage ? garage?.$id : "",
                                userId: currentUserId,
                                customer: profile?.$id,
                                carType: selectedCarType,
                                thirdPartyDetails: {
                                  purchaseDate,
                                  companyName,
                                },
                                vehicleImages: [imageUrl],
                              };

                              // Create a new document
                              await database.createDocument(
                                environment.appwriteDatabaseId,
                                environment.appwriteVehiclesCollectionId,
                                ID.unique(),
                                objectData,
                                [
                                  Permission.read(Role.user(currentUserId)),
                                  Permission.delete(Role.user(currentUserId)),
                                  Permission.update(Role.user(currentUserId)),
                                ]
                              );

                              setSubmitting(false);
                              setIsSpinnerVisible(false);

                              toast.success(() => (
                                <div className="font-body font-light text-base w-full flex start">
                                  Vehicle added successfully
                                </div>
                              ));
                              resetForm({ values: initialValues });
                              setImages(null);
                            } else {
                              toast.error(() => (
                                <div className="font-body font-light text-base w-full flex start">
                                  Failure. There was an error adding vehicle
                                </div>
                              ));
                              setIsSpinnerVisible(false);
                            }
                          } else {
                            const garage = garageData.find(
                              (garage: any) =>
                                garage?.name === lastServiceGarageName
                            );
                            const objectData = {
                              licensePlate,
                              chassisNumber,
                              currentMileage,
                              lastServiceDate,
                              lastServicesOffered: services.find(
                                (service: any) =>
                                  service.name === lastServicesOffered
                              )?.$id,
                              lastServiceGarageName: garage
                                ? garage?.name
                                : lastServiceGarageName,
                              garage: garage ? garage?.$id : "",
                              userId: currentUserId,
                              customer: profile?.$id,
                              carType: selectedCarType,
                              thirdPartyDetails: {
                                purchaseDate,
                                companyName,
                              },
                              // vehicleImages: [''],
                            };

                            // Create a new document
                            await database
                              .createDocument(
                                environment.appwriteDatabaseId,
                                environment.appwriteVehiclesCollectionId,
                                ID.unique(),
                                objectData,
                                [
                                  Permission.read(Role.user(currentUserId)),
                                  Permission.delete(Role.user(currentUserId)),
                                  Permission.update(Role.user(currentUserId)),
                                ]
                              )
                              .then((res) => {
                                console.log(res);
                                toast.success(() => (
                                  <div className="font-body font-light text-base w-full flex start">
                                    Vehicle added successfully
                                  </div>
                                ));
                              })
                              .catch((error) => {
                                console.log(error.message);
                                toast.error(() => (
                                  <div className="font-body font-light text-base w-full flex start">
                                    Failure. There was an error creating vehicle
                                  </div>
                                ));
                              });

                            setSubmitting(false);
                            setIsSpinnerVisible(false);
                            resetForm({ values: initialValues });
                            setImages(null);
                          }
                        } catch (error) {
                          console.error("An error occurred:", error);
                          setIsSpinnerVisible(false);
                          toast.error(() => (
                            <div className="font-body font-light text-base w-full flex start">
                              Network error. Check your connection
                            </div>
                          ));
                        }
                      }, 5000);
                    } else {
                      setIsSpinnerVisible(false);
                      toast.error(() => (
                        <div className="font-body font-light text-base w-full flex start">
                          Failure. First complete your profile
                        </div>
                      ));
                    }
                  }}
                  validationSchema={toFormikValidationSchema(vehicleSchema)}
                >
                  {(formikProps) => (
                    <Form className="flex flex-col items-center self-center justify-center w-full mt-2 rounded-md md:mt-0">
                      {/* License Plate */}
                      <div className="flex flex-col w-full gap-2 md:flex-row">
                        <div className="md:w-2/4">
                          <h4 className="font-body">Number Plate</h4>
                          <Field
                            type="text"
                            name="licensePlate"
                            className="w-full p-2 text-base border rounded-md outline-none border-secondary-300 placeholder:text-secondary-300 font-body font-regular"
                            placeholder="Enter vehicle number plate"
                          />
                          <ErrorMessage
                            name="licensePlate"
                            component="div"
                            className="text-danger-500"
                          />
                        </div>
                        {/* Chassis Number */}
                        <div className="md:w-2/4">
                          <h4 className="font-body">Chassis Number</h4>
                          <Field
                            type="text"
                            name="chassisNumber"
                            className="w-full p-2 text-base border rounded-md outline-none border-secondary-300 placeholder:text-secondary-300 font-body font-regular"
                            placeholder="Enter vehicle number plate"
                          />
                          <ErrorMessage
                            name="chassisNumber"
                            component="div"
                            className="text-danger-500"
                          />
                        </div>
                      </div>

                      {/* Car Type */}
                      <div className="flex flex-col w-full">
                        <div className="w-full p-1">
                          <h4 className="text-base font-body font-regular">
                            Car Type
                          </h4>
                          <Select
                            name="selectedCarType"
                            options={carTypes}
                            isClearable
                            closeMenuOnSelect
                            getOptionLabel={(option) => option.name}
                            getOptionValue={(option) => option.$id}
                            placeholder="Select car type..."
                            components={{
                              Option: CustomOption,
                            }}
                            onChange={(selectedOption) => {
                              if (selectedOption) {
                                formikProps.setFieldValue(
                                  "selectedCarType",
                                  selectedOption.$id
                                );
                              }
                            }}
                          />

                          <ErrorMessage
                            name="selectedCarType"
                            component="div"
                            className="text-danger-500"
                          />
                        </div>

                        {/* Current Mileage */}
                        <div className="w-full p-1">
                          <h4 className="text-base font-body font-regular">
                            Current Mileage
                          </h4>
                          <Field
                            type="number"
                            name="currentMileage"
                            className="w-full p-2 text-base border rounded-md outline-none font-body font-regular border-secondary-300 placeholder:text-secondary-300"
                            placeholder="Enter vehicle mileage"
                          />
                          <ErrorMessage
                            name="currentMileage"
                            component="div"
                            className="text-danger-500"
                          />
                        </div>
                      </div>

                      {/* Third-party Details */}
                      <div className="flex flex-col w-full">
                        <div className="w-full p-1 mt-3 border border-secondary-50">
                          <h4 className="mb-2 text-base font-body">
                            Third-party details
                          </h4>
                          <div className="flex flex-col w-full lg:flex-row lg:gap-1">
                            <div className="flex flex-col w-full lg:w-2/4">
                              <h4 className="mb-2 text-base font-light font-body">
                                Purchase date
                              </h4>
                              <Field
                                type="date"
                                name="purchaseDate"
                                className="w-full p-2 mb-4 text-base border rounded-md outline-none font-body font-regular border-secondary-300 placeholder:text-secondary-300"
                                placeholder="Purchase Date"
                              />
                              <ErrorMessage
                                name="purchaseDate"
                                component="div"
                                className="text-danger-500"
                              />
                            </div>

                            <div className="flex flex-col w-full lg:w-2/4">
                              <h4 className="mb-2 text-base font-light font-body">
                                Company name
                              </h4>
                              <Field
                                type="text"
                                name="companyName"
                                className="w-full p-2 mb-4 text-base border rounded-md outline-none font-body font-regular border-secondary-300 placeholder:text-secondary-300"
                                placeholder="Company Name"
                              />
                              <ErrorMessage
                                name="companyName"
                                component="div"
                                className="text-danger-500"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Last Service */}
                      <div className="flex flex-col w-full">
                        <div className="w-full p-1 mb-2">
                          <h4 className="text-base font-body font-regular">
                            Last service name
                          </h4>
                          <Select
                            name="lastServicesOffered"
                            options={services}
                            getOptionLabel={(option: any) => option.name}
                            getOptionValue={(option: any) => option.$id}
                            isClearable
                            isSearchable
                            onChange={(newValue) => {
                              if (newValue) {
                                formikProps.setFieldValue(
                                  "lastServicesOffered",
                                  newValue.$id
                                );
                              }
                            }}
                          />
                        </div>

                        {/* Last service garage name  */}
                        <div className="w-full p-1">
                          <h4 className="text-base font-body font-regular">
                            Last service garage name
                          </h4>
                          <Creatable
                            name="lastServiceGarageName"
                            options={garageData}
                            getOptionLabel={(option: any) =>
                              option.name || option.label
                            }
                            getOptionValue={(option: any) => option.$id}
                            isClearable
                            isSearchable
                            onCreateOption={(inputValue) => {
                              if (inputValue) {
                                setGarageData((garageData: any) => [
                                  ...garageData,
                                  { name: inputValue },
                                ]);
                                formikProps.setFieldValue(
                                  "lastServiceGarageName",
                                  inputValue
                                );
                              }
                            }}
                            onChange={(newValue: any) => {
                              if (newValue && newValue.name) {
                                formikProps.setFieldValue(
                                  "lastServiceGarageName",
                                  newValue?.name
                                );
                              } else {
                                formikProps.setFieldValue(
                                  "lastServiceGarageName",
                                  newValue?.label
                                );
                              }
                            }}
                          />
                          <ErrorMessage
                            name="lastServiceGarageName"
                            component="div"
                            className="text-danger-500"
                          />
                        </div>

                        <div className="w-full p-1 mb-2">
                          <h4 className="text-base font-body font-regular">
                            Last date of service
                          </h4>
                          <Field
                            type="date"
                            name="lastServiceDate"
                            className="w-full p-2 text-base border rounded-md outline-none font-body font-regular border-secondary-300 placeholder:text-secondary-300"
                            placeholder="Enter vehicle modal"
                          />
                          <ErrorMessage
                            name="lastServiceDate"
                            component="div"
                            className="text-danger-500"
                          />
                        </div>
                      </div>

                      <div className="flex items-center w-full mt-5">
                        <button
                          type="submit"
                          className="w-2/4 p-1 m-auto text-white rounded-md bg-primary-500"
                          disabled={formikProps.isSubmitting}
                        >
                          Save
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
        {isSpinnerVisible && <Spinner />}
      </div>
    </ErrorBoundary>
  );
};

export default Index;
