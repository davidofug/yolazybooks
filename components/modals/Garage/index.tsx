"useClient";
import { useRef, Fragment } from "react";
import { FaPhoneAlt } from "react-icons/fa";
import { HiLocationMarker } from "react-icons/hi";
import { BsStarFill, BsStar } from "react-icons/bs";
import Image from "next/image";
import { addSeparator } from "@/utils/thousandSeparator";
import { useRouter } from "next/navigation";

interface garageModalProps {
  setModalOpen: (show: boolean) => void;
  setData: (data: any) => void;
  data?: any;
}

const GarageModal: React.FC<garageModalProps> = ({
  data,
  setModalOpen,
  setData,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  return (
    <div
      className="h-screen w-screen bg-black/20 bg-opacity-40 fixed top-0 left-0 bottom-0 right-0 z-20 flex justify-center items-center overflow-hidden"
      key={`${data.$id}-garage-modal`}
    >
      <div
        className="bg-white rounded-md w-11/12 md:w-9/12 lg:w-6/12 h-5/6 overflow-x-hidden relative px-5 py-5 overflow-y-auto"
        onClick={(event) => event.stopPropagation()}
        ref={ref}
      >
        <div className="flex justify-end items-center ">
          <button
            onClick={() => {
              setModalOpen(false);
              setData(null);
            }}
            className="text-secondary-black font-body"
          >
            <span className="sr-only">Close</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        {/* vehicle Details */}
        <div className="flex flex-col gap-y-2 gap-x-2">
          <div
            className={`relative h-28 w-28 border-4 rounded border-white shadow flex justify-center items-center font-body font-semibold text-h1 ${
              data?.status === "active"
                ? "border-success-400"
                : data?.status === "suspended"
                ? "border-danger-400"
                : "border-warning-400"
            }`}
          >
            {data?.logoUrl ? (
              <Image
                src={data?.logoUrl}
                alt="logo"
                className="w-full"
                height={50}
                width={50}
                quality={100}
              />
            ) : (
              data?.name?.[0] ?? "N/A"
            )}
          </div>
          <div className="text-sm flex flex-col justify-start gap-x-2 gap-y-2">
            <p className="font-bold font-body text-lg text-secondary-700">
              {data?.name ?? ""}
            </p>
            <div className="flex flex-col md:flex-row gap-2">
              <div className="flex gap-x-2">
                <div className="flex flex-col">
                  <p className="text-sm font-semibold text-secondary-900 font-body">
                    Location
                  </p>
                  <div className="flex gap-x-1 items-start">
                    {data?.garageAddress?.name ? (
                      <>
                        <HiLocationMarker className="text-primary-500 w-5 h-5" />
                        <span className="font-body font-regualar text-black w-32">
                          {data?.garageAddress?.name ?? ""}
                        </span>
                      </>
                    ) : (
                      <span className="font-body text-sm">N/A</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-x-2">
                <div className="flex flex-col">
                  <p className="text-sm font-semibold text-secondary-900 font-body">
                    Phone
                  </p>
                  <div className="text-secondary-700 font-body">
                    {data.phone}
                  </div>
                </div>
              </div>
            </div>
            <section>
              <p className="font-semibold font-body text-base text-secondary-700">
                Contact Person
              </p>
              <div className="text-sm flex flex-col justify-center">
                <div className="font-medium text-black font-body capitalize">
                  <span className="capitalize">
                    {data?.contactPerson?.salutation ?? ""}
                  </span>{" "}
                  {data?.contactPerson?.name}
                </div>
                <div className="text-secondary-400 flex gap-x-1 items-center">
                  <div>
                    <FaPhoneAlt color="black" />
                  </div>
                  <div className="text-secondary-400">
                    {data.contactPerson.phone}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-y-1 lg:flex-row gap-x-2">
                {data?.contactPerson?.email && (
                  <div className="flex flex-col">
                    <p className="text-sm font-semibold text-secondary-900 font-body">
                      Email
                    </p>
                    <p className="text-sm font-body text-secondary-700">
                      {data?.contactPerson?.email ?? ""}
                    </p>
                  </div>
                )}
                {data?.contactPerson?.role && (
                  <div className="flex flex-col">
                    <p className="text-sm font-semibold text-secondary-900 font-body">
                      Role
                    </p>
                    <p className="text-sm font-body text-secondary-700 capitalize">
                      {data?.contactPerson?.role ?? ""}
                    </p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
        <section className="flex  flex-col mt-5">
          <div className="flex gap-x-5">
            <p className="font-bold font-body text-lg text-secondary-700">
              Average Rating
            </p>
            <button
              type="button"
              className="text-primary-500 underline text-regular text-base uppercase"
              onClick={(event: any) => {
                event.preventDefault();
                router.push("/admin/ratings");
              }}
            >
              SEE ALL
            </button>
          </div>
          <div className="flex items-start gap-x-2">
            {data?.averageRating && data.averageRating > 0 && (
              <span className="font-medium font-body text-lg text-black">
                {Math.round((data.averageRating * 10) / 10).toFixed(1)}
              </span>
            )}

            <div className="flex flex-col justify-end gap-y-1">
              {data?.averageRating && (
                <div className="flex gap-x-1">
                  {Array(5)
                    .fill(0)
                    .map((_, index) => (
                      <Fragment key={`ratingStar-${index}`}>
                        {index < data.averageRating ? (
                          <BsStarFill className="text-warning-500" size={14} />
                        ) : (
                          <BsStar className="text-warning-500" size={14} />
                        )}
                      </Fragment>
                    ))}
                </div>
              )}
              <span className="font-body font-light text-base capitalize">
                {data?.totalReviews && data.totalReviews > 0
                  ? `${addSeparator(data?.totalReviews)} ${
                      data?.totalReviews === 1 ? " review" : " reviews"
                    } `
                  : "no reviews yet"}
              </span>
            </div>
          </div>
        </section>
        <section className="flex flex-col gap-y-1 mt-5">
          <p className="font-bold font-body text-lg text-secondary-700">
            Services Offered
          </p>
          {data?.garageServices &&
            data?.garageServices.length > 0 &&
            data.garageServices.map((item: any, index: number) => {
              return (
                <span
                  key={`service-offered-${index}`}
                  className="font-body font-light text-base capitalize"
                >
                  {`${index + 1}. ${item.service.name}`}
                </span>
              );
            })}
        </section>

        <section className="flex flex-col mt-5 gap-y-2">
          <p className="font-bold font-body text-lg text-secondary-700">
            Car types
          </p>
          <div className="flex w-full flex-wrap">
            {data?.primaryCarTypes && data?.primaryCarTypes?.length > 0 ? (
              data.primaryCarTypes.map((item: any, index: number) => {
                return (
                  <div
                    className="flex gap-x-2 flex-col gap-y-1 justify-between"
                    key={`carType-${index}`}
                  >
                    <div className="relative w-16 overflow-hidden">
                      <Image
                        className="h-full w-full object-cover object-center"
                        src={`${item.logoUrl}`}
                        width={50}
                        height={20}
                        alt=""
                        key={data.logoField}
                      />
                    </div>
                    <p className="font-medium text-gray-700 text-center font-body capitalize">
                      {item.name}
                    </p>
                  </div>
                );
              })
            ) : (
              <span className="font-body font-light text-base capitalize">
                No Car Types added yet
              </span>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default GarageModal;
