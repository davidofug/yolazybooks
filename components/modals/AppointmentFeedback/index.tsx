"useClient";
import { useRef, useState } from "react";
import { Permission, Role } from "appwrite";
import { Formik, Form } from "formik";
import environment from "@/environments/environment";
import Spinner from "@/components/Spinner";
import DatabaseService from "@/lib/services/database.service";
import { BsStarFill, BsStar } from "react-icons/bs";
import { toast, ToastContainer } from "react-toastify";

interface AppointmentFeedbackModalProps {
  setModalOpen: (show: boolean) => void;
  setData: (data: any) => void;
  data: any;
}

const AppointmentFeedbackModal: React.FC<AppointmentFeedbackModalProps> = ({
  data,
  setModalOpen,
  setData,
}) => {
  const garageId = data?.garage?.$id;
  const appointmentId = data?.$id;
  const customerId = data?.customer?.$id;
  const appointmentData = data;
  const ref = useRef<HTMLDivElement>(null);
  const commentRef = useRef<HTMLTextAreaElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loaderText, setLoaderText] = useState<string>("");
  const { appwriteDatabaseId, appwriteRatingsCollectionId } = environment;

  const handleAppointmentRating = async (data: any, actions: any) => {
    setLoaderText("Adding rating feedback");
    setLoading(true);

    try {
      const response = await DatabaseService.createDocument(
        appwriteDatabaseId,
        appwriteRatingsCollectionId,
        {
          garage: garageId,
          booking: appointmentId,
          value: data.rating,
          comment: data.comment,
          customer: customerId,
        },
        [
          Permission.read(Role.user(customerId)),
          Permission.delete(Role.user(customerId)),
          Permission.update(Role.user(customerId)),
        ]
      );

      if (response) {
        console.log("Data: ", {
          ...appointmentData,
          ...response,
        });
        setData(() => ({
          ...appointmentData,
          ...response,
        }));
        toast.success(() => (
          <div className="font-body text-light text-sm">
            Feedback successfully submitted
          </div>
        ));
      }
    } catch (error: any) {
      if (error?.code === 409) {
        toast.error(() => (
          <div className="font-body text-light text-sm">
            Your feedback is appreciated once
          </div>
        ));
      } else {
        toast.error(() => (
          <div className="font-body text-light text-sm">{error?.message}</div>
        ));
      }
    } finally {
      actions.resetForm({ values: { rating: 0, comment: "" } });
      if (commentRef && commentRef?.current) commentRef.current.value = "";
      setLoading(false);
      setLoaderText("");
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
        <div className="flex justify-end items-center">
          <button
            onClick={() => {
              setModalOpen(false);
              // setData(null);
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
        {loading && <Spinner loaderText={loaderText} />}
        <Formik
          initialValues={{
            comment: data?.rating?.comment ?? "",
            rating: data?.rating?.value ?? 0,
          }}
          onSubmit={handleAppointmentRating}
        >
          {({ setFieldValue, values }) => {
            return (
              <Form className="flex flex-col gap-y-5">
                <h2 className="font-semibold text-secondary-800 uppercase text-sm">
                  Customer Feedback
                </h2>
                <div className="flex flex-col gap-y-1">
                  <label className="font-semibold text-secondary-800 font-body text-sm">
                    Rating
                  </label>
                  <div className="flex gap-x-1">
                    {Array(5)
                      .fill(0)
                      .map((_, index) => (
                        <button
                          key={`rating-value-${index}`}
                          type="button"
                          onClick={(event) => {
                            event.preventDefault();
                            setFieldValue("rating", index + 1);
                          }}
                        >
                          {index < values.rating ? (
                            <BsStarFill
                              className="text-warning-500"
                              size={15}
                            />
                          ) : (
                            <BsStar className="text-warning-500" size={15} />
                          )}
                        </button>
                      ))}
                  </div>
                </div>

                <div className="flex flex-col gap-y-1">
                  <label className="font-semibold text-secondary-800 font-body text-sm">
                    Please tell us about your experience
                  </label>
                  <textarea
                    defaultValue={values?.comment}
                    name="comment"
                    ref={commentRef}
                    rows={2}
                    onChange={({ target: { name, value } }) => {
                      setFieldValue(name, value);
                    }}
                    placeholder="Add a comment..."
                    className="w-full rounded-md p-2 border-[0.5px] border-secondary-100 outline-none font-body text-sm text-secondary-800 resize-none"
                  />
                </div>
                <button
                  className={`w-full px-10 md:w-fit py-1.5 text-center text-white rounded-md ${
                    !values.comment || !values.rating
                      ? "bg-primary-100"
                      : "bg-primary-500"
                  }  mb-5 font-body uppercase font-semibold text-sm`}
                >
                  Submit
                </button>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default AppointmentFeedbackModal;
