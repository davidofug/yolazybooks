import React from "react";
import Image from "next/image";
import logo from "@/assets/images/logo.png";
import { BsStarFill, BsStar } from "react-icons/bs";
import { HiLocationMarker } from "react-icons/hi";

interface garageProps {
  garage: any;
}
const Garage: React.FC<garageProps> = ({ garage }) => {
  return (
    <div className="flex gap-5 bg-secondary-50 p-3 mb-2 rounded-md justify-between items-center">
      <div className="flex gap-x-1.5">
        <div className="h-20 w-20 rounded-sm overflow-hidden flex justify-center items-center font-body text-base md:text-h2 bg-secondary-50 text-secondary-600">
          {garage?.logoUrl ? (
            <Image
              src={logo}
              alt="logo"
              width={500}
              height={500}
              className="w-full h-full"
              quality={100}
            />
          ) : (
            garage?.name?.[0] ?? ""
          )}
        </div>
        <div className="py-1 flex flex-col justify-start gap-y-1 rounded">
          <h2 className="text-sm md:text-lg font-body font-medium max-w-32 md:max-w-96">
            {garage.name}
          </h2>

          <div className="flex gap-x-1">
            {garage?.averageRating ? (
              Array(5)
                .fill(0)
                .map((_, index) => (
                  <>
                    {index < 4 ? (
                      // {index < averageRating ? (
                      <BsStarFill className="text-warning-500" size={15} />
                    ) : (
                      <BsStar className="text-warning-500" size={15} />
                    )}
                  </>
                ))
            ) : (
              <span className="font-body text-xs md:text-sm font-light">
                No Reviews Yet
              </span>
            )}
          </div>
          <div className="inline-flex gap-x-1 max-w-32 md:min-w-32 md:max-w-96">
            <HiLocationMarker className="text-primary-500 w-4 h-4 md:w-5 md:h-5 " />
            <span className="font-body font-regular text-xs md:text-base text-black max-w-24">
              {garage.garageAddress.name ?? "Not specified"}
            </span>
          </div>
        </div>
      </div>
      <button className="bg-primary-500 rounded font-body text-xs md:text-base text-white py-2 px-4 h-fit ">
        Book Appointment
      </button>
    </div>
  );
};

export default Garage;
