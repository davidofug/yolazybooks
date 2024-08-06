"use client";

import React from "react";

import environment from "@/environments/environment";
import { account, database } from "@/appwrite/appwrite";
import { Permission, Role } from "appwrite";
import { toast, ToastContainer } from "react-toastify";
import { FaUserEdit } from "react-icons/fa";
import Select from "react-select";
import { useFormik } from "formik";

import PictureUpload from "@/components/PictureUpload";
import DisplayContact from "@/components/ProfileContactInfo";
import DisplayMechanic from "@/components/MechanicEditInfo";

const Page: React.FC = () => {
  const [profilePicture, setProfilePicture] = React.useState<any>(null);
  const [isEditFavoritePlaces, setIsEditFavoritePlaces] =
    React.useState<boolean>(false);
  const [isEditContact, setIsEditContact] = React.useState<boolean>(false);
  const [isEditMechanic, setIsEditMechanic] = React.useState<boolean>(false);
  const [isEditAccountInfo, setIsEditAccountInfo] =
    React.useState<boolean>(false);
  const [profileData, setProfileData] = React.useState<any>([]);
  const [home, setHome] = React.useState<any>();
  const [hangout, setHangout] = React.useState<any>();
  const [workplace, setWorkplace] = React.useState<any>();

  const { appwriteDatabaseId, appwriteProfilesCollectionId } = environment;

  const fetchData = async () => {
    const data = (
      await database.listDocuments(
        appwriteDatabaseId,
        appwriteProfilesCollectionId
      )
    ).documents;
    // console.log("Data returned", data);
    if (data) {
      setProfileData(data);
    }
  };

  React.useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // console.log(profileData[0].firstName);
  const initialValues = {
    firstName: profileData.length ? profileData[0].firstName : "",
    secondName: profileData.length ? profileData[0].secondName : "",
    salutation: profileData.length ? profileData[0].salutation : "",
    gender: profileData.length ? profileData[0].gender : "",
    email: profileData.length ? profileData[0].email : "",
    currentGarageName: profileData.length
      ? profileData[0].currentGarageName
      : "",
    mechanicName: profileData.length ? profileData[0].mechanicName : "",
    mechanicPhone: profileData.length ? profileData[0].mechanicPhone : "",
    userId: profileData.length ? profileData[0].userId : "",
    phoneNumber: profileData.length ? profileData[0].phoneNumber : "",
  };

  // handle contact editing
  const handleContactEdit = () => {
    setIsEditContact(!isEditContact);
  };
  // handle submit
  const onSubmit = async (values: any) => {
    const userID = (await account.get()).$id;
    if (profileData.length > 0) {
      const data = {
        firstName:
          values.firstName != "" ? values.firstName : profileData[0].firstName,
        secondName:
          values.secondName != ""
            ? values.secondName
            : profileData[0].secondName,
        salutation:
          values.salutation != ""
            ? values.salutation
            : profileData[0].salutation,
        gender:
          profileData.length && profileData[0].gender
            ? profileData[0].gender
            : "",
        email: values.email != "" ? values.email : profileData[0].email,
        currentGarageName:
          values.currentGarageName != ""
            ? values.currentGarageName
            : profileData[0].currentGarageName,
        mechanicName:
          values.mechanicName != ""
            ? values.mechanicName
            : profileData[0].mechanicName,
        mechanicPhone:
          values.mechanicPhone != ""
            ? values.mechanicPhone
            : profileData[0].mechanicPhone,
        // recommendation: profileData.length ? profileData[0].recommedation : false,
        // favoritePlaces: profileData.length ? profileData[0].favoritePlaces : [''],
        userId: profileData.length ? profileData[0].userId : "",
        phoneNumber: values.phoneNumber
          ? values.phoneNumber
          : profileData[0].phoneNumber,
      };
      const response = await database.updateDocument(
        appwriteDatabaseId,
        appwriteProfilesCollectionId,
        profileData[0].$id,
        data
      );
    } else {
      const data = {
        ...values,
        userId: userID,
      };
      // console.log("This is ",data);
      const response = await database.createDocument(
        appwriteDatabaseId,
        appwriteProfilesCollectionId,
        userID,
        data,
        [
          Permission.read(Role.user(userID)),
          Permission.delete(Role.user(userID)),
          Permission.update(Role.user(userID)),
        ]
      );
    }

    // Set the section display to false
    setIsEditAccountInfo(false);
    setIsEditContact(false);
    setIsEditFavoritePlaces(false);
    setIsEditMechanic(false);
    fetchData();
  };

  // useform
  const formik = useFormik({
    initialValues,
    onSubmit,
  });

  return (
    <div className="flex flex-col items-center justify-center w-full p-2 mt-5">
      <div className="w-full md:w-3/4">
        <div className="flex flex-col items-center justify-center pl-5 md:w-1/5">
          <PictureUpload
            uploadMessage=""
            outterContainer="rounded-full"
            innerContainer="rounded-full w-24 h-24"
            selected={profilePicture}
            setSelected={setProfilePicture}
          />
        </div>
        {/* Contact information  */}
        <DisplayContact
          profileData={profileData[0]}
          isEditing={isEditContact}
          setIsEditing={handleContactEdit}
          onSave={onSubmit}
        />

        {/* Mechanic information  */}
        <DisplayMechanic
          profileData={profileData[0]}
          isEditing={isEditMechanic}
          setIsEditing={setIsEditMechanic}
          onSave={onSubmit}
        />
        {/* Favorite places edit  */}
        {isEditFavoritePlaces && (
          <div className="w-full p-5 mt-5 rounded-md">
            <div className="flex justify-between">
              <h4 className="text-lg font-semibold font-body">
                Favorite Places
              </h4>
            </div>
            <div className="flex flex-col w-full mt-3 md:flex-row md:justify-between">
              {/* Home address  */}
              <div className="w-full md:w-2/5 ">
                <h4 className=" font-body">Home address</h4>
                <div className="w-full border rounded-md border-secondary-50">
                  {/* <FavoritePlaces /> */}
                  {/* <FavoritePlaceInput setFavoritePlace={setHome}/> */}
                  <Select
                    isClearable
                    isMulti
                    options={[{ value: "kansanga", label: "Kansanga" }]}
                  />
                </div>
              </div>
              {/* work place address  */}
              <div className="w-full md:w-2/5 ">
                <h4 className="font-body">Work place address</h4>
                <div className="w-full border rounded-md border-secondary-50">
                  <Select
                    isClearable
                    isMulti
                    options={[{ value: "kansanga", label: "Kansanga" }]}
                  />
                  {/* <input className="w-full p-2 outline-none font-body placeholder:font-body" type="text" placeholder="Kampala" name="lastName" disabled={isEditFavoritePlaces ? false : true} /> */}
                </div>
              </div>
            </div>
            {/* favorite hangout  */}
            <div className="flex flex-col w-full mt-3 md:flex-row md:justify-between">
              {/* First Name  */}
              <div className="w-full md:w-2/5 ">
                <h4 className=" font-body">Hangout place</h4>
                <div className="w-full border rounded-md border-secondary-50">
                  <Select
                    isClearable
                    isMulti
                    options={[
                      { value: "kansanga", label: "Kansanga" },
                      { value: "Kampala", label: "Kampala" },
                    ]}
                  />
                  {/* <input type="text" placeholder="Kansanga" className="w-full p-2 outline-none font-body placeholder:font-body" name="phonenumber" disabled={isEditFavoritePlaces ? false : true} /> */}
                </div>
              </div>
            </div>
            <button
              className={`${
                isEditFavoritePlaces ? "block" : "hidden"
              } text-white bg-primary-500 rounded-md p-1 font-body mt-3`}
              onClick={() => {
                toast.info(() => (
                  <div className="font-body font-light text-base w-full flex start">
                    Comming soon
                  </div>
                ));
                setIsEditFavoritePlaces(false);
              }}
            >
              Save changes
            </button>
          </div>
        )}
        {/* Favorite places display  */}
        {!isEditFavoritePlaces && (
          <div className="w-full p-5 mt-5 rounded-md">
            <div className="flex justify-between">
              <h4 className="text-lg font-semibold font-body">
                Favorite Places
              </h4>
              <span>
                <FaUserEdit
                  size={20}
                  className="cursor-pointer"
                  onClick={() => setIsEditFavoritePlaces(true)}
                />
              </span>
            </div>
            <div className="flex flex-col w-full mt-3 md:flex-row md:justify-between">
              {/* Home address  */}
              <div className="w-full md:w-2/5 ">
                <h4 className=" font-body">Home address</h4>
                <h4 className="font-body text-secondary-300">Not provided</h4>
              </div>
              {/* work place address  */}
              <div className="w-full md:w-2/5 ">
                <h4 className="font-body">Work place address</h4>
                <h4 className="font-body text-secondary-300">Not provided</h4>
              </div>
              {/* favorite hangout  */}
              <div className="w-full md:w-2/5 ">
                <h4 className=" font-body">Hangout place</h4>
                <h4 className=" font-body text-secondary-300">Not provided</h4>
              </div>
            </div>
            <div className="flex flex-col w-full mt-3 md:flex-row md:justify-between">
              {/* First Name  */}
            </div>
            <button
              onClick={() => setIsEditFavoritePlaces(false)}
              className={`${
                isEditFavoritePlaces ? "block" : "hidden"
              } text-white bg-primary-500 rounded-md p-1 font-body mt-3`}
            >
              Save changes
            </button>
          </div>
        )}
        {/* account information  */}
        <div className="w-full p-5 mt-5 rounded-md">
          <div className="flex justify-between">
            <h4 className="text-lg font-semibold font-body">
              Account information
            </h4>
            <span>
              <FaUserEdit
                size={20}
                className="cursor-pointer"
                onClick={() => {
                  toast.info(() => (
                    <div className="font-body font-light text-base w-full flex start">
                      Can&apos;t edit account information now
                    </div>
                  ));
                }}
              />
            </span>
          </div>
          <div className="flex flex-col w-full mt-3 md:flex-row md:justify-between">
            {/*   */}
            <div className="w-full md:w-2/5 ">
              <h4 className=" font-body">Phone</h4>
              <div className="w-full border rounded-md border-secondary-50">
                <input
                  className="w-full p-2 outline-none font-body placeholder:font-body"
                  type="text"
                  placeholder={
                    profileData.length
                      ? profileData[0].phoneNumber
                      : "Not provided"
                  }
                  name="firstName"
                  disabled={isEditAccountInfo ? false : true}
                />
              </div>
            </div>
            {/* Password  */}
            <div className="w-full md:w-2/5 ">
              <h4 className="font-body">Email</h4>
              <div className="w-full border rounded-md border-secondary-50">
                <input
                  className="w-full p-2 outline-none font-body placeholder:font-body"
                  placeholder={
                    profileData.length ? profileData[0].email : "Not provided"
                  }
                  type="password"
                  name="password"
                  disabled={isEditAccountInfo ? false : true}
                />
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsEditAccountInfo(false)}
            className={`${
              isEditAccountInfo ? "block" : "hidden"
            } text-white bg-primary-500 rounded-md p-1 font-body mt-3`}
          >
            Save changes
          </button>
        </div>
      </div>
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
    </div>
  );
};

export default Page;
