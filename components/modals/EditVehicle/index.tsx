import { database } from "@/appwrite/appwrite";
import CustomOption from "@/components/CustomSelect";
import PictureUpload from "@/components/PictureUpload";
import Spinner from "@/components/Spinner";
import environment from "@/environments/environment";
import { format, parseISO, isValid } from "date-fns";

import { Formik, Form, Field, ErrorMessage, FormikProps } from "formik";

import Image from "next/image";
import React from "react";
import { toast, ToastContainer } from "react-toastify";
import { AiOutlineClose } from "react-icons/ai";
import Select from "react-select";

interface EditVehicleProps {
  isEdit: boolean;
  handleIsEdit: () => void;
  vehicle: any;
  carTypes: any;
  garageData: any;
  services: any;
  fetch: () => void;
}

interface FormValues {
  selectedCarType: string;
  vehicleImage: string;
  licensePlate: string;
  chassisNumber: string;
  currentMileage: string;
  lastServiceDate: string;
  lastServiceGarageName: string;
  purchaseDate: string;
  companyName: string;
  lastServicesOffered: string;
}

const Index: React.FC<EditVehicleProps> = ({
  isEdit,
  vehicle,
  carTypes,
  garageData,
  services,
  handleIsEdit,
  fetch,
}) => {
  const modelTrue =
    "top-12 visible transform -translate-x-2/4 -trnaslate-y-2/4 scale-100";
  const modelFalse =
    "top-0 invisible transform -translate-x-2/4 -trnaslate-y-2/4 scale-50";
  const [images, setImages] = React.useState<string | null>(null);
  const [isSpinnerVisible, setIsSpinnerVisible] =
    React.useState<boolean>(false);

  const initialValues: FormValues = {
    selectedCarType: vehicle?.carType?.name || "",
    vehicleImage: "",
    licensePlate: vehicle?.licensePlate || "",
    chassisNumber: vehicle?.chassisNumber || "",
    currentMileage: vehicle?.currentMileage || "",
    lastServiceDate: vehicle?.lastServiceDate || "",
    lastServiceGarageName: vehicle?.lastServiceGarageName || "",
    purchaseDate: vehicle?.third_party_details?.purchaseDate || "",
    companyName: vehicle?.third_party_details?.companyName || "",
    lastServicesOffered: vehicle?.lastServicesOffered?.name || "",
  };

  React.useEffect(() => {
    if (vehicle?.vehicleImages) {
      setImages(vehicle?.vehicleImages[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // console.log(vehicle.$id)
  return (
    <div
      className={`absolute w-4/5 pt-3 md:top-1/3 lg:top-5 lg:w-2/5 md:w-3/5 bg-white rounded-md left-2/4 pl-7 pr-7 pb-7 ${
        isEdit ? modelTrue : modelFalse
      } z-20`}
    >
      {/* When the form is submitting, load a spinner */}
      {isSpinnerVisible && <Spinner />}
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
      <div className="flex flex-row items-center justify-between mb-5">
        <div></div>
        <h5 className="font-extrabold font-heading text-primary-500">
          Edit Vehicle Information
        </h5>
        <div className="p-1 rounded-lg cursor-pointer bg-primary-50">
          <AiOutlineClose
            width={50}
            onClick={handleIsEdit}
            className="cursor-pointer fill-secondary-500"
          />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center">
        <div>
          {images && (
            <div className="w-full">
              <PictureUpload
                uploadMessage=""
                outterContainer=""
                innerContainer=""
                selected={images}
                setSelected={setImages}
              />
            </div>
          )}
        </div>
        <Formik
          initialValues={initialValues}
          onSubmit={async (
            {
              selectedCarType,
              vehicleImage,
              licensePlate,
              chassisNumber,
              currentMileage,
              lastServiceDate,
              lastServiceGarageName,
              purchaseDate,
              companyName,
              lastServicesOffered,
            },
            { setSubmitting }
          ) => {
            // Simulate an API request
            setIsSpinnerVisible(true);
            setTimeout(async () => {
              try {
                if (vehicleImage) {
                }
                const garage = garageData.find(
                  (garage: any) => garage?.name === lastServiceGarageName
                );
                const updateData = await database.updateDocument(
                  environment.appwriteDatabaseId,
                  environment.appwriteVehiclesCollectionId,
                  vehicle?.$id,
                  {
                    licensePlate,
                    chassisNumber,
                    currentMileage,
                    lastServiceDate,
                    lastServicesOffered: services.find(
                      (service: any) => service.name === lastServicesOffered
                    )?.$id,
                    lastServiceGarageName: garage
                      ? garage?.name
                      : lastServiceGarageName,
                    garage: garage ? garage?.$id : "",
                    carType:
                      carTypes.find(
                        (carType: any) => carType.name === selectedCarType
                      )?.$id || selectedCarType,
                    third_party_details: {
                      purchaseDate,
                      companyName,
                    },
                  }
                );

                setIsSpinnerVisible(false);
                setSubmitting(false);
                handleIsEdit();
                fetch();
              } catch (error) {
                setIsSpinnerVisible(false);
                toast.error(() => (
                  <div className="font-body font-light text-base w-full flex start">
                    Failure. Please check your internet connection
                  </div>
                ));
              }
            }, 5000);
          }}
        >
          {(formikProps) => (
            <Form className="flex flex-col items-center self-center justify-center rounded-md">
              {/* License Plate */}
              <div className="flex flex-col w-full lg:flex-row">
                <div className="w-full p-1 lg:w-2/4">
                  <h4 className="font-body">Number Plate</h4>
                  <Field
                    className="w-full p-2 text-base border rounded-md outline-none border-secondary-300 placeholder:text-secondary-300 font-body font-regular"
                    type="text"
                    name="licensePlate"
                    placeholder={formikProps.initialValues.licensePlate}
                  />
                  <ErrorMessage
                    name="licensePlate"
                    component="div"
                    className="text-danger-500"
                  />
                </div>

                {/* Chassis Number */}
                <div className="w-full p-1 lg:w-2/4">
                  <h4 className="font-body">Chassis Number</h4>
                  <Field
                    className="w-full p-2 text-base border rounded-md outline-none font-body font-regular border-secondary-300 placeholder:text-secondary-300"
                    type="text"
                    name="chassisNumber"
                    placeholder="Enter chassis number"
                  />
                  <ErrorMessage
                    name="chassisNumber"
                    component="div"
                    className="text-danger-500"
                  />
                </div>
              </div>

              {/* Car Type */}
              <div className="flex flex-col w-full lg:flex-row">
                <div className="w-full p-1 lg:w-2/4">
                  <h4 className="text-base font-body font-regular">Car Type</h4>
                  <Select
                    name="selectedCarType"
                    options={carTypes}
                    isClearable
                    closeMenuOnSelect
                    getOptionLabel={(option: any) => option.name}
                    getOptionValue={(option: any) => option.$id}
                    value={carTypes.find(
                      (option: any) =>
                        option.name == formikProps.values.selectedCarType
                    )}
                    placeholder="Select..."
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
                <div className="w-full p-1 lg:w-2/4">
                  <h4 className="text-base font-body font-regular">
                    Current Mileage
                  </h4>
                  <Field
                    className="w-full p-2 text-base border rounded-md outline-none font-body font-regular border-secondary-300 placeholder:text-secondary-300"
                    type="number"
                    name="currentMileage"
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
                  <h4 className="mb-2 text-base font-body font-regular">
                    Third-party details
                  </h4>
                  <div className="flex flex-col w-full lg:flex-row lg:gap-1">
                    <div className="flex flex-col w-full lg:w-2/4">
                      <Field
                        className="w-full p-2 mb-4 text-base border rounded-md outline-none font-body font-regular border-secondary-300 placeholder:text-secondary-300"
                        type="date"
                        name="purchaseDate"
                        placeholder="Purchase Date"
                        value={
                          isValid(formikProps.values.purchaseDate)
                            ? format(
                                parseISO(formikProps.values.purchaseDate),
                                "yyyy-MM-dd"
                              )
                            : ""
                        }
                      />
                      <ErrorMessage
                        name="purchaseDate"
                        component="div"
                        className="text-danger-500"
                      />
                    </div>

                    <div className="flex flex-col w-full lg:w-2/4">
                      <Field
                        className="w-full p-2 mb-4 text-base border rounded-md outline-none font-body font-regular border-secondary-300 placeholder:text-secondary-300"
                        type="text"
                        name="companyName"
                        // value={ formikProps.values.companyName }
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
              <div className="flex flex-col w-full lg:flex-row">
                <div className="w-full p-1 mb-2 lg:w-2/4">
                  <h4 className="text-base font-body font-regular">
                    Last date of service
                  </h4>
                  <Field
                    className="w-full p-2 text-base border rounded-md outline-none font-body font-regular border-secondary-300 placeholder:text-secondary-300"
                    type="date"
                    name="lastServiceDate"
                    placeholder="Enter vehicle modal"
                    value={format(
                      parseISO(formikProps.values.lastServiceDate),
                      "yyyy-MM-dd"
                    )}
                  />
                  <ErrorMessage
                    name="lastServiceDate"
                    component="div"
                    className="text-danger-500"
                  />
                </div>

                {/* Last service garage name  */}
                <div className="w-full p-1 lg:w-2/4">
                  <h4 className="text-base font-body font-regular">
                    Last service garage name
                  </h4>
                  <Select
                    name="lastServiceGarageName"
                    options={garageData}
                    value={
                      garageData &&
                      garageData?.length > 0 &&
                      garageData.find(
                        (option: any) =>
                          option.name ==
                          formikProps.values.lastServiceGarageName
                      )
                    }
                    getOptionLabel={(option: any) =>
                      option.name || option.label
                    }
                    getOptionValue={(option: any) => option.$id}
                    isClearable
                    isSearchable
                    onChange={(newValue: any) => {
                      if (newValue) {
                        formikProps.setFieldValue(
                          "lastServiceGarageName",
                          newValue?.name
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
  );
};
export default Index;
