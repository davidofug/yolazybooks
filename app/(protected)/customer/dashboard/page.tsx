"use client";

import React from "react";

import { database } from "@/appwrite/appwrite";
import environment from "@/environments/environment";

import Garage from "@/utils/functions/Interfaces";
import GarageCard from "@/components/cards/Garage";
import BookingModal from "@/components/modals/Booking";

import { MdOutlineSearch } from "react-icons/md";
import Select from "react-select";
import Spinner from "@/components/Spinner";

export default function Page() {
  const [modelVisible, setModelVisible] = React.useState(false);
  const [filterValue, setFilterValue] = React.useState<string>("");
  const [seletedGarage, setSeletedGarage] = React.useState<Garage | null>(null);
  const [carTypes, setCarTypes] = React.useState<any>([]);
  const [data, setData] = React.useState<any>([]);
  const [services, setServices] = React.useState<any>([]);
  const [error, setError] = React.useState<Error | null>(null);
  const [garageLocations, setGarageLocations] = React.useState<any>([]);
  const [selectedFilters, setSelectedFilters] = React.useState<any>([]);
  const [loading, setLoading] = React.useState(true);

  const [profile, setProfile] = React.useState<any>(null);

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

      // set the garageLocations
      if (garageData.length) {
        let locs: string[] = [];
        for (const garage of garageData) {
          if (!locs.includes(garage.garageAddress.name)) {
            locs.push(garage.garageAddress.name);
          }
        }
        setGarageLocations(locs);
      }

      // Fetch services offered data
      const servicesOffered = (
        await database.listDocuments(
          environment.appwriteDatabaseId,
          environment.appwriteServicesCollectionId
        )
      ).documents;

      // Fetch user profile
      // console.log(environment.appwriteProfilesCollectionId);
      const userProfile = (
        await database.listDocuments(
          environment.appwriteDatabaseId,
          environment.appwriteProfilesCollectionId
        )
      ).documents;

      if (userProfile) {
        setProfile(userProfile[0]);
      }

      // Set states for fetched data
      setData(garageData);
      setCarTypes(carData);
      setServices(servicesOffered);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error as Error);
    }
  };
  // use effect
  React.useEffect(() => {
    // Call fetchData() when the component mounts

    fetchData();
  }, [data]); // The empty dependency array ensures this effect runs only once

  // handle methods
  const filteredGarages = data?.filter((garage: any) => {
    if (filterValue == "" && selectedFilters?.length == 0) {
      return true;
    }
    const garageAddressMatch = garage?.garageAddress.name
      .toLowerCase()
      .includes(filterValue.toLowerCase());
    const garageNameMatch = selectedFilters?.includes(
      garage?.garageAddress.name
    );
    const carTypeMatch = selectedFilters?.includes(
      garage?.primaryCarTypes.name
    );
    return garageAddressMatch || garageNameMatch || carTypeMatch;
  });

  const handleModel = () => {
    setModelVisible(!modelVisible);
  };

  return (
    <div className={`flex flex-row ml-10 pt-5 pb-5 w-full h-full`}>
      <div className="lg:w-4/5 h-full flex flex-col">
        <section className="flex flex-col gap-5 mb-4 lg:w-full font-body">
          <div className="">
            <h1>
              Hello
              <span className="">👋</span>,&nbsp;
              <span className="text-xl font-bold">
                {profile?.salutation ?? ""} {profile?.firstName ?? ""}
              </span>
            </h1>
            <h5 className="mt-3 font-bold">
              <span className="text-primary-500">Welcome</span> to Autofore
            </h5>
          </div>
        </section>

        <section className="lg:w-full relative h-full overflow-y-auto">
          {loading && <Spinner />}
          {data && data?.length > 0 ? (
            <>
              <div className="font-body pb-5">
                <h5 className="font-semibold">To find the best car service,</h5>
                <ul className="pl-2 mb-5">
                  <li className="m-2 ml-5 list-decimal">
                    Enter your location to discover nearby garages.
                  </li>
                  <li className="mb-2 ml-5 mr-2 list-decimal">
                    Select your car type to see specialized services
                  </li>
                  <li className="mb-2 ml-5 mr-2 list-decimal ">
                    Browse services by category.
                  </li>
                  <li className="mb-2 ml-5 mr-2 list-decimal">
                    Choose a garage that suits your needs.
                  </li>
                  <li className="mb-0 ml-5 mr-2 list-decimal">
                    Ready to schedule? Click book appointment
                  </li>
                </ul>
              </div>
              <section className="flex flex-row items-center justify-between mb-4 lg:w-full">
                <div className="flex items-center justify-between w-full">
                  <div className="w-full md:w-2/5 gap-5 border rounded-md border-secondary-50 flex items-center p-1.5 ">
                    <input
                      type="text"
                      placeholder="search by location"
                      className="w-4/5 p-0.5 rounded-md outline-none font-body"
                      value={filterValue}
                      onChange={(event) => setFilterValue(event.target.value)}
                    />
                    <MdOutlineSearch
                      size={25}
                      className=" fill-secondary-300"
                    />
                  </div>
                  <div className="hidden w-2/4 gap-1 md:flex">
                    <Select
                      className="hidden md:inline md:rounded-md font-body"
                      isClearable
                      options={carTypes}
                      placeholder="search by car type"
                      getOptionLabel={(option: any) => option.name}
                      getOptionValue={(option) => option.$id}
                      onChange={(newValue) => {
                        setSelectedFilters(newValue?.name);
                      }}
                    />
                    <Select
                      className="rounded-md font-body"
                      isClearable
                      placeholder="Search by service"
                      options={services}
                      getOptionLabel={(option: any) => option.name}
                      getOptionValue={(option) => option.$id}
                      onChange={(newValue) => {
                        setSelectedFilters(newValue?.name);
                      }}
                    />
                  </div>
                </div>
              </section>
              <ul className="w-full mx-auto h-full">
                {filterValue.length == 0 ? (
                  data?.map((garage: any, index: number) => (
                    <div key={index}>
                      <GarageCard
                        garage={garage}
                        handleModel={handleModel}
                        setSelectedGarage={setSeletedGarage}
                      />
                      <BookingModal
                        modelVisible={modelVisible}
                        handleModel={handleModel}
                        garage={seletedGarage}
                        profile={profile}
                      />
                    </div>
                  ))
                ) : filteredGarages.length > 0 ? (
                  filteredGarages.map((garage: any, index: number) => (
                    <div key={index}>
                      <GarageCard
                        garage={garage}
                        handleModel={handleModel}
                        setSelectedGarage={setSeletedGarage}
                      />
                      <BookingModal
                        modelVisible={modelVisible}
                        handleModel={handleModel}
                        garage={garage}
                        profile={profile}
                      />
                    </div>
                  ))
                ) : (
                  <div className="text-center text-danger-500">
                    No garage at that location.
                  </div>
                )}
              </ul>
            </>
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
                  <circle
                    cx="190.15351"
                    cy="24.95465"
                    r="12.66462"
                    fill="#fff"
                  />
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
                  {!data || data?.length === 0
                    ? "No Garages yet"
                    : "No garages found"}
                </span>
              </div>
            )
          )}
        </section>
      </div>
    </div>
  );
}
