"use client";
import React, { useEffect, useState, useRef } from "react";
import { Role, Permission, Query } from "appwrite";
import clsx from "clsx";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { garageSchema } from "@/utils/validators/garageValidator";
import { GarageFormValues } from "@/utils/validators/garageValidator";
import { Salutation } from "@/utils/validators/garageValidator";
import { Gender } from "@/utils/validators/garageValidator";
import Map from "@/components/Map";
import environment from "@/environments/environment";
import Image from "next/image";
import { MdOutlineClose } from "react-icons/md";
import Select, {
  components,
  DropdownIndicatorProps,
  ClearIndicatorProps,
  MultiValueRemoveProps,
  SelectInstance,
} from "react-select";
import CreatableSelect from "react-select/creatable";
import { BiChevronDown } from "react-icons/bi";
import { GrFormClose } from "react-icons/gr";
import toast, { Toaster } from "react-hot-toast";
import ImageUpload from "@/components/ImageUpload";

import DatabaseService from "@/lib/services/database.service";
import StorageService from "@/lib/services/storage.service";
import AuthenticationService from "@/lib/services/authentication.service";
import Alert from "@/components/Alert";
import Spinner from "@/components/Spinner";

const DropdownIndicator = (props: DropdownIndicatorProps) => {
  return (
    <components.DropdownIndicator {...props}>
      <BiChevronDown />
    </components.DropdownIndicator>
  );
};

const ClearIndicator = (props: ClearIndicatorProps) => {
  return (
    <components.ClearIndicator {...props}>
      <GrFormClose className="group-hover:text-danger-700" />
    </components.ClearIndicator>
  );
};

const MultiValueRemove = (props: MultiValueRemoveProps) => {
  return (
    <components.MultiValueRemove {...props}>
      <GrFormClose className="group-hover:text-danger-700" />
    </components.MultiValueRemove>
  );
};

function EditGarage({ params: { id: garageId } }: any) {
  const [garage, setGarage] = useState<any | null>(null);
  const [adminId, setAdminId] = useState<string>("");
  const selectRef = useRef<SelectInstance<string | null>>(null);
  const servicesSelectRef = useRef<SelectInstance<string | null>>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [serviceOptions, setServiceOptions] = useState<any>([]);
  const [selectedServiceOptions, setSelectedServiceOptions] = useState<any>([]);

  const [carTypeOptions, setCarTypeOptions] = useState<any>([]);
  const [selectedCarTypeOptions, setSelectedCarTypeOptions] = useState<any>([]);
  const [districtAreas, setDistrictAreas] = useState<any>([]);
  const [selectedAreas, setSelectedAreas] = useState<any>([]);
  const [areas, setAreas] = useState<any>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<any>(null);

  const [loading, setLoading] = useState<boolean>(true);

  const initialValues: GarageFormValues = {
    name: garage?.name,
    phone: garage?.phone,
    description: garage?.description,
    district: garage?.district,
    areas: garage?.areas,
    garageAddress: {
      name: garage?.garageAddress?.name,
      longitude: garage?.garageAddress?.longitude,
      latitude: garage?.garageAddress?.latitude,
    },
    status: garage?.status,
    logoUrl: garage?.logoUrl,
    logo: "",
    logoField: garage?.logoField,
    primaryCarTypes:
      garage?.primaryCarTypes && garage?.primaryCarTypes?.length > 0
        ? garage?.primaryCarTypes.map((carType: any) => carType.$id)
        : [],
    garageServices:
      garage?.garageServices && garage?.garageServices?.length > 0
        ? garage.garageServices.map(
            ({ price, currency, service: { $id: service } }: any) => {
              return { price, currency, service, createdBy: adminId };
            }
          )
        : [],
    contactPerson: {
      name: garage?.contactPerson?.name,
      email: garage?.contactPerson?.email,
      phone: garage?.contactPerson?.phone,
      gender: garage?.contactPerson?.gender,
      salutation: garage?.contactPerson?.salutation,
      role: garage?.contactPerson?.role,
    },
  };

  useEffect(() => {
    const fetchGarage = async () => {
      const garage = await DatabaseService.getDocument(
        environment.appwriteDatabaseId,
        environment.appwriteGarageCollectionId,
        garageId
      );

      return garage ?? null;
    };

    AuthenticationService.getSession()
      .then((session: any) => {
        setAdminId(session?.$id);
      })
      .catch((error) => {
        console.log("Error: ", error);
      });

    // fetchCarTypes();
    // fetchServices();
    fetchGarage()
      .then(async (garage: any) => {
        console.log("Garage: ", garage);
        const { documents: carTypes } = await DatabaseService.listDocuments(
          environment.appwriteDatabaseId,
          environment.appwriteCarTypesCollectionId
        );

        const { documents: districtAreas } =
          await DatabaseService.listDocuments(
            environment.appwriteDatabaseId,
            environment.appwriteDistrictAreasCollectionId,
            [Query.limit(135)]
          );

        const { documents: services } = await DatabaseService.listDocuments(
          environment.appwriteDatabaseId,
          environment.appwriteServicesCollectionId
        );

        const carTypeOptions = carTypes.map((carType: any, index: number) => ({
          value: carType.$id,
          optionData: carType,
          label: (
            <div
              className="gap-x-1.5 flex items-center"
              key={`${carType.name}-${index}`}
            >
              <div className="w-10">
                <Image
                  className="w-full object-cover object-center"
                  src={`${carType?.logoUrl}`}
                  width={20}
                  height={20}
                  alt=""
                />
              </div>
              <div className="flex flex-col justify-center">
                <span className="font-body text-base font-regular">
                  {carType.name}
                </span>
              </div>
            </div>
          ),
        }));

        const selectedCarTypeOptions = carTypeOptions.filter((option: any) => {
          return garage.primaryCarTypes.find(
            (carType: any) => carType.$id === option.value
          );
        });

        const serviceOptions = services.map((service: any, index: number) => {
          return {
            value: service.$id,
            optionData: service,
            label: (
              <div
                className="flex flex-col justify-center"
                key={`${service.name}-${index}`}
              >
                <span className="font-body text-base font-regular">
                  {service.name}
                </span>
              </div>
            ),
          };
        });

        const selectedServiceOptions = serviceOptions.filter((option: any) => {
          return garage.garageServices.find((garageService: any) => {
            return garageService?.service.$id === option.value;
          });
        });

        const selectedDistrict = (
          await DatabaseService.listDocuments(
            environment.appwriteDatabaseId,
            environment.appwriteDistrictAreasCollectionId,
            [Query.equal("district", garage.district)]
          )
        ).documents[0];

        setSelectedDistrict({
          value: selectedDistrict,
          optionData: selectedDistrict,
          label: (
            <div className="flex flex-col justify-center">
              <span className="font-body text-base font-regular">
                {selectedDistrict.district}
              </span>
            </div>
          ),
        });
        setSelectedAreas(() =>
          garage.areas.map((area: string) => {
            return {
              value: area,
              optionData: area,
              label: (
                <div className="flex flex-col justify-center" key={`${area}`}>
                  <span className="font-body text-base font-regular">
                    {area}
                  </span>
                </div>
              ),
            };
          })
        );
        setDistrictAreas(districtAreas);
        setAreas(selectedDistrict.areas);
        setSelectedCarTypeOptions(selectedCarTypeOptions);
        setCarTypeOptions(carTypeOptions);
        setSelectedServiceOptions(selectedServiceOptions);
        setServiceOptions(serviceOptions);
        setGarage(garage);
        return true;
      })
      .then(() => setLoading(false))
      .catch((error) => console.log(error.message));
  }, []);

  async function handleSubmit(data: any, actions: any): Promise<void> {
    setLoading(true);
    const {
      appwriteGarageLogosBucketId,
      appwriteAdminTeamId,
      appwriteDatabaseId,
      appwriteGarageCollectionId,
      appwriteDistrictAreasCollectionId,
    } = environment;

    const bucketId: string = appwriteGarageLogosBucketId;
    const permissions = [
      Permission.read(Role.any()),
      Permission.update(Role.team(appwriteAdminTeamId)),
      Permission.delete(Role.team(appwriteAdminTeamId)),
    ];

    const {
      contactPerson,
      description,
      garageAddress,
      garageServices,
      name,
      phone,
      primaryCarTypes,
      district,
      areas,
    } = data;

    console.log("Garage Areas: ", areas);

    const distAreasSet = new Set(selectedDistrict.optionData.areas);
    const newAreas = selectedAreas.filter((selectedArea: any) => {
      return !distAreasSet.has(selectedArea.value);
    });

    if (newAreas?.length > 0) {
      const updatedAreaList = [
        ...selectedDistrict.optionData.areas,
        ...newAreas.map((newArea: any) => newArea.value),
      ];
    }

    try {
      if (data?.logo) {
        try {
          try {
            const response = await StorageService.deleteFile(
              bucketId,
              data.logoField
            );
          } catch (error: any) {
            console.log("Error: ", error.message);
          } finally {
            const { $id: logo } = await StorageService.createFile(
              bucketId,
              data.logo,
              permissions
            );

            if (logo) {
              const url = await StorageService.getFileforView(bucketId, logo);

              try {
                const updatedGarage = await DatabaseService.updateDocument(
                  appwriteDatabaseId,
                  appwriteGarageCollectionId,
                  garage.$id,
                  {
                    name,
                    description,
                    contactPerson,
                    garageAddress,
                    garageServices,
                    primaryCarTypes,
                    phone,
                    district: district,
                    areas: areas,
                    logoUrl: url,
                    logoField: logo,
                    createdBy: adminId,
                  }
                );
                if (garage) {
                  setGarage(updatedGarage);
                  const selectedCarTypeOptions = carTypeOptions.filter(
                    (option: any) => {
                      return updatedGarage.primaryCarTypes.find(
                        (carType: any) => carType.$id === option.value
                      );
                    }
                  );
                  const selectedServiceOptions = serviceOptions.filter(
                    (option: any) => {
                      return updatedGarage.garageServices.find(
                        (garageService: any) => {
                          return garageService?.service.$id === option.value;
                        }
                      );
                    }
                  );
                  setSelectedCarTypeOptions(() => selectedCarTypeOptions);
                  setSelectedServiceOptions(() => selectedServiceOptions);
                  if (inputRef && inputRef.current && inputRef.current.value) {
                    inputRef.current.value = updatedGarage.garageAddress.name;
                  }
                  setLoading(false);
                  toast.custom((t) => (
                    <Alert
                      type="success"
                      message="Garage created successfully"
                      toastEvent={t}
                    />
                  ));
                  actions.setSubmitting(false);
                }
              } catch (error: any) {
                console.log("Garage Update Error: ", error.message);
                actions.resetForm({ values: initialValues });
                setLoading(false);
                toast.custom((t) => (
                  <Alert
                    type="failed"
                    message="Failure creating garage"
                    toastEvent={t}
                  />
                ));
                actions.setSubmitting(false);
              }
            }
          }
        } catch (error) {
          console.log(error);
        }
      } else {
        try {
          const updatedGarage = await DatabaseService.updateDocument(
            appwriteDatabaseId,
            appwriteGarageCollectionId,
            garage.$id,
            {
              name,
              description,
              contactPerson,
              garageAddress,
              garageServices,
              primaryCarTypes,
              phone,
              district: district,
              areas: areas,
              logoUrl: data.logoUrl,
              logoField: data.logoField,
              createdBy: adminId,
            }
          );
          if (garage) {
            console.log("Garage: ", updatedGarage);
            setGarage(updatedGarage);
            setGarage(updatedGarage);
            const selectedCarTypeOptions = carTypeOptions.filter(
              (option: any) => {
                return updatedGarage.primaryCarTypes.find(
                  (carType: any) => carType.$id === option.value
                );
              }
            );
            const selectedServiceOptions = serviceOptions.filter(
              (option: any) => {
                return updatedGarage.garageServices.find(
                  (garageService: any) => {
                    return garageService?.service.$id === option.value;
                  }
                );
              }
            );
            setSelectedCarTypeOptions(() => selectedCarTypeOptions);
            setSelectedServiceOptions(() => selectedServiceOptions);
            if (inputRef && inputRef.current && inputRef.current.value) {
              inputRef.current.value = updatedGarage.garageAddress.name;
            }
            setLoading(false);
            toast.custom((t) => (
              <Alert
                type="success"
                message="Garage created successfully"
                toastEvent={t}
              />
            ));
            actions.setSubmitting(false);
          }
        } catch (error: any) {
          console.log("Garage Update Error: ", error.message);
          actions.resetForm({ values: initialValues });
          selectRef.current?.clearValue();
          if (inputRef && inputRef.current && inputRef.current.value) {
            inputRef.current.value = "";
          }

          setLoading(false);
          toast.custom((t) => (
            <Alert
              type="failed"
              message="Failure creating garage"
              toastEvent={t}
            />
          ));
          actions.setSubmitting(false);
        }
      }
    } catch (error: any) {
      toast.custom((t) => (
        <Alert type="failed" message={error.message} toastEvent={t} />
      ));
    }
  }

  const districtOptions = districtAreas.map((item: any, index: number) => ({
    value: item.district,
    optionData: item,
    label: (
      <div
        className="flex flex-col justify-center"
        key={`${item.district}-${item.$id}-${index}`}
      >
        <span className="font-body text-base font-regular">
          {item.district}
        </span>
      </div>
    ),
  }));

  const areaOptions = areas.map((area: string) => ({
    value: area,
    optionData: area,
    label: (
      <div className="flex flex-col justify-center" key={`${area}`}>
        <span className="font-body text-base font-regular">{area}</span>
      </div>
    ),
  }));

  const controlStyles = {
    base: "border-[0.5px] rounded-md bg-white hover:cursor-pointer",
    focus: "border-secondary-500 ring-none",
    nonFocus: "border-secondary-100",
  };

  const servicesControlStyles = {
    base: "border-[0.5px] rounded-md bg-white hover:cursor-pointer w-full col-span-4 flex overflow-x-auto min-h-10",
    focus: "border-secondary-500 ring-none",
    nonFocus: "border-secondary-100",
  };

  const placeholderStyles =
    "text-secondary-200 pl-1 py-0.5 font-body text-base font-light";
  const selectInputStyles = "pl-1 py-0.5";
  const valueContainerStyles = "p-1 gap-1";
  const singleValueStyles = "leading-7 ml-1";
  const multiValueStyles =
    "bg-gray-100 rounded items-center py-0.5 pl-2 pr-1 gap-1.5";
  const multiValueLabelStyles = "leading-6 py-0.5";
  const multiValueRemoveStyles =
    "border border-gray-200 bg-white hover:bg-red-50 hover:text-red-800 text-gray-500 hover:border-red-300 rounded-md";
  const indicatorsContainerStyles = "p-1 gap-1";
  const clearIndicatorStyles =
    "text-gray-500 p-1 rounded-md hover:bg-red-50 hover:text-red-800";
  const indicatorSeparatorStyles = "bg-gray-300";
  const dropdownIndicatorStyles =
    "p-1 hover:bg-gray-100 text-gray-500 rounded-md hover:text-black";
  const menuStyles = "p-1 mt-2 border border-gray-200 bg-white rounded-lg";
  const groupHeadingStyles = "ml-3 mt-2 mb-1 text-gray-500 text-sm";
  const optionStyles = {
    base: "hover:cursor-pointer px-3 py-2 rounded flex flex-row items-center gap-x-2",
    focus: "bg-gray-100 active:bg-secondary-50",
    selected:
      "text-secondary-700 flex flex-row hidden bg-danger-50 pointer-events-none",
  };
  const noOptionsMessageStyles =
    "text-gray-500 p-2 bg-gray-50 border border-dashed border-gray-200 rounded-sm";

  return (
    <div className="w-full pb-5 pt-5 lg:pt-0 z-10 relative">
      <Toaster />
      {loading && <Spinner loaderText="Updating garage information" />}
      <h2 className="font-body text-lg font-bold py-1">Edit Garage</h2>
      <Formik
        onSubmit={handleSubmit}
        validationSchema={toFormikValidationSchema(garageSchema)}
        initialValues={initialValues}
        enableReinitialize={true}
      >
        {({ values, setFieldValue, isSubmitting, errors }) => {
          return (
            <Form className="grid grid-cols-2 gap-5">
              <div className="col-span-2 flex flex-col gap-y-1">
                <h2 className="font-body text-base font-regular">
                  Garage Logo
                </h2>
                <div className="relative w-96 h-24 mb-2 ">
                  <div className="absolute flex items-end justify-between w-11/12">
                    <div
                      className="bg-white w-28 h-28 overflow-hidden bg-cover border-2 border-white"
                      style={{ backgroundImage: `url(${values?.logoUrl})` }}
                    ></div>
                    <label
                      htmlFor="logoUrl"
                      className="cursor-pointer bg-secondary-50 bg-opacity-5 w-28 h-28  border-[0.5px] rounded-sm z-10 absolute top-0 left-0 flex gap-1 justify-center items-center text-white "
                    >
                      {!values?.logoUrl && (
                        <span
                          className={`font-body text-black text-center text-sm`}
                        >
                          Upload logo
                        </span>
                      )}
                      <ImageUpload
                        fileRef="logo"
                        urlRef="logoUrl"
                        inputStyles="absolute opacity-0 h-full w-full bg-danger-500 hidden"
                        setFieldValue={setFieldValue}
                      />
                      {values?.logoUrl && (
                        <button
                          type="button"
                          className="text-white rounded p-1.5 absolute -top-2 -right-2 bg-primary-500 bg-opacity-80 hover:bg-opacity-100 transition-all duration-300 z-20 cursor-pointer"
                          onClick={(event) => {
                            event.preventDefault();
                            setFieldValue("logo", null);
                            setFieldValue("logoUrl", null);
                          }}
                        >
                          <MdOutlineClose size={15} />
                        </button>
                      )}
                    </label>
                  </div>
                </div>
                <div className="mt-2">
                  <ErrorMessage name="logoUrl">
                    {(msg: string) => (
                      <div className="text-xs text-danger-500 font-body font-light">
                        {msg}
                      </div>
                    )}
                  </ErrorMessage>
                </div>
              </div>

              <div className="flex flex-col gap-y-1 col-span-2 md:col-span-1">
                <label
                  htmlFor="name"
                  className="font-body text-base font-regular"
                >
                  Garage Name
                </label>
                <Field
                  name="name"
                  type="text"
                  className="border-[0.5px] border-secondary-100 placeholder:font-body placeholder:font-light  focus:border-secondary-500 rounded p-2 outline-none font-body text-base font-light "
                  placeholder="Enter name"
                />
                <div className="">
                  <ErrorMessage name="name">
                    {(msg: string) => (
                      <div className="text-xs text-danger-500 font-body font-light">
                        {msg}
                      </div>
                    )}
                  </ErrorMessage>
                </div>
              </div>
              <div className="flex flex-col gap-y-1 col-span-2 md:col-span-1">
                <label
                  htmlFor="phone"
                  className="font-body text-base font-regular"
                >
                  Phone Number
                </label>
                <Field
                  name="phone"
                  type="text"
                  placeholder="Enter phone number"
                  className="border-[0.5px] border-secondary-100 placeholder:font-body placeholder:font-light  focus:border-secondary-500 rounded p-2 outline-none font-body text-base font-light"
                />
                <div className="">
                  <ErrorMessage name="phone">
                    {(msg: string) => (
                      <div className="text-xs text-danger-500 font-body font-light">
                        {msg}
                      </div>
                    )}
                  </ErrorMessage>
                </div>
              </div>
              <div className="flex flex-col gap-y-1 col-span-2">
                <label
                  htmlFor="description"
                  className="font-body text-base font-regular"
                >
                  Description
                </label>
                <Field
                  name="description"
                  type="text"
                  placeholder="Describe your garage here"
                  className="border-[0.5px] border-secondary-100 focus:border-secondary-500 placeholder:font-body placeholder:font-light  rounded p-2 outline-none font-body text-base font-light resize-none"
                  as="textarea"
                  rows={3}
                />
                <div className="">
                  <ErrorMessage name="description">
                    {(msg: string) => (
                      <div className="text-xs text-danger-500 font-body font-light">
                        {msg}
                      </div>
                    )}
                  </ErrorMessage>
                </div>
              </div>
              <section className="flex flex-col col-span-2">
                <Map inputRef={inputRef} />
                <ErrorMessage name="garageAddress.name">
                  {(msg: string) => (
                    <div className="text-xs text-danger-500 font-body font-light">
                      {msg}
                    </div>
                  )}
                </ErrorMessage>
              </section>

              <div className="flex flex-col gap-y-2 col-span-2 md:col-span-1">
                <h3 className="font-body text-base font-regular py-1">
                  District
                </h3>
                <Field name="district">
                  {({ field, form }: any) => {
                    return (
                      <Select
                        value={selectedDistrict}
                        onChange={(selectedOption: any) => {
                          console.log("Values", values);
                          console.log("Selected Option", selectedOption);
                          if (selectedOption) {
                            form.setFieldValue(
                              field.name,
                              selectedOption.optionData.district
                            );
                          }
                          setSelectedDistrict(() => selectedOption);
                          setSelectedAreas(() => []);
                          setAreas(
                            () => selectedOption?.optionData?.areas ?? []
                          );
                        }}
                        closeMenuOnSelect={true}
                        options={districtOptions}
                        unstyled
                        placeholder="Select District"
                        styles={{
                          input: (base) => ({
                            ...base,
                            "input:focus": {
                              boxShadow: "none",
                            },
                          }),
                          multiValueLabel: (base) => ({
                            ...base,
                            whiteSpace: "normal",
                            overflow: "visible",
                          }),
                          control: (base) => ({
                            ...base,
                            transition: "none",
                          }),
                        }}
                        components={{
                          DropdownIndicator,
                          ClearIndicator,
                          MultiValueRemove,
                        }}
                        classNames={{
                          control: ({ isFocused }) =>
                            clsx(
                              isFocused
                                ? servicesControlStyles.focus
                                : servicesControlStyles.nonFocus,
                              servicesControlStyles.base
                            ),
                          placeholder: () => placeholderStyles,
                          input: () => selectInputStyles,
                          valueContainer: () => valueContainerStyles,
                          singleValue: () => singleValueStyles,
                          multiValue: () => multiValueStyles,
                          multiValueLabel: () => multiValueLabelStyles,
                          multiValueRemove: () => multiValueRemoveStyles,
                          indicatorsContainer: () => indicatorsContainerStyles,
                          clearIndicator: () => clearIndicatorStyles,
                          indicatorSeparator: () => indicatorSeparatorStyles,
                          dropdownIndicator: () => dropdownIndicatorStyles,
                          menu: () => menuStyles,
                          groupHeading: () => groupHeadingStyles,
                          option: ({ isFocused, isSelected }) =>
                            clsx(
                              isFocused && optionStyles.focus,
                              isSelected && optionStyles.selected,
                              optionStyles.base
                            ),
                          noOptionsMessage: () => noOptionsMessageStyles,
                        }}
                      />
                    );
                  }}
                </Field>
                <div className="">
                  <ErrorMessage name="district">
                    {(msg: string) => (
                      <div className="text-xs text-danger-500 font-body font-light">
                        {msg}
                      </div>
                    )}
                  </ErrorMessage>
                </div>
              </div>

              <div className="flex flex-col gap-y-2 col-span-2 md:col-span-1">
                <h3 className="font-body text-base font-regular py-1">Areas</h3>
                <Field name="areas">
                  {({ field, form }: any) => {
                    return (
                      <CreatableSelect
                        isMulti
                        onChange={(selectedOptions: any) => {
                          setSelectedAreas(() => selectedOptions);
                          form.setFieldValue(
                            field.name,
                            selectedOptions.map((option: any) => option.value)
                          );
                        }}
                        onCreateOption={(label: string) => {
                          const newOption = {
                            value: label,
                            optionData: label,
                            label: (
                              <div
                                className="flex flex-col justify-center"
                                key={`${label}`}
                              >
                                <span className="font-body text-base font-regular">
                                  {label}
                                </span>
                              </div>
                            ),
                          };
                          setSelectedAreas((selectedAreas: any[]) => [
                            ...selectedAreas,
                            newOption,
                          ]);
                          setAreas((areas: any[]) => [...areas, label]);
                          form.setFieldValue(field.name, [
                            ...values.areas,
                            label,
                          ]);
                        }}
                        closeMenuOnSelect={false}
                        options={areaOptions}
                        unstyled
                        placeholder="Select Areas"
                        styles={{
                          input: (base) => ({
                            ...base,
                            "input:focus": {
                              boxShadow: "none",
                            },
                          }),
                          multiValueLabel: (base) => ({
                            ...base,
                            whiteSpace: "normal",
                            overflow: "visible",
                          }),
                          control: (base) => ({
                            ...base,
                            transition: "none",
                          }),
                        }}
                        components={{
                          DropdownIndicator,
                          ClearIndicator,
                          MultiValueRemove,
                        }}
                        classNames={{
                          control: ({ isFocused }) =>
                            clsx(
                              isFocused
                                ? servicesControlStyles.focus
                                : servicesControlStyles.nonFocus,
                              servicesControlStyles.base
                            ),
                          placeholder: () => placeholderStyles,
                          input: () => selectInputStyles,
                          valueContainer: () => valueContainerStyles,
                          singleValue: () => singleValueStyles,
                          multiValue: () => multiValueStyles,
                          multiValueLabel: () => multiValueLabelStyles,
                          multiValueRemove: () => multiValueRemoveStyles,
                          indicatorsContainer: () => indicatorsContainerStyles,
                          clearIndicator: () => clearIndicatorStyles,
                          indicatorSeparator: () => indicatorSeparatorStyles,
                          dropdownIndicator: () => dropdownIndicatorStyles,
                          menu: () => menuStyles,
                          groupHeading: () => groupHeadingStyles,
                          option: ({ isFocused, isSelected }) =>
                            clsx(
                              isFocused && optionStyles.focus,
                              isSelected && optionStyles.selected,
                              optionStyles.base
                            ),
                          noOptionsMessage: () => noOptionsMessageStyles,
                        }}
                        value={selectedAreas}
                      />
                    );
                  }}
                </Field>
                <div className="">
                  <ErrorMessage name="areas">
                    {(msg: string) => (
                      <div className="text-xs text-danger-500 font-body font-light">
                        {msg}
                      </div>
                    )}
                  </ErrorMessage>
                </div>
              </div>

              {/* Services */}
              <section className="flex flex-col col-span-2">
                <h3 className="font-body text-base font-semibold py-1">
                  Services
                </h3>
                <Field name="garageServices">
                  {({ field, form }: any) => {
                    return (
                      <Select
                        isMulti
                        ref={servicesSelectRef}
                        value={selectedServiceOptions}
                        onChange={(selectedOptions: any) => {
                          console.log("Values", values);
                          form.setFieldValue(
                            field.name,
                            selectedOptions.map((option: any) => ({
                              service: option.value,
                              createdBy: adminId,
                              price: 0,
                              currency: "",
                            }))
                          );
                          setSelectedServiceOptions(selectedOptions);
                        }}
                        closeMenuOnSelect={false}
                        options={serviceOptions}
                        unstyled
                        placeholder="Select Car Types"
                        styles={{
                          input: (base) => ({
                            ...base,
                            "input:focus": {
                              boxShadow: "none",
                            },
                          }),
                          multiValueLabel: (base) => ({
                            ...base,
                            whiteSpace: "normal",
                            overflow: "visible",
                          }),
                          control: (base) => ({
                            ...base,
                            transition: "none",
                          }),
                        }}
                        components={{
                          DropdownIndicator,
                          ClearIndicator,
                          MultiValueRemove,
                        }}
                        classNames={{
                          control: ({ isFocused }) =>
                            clsx(
                              isFocused
                                ? servicesControlStyles.focus
                                : servicesControlStyles.nonFocus,
                              servicesControlStyles.base
                            ),
                          placeholder: () => placeholderStyles,
                          input: () => selectInputStyles,
                          valueContainer: () => valueContainerStyles,
                          singleValue: () => singleValueStyles,
                          multiValue: () => multiValueStyles,
                          multiValueLabel: () => multiValueLabelStyles,
                          multiValueRemove: () => multiValueRemoveStyles,
                          indicatorsContainer: () => indicatorsContainerStyles,
                          clearIndicator: () => clearIndicatorStyles,
                          indicatorSeparator: () => indicatorSeparatorStyles,
                          dropdownIndicator: () => dropdownIndicatorStyles,
                          menu: () => menuStyles,
                          groupHeading: () => groupHeadingStyles,
                          option: ({ isFocused, isSelected }) =>
                            clsx(
                              isFocused && optionStyles.focus,
                              isSelected && optionStyles.selected,
                              optionStyles.base
                            ),
                          noOptionsMessage: () => noOptionsMessageStyles,
                        }}
                      />
                    );
                  }}
                </Field>
              </section>

              {/* Car Types */}
              <section className="flex flex-col col-span-2">
                <div className="flex flex-col gap-y-1 col-span-2">
                  <label
                    htmlFor={`carTypes`}
                    className="font-body text-base font-regular"
                  >
                    Car Types
                  </label>
                  {carTypeOptions && (
                    <Field name="primaryCarTypes">
                      {({ field, form }: any) => {
                        return (
                          <Select
                            isMulti
                            ref={selectRef}
                            value={selectedCarTypeOptions}
                            onChange={(selectedOptions: any) => {
                              form.setFieldValue(
                                field.name,
                                selectedOptions.map(
                                  (option: any) => option.value
                                )
                              );
                              setSelectedCarTypeOptions(selectedOptions);
                            }}
                            closeMenuOnSelect={false}
                            options={carTypeOptions}
                            unstyled
                            placeholder="Select Car Types"
                            styles={{
                              input: (base) => ({
                                ...base,
                                "input:focus": {
                                  boxShadow: "none",
                                },
                              }),
                              multiValueLabel: (base) => ({
                                ...base,
                                whiteSpace: "normal",
                                overflow: "visible",
                              }),
                              control: (base) => ({
                                ...base,
                                transition: "none",
                              }),
                            }}
                            components={{
                              DropdownIndicator,
                              ClearIndicator,
                              MultiValueRemove,
                            }}
                            classNames={{
                              control: ({ isFocused }) =>
                                clsx(
                                  isFocused
                                    ? controlStyles.focus
                                    : controlStyles.nonFocus,
                                  controlStyles.base
                                ),
                              placeholder: () => placeholderStyles,
                              input: () => selectInputStyles,
                              valueContainer: () => valueContainerStyles,
                              singleValue: () => singleValueStyles,
                              multiValue: () => multiValueStyles,
                              multiValueLabel: () => multiValueLabelStyles,
                              multiValueRemove: () => multiValueRemoveStyles,
                              indicatorsContainer: () =>
                                indicatorsContainerStyles,
                              clearIndicator: () => clearIndicatorStyles,
                              indicatorSeparator: () =>
                                indicatorSeparatorStyles,
                              dropdownIndicator: () => dropdownIndicatorStyles,
                              menu: () => menuStyles,
                              groupHeading: () => groupHeadingStyles,
                              option: ({ isFocused, isSelected }) =>
                                clsx(
                                  isFocused && optionStyles.focus,
                                  isSelected && optionStyles.selected,
                                  optionStyles.base
                                ),
                              noOptionsMessage: () => noOptionsMessageStyles,
                            }}
                          />
                        );
                      }}
                    </Field>
                  )}
                  <div className="">
                    <ErrorMessage name={`carTypes`}>
                      {(msg: string) => (
                        <div className="text-xs text-danger-500 font-body font-light">
                          {msg}
                        </div>
                      )}
                    </ErrorMessage>
                  </div>
                </div>
              </section>

              <section className="flex flex-col col-span-2 gap-y-2">
                <h3 className="font-body text-base font-semibold py-1">
                  Contact Person
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  <div className="flex flex-col gap-y-1 md:col-span-1">
                    <label
                      htmlFor="contactPersonName"
                      className="font-body text-base font-regular"
                    >
                      Name
                    </label>
                    <Field
                      id="contactPersonName"
                      name="contactPerson.name"
                      type="text"
                      placeholder="Eg. John Doe"
                      className="border-[0.5px] border-secondary-100 placeholder:font-body placeholder:font-light  focus:border-secondary-500 rounded p-2 outline-none font-body text-base font-light"
                    />
                    <div className="">
                      <ErrorMessage name={`contactPerson.name`}>
                        {(msg: string) => (
                          <div className="text-xs text-danger-500 font-body font-light">
                            {msg}
                          </div>
                        )}
                      </ErrorMessage>
                    </div>
                  </div>
                  <div className="flex flex-col gap-y-1 md:col-span-1">
                    <label
                      htmlFor="contactPersonEmail"
                      className="font-body text-base font-regular"
                    >
                      Email
                    </label>
                    <Field
                      id="contactPersonEmail"
                      name="contactPerson.email"
                      type="text"
                      placeholder="Eg. johndoe@garage.com"
                      className="border-[0.5px] border-secondary-100 placeholder:font-body placeholder:font-light  focus:border-secondary-500 rounded p-2 outline-none font-body text-base font-light"
                    />
                    <div className="">
                      <ErrorMessage name={`contactPerson.email`}>
                        {(msg: string) => (
                          <div className="text-xs text-danger-500 font-body font-light">
                            {msg}
                          </div>
                        )}
                      </ErrorMessage>
                    </div>
                  </div>
                  <div className="flex flex-col gap-y-1  ">
                    <label
                      htmlFor="contactPersonPhone"
                      className="font-body text-base font-regular"
                    >
                      Phone
                    </label>
                    <Field
                      id="contactPersonPhone"
                      name="contactPerson.phone"
                      type="text"
                      placeholder="Eg. 0777777777"
                      className="border-[0.5px] border-secondary-100 placeholder:font-body placeholder:font-light  focus:border-secondary-500 rounded p-2 outline-none font-body text-base font-light"
                    />
                    <div className="">
                      <ErrorMessage name={`contactPerson.phone`}>
                        {(msg: string) => (
                          <div className="text-xs text-danger-500 font-body font-light">
                            {msg}
                          </div>
                        )}
                      </ErrorMessage>
                    </div>
                  </div>
                  <div className="flex flex-col gap-y-1 ">
                    <label
                      htmlFor="contactPersonGender"
                      className="font-body text-base font-regular"
                    >
                      Gender
                    </label>
                    <Field
                      id="contactPersonGender"
                      name="contactPerson.gender"
                      as="select"
                      className="border-[0.5px] border-secondary-100 placeholder:font-body placeholder:font-light  focus:border-secondary-500 rounded px-2 py-1.5 outline-none font-body text-base font-light"
                    >
                      <option value="" selected disabled>
                        Select Gender
                      </option>
                      {Object.values(Gender).map((gender) => (
                        <option key={gender} value={gender}>
                          {gender}
                        </option>
                      ))}
                    </Field>
                    <div className="">
                      <ErrorMessage name={`contactPerson.gender`}>
                        {(msg: string) => (
                          <div className="text-xs text-danger-500 font-body font-light">
                            {msg}
                          </div>
                        )}
                      </ErrorMessage>
                    </div>
                  </div>
                  <div className="flex flex-col gap-y-1 ">
                    <label
                      htmlFor="contactPersonSalutation"
                      className="font-body text-base font-regular"
                    >
                      Salutation
                    </label>
                    <Field
                      id="contactPersonSalutation"
                      name="contactPerson.salutation"
                      as="select"
                      className="border-[0.5px] border-secondary-100 placeholder:font-body placeholder:font-light  focus:border-secondary-500 rounded px-2 py-1.5 outline-none font-body text-base font-light"
                    >
                      <option value="" selected disabled>
                        Select Salutation
                      </option>
                      {Object.values(Salutation).map((salutation) => (
                        <option key={salutation} value={salutation}>
                          {salutation}
                        </option>
                      ))}
                    </Field>
                    <div className="">
                      <ErrorMessage name={`contactPerson.salutation`}>
                        {(msg: string) => (
                          <div className="text-xs text-danger-500 font-body font-light">
                            {msg}
                          </div>
                        )}
                      </ErrorMessage>
                    </div>
                  </div>
                  <div className="flex flex-col gap-y-1 ">
                    <label
                      htmlFor="contactPersonRole"
                      className="font-body text-base font-regular"
                    >
                      Role
                    </label>
                    <Field
                      id="contactPersonRole"
                      name="contactPerson.role"
                      type="text"
                      placeholder="Eg. General Manager"
                      className="border-[0.5px] border-secondary-100 placeholder:font-body placeholder:font-light  focus:border-secondary-500 rounded p-2 outline-none font-body text-base font-light"
                    />
                    <div className="">
                      <ErrorMessage name={`contactPerson.role`}>
                        {(msg: string) => (
                          <div className="text-xs text-danger-500 font-body font-light">
                            {msg}
                          </div>
                        )}
                      </ErrorMessage>
                    </div>
                  </div>
                </div>
              </section>
              <button
                type="submit"
                value="Submit"
                className="text-base font-regular text-white font-body text-center p-2 bg-primary-500 rounded w-full capitalize col-span-2 md:col-span-1 md:w-fit"
                disabled={isSubmitting}
              >
                Save Garage
              </button>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}

export default EditGarage;
