"useClient";
import { useRef, useState } from "react";
import format from "date-fns/format";
import parseISO from "date-fns/parseISO";
import Image from "next/image";
import { FaPhoneAlt } from "react-icons/fa";
import { Formik, Form } from "formik";
import environment from "@/environments/environment";
import Spinner from "@/components/Spinner";
import { toast, ToastContainer } from "react-toastify";
import DatabaseService from "@/lib/services/database.service";

interface AppointmentModalProps {
  setModalOpen: (show: boolean) => void;
  setData: (data: any) => void;
  data?: any;
}

const AppointmentModal: React.FC<AppointmentModalProps> = ({
  data,
  setModalOpen,
  setData,
}) => {
  console.log("Appointment: ", data);
  const dateFormat = "dd MMM yyyy";
  const timeFormat = "hh:mm aa";
  const appointmentId = data?.$id;
  const ref = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loaderText, setLoaderText] = useState<string>("");
  const { appwriteDatabaseId, appwriteBookingsCollectionId } = environment;

  const handleAppointmentUpdate = async (data: any) => {
    setLoaderText("Updating appointment");
    setLoading(true);
    try {
      const response = await DatabaseService.updateDocument(
        appwriteDatabaseId,
        appwriteBookingsCollectionId,
        appointmentId,
        data
      );

      if (response) {
        setLoading(false);
        setData((previousData: any) => ({ ...previousData, ...response }));
        toast.success(() => (
          <div className="font-body font-light text-base w-full flex start">
            Appointment has successfully been updated
          </div>
        ));
      }
    } catch (error: any) {
      setLoading(false);
      toast.error(() => (
        <div className="font-body font-light text-base w-full flex start">
          {error.message}
        </div>
      ));
    }
  };

  return (
    <div className="h-screen w-screen bg-black/20 bg-opacity-40 fixed top-0 left-0 bottom-0 right-0 z-20 flex justify-center items-center overflow-hidden">
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
      <div
        className="bg-white rounded-md w-11/12 md:w-9/12 lg:w-6/12 h-3/4 md:h-fit overflow-x-hidden relative px-5 py-5 overflow-y-auto"
        onClick={(event) => event.stopPropagation()}
        ref={ref}
      >
        {loading && <Spinner loaderText={loaderText} />}
        <div className="flex justify-end items-center">
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
        <div className="flex flex-col gap-x-2">
          <h2 className="font-body font-semibold text-sm uppercase text-secondary-800 py-1">
            customer Details
          </h2>
          <div
            className={`relative h-20 w-20  mb-2 rounded-full flex justify-center items-center font-body text-secondary-500 font-h3 text-h3 font-light shadow-sm border-[0.5px] `}
          >
            {data?.customer?.logoUrl ? (
              <Image
                src={data?.customer?.logoUrl}
                alt="logo"
                className="w-full object-cover object-center rounded-full  "
                height={50}
                width={50}
                quality={100}
              />
            ) : (
              data?.customer?.firstName?.[0] ?? "N/A"
            )}
          </div>
          <div className="text-sm font-body flex flex-col gap-y-1">
            <p className="font-medium text-black line-clamp-3">
              {`${data?.customer?.salutation ?? ""} ${data?.customer
                ?.firstName}`}
            </p>
            <div className="text-gray-400 flex gap-x-1 items-center">
              <div>
                <FaPhoneAlt color="black" />
              </div>
              <div className="text-secondary-400">
                {data.customer.phoneNumber ?? "N/A"}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-x-2 my-5">
          <h2 className="font-body font-semibold text-sm uppercase text-secondary-800 py-1">
            garage details
          </h2>
          <div
            className={`relative h-20 w-20  mb-2 rounded-md flex justify-center items-center font-body text-secondary-500 font-h3 text-h3 font-light`}
          >
            {data?.garage?.logoUrl ? (
              <Image
                src={data?.garage?.logoUrl}
                alt="logo"
                className="w-full object-cover object-center "
                height={50}
                width={50}
                quality={100}
              />
            ) : (
              data?.garage?.name?.[0] ?? "N/A"
            )}
          </div>
          <div className="text-sm font-body flex flex-col gap-y-1">
            <p className="font-medium text-black line-clamp-3">
              {`${data.garage.name}`}
            </p>
            <div className="text-gray-400 flex gap-x-1 items-center">
              <div>
                <FaPhoneAlt color="black" />
              </div>
              <div className="text-secondary-400">{data.garage.phone}</div>
            </div>
          </div>
        </div>

        <div className="text-sm font-body flex flex-col gap-x-1 gap-y-2 my-5">
          <h3 className="font-semibold text-secondary-800">Date & Time</h3>
          <div className="text-sm flex gap-x-2 uppercase ">
            <p className="text-secondary-400">
              {format(parseISO(data.bookingDate), dateFormat)}
            </p>
            <span className="font-semibold text-secondary-800">at</span>
            <p className="text-secondary-400">
              {data?.bookingTime
                ? format(
                    new Date(`2000-01-01T${data.bookingTime}:00Z`),
                    timeFormat
                  )
                : "N/A"}
            </p>
          </div>
        </div>
        {data?.status && data?.comment ? (
          <section className="flex flex-col gap-y-5 mb-5">
            <div className="flex flex-col gap-y-1">
              <h3 className="font-semibold text-secondary-800 font-body">
                Comment
              </h3>
              <p className="font-body text-sm font-light">{data.comment}</p>
            </div>
            <div className="flex flex-col gap-y-1">
              <h3 className="font-semibold text-secondary-800 font-body">
                Status
              </h3>
              <span
                className={` inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold capitalize w-fit ${
                  data?.status === "cancelled"
                    ? "bg-danger-50 text-danger-600"
                    : data?.status === "honoured"
                    ? "bg-success-50 text-success-700"
                    : data?.status === "pending"
                    ? "bg-warning-50 text-warning-500"
                    : ""
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    data?.status === "cancelled" || data?.status === "canceled"
                      ? "bg-danger-600"
                      : data?.status === "honoured"
                      ? "bg-green-600"
                      : data?.status === "pending"
                      ? "bg-warning-500"
                      : ""
                  }`}
                ></span>
                {data.status}
              </span>
            </div>
          </section>
        ) : (
          <Formik
            initialValues={{
              comment: data?.comment ?? "",
              status: data.status,
            }}
            onSubmit={handleAppointmentUpdate}
          >
            {({ setFieldValue, values }) => {
              return (
                <Form className="flex flex-col gap-y-5">
                  <div className="flex flex-col gap-y-1">
                    <h2 className="font-semibold text-secondary-800 uppercase">
                      Update Appointment
                    </h2>

                    <h3 className="font-semibold text-secondary-800">Status</h3>
                    <div className="flex items-center justify-start w-full">
                      <label
                        htmlFor="status"
                        className="flex items-center gap-x-2 cursor-pointer"
                      >
                        <div className="relative">
                          <input
                            type="checkbox"
                            id="status"
                            className="sr-only peer"
                            name="status"
                            defaultChecked={values?.status === "honoured"}
                            onChange={({ target: { name, checked } }) => {
                              checked
                                ? setFieldValue(name, "honoured")
                                : setFieldValue(name, "cancelled");
                            }}
                            disabled={values?.status !== "pending"}
                          />
                          <div
                            className={`block ${
                              values.status === "pending"
                                ? "bg-warning-100"
                                : values.status === "honoured"
                                ? "bg-success-100"
                                : values.status === "cancelled"
                                ? "bg-danger-100"
                                : ""
                            } w-10 h-6 rounded-full`}
                          ></div>
                          <div
                            className={`absolute left-1 top-1 w-4 h-4 rounded-full transition-all duration-300 peer-checked:translate-x-full ${
                              values.status === "pending"
                                ? "bg-warning-500"
                                : values.status === "honoured"
                                ? "bg-success-700"
                                : values.status === "cancelled"
                                ? "bg-danger-600"
                                : ""
                            }`}
                          ></div>
                        </div>
                        <div
                          className={` inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold capitalize ${
                            values?.status === "cancelled"
                              ? "bg-danger-50 text-danger-600"
                              : values?.status === "honoured"
                              ? "bg-success-50 text-success-700"
                              : values?.status === "pending"
                              ? "bg-warning-50 text-warning-500"
                              : ""
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              values?.status === "cancelled" ||
                              values?.status === "canceled"
                                ? "bg-danger-600"
                                : values?.status === "honoured"
                                ? "bg-green-600"
                                : values?.status === "pending"
                                ? "bg-warning-500"
                                : ""
                            }`}
                          ></span>
                          {values.status}
                        </div>
                      </label>
                    </div>
                  </div>
                  <div className="flex flex-col gap-y-1">
                    <label className="font-semibold text-secondary-800 font-body">
                      Comment
                    </label>
                    <textarea
                      defaultValue={values?.comment}
                      name="comment"
                      rows={2}
                      onChange={({ target: { name, value } }) => {
                        setFieldValue(name, value);
                      }}
                      placeholder="Add a comment..."
                      className="w-full rounded-md p-2 border-[0.5px] border-secondary-100 outline-none font-body text-sm text-secondary-800 resize-none"
                      disabled={values.status === "pending"}
                    />
                  </div>
                  <button
                    className={`w-full sm:w-40 py-1.5 text-center text-white rounded-md ${
                      values.status === "pending"
                        ? "bg-primary-100"
                        : "bg-primary-500"
                    }  mb-5 font-body uppercase font-semibold`}
                    disabled={values.status === "pending"}
                  >
                    update
                  </button>
                </Form>
              );
            }}
          </Formik>
        )}
      </div>
    </div>
  );
};

export default AppointmentModal;
