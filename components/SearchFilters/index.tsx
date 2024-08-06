"use client";
import React, { useState, useEffect } from "react";
import { Formik, Form, Field, useFormikContext } from "formik";

function Submit() {
  const { values, submitForm } = useFormikContext();
  useEffect(() => {
    // Submit the form imperatively as an effect as soon as form values.token are 6 digits long
    submitForm();
  }, [values, submitForm]);
  return null;
}
function LandingPageFilters() {
  const initialValues = {
    location: "",
    carType: "",
    service: "",
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => {
        console.log(values);
      }}
    >
      <Form>
        <div className="container mx-auto py-12 justify-center">
          <div className="grid md:grid-cols-4 gap-4">
            <Field
              type="text"
              className="shadow-m p-2 rounded-md w-1/2 col-span-2"
              placeholder="Enter location"
              name="location"
            />
            <Field
              as="select"
              className="border-2 border-secondary-400 p-2 rounded-md"
              name="carType"
            >
              <option>Car Type</option>
            </Field>
            <Field
              as="select"
              className="border-2 border-secondary-400 p-2 rounded-md"
              name="service"
            >
              <option>Service</option>
            </Field>
            <Submit />
          </div>
        </div>
      </Form>
    </Formik>
  );
}

export default LandingPageFilters;
