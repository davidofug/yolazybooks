import React from "react";
import Image from "next/image";
import logo from "@/assets/images/logo.png";
import { format } from "date-fns";
import { AiOutlineClose } from "react-icons/ai";
import { GrLocation } from "react-icons/gr";
import { BiPhone } from "react-icons/bi";
import { MdEmail } from "react-icons/md";
import { account, database } from "@/appwrite/appwrite";
import environment from "@/environments/environment";
import { ID, Permission, Role } from "appwrite";
import Spinner from "@/components/Spinner";
import { toast, ToastContainer } from "react-toastify";
import Select from "react-select";
import Link from "next/link";
import { useFormik } from "formik";
import { bookingSchema } from "@/utils/validators/bookingValidator";
import { toFormikValidationSchema } from "zod-formik-adapter";
import UsersService from "@/lib/services/users.service";
import MessageService from "@/lib/services/messaging.service";

interface ModeProps {
  modelVisible: boolean;
  handleModel(): any;
  garage: any;
  profile: any;
}

interface FormValues {
  bookingDate: string;
  vehicle: [];
}

export default function Index(Props: ModeProps) {
  const [isloading, setIsloading] = React.useState<boolean>(false);
  const [vehicle, setVehicle] = React.useState<any>([]);

  // console.log("Selected garage", Props.garage);
  const initialValues: FormValues = {
    bookingDate: "",
    vehicle: [],
  };

  // function to fetch vehicle data
  const getVehicleData = async () => {
    const data = (
      await database.listDocuments(
        environment.appwriteDatabaseId,
        environment.appwriteVehiclesCollectionId
      )
    ).documents;

    if (data) {
      setVehicle(data);
    }
  };
  // function to handle booking submission
  const handleSubmit = async (values: any) => {
    if (Props.profile) {
      setIsloading(true);
      try {
        const userId = (await account.get()).$id;
        // console.log(userId)
        const booking = await database.createDocument(
          environment.appwriteDatabaseId,
          environment.appwriteBookingsCollectionId,
          ID.unique(),
          {
            customer: Props.profile?.$id,
            bookingDate: values.bookingDate,
            garage: Props.garage?.$id,
            vehicles: values.vehicle,
          },
          [
            Permission.read(Role.user(userId)),
            Permission.update(Role.user(userId)),
          ]
        );

        if (booking) {
          toast.success(() => (
            <div className="font-body font-light text-base w-full flex start">
              You have successfully booked an appointment with{" "}
              {Props.garage.name}.
            </div>
          ));
          setIsloading(false);
          Props.handleModel();

          const { admins } = await UsersService.listAdmins();
          admins.forEach(
            async ({
              phoneNumber,
              firstName,
            }: {
              phoneNumber: string;
              firstName: string | null;
            }) => {
              const message: string = `Hey ${
                firstName ?? "Admin,"
              }\nA customer has requested for an appointment at ${
                Props.garage.name
              }.\nVisit link below to see all appointments.\nhttps://www.autofore.co/admin/appointments \nAutofore.co`;

              const response = await MessageService.sendMessage({
                phone: phoneNumber,
                message: message,
              });
              console.log("Response: ", response);
            }
          );

          const garageContactPersonMessage: string = `Hello! A customer wants your services. Someone from Autofore will contact you shortly.\nRegards Autofore`;
          await MessageService.sendMessage({
            phone: Props.garage.contactPerson.phone,
            message: garageContactPersonMessage,
          });
        }
      } catch (error: any) {
        setIsloading(false);
        toast.error(() => (
          <div className="font-body font-light text-base w-full flex start">
            {error.message}.
          </div>
        ));
      } finally {
        setIsloading(false);
      }
    }
  };

  // useform
  const formik = useFormik({
    initialValues,
    onSubmit: handleSubmit,
    validationSchema: toFormikValidationSchema(bookingSchema),
  });
  // console.log(Props.garage)
  React.useEffect(() => {
    // Fetch data on
    getVehicleData();
  }, []);

  return (
    <div
      className={`${
        Props.modelVisible
          ? "bg-secondary-100/30 w-full h-full top-0 left-0 absolute z-20 flex justify-center items-center"
          : "hidden"
      }`}
    >
      <div
        className={`w-4/5 pt-0 md:w-3/5 lg:w-2/5 bg-white rounded-md pl-7 pr-7 pb-7`}
      >
        <div className="flex flex-row items-center justify-between pt-2 mb-5">
          <div></div>
          <h5 className="font-extrabold font-heading text-primary-500">
            Booking form
          </h5>
          <AiOutlineClose
            className="cursor-pointer hover:fill-danger-500"
            width={50}
            onClick={Props.handleModel}
          />
        </div>

        {/* <h2 className='mb-5 font-semibold text-center font-heading'>Auto Dynamics Kampala</h2> */}
        <div className="">
          <div className="flex flex-col-reverse items-center justify-between md:flex-row font-body">
            <div className="flex w-full gap-2 items-cen">
              <form
                onSubmit={formik.handleSubmit}
                className="flex flex-col justify-between md:flex-row md:gap-3 md:items-center"
              >
                {vehicle.length > 0 ? (
                  <div className="mb-1">
                    <Select
                      options={vehicle}
                      isMulti
                      getOptionLabel={(option: any) => option?.licensePlate}
                      getOptionValue={(option) => option?.$id}
                      placeholder="Select a vehicle"
                      onChange={(selectedOptions) => {
                        let arr = selectedOptions.map((newValue) => {
                          return newValue.$id;
                        });
                        formik.setFieldValue("vehicle", arr);
                      }}
                    />
                    {/* {formik.errors.vehicle} */}
                  </div>
                ) : (
                  <Link
                    href="/customer/vehicles/addVehicle"
                    className="flex items-center gap-2 "
                  >
                    <h4>No vehicles</h4>
                    <button className="p-1 m-1 ml-0 text-white rounded-md bg-primary-500 font-body">
                      Add vehicle
                    </button>
                  </Link>
                )}
                <div className="flex gap-2">
                  <input
                    type="date"
                    min={format(new Date(), "yyyy-MM-dd")}
                    {...formik.getFieldProps("bookingDate")}
                    // max={}
                    className="p-2 text-lg border rounded-md outline-none font-body"
                  />
                  {/* {formik.errors.bookingDate} */}
                  <button
                    type="submit"
                    className="p-1 text-white rounded-md font-body bg-primary-500"
                    // onClick={handleSubmit}
                  >
                    submit
                  </button>
                </div>
              </form>
            </div>
          </div>
          {/* Garage information. */}
          <div className="w-full mb-5">
            {Props.garage?.logoField && (
              <div className="w-2/5">
                <Image
                  src={Props.garage?.logoUrl ?? logo}
                  width={100}
                  height={100}
                  quality={80}
                  alt="Garage-logo"
                  className="w-full h-full"
                />
              </div>
            )}
          </div>
          {/* Address information  */}
          <div className="text-lg font-body">
            <h1 className="font-semibold font-body">
              {Props.garage?.name ?? "N/A"}
            </h1>
            <h5 className="flex items-center gap-1 font-body">
              <span>
                <GrLocation size={12} />
              </span>
              {Props.garage?.garageAddress?.name}
            </h5>
            <div className="w-2/4 p-1 rounded-md">
              <h1 className="font-semibold font-body">
                {Props.garage?.contactPerson?.role}&apos;s Contact information
              </h1>
              <h2 className=" font-body">
                {Props.garage?.contactPerson?.salutation +
                  " " +
                  Props.garage?.contactPerson?.name}
              </h2>
              <h5 className="flex items-center gap-1 font-body">
                <span>
                  <BiPhone size={15} />
                </span>
                +{Props.garage?.contactPerson?.phone}
              </h5>
              <h5 className="flex items-center gap-1 font-body">
                <span>
                  <MdEmail size={15} />
                </span>
                {Props.garage?.contactPerson?.email}
              </h5>
            </div>
          </div>
          {/* Services information  */}
          <div className="font-body">
            <h4 className="font-semibold">Services we offer</h4>
            <div
              className="overflow-y-auto border rounded-md"
              style={{ maxHeight: "150px" }}
            >
              <ul className="pl-2">
                {Props.garage?.garageServices?.map((service: any) => (
                  <li key={service.$id} className="flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-primary-500"></span>
                    <span className="font-extralight">
                      {service.service.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      {isloading && <Spinner />}
    </div>
  );
}
