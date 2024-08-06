import React from "react";
import Select from "react-select";
import { useFormik } from "formik";
import { FaUserEdit } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";

interface ProfileProps {
  profileData: any;
  isEditing: boolean;
  setIsEditing: (data: any) => void;
  onSave: (data: any) => void;
}
const Index: React.FC<ProfileProps> = ({
  profileData,
  isEditing,
  onSave,
  setIsEditing,
}) => {
  // console.log(profileData[0].firstName);
  const initialValues = {
    firstName: profileData?.firstName ?? "",
    secondName: profileData?.secondName ?? "",
    salutation: profileData?.salutation ?? "",
    gender: profileData?.gender ?? "",
    email: profileData?.email ?? "",
    currentGarageName: profileData?.currentGarageName ?? "",
    mechanicName: profileData?.mechanicName ?? "",
    mechanicPhone: profileData?.mechanicPhone ?? "",
    userId: profileData?.userId ?? "",
    phoneNumber: profileData?.phoneNumber ?? "",
  };

  // console.log(profileData)
  const salutationOptions = [
    { value: "mr", label: "Mr." },
    { value: "mrs", label: "Mrs." },
    { value: "miss", label: "Miss" },
    { value: "dr", label: "Dr." },
    { value: "pro", label: "Pro." },
    { value: "eng", label: "Eng." },
    { value: "sir", label: "Sir" },
    { value: "madam", label: "Madam" },
    { value: "mademoiselle", label: "Mademoiselle" },
    { value: "sir/madam", label: "Sir/Madam" },
  ];

  // useform
  const formik = useFormik({
    initialValues,
    onSubmit: onSave,
  });

  return (
    <div>
      {/* Contact information  edit  */}
      <form onSubmit={formik.handleSubmit}>
        {isEditing && (
          <div className="w-full p-5 mt-5 rounded-md">
            <div className="flex justify-between">
              <h4 className="text-lg font-semibold font-body">
                Contact Details
              </h4>
              <MdOutlineCancel size={15} onClick={() => setIsEditing(false)} />
            </div>
            <div className="flex flex-col w-full mt-3 md:flex-row md:justify-between">
              {/* First Name  */}
              <div className="w-full md:w-2/5 ">
                <h4 className=" font-body">First Name</h4>
                <div className="w-full border rounded-md border-secondary-50">
                  <input
                    className="w-full p-2 outline-none font-body placeholder:font-body"
                    type="text"
                    placeholder={
                      profileData?.firstName ?? "set your first name"
                    }
                    disabled={isEditing ? false : true}
                    {...formik.getFieldProps("firstName")}
                  />
                </div>
              </div>
              {/* Last Name  */}
              <div className="w-full md:w-2/5 ">
                <h4 className="font-body">Last Name</h4>
                <div className="w-full border rounded-md border-secondary-50">
                  <input
                    className="w-full p-2 outline-none font-body placeholder:font-body"
                    type="text"
                    placeholder={
                      profileData?.secondName ?? "set your last name"
                    }
                    disabled={isEditing ? false : true}
                    {...formik.getFieldProps("secondName")}
                  />
                </div>
              </div>
            </div>
            {/* Salutation and gender  */}
            <div className="flex flex-col w-full mt-3 md:flex-row md:justify-between">
              {/* Salutation */}
              <div className="w-full md:w-2/5 ">
                <h4 className=" font-body">Salutation</h4>
                <div className="w-full border rounded-md border-secondary-50">
                  <Select
                    className="w-full p-2 outline-none font-body placeholder:font-body"
                    options={salutationOptions}
                    placeholder={profileData?.salutation ?? "Select salutation"}
                    onChange={(value) => {
                      formik.setFieldValue("salutation", value?.label);
                    }}
                  />
                </div>
              </div>
              {/* Gender */}
              <div className="w-full md:w-2/5 ">
                <h4 className="font-body">Gender</h4>
                <div className="w-full border rounded-md border-secondary-50">
                  <Select
                    className="w-full p-2 outline-none font-body placeholder:font-body"
                    options={[
                      { value: "female", label: "Female" },
                      { value: "male", label: "Male" },
                    ]}
                    placeholder={profileData?.salutation ?? "Select salutation"}
                    onChange={(value) => {
                      formik.setFieldValue("gender", value?.label);
                    }}
                  />
                </div>
              </div>
            </div>
            {/* Phone and email  */}
            <div className="flex flex-col w-full mt-3 md:flex-row md:justify-between">
              {/* Phone number  */}
              <div className="w-full md:w-2/5 ">
                <h4 className=" font-body">Phone number</h4>
                <div className="w-full border rounded-md border-secondary-50">
                  <input
                    className="w-full p-2 outline-none font-body placeholder:font-body"
                    type="text"
                    placeholder={profileData?.phoneNumber ?? "set your number"}
                    disabled={isEditing ? false : true}
                    {...formik.getFieldProps("phoneNumber")}
                  />
                </div>
              </div>
              {/* Email  */}
              <div className="w-full md:w-2/5 ">
                <h4 className="font-body">Email</h4>
                <div className="w-full border rounded-md border-secondary-50">
                  <input
                    className="w-full p-2 outline-none font-body placeholder:font-body"
                    type="email"
                    placeholder={profileData?.email ?? "set your email"}
                    disabled={isEditing ? false : true}
                    {...formik.getFieldProps("email")}
                  />
                </div>
              </div>
            </div>
            <button
              type="submit"
              className={`${
                isEditing ? "block" : "hidden"
              } text-white bg-primary-500 rounded-md p-1 font-body mt-3`}
            >
              Save changes
            </button>
          </div>
        )}
      </form>
      {/* Contact information  display  */}
      {!isEditing && (
        <div className="w-full p-5 mt-5 rounded-md">
          <div className="flex justify-between">
            <h4 className="text-lg font-semibold font-body">Contact Details</h4>
            <span>
              <FaUserEdit
                size={20}
                className="cursor-pointer"
                onClick={() => setIsEditing(true)}
              />
            </span>
          </div>
          <div className="flex flex-col w-full mt-3 md:flex-row md:justify-between">
            {/* Name  */}
            <div className="w-full md:w-2/5 ">
              <h1 className=" font-body">Name</h1>
              <h4 className="font-body text-secondary-300">
                {profileData?.salutation ?? ""}
                {profileData?.firstName ?? ""}
                {profileData?.secondName ?? ""}
                {!profileData?.firstName && !profileData?.secondName
                  ? "Set name"
                  : ""}
              </h4>
            </div>
            {/* phone number  */}
            <div className="w-full md:w-2/5 ">
              <h4 className="font-body">Phone number</h4>
              <h4 className="font-body text-secondary-300">
                {profileData?.phoneNumber ?? "set phone number"}
              </h4>
            </div>
            {/* Email address  */}
            <div className="w-full md:w-2/5 ">
              <h4 className="font-body">Email</h4>
              <h4 className="font-body text-secondary-300">
                {profileData?.email ?? "set email"}
              </h4>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
