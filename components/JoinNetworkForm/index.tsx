"use client";
import { useFormik, FormikHelpers } from "formik";
import React, { useState } from "react";
import { toFormikValidationSchema } from "zod-formik-adapter";

import { isDirty, z } from "zod";
import { database } from "@/appwrite/appwrite";
import environment from "@/environments/environment";
import { ID } from "appwrite";
import Spinner from "@/components/Spinner";
import { ToastContainer, toast } from "react-toastify";
import UsersService from "@/lib/services/users.service";
import MessageService from "@/lib/services/messaging.service";

// form values validator using zod
const formValidation = z.object({
  garageName: z.string({ required_error: "Garage name is required" }),
  contactPersonName: z.string({ required_error: "Contact person is required" }),
  phoneNumber: z
    .string({
      required_error: "Phone number is required",
    })
    .length(10, {
      message: "Should be 10 digits",
    }),
});

export default function Index() {
  const [loading, setLoading] = useState<boolean>(false);
  const { appwriteDatabaseId, appwriteGarageNetworkJoinRequestCollectionId } =
    environment;
  // Initial values of the form fields
  const initialValues = {
    garageName: "",
    contactPersonName: "",
    phoneNumber: "",
  };

  // function to handle the submission of values to the database
  const handleSubmit = async (
    values: {
      garageName: string;
      contactPersonName: string;
      phoneNumber: string;
    },
    formikHelpers: FormikHelpers<typeof initialValues>
  ) => {
    // console.log("Out putting values", values)
    try {
      setLoading(true);
      const response = await database.createDocument(
        appwriteDatabaseId,
        appwriteGarageNetworkJoinRequestCollectionId,
        ID.unique(),
        {
          ...values,
          status: "pending",
        }
      );

      if (response) {
        formikHelpers.resetForm({ values: initialValues });
        toast.success(() => (
          <div className="font-body font-light text-base w-full flex start">
            Request sent successfully
          </div>
        ));
        setLoading(false);
        const { admins } = await UsersService.listAdmins();
        console.log("Admins: ", admins);
        admins.forEach(
          async ({
            phoneNumber,
            firstName,
          }: {
            phoneNumber: string;
            firstName: string | null;
          }) => {
            const message: string = `Hello ${
              firstName ?? "Admin,"
            }\nA garage wants to join our network.\nVisit the link below to see all requests \nhttps://www.autofore.co/admin/requests \nAutofore.co`;

            const response = await MessageService.sendMessage({
              phone: phoneNumber,
              message: message,
            });
            console.log("Response: ", response);
          }
        );
      }
    } catch (error) {
      console.log(JSON.stringify(error, null, 2));
      console.log("Request failed.");
      setLoading(false);
    } finally {
      formikHelpers.setSubmitting(false);
    }
  };

  // Initialize formik
  const formik = useFormik({
    initialValues,
    onSubmit: handleSubmit,
    validationSchema: toFormikValidationSchema(formValidation),
  });

  return (
    <form
      className="flex flex-col items-center w-full gap-y-4 p-2  md:w-4/5 h-fit"
      onSubmit={formik.handleSubmit}
    >
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
      {loading && <Spinner />}
      <div className="w-4/5 flex flex-col gap-y-1">
        <input
          className="w-full border-[0.5px] border-secondary-100 placeholder:font-body placeholder:font-light  focus:border-secondary-500 rounded p-2 outline-none font-body text-base font-light"
          type="text"
          placeholder="Garage name"
          {...formik.getFieldProps("garageName")}
        />
        {formik.touched.garageName && formik.errors?.garageName && (
          <p className="w-full text-xs font-light text-danger-600 text-start">
            {formik.errors.garageName}
          </p>
        )}
      </div>
      <div className="w-4/5 flex flex-col gap-y-1">
        <input
          className="w-full border-[0.5px] border-secondary-100 placeholder:font-body placeholder:font-light  focus:border-secondary-500 rounded p-2 outline-none font-body text-base font-light"
          type="text"
          placeholder="Contact Person's name"
          {...formik.getFieldProps("contactPersonName")}
        />
        {formik.touched.contactPersonName &&
          formik.errors?.contactPersonName && (
            <p className="w-full text-xs font-light text-danger-600 text-start">
              {formik.errors.contactPersonName}
            </p>
          )}
      </div>
      <div className="w-4/5 flex flex-col gap-y-1">
        <input
          className="w-full border-[0.5px] border-secondary-100 placeholder:font-body placeholder:font-light  focus:border-secondary-500 rounded p-2 outline-none font-body text-base font-light"
          type="text"
          placeholder="Phone number"
          {...formik.getFieldProps("phoneNumber")}
        />
        {formik.touched.phoneNumber && formik.errors?.phoneNumber && (
          <p className="w-full text-xs font-light text-danger-600 text-start">
            {formik.errors.phoneNumber}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="w-4/5 py-2 px-2 text-white rounded-md bg-primary-500 font-medium text-base"
        disabled={!(formik.isValid && formik.dirty) || formik.isSubmitting}
      >
        Join Now
      </button>
    </form>
  );
}
