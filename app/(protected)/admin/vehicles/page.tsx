"use client";
import React, { Fragment, useEffect, useState } from "react";
import format from "date-fns/format";
import parseISO from "date-fns/parseISO";
import { BiSearch } from "react-icons/bi";
import TablePaginate from "@/components/Paginate";
import DatabaseService from "@/lib/services/database.service";
import environment from "@/environments/environment";
import Image from "next/image";
import Spinner from "@/components/Spinner";
import VehicleModal from "@/components/modals/vehicle";
import Select, {
  DropdownIndicatorProps,
  ClearIndicatorProps,
  MultiValueRemoveProps,
  components,
} from "react-select";

import { BiChevronDown } from "react-icons/bi";
import { GrFormClose } from "react-icons/gr";
import clsx from "clsx";
import { appwriteClient } from "@/appwrite/appwrite";
import { Query } from "appwrite";
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

interface Vehicle {
  $id: string
}
function Vehicles() {
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [carType, setCarType] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [customerModal, setCustomerModal] = useState<boolean>(false);
  const [customerData, setCustomerData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [carTypes, setCarTypes] = useState<any[]>([]);
  const [totalVehicles, setTotalVehicles] = useState<number>(0);
  const {
    appwriteDatabaseId,
    appwriteVehiclesCollectionId,
    appwriteCarTypesCollectionId,
  } = environment;

  const dateFormat = "dd MMM yyyy";

  const controlStyles = {
    base: "border-[0.5px] rounded-md bg-white hover:cursor-pointer w-56 text-sm",
    focus: "border-secondary-100 ring-none caret-transparent",
    nonFocus: "border-secondary-100",
  };

  const placeholderStyles =
    "text-secondary-200 pl-1 py-0.5 font-body text-sm font-light";
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

  let carOptions = carTypes.map((carType: any, index: number) => ({
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

  const carTypeOptions = [
    {
      value: "all",
      optionData: { name: "All" },
      label: (
        <div
          className="gap-x-1.5 flex items-center"
          key={`all-${carTypes.length}`}
        >
          <div className="flex flex-col justify-center">
            <span className="font-body text-base font-regular capitalize">
              all
            </span>
          </div>
        </div>
      ),
    },
    ...carOptions,
  ];

  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);

      const vehicles = await DatabaseService.listDocuments(
        appwriteDatabaseId,
        appwriteVehiclesCollectionId
      );

      const carTypes = await DatabaseService.listDocuments(
        appwriteDatabaseId,
        appwriteCarTypesCollectionId,
        [
          Query.limit(itemsPerPage),
          Query.offset(itemsPerPage * (currentPage - 1)),
          Query.orderDesc("$createdAt"),
        ]
      );

      setVehicles(vehicles.documents);
      setCarTypes(carTypes.documents);
      setTotalVehicles(vehicles.total);
      setLoading(false);
    };

    fetchVehicles();
    appwriteClient.subscribe(
      `databases.${appwriteDatabaseId}.collections.${appwriteVehiclesCollectionId}.documents`,
      (response: any) => {
        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.create"
          )
        ) {
          setVehicles((previousVehicles: any[]) => {
            return [...previousVehicles, response.payload];
          });
          setTotalVehicles((totalRatings: number) => totalRatings + 1);
        } else if (
          response.events.includes(
            "databases.*.collections.*.documents.*.update"
          )
        ) {
          setVehicles((previousVehicles: any[]) => {
            return previousVehicles.map((vehicle: Vehicle) => {
              return vehicle.$id === response.payload.$id
                ? response.payload
                : vehicle;
            });
          });
        } else if (
          response.events.includes(
            "databases.*.collections.*.documents.*.delete"
          )
        ) {
          setVehicles((previousVehicles: any[]) => {
            return previousVehicles.filter((vehicle: Vehicle) => {
              return vehicle.$id !== response.payload.$id;
            });
          });
          setTotalVehicles((totalRatings: number) => totalRatings - 1);
        }
      }
    );
  }, [currentPage, itemsPerPage]);

  let filteredVehicles: any = vehicles;

  filteredVehicles = vehicles?.filter((vehicle) => {
    console.log(carType);
    console.log("Car Type Name: ", vehicle.carType.name);
    return !carType || carType === "All"
      ? vehicle
      : vehicle.carType.name === carType;
  });

  if (startDate) {
    filteredVehicles = filteredVehicles.filter(
      (vehicle: any) => parseISO(vehicle.lastServiceDate) >= startDate
    );
  }

  if (endDate) {
    filteredVehicles = filteredVehicles.filter(
      (vehicle: any) => parseISO(vehicle.lastServiceDate) <= endDate
    );
  }

  filteredVehicles =
    filteredVehicles && filteredVehicles.length > 0 && searchText
      ? filteredVehicles.filter(
          (vehicle: any) =>
            vehicle.licensePlate &&
            vehicle.licensePlate
              .toLowerCase()
              .indexOf(searchText.toLowerCase()) > -1
        )
      : filteredVehicles;

  const indexOfLastCustomer = currentPage * itemsPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - itemsPerPage;
  const currentCustomers = filteredVehicles
    ? filteredVehicles.slice(indexOfFirstCustomer, indexOfLastCustomer)
    : null;

  return (
    <div className="w-full h-full pb-5 pt-5 lg:pt-0 z-10 relative">
      <h2 className="font-body text-lg font-bold py-1">Vehicles</h2>
      {/* Filters */}
      <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 justify-between">
        <label
          className="flex w-fit relative justify-end items-center"
          htmlFor="search-input"
        >
          <input
            type="text"
            placeholder="Enter license No."
            id="search-input"
            className="w-full h-full py-2 pl-2 pr-10 rounded-md bg-white border-[0.5px] border-secondary-100/70 outline-none font-body text-sm font-light  placeholder:text-secondary-100"
            onChange={(event) => {
              console.log("searching");
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
              className="w-full px-2 py-1.5 bg-white outline-none  placeholder:text-secondary-200 text-sm font-light font-body"
            />
            <span className="px-4 text-secondary-600 bg-gray-100 h-full flex items-center justify-center">
              to
            </span>
            <input
              type="date"
              className="w-full px-2 py-1.5 bg-white outline-none placeholder:text-secondary-200 text-sm font-light font-body"
            />
          </div>
          <Select
            onChange={(selectedOption: any) => {
              console.log(
                "selected car type: ",
                selectedOption.optionData.name.toLowerCase()
              );
              setCarType(() => selectedOption?.optionData.name);
            }}
            closeMenuOnSelect
            options={carTypeOptions}
            unstyled
            placeholder="Select Car Type"
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
                  isFocused ? controlStyles.focus : controlStyles.nonFocus,
                  controlStyles.base
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
          <button
            className="px-2  text-primary-500 underline font-body text-base rounded outline-none"
            onClick={(event) => {
              event.preventDefault();
              setCarType(() => "");
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
        <Spinner loaderText="Fetching vehicles" />
      ) : (
        <div className="py-5">
          {currentCustomers && currentCustomers?.length > 0 ? (
            <div className="overflow-x-scroll rounded-lg border border-gray-200 shadow-md">
              <table className="w-full border-collapse bg-white text-left text-sm text-gray-500 h-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-4 font-semibold text-secondary-900 uppercase font-body text-sm"
                    >
                      Vehicle
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 font-semibold text-secondary-900 uppercase font-body text-sm"
                    >
                      Current Mileage
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 font-semibold text-secondary-900 uppercase font-body text-sm"
                    >
                      Last Service Garage
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 font-semibold text-secondary-900 uppercase font-body text-sm"
                    >
                      Last Service Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 border-t border-gray-100 ">
                  {currentCustomers?.map((customer: any, index: number) => {
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
                              <div className="relative h-16 w-16 flex justify-center items-center rounded-md font-body font-light text-secondary-500">
                                {customer?.carType?.logoUrl ? (
                                  <Image
                                    src={customer?.carType?.logoUrl}
                                    alt="logo"
                                    className="w-full"
                                    height={50}
                                    width={50}
                                    quality={100}
                                  />
                                ) : (
                                  customer?.firstName?.[0] ?? "N/A"
                                )}
                              </div>
                              <div className="text-sm inline-flex flex-col justify-center">
                                <div className="font-medium text-gray-700">
                                  {customer?.carType?.name ??
                                    "Not specified yet"}
                                </div>
                                <div className="text-gray-400 flex gap-x-1 items-center">
                                  <div className="text-secondary-400">
                                    {customer?.licensePlate}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <span className="font-body text-black font-medium">
                              {customer.currentMileage} mi
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-body text-black font-medium">
                              {customer.lastServiceGarageName}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-body text-black font-medium">
                              {format(
                                parseISO(customer.lastServiceDate),
                                dateFormat
                              )}
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
                  totalItems={totalVehicles}
                  itemsPerPage={itemsPerPage}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                />
              </div>
              {customerModal && (
                <VehicleModal
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
                {!vehicles || vehicles?.length === 0
                  ? "No vehicles yet"
                  : "No vehicles found"}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Vehicles;
